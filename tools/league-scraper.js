#!/usr/bin/env node
/**
 * Bulk League Roster Scraper
 *
 * Pulls every team in a given league from EuroBasket, then every player
 * from each team. Saves each player as a JSON cache file.
 *
 * Includes:
 *   - Rate limiting (2.5s between requests; configurable)
 *   - Retry logic on network failure (3 attempts)
 *   - Exponential backoff on 429 / 5xx
 *   - Resume support (skips players already cached unless --force)
 *   - --dry-run flag (lists targets without scraping)
 *
 * Usage:
 *   EUROBASKET_EMAIL=... EUROBASKET_PASSWORD=... \
 *     node tools/league-scraper.js --league GER-1
 *
 *   node tools/league-scraper.js --league GER-1 --dry-run
 *   node tools/league-scraper.js --league FRA-1 --force
 *   node tools/league-scraper.js --leagues GER-1,FRA-1,ITA-1
 *
 * League codes (a non-exhaustive list — EuroBasket has 200+):
 *   ELITE:   BSL (Turkey), GER-1 (Germany BBL), ESP-1 (Spain ACB),
 *            FRA-1 (France Pro A), ITA-1 (Italy Serie A), GRE-1, ISR-1,
 *            VTB-1 (Russia/Eurasia), POL-1, LTU-1
 *   MID:     GER-2, ESP-2, ESP-3 (LEB Plata), FRA-2, ITA-2, GRE-2,
 *            BNXT-1 (Belgium-Netherlands), CZE-1, AUT-1, CRO-1, SLO-1,
 *            POR-1, ROM-1, BUL-1, FIN-1, HUN-1
 *   ASIA:    JPN-1 (B.League), KOR-1, PHI-1 (PBA), CHN-1 (NBL — not CBA)
 *   AMERICAS: MEX-1 (LNBP), VEN-1, ARG-1
 *   OCEANIA: AUS-1 (NBL), AUS-2 (NBL1), NZL-1
 *   AFRICA:  BAL (Basketball Africa League)
 *   OTHER:   QAT-1, AZE-1, GEO-2
 */
try { require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); } catch {}

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CACHE_DIR = path.join(ROOT, 'data', 'cache');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const REQUEST_DELAY = parseInt(process.env.SCRAPE_DELAY_MS || '1800', 10);  // 1.8s default — fits 4000 players in ~2h

// ---- CLI args ----
const args = process.argv.slice(2);
const arg = (k) => { const i = args.indexOf(k); return i !== -1 ? args[i+1] : null; };
const dryRun = args.includes('--dry-run');
const force  = args.includes('--force');
const leagueArg = arg('--league') || (arg('--leagues') ? arg('--leagues').split(',') : null);
const leagues = Array.isArray(leagueArg) ? leagueArg : (leagueArg ? [leagueArg] : null);
if (!leagues) {
  console.error('Usage: node tools/league-scraper.js --league GER-1 [--dry-run] [--force]');
  process.exit(1);
}

// ---- State ----
let sessionCookies = null;
const stats = { teams: 0, players: 0, fetched: 0, skipped: 0, errors: 0 };

// ---- Helpers ----
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const slugify = (s) => s.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function login() {
  if (!process.env.EUROBASKET_EMAIL || !process.env.EUROBASKET_PASSWORD) {
    console.warn('⚠️  No EuroBasket credentials — running unauthenticated (limited stats)');
    return false;
  }
  console.log('🔐 Logging into EuroBasket…');
  try {
    const resp = await axios.post(
      'https://www.eurobasket.com/news_system/ndverifikacijasub.aspx',
      `email=${encodeURIComponent(process.env.EUROBASKET_EMAIL)}&pwd=${encodeURIComponent(process.env.EUROBASKET_PASSWORD)}&B1=Login&Referal=`,
      { headers: { 'User-Agent': USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded', Referer: 'https://www.eurobasket.com/news_system/login.aspx' }, maxRedirects: 0, validateStatus: () => true, timeout: 15000 }
    );
    const setCookies = resp.headers['set-cookie'] || [];
    if (setCookies.length > 0) {
      sessionCookies = setCookies.map(c => c.split(';')[0]).join('; ');
      console.log('✅ Logged in');
      return true;
    }
  } catch (e) { console.error('❌ Login failed:', e.message); }
  return false;
}

async function fetchPage(url, attempts = 3) {
  const headers = { 'User-Agent': USER_AGENT };
  if (sessionCookies) headers['Cookie'] = sessionCookies;
  for (let i = 1; i <= attempts; i++) {
    try {
      const r = await axios.get(url, { headers, timeout: 30000 });
      return r.data;
    } catch (e) {
      const status = e.response?.status;
      if (status === 429 || status >= 500) {
        const wait = Math.pow(2, i) * 1000;
        console.warn(`   ⚠️  ${status} on attempt ${i}, backing off ${wait}ms`);
        await sleep(wait);
        continue;
      }
      if (i === attempts) throw e;
    }
  }
}

// ---- League code → EuroBasket URL mapping ----
// EuroBasket uses /Country/League-Name.aspx URLs (verified Apr 2026).
// Codes here are the same ones used in SCRAPE_LEAGUES env var / cebl-records.
const LEAGUE_URLS = {
  // Germany
  'GER-1': 'https://www.eurobasket.com/Germany/Basketball-Bundesliga.aspx',
  'GER-2': 'https://www.eurobasket.com/Germany/2-Basketball-Bundesliga-ProA.aspx',
  'GER-3': 'https://www.eurobasket.com/Germany/2-Basketball-Bundesliga-ProB.aspx',
  // France
  'FRA-1': 'https://www.eurobasket.com/france/basketball-betclic-elite.aspx',
  'FRA-2': 'https://www.eurobasket.com/France/basketball-League-ProB.aspx',
  'FRA-3': 'https://www.eurobasket.com/France/Nationale-Masculine-1.aspx',
  // Spain
  'ESP-1': 'https://www.eurobasket.com/Spain/basketball-Liga-Endesa.aspx',
  'ESP-2': 'https://www.eurobasket.com/Spain/basketball-Liga-Primera-FEB.aspx',
  'ESP-3': 'https://www.eurobasket.com/Spain/basketball-Liga-Segunda-FEB.aspx',
  // Italy
  'ITA-1': 'https://www.eurobasket.com/Italy/basketball-League-Serie-A.aspx',
  'ITA-2': 'https://www.eurobasket.com/Italy/basketball-League-Serie-A2.aspx',
  // Greece
  'GRE-1': 'https://www.eurobasket.com/Greece/basketball-League-A1.aspx',
  'GRE-2': 'https://www.eurobasket.com/Greece/basketball-League-A2.aspx',
  // Turkey
  'BSL':   'https://www.eurobasket.com/Turkey/basketball-Super-League-BSL.aspx',
  // Israel
  'ISR-1': 'https://www.eurobasket.com/Israel/basketball-Premier-League.aspx',
  'ISR-2': 'https://www.eurobasket.com/Israel/basketball-League-Liga-Leumit.aspx',
  // Lithuania
  'LTU-1': 'https://www.eurobasket.com/Lithuania/basketball-League-LKL.aspx',
  // Poland
  'POL-1': 'https://www.eurobasket.com/Poland/basketball-League-PLK.aspx',
  'POL-2': 'https://www.eurobasket.com/Poland/basketball-League-1Liga.aspx',
  // Portugal
  'POR-1': 'https://www.eurobasket.com/Portugal/basketball-League-LPB.aspx',
  // Belgium-Netherlands
  'BNXT-1': 'https://www.eurobasket.com/Netherlands/basketball-League-BNXT.aspx',
  // Czech
  'CZE-1': 'https://www.eurobasket.com/Czech_Republic/basketball-League-NBL.aspx',
  // Austria
  'AUT-1': 'https://www.eurobasket.com/Austria/basketball-League-Superliga.aspx',
  // Croatia
  'CRO-1': 'https://www.eurobasket.com/Croatia/basketball-League-Premijer-Liga.aspx',
  // Slovenia
  'SLO-1': 'https://www.eurobasket.com/Slovenia/basketball-League-Liga-Nova-KBM.aspx',
  // Bulgaria
  'BUL-1': 'https://www.eurobasket.com/Bulgaria/basketball-League-NBL.aspx',
  // Romania
  'ROM-1': 'https://www.eurobasket.com/Romania/basketball-League-Liga-Nationala.aspx',
  // Finland
  'FIN-1': 'https://www.eurobasket.com/Finland/basketball-League-Korisliiga.aspx',
  // Russia / VTB
  'VTB-1': 'https://www.eurobasket.com/Russia/basketball-League-VTB-United.aspx',
  // Australia
  'AUS-1': 'https://www.eurobasket.com/Australia/basketball-League-NBL.aspx',
  'AUS-2': 'https://www.eurobasket.com/Australia/basketball-League-NBL1.aspx',
  // Asia
  'JPN-1': 'https://www.eurobasket.com/Japan/basketball-League-B1.aspx',
  'KOR-1': 'https://www.eurobasket.com/South_Korea/basketball-League-KBL.aspx',
  'PHI-1': 'https://www.eurobasket.com/Philippines/basketball-League-PBA.aspx',
  // Americas
  'MEX-1': 'https://www.eurobasket.com/Mexico/basketball-League-LNBP.aspx',
  'ARG-1': 'https://www.eurobasket.com/Argentina/basketball-League-LNB.aspx',
  // Lebanon
  'LBN-1': 'https://www.eurobasket.com/Lebanon/basketball-League-LBL.aspx',
};

// ---- League → teams ----
async function getLeagueTeams(leagueCode) {
  // Try the canonical URL from our mapping first.
  const candidates = [];
  if (LEAGUE_URLS[leagueCode]) candidates.push(LEAGUE_URLS[leagueCode]);
  // Fallback patterns (in case eurobasket reorganizes a URL)
  candidates.push(`https://basketball.eurobasket.com/league/${leagueCode}/teams.aspx`);
  candidates.push(`https://basketball.eurobasket.com/league/${leagueCode}/`);

  for (const url of candidates) {
    try {
      const html = await fetchPage(url);
      const $ = cheerio.load(html);
      const teams = [];
      $('a').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (href.match(/\/team\/[A-Za-z0-9-]+\/\d+/i)) {
          const fullUrl = href.startsWith('http') ? href : `https://basketball.eurobasket.com${href}`;
          const name = $(el).text().trim();
          if (name && name.length > 1 && !teams.find(t => t.url === fullUrl)) {
            teams.push({ name, url: fullUrl });
          }
        }
      });
      if (teams.length > 0) {
        console.log(`   ✅ Resolved ${leagueCode} via ${url}`);
        return teams;
      }
    } catch (e) { /* try next */ }
  }
  return [];
}

// ---- Team → players ----
async function getTeamRoster(teamUrl) {
  const html = await fetchPage(teamUrl);
  const $ = cheerio.load(html);
  const players = [];
  const seenUrls = new Set();
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    // Match /player/Name-Slug/12345 — require numeric ID at end so we don't
    // pick up roster-management or marketing links.
    const m = href.match(/\/player\/([A-Za-z0-9-]+)\/(\d+)/);
    if (!m) return;
    const fullUrl = href.startsWith('http') ? href : `https://basketball.eurobasket.com${href}`;
    if (seenUrls.has(fullUrl)) return;
    seenUrls.add(fullUrl);
    // The URL slug is the canonical player identifier — e.g. "Sean-East-II"
    // (anchor text is sometimes garbage from icon fonts or roster numbers).
    const urlSlug = m[1];
    const playerId = m[2];
    // Build a clean display name from URL slug ("sean east ii") just as a hint;
    // the real fullName will overwrite this after fetchPlayer().
    const displayName = urlSlug.replace(/-/g, ' ');
    players.push({ name: displayName, urlSlug, playerId, url: fullUrl });
  });
  return players;
}

// ---- Parse a player profile HTML into a cache object ----
// Exported so refetch-missing-bio.js can reuse the parsing logic.
function parsePlayerProfile(html, playerUrl) {
  const $ = cheerio.load(html);
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

  const cache = {
    fullName: $('h1').first().text().replace(/basketball profile/i, '').trim(),
    sourceUrl: playerUrl,
  };

  // Nationality — "Name is Slovenian basketball player" — independent regex
  const natMatch = bodyText.match(/\bis\s+([A-Z][a-zA-Z]{1,30}?)\s+basketball\s+player\b/i);
  if (natMatch) cache.nationality = natMatch[1];

  // Birthdate — supports "January 26 2001", "January 26, 2001", "Jan.26, 2001"
  const dateMatch = bodyText.match(/born\s+(?:on\s+)?([A-Z][a-z]+\.?\s*\d{1,2}[,]?\s*\d{4})/i);
  if (dateMatch) cache.birthdate = dateMatch[1].replace(/\s+/g, ' ').replace(/\./g, '. ').replace(/\s+/g, ' ').trim();

  // Birth city — "born ... in Jesenice" or FAQ "X was born in Jesenice (SLO)"
  const cityMatch = bodyText.match(/born\s+(?:on\s+[A-Z][a-z]+\.?\s*\d{1,2}[,]?\s*\d{4}\s+)?in\s+([A-Z][^.,()]{1,60}?)(?=\s*[.,(]|\s+is\s|\s+was\s|$)/);
  if (cityMatch) cache.birthCity = cityMatch[1].trim();
  // Fallback FAQ pattern: "Name was born in [City] (SLO)"
  if (!cache.birthCity) {
    const faqCity = bodyText.match(/was\s+born\s+in\s+([A-Z][^.,()]{1,60}?)\s*\(/);
    if (faqCity) cache.birthCity = faqCity[1].trim();
  }

  // Height — "6'6\"" or "6'6" (with optional cm)
  const hwMatch = bodyText.match(/(\d+['']\d+[''"]?)\s*(?:\((\d+)\s*cm\))?/);
  if (hwMatch) {
    cache.height = hwMatch[1].replace(/['']/g, "'").replace(/[""]/g, '"');
    if (hwMatch[2]) cache.heightCm = hwMatch[2];
  }

  // Weight in lbs (kg)
  const wtMatch = bodyText.match(/([\d.]+)\s*lbs?\s*\(([\d.]+)\s*kg\)/i);
  if (wtMatch) { cache.weight = wtMatch[1]; cache.weightKg = wtMatch[2]; }

  // Position
  const posMatch = bodyText.match(/\d+['']\d+[''"]?\s+(guard|forward|center|point guard|shooting guard|small forward|power forward)/i);
  if (posMatch) cache.position = posMatch[1];

  // College / University
  const collegeMatch = bodyText.match(/(?:University|College)\s+(?:of\s+)?[\w\s]+/i);
  if (collegeMatch) cache.college = collegeMatch[0].trim();

  return { cache, $, bodyText };
}

// ---- Player → cache JSON ----
async function fetchPlayer(playerUrl) {
  const html = await fetchPage(playerUrl);
  const { cache, $, bodyText } = parsePlayerProfile(html, playerUrl);

  // Current team & league from current-season summary
  const summaryTable = $('table').toArray().find(t => $(t).find('tr').first().text().trim() === 'Summary');
  if (summaryTable) {
    const rows = $(summaryTable).find('tr');
    if (rows.length >= 3) {
      const cells = $(rows[2]).find('td').toArray().map(c => $(c).text().trim());
      if (cells.length > 0) cache.currentTeam = cells[0];
    }
  }

  // Career history (year/team/league rows)
  const careerHistory = [];
  $('table').each((_, t) => {
    const heading = $(t).find('tr').first().text().trim();
    if (!heading.toLowerCase().includes('club competitions')) return;
    $(t).find('tr').slice(2).each((_, row) => {
      const cells = $(row).find('td').toArray().map(c => $(c).text().trim());
      if (cells.length >= 3 && cells[0] && cells[1]) {
        careerHistory.push({ year: cells[0], team: cells[1], league: cells[2] });
      }
    });
  });
  cache.careerHistory = careerHistory;

  // Verification metadata
  cache._lastVerified = new Date().toISOString();
  cache._sources = ['eurobasket.com'];
  cache._dataConfidence = cache.currentTeam && cache.fullName ? 'high' : 'medium';
  cache.cachedAt = cache._lastVerified;

  return cache;
}

function shouldSkip(slug) {
  if (force) return false;
  const fp = path.join(CACHE_DIR, `${slug}.json`);
  if (!fs.existsSync(fp)) return false;
  // Skip if cached within last 30 days
  try {
    const d = JSON.parse(fs.readFileSync(fp, 'utf-8'));
    const t = new Date(d._lastVerified || d.cachedAt || 0).getTime();
    const age = Date.now() - t;
    return age < 30 * 24 * 60 * 60 * 1000;
  } catch { return false; }
}

// ---- Main loop ----
(async () => {
  await login();
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

  for (const leagueCode of leagues) {
    console.log(`\n🏀 Scraping league: ${leagueCode}`);
    const teams = await getLeagueTeams(leagueCode);
    if (teams.length === 0) {
      console.warn(`   ⚠️  No teams found for ${leagueCode}. Check league code.`);
      continue;
    }
    console.log(`   ✅ Found ${teams.length} teams`);
    stats.teams += teams.length;
    if (dryRun) { teams.slice(0, 5).forEach(t => console.log(`      - ${t.name}`)); continue; }

    for (const team of teams) {
      try {
        await sleep(REQUEST_DELAY);
        const roster = await getTeamRoster(team.url);
        console.log(`   📋 ${team.name}: ${roster.length} players`);
        stats.players += roster.length;
        for (const p of roster) {
          // Use the URL-derived slug (canonical) for the skip check + filename.
          // Anchor text is often roster numbers or icon-font glyphs, not the name.
          const urlSlug = (p.urlSlug || '').toLowerCase();
          if (urlSlug && shouldSkip(urlSlug)) { stats.skipped++; continue; }
          try {
            await sleep(REQUEST_DELAY);
            const cache = await fetchPlayer(p.url);
            // Prefer slug from the cache.fullName the API gave us (most reliable).
            // Falls back to URL slug if fullName is empty.
            const finalSlug = cache.fullName ? slugify(cache.fullName) : urlSlug || slugify(p.name);
            if (!finalSlug) { stats.errors++; continue; }
            fs.writeFileSync(path.join(CACHE_DIR, `${finalSlug}.json`), JSON.stringify(cache, null, 2));
            stats.fetched++;
            if (stats.fetched % 10 === 0) console.log(`      ↳ ${stats.fetched} fetched (latest: ${cache.fullName || finalSlug})`);
          } catch (e) {
            stats.errors++;
            console.warn(`      ❌ ${p.url}: ${e.message}`);
          }
        }
      } catch (e) {
        stats.errors++;
        console.warn(`   ❌ Team ${team.name}: ${e.message}`);
      }
    }
  }

  console.log('\n📊 Done!');
  console.log(`   Teams scanned: ${stats.teams}`);
  console.log(`   Players found: ${stats.players}`);
  console.log(`   ✅ Fetched:    ${stats.fetched}`);
  console.log(`   ⏭️  Skipped:    ${stats.skipped} (cached <30 days)`);
  console.log(`   ❌ Errors:     ${stats.errors}`);
  if (stats.fetched > 0) console.log(`\n   Run "node tools/extract-global-pros.js" to update global-pros.js`);
})().catch(e => { console.error(e); process.exit(1); });
