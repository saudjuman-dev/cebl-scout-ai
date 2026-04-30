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
const REQUEST_DELAY = parseInt(process.env.SCRAPE_DELAY_MS || '2500', 10);

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

// ---- League → teams ----
async function getLeagueTeams(leagueCode) {
  // EuroBasket league pages: try the standard URL pattern
  const urls = [
    `https://basketball.eurobasket.com/league/${leagueCode}/teams.aspx`,
    `https://basketball.eurobasket.com/league/${leagueCode}/`,
  ];
  for (const url of urls) {
    try {
      const html = await fetchPage(url);
      const $ = cheerio.load(html);
      const teams = [];
      $('a').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (href.match(/\/team\/[A-Za-z0-9-]+/i)) {
          const fullUrl = href.startsWith('http') ? href : `https://basketball.eurobasket.com${href}`;
          const name = $(el).text().trim();
          if (name && !teams.find(t => t.url === fullUrl)) teams.push({ name, url: fullUrl });
        }
      });
      if (teams.length > 0) return teams;
    } catch (e) { /* try next */ }
  }
  return [];
}

// ---- Team → players ----
async function getTeamRoster(teamUrl) {
  const html = await fetchPage(teamUrl);
  const $ = cheerio.load(html);
  const players = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (href.match(/\/player\/[A-Za-z0-9-]+/)) {
      const fullUrl = href.startsWith('http') ? href : `https://basketball.eurobasket.com${href}`;
      const name = $(el).text().trim();
      if (name && /^[A-Z][a-z]/.test(name) && !players.find(p => p.url === fullUrl)) {
        players.push({ name, url: fullUrl });
      }
    }
  });
  return players;
}

// ---- Player → cache JSON ----
async function fetchPlayer(playerUrl) {
  const html = await fetchPage(playerUrl);
  const $ = cheerio.load(html);
  const bodyText = $('body').text();

  const cache = {
    fullName: $('h1').first().text().replace(/basketball profile/i, '').trim(),
    sourceUrl: playerUrl,
  };

  const bioMatch = bodyText.match(/is\s+(\w+)\s+basketball player born\s+(?:on\s+)?([A-Z][a-z]+ \d{1,2},?\s*\d{4})\s+in\s+([^.]+)/i);
  if (bioMatch) {
    cache.nationality = bioMatch[1];
    cache.birthdate = bioMatch[2].trim();
    cache.birthCity = bioMatch[3].trim();
  }

  const hwMatch = bodyText.match(/(\d+['']\d+[''"]?)\s*(?:\((\d+)\s*cm\))?/);
  if (hwMatch) {
    cache.height = hwMatch[1].replace(/['']/g, "'").replace(/[""]/g, '"');
    if (hwMatch[2]) cache.heightCm = hwMatch[2];
  }
  const wtMatch = bodyText.match(/([\d.]+)\s*lbs?\s*\(([\d.]+)\s*kg\)/i);
  if (wtMatch) { cache.weight = wtMatch[1]; cache.weightKg = wtMatch[2]; }

  const posMatch = bodyText.match(/\d+['']\d+[''"]?\s+(guard|forward|center|point guard|shooting guard|small forward|power forward)/i);
  if (posMatch) cache.position = posMatch[1];

  const collegeMatch = bodyText.match(/(?:University|College)\s+(?:of\s+)?[\w\s]+/i);
  if (collegeMatch) cache.college = collegeMatch[0].trim();

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
          const slug = slugify(p.name);
          if (shouldSkip(slug)) { stats.skipped++; continue; }
          try {
            await sleep(REQUEST_DELAY);
            const cache = await fetchPlayer(p.url);
            fs.writeFileSync(path.join(CACHE_DIR, `${slug}.json`), JSON.stringify(cache, null, 2));
            stats.fetched++;
            if (stats.fetched % 10 === 0) console.log(`      ↳ ${stats.fetched} fetched`);
          } catch (e) {
            stats.errors++;
            console.warn(`      ❌ ${p.name}: ${e.message}`);
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
