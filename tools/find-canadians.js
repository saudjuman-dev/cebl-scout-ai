#!/usr/bin/env node
/**
 * Canadian Player Tracking & Discovery
 *
 * Three jobs in one script:
 *
 * 1. SYNC EXISTING CANADIANS:
 *    Walks every cache JSON, identifies Canadians (nationality field),
 *    ensures their names are in cebl-players.txt so the weekly cron
 *    refreshes them.
 *
 * 2. DISCOVERY VIA EUROBASKET LISTING PAGES:
 *    Tries the "Canada Players Abroad" + Canadian domestic league pages
 *    on EuroBasket. (As of Apr 2026 these tend to be sparse/empty
 *    in the off-season — but if they wake up during the season, this
 *    script picks up new Canadians automatically.)
 *
 * 3. CACHE-FILE MINING:
 *    For every cached player whose careerHistory shows a CEBL stop or
 *    a Canadian birth city, double-check their nationality and flag
 *    them for follow-up if it's missing.
 *
 * Usage:
 *   EUROBASKET_EMAIL=... EUROBASKET_PASSWORD=... node tools/find-canadians.js
 *   node tools/find-canadians.js --dry-run          # don't write anything
 *   node tools/find-canadians.js --refetch          # also re-pull existing
 *   node tools/find-canadians.js --skip-discovery   # only do sync + mining
 */
try { require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); } catch {}

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CACHE_DIR = path.join(ROOT, 'data', 'cache');
const PLAYERS_TXT = path.join(__dirname, 'cebl-players.txt');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const DELAY_MS = parseInt(process.env.SCRAPE_DELAY_MS || '1800', 10);

const args = process.argv.slice(2);
const dryRun       = args.includes('--dry-run');
const refetch      = args.includes('--refetch');
const skipDiscover = args.includes('--skip-discovery');

// Canadian provinces (for birth-city heuristic)
const CANADIAN_PROVINCES = ['ON', 'QC', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU',
  'Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan',
  'Nova Scotia', 'New Brunswick', 'Newfoundland', 'Prince Edward Island'];
const CANADIAN_HINT = /\b(?:CAN|Canada|ON|QC|BC|AB|MB|SK|NS|NB|Toronto|Montreal|Vancouver|Ottawa|Calgary|Edmonton|Winnipeg|Hamilton|Brampton|Mississauga|London|Halifax|Saskatoon|Regina|Victoria|Quebec City)\b/i;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const slugify = (s) => s.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

let cookies = null;

async function login() {
  if (!process.env.EUROBASKET_EMAIL || !process.env.EUROBASKET_PASSWORD) {
    console.warn('⚠️  No EUROBASKET_EMAIL / EUROBASKET_PASSWORD env. Public-only fetch (limited).');
    return false;
  }
  console.log('🔐 Logging in…');
  const resp = await axios.post(
    'https://www.eurobasket.com/news_system/ndverifikacijasub.aspx',
    `email=${encodeURIComponent(process.env.EUROBASKET_EMAIL)}&pwd=${encodeURIComponent(process.env.EUROBASKET_PASSWORD)}&B1=Login&Referal=`,
    { headers: { 'User-Agent': USER_AGENT, 'Content-Type': 'application/x-www-form-urlencoded', Referer: 'https://www.eurobasket.com/news_system/login.aspx' }, maxRedirects: 0, validateStatus: () => true, timeout: 15000 }
  );
  const setCookies = resp.headers['set-cookie'] || [];
  if (setCookies.length > 0) {
    cookies = setCookies.map(c => c.split(';')[0]).join('; ');
    console.log('✅ Logged in.');
    return true;
  }
  console.error('❌ Login failed (no cookies returned).');
  return false;
}

async function fetchPage(url, attempts = 3) {
  const headers = { 'User-Agent': USER_AGENT };
  if (cookies) headers['Cookie'] = cookies;
  for (let i = 1; i <= attempts; i++) {
    try {
      const r = await axios.get(url, { headers, timeout: 30000 });
      return r.data;
    } catch (e) {
      const status = e.response?.status;
      if (status === 429 || status >= 500) { await sleep(Math.pow(2, i) * 1000); continue; }
      if (i === attempts) throw e;
    }
  }
}

// --- Discovery sources ---
// Each returns { url, label } objects we'll then walk for player links.
const DISCOVERY_PAGES = [
  { url: 'https://www.eurobasket.com/Canada/basketball-Players-Abroad.aspx', label: 'Canadians abroad' },
  { url: 'https://www.eurobasket.com/Canada/basketball-CEBL.aspx',           label: 'CEBL roster' },
  { url: 'https://www.eurobasket.com/Canada/basketball-NBLCanada.aspx',      label: 'NBL Canada (legacy)' },
  { url: 'https://www.eurobasket.com/Canada/basketball-U-Sports.aspx',       label: 'U Sports' },
  { url: 'https://www.eurobasket.com/Canada/basketball-BSL.aspx',            label: 'Canada BSL' },
];

async function extractPlayersFromListPage(url) {
  const html = await fetchPage(url);
  const $ = cheerio.load(html);
  const found = new Set();
  const players = [];
  $('a').each((_, el) => {
    const href = $(el).attr('href') || '';
    const m = href.match(/\/player\/([A-Za-z0-9-]+)\/(\d+)/);
    if (!m) return;
    const fullUrl = href.startsWith('http') ? href : `https://basketball.eurobasket.com${href}`;
    if (found.has(fullUrl)) return;
    found.add(fullUrl);
    const name = m[1].replace(/-/g, ' ').trim();
    if (name.length > 1) players.push({ url: fullUrl, name, urlSlug: m[1].toLowerCase() });
  });
  return players;
}

// --- Re-use the bio parser from refetch-missing-bio (lenient) ---
function parseBio(html, url) {
  const $ = cheerio.load(html);
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const out = { sourceUrl: url, fullName: $('h1').first().text().replace(/basketball profile/i, '').trim() };
  const natMatch = bodyText.match(/\bis\s+([A-Z][a-zA-Z]{1,30}?)\s+basketball\s+player\b/i);
  if (natMatch) out.nationality = natMatch[1];
  const dateMatch = bodyText.match(/born\s+(?:on\s+)?([A-Z][a-z]+\.?\s*\d{1,2}[,]?\s*\d{4})/i);
  if (dateMatch) out.birthdate = dateMatch[1].replace(/\s+/g, ' ').trim();
  const cityMatch = bodyText.match(/born\s+(?:on\s+[A-Z][a-z]+\.?\s*\d{1,2}[,]?\s*\d{4}\s+)?in\s+([A-Z][^.,()]{1,60}?)(?=\s*[.,(]|\s+is\s|\s+was\s|$)/);
  if (cityMatch) out.birthCity = cityMatch[1].trim();
  if (!out.birthCity) {
    const faqCity = bodyText.match(/was\s+born\s+in\s+([A-Z][^.,()]{1,60}?)\s*\(/);
    if (faqCity) out.birthCity = faqCity[1].trim();
  }
  const hwMatch = bodyText.match(/(\d+['']\d+[''"]?)\s*(?:\((\d+)\s*cm\))?/);
  if (hwMatch) {
    out.height = hwMatch[1].replace(/['']/g, "'").replace(/[""]/g, '"');
    if (hwMatch[2]) out.heightCm = hwMatch[2];
  }
  const wtMatch = bodyText.match(/([\d.]+)\s*lbs?\s*\(([\d.]+)\s*kg\)/i);
  if (wtMatch) { out.weight = wtMatch[1]; out.weightKg = wtMatch[2]; }
  const posMatch = bodyText.match(/\d+['']\d+[''"]?\s+(guard|forward|center|point guard|shooting guard|small forward|power forward)/i);
  if (posMatch) out.position = posMatch[1];

  // career history
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
  out.careerHistory = careerHistory;

  // current team from Summary
  const summaryTable = $('table').toArray().find(t => $(t).find('tr').first().text().trim() === 'Summary');
  if (summaryTable) {
    const rows = $(summaryTable).find('tr');
    if (rows.length >= 3) {
      const cells = $(rows[2]).find('td').toArray().map(c => $(c).text().trim());
      if (cells.length > 0) out.currentTeam = cells[0];
    }
  }

  out._lastVerified = new Date().toISOString();
  out._sources = ['eurobasket.com'];
  out._dataConfidence = (out.fullName && (careerHistory.length > 0 || out.currentTeam)) ? 'high' : 'medium';
  out.cachedAt = out._lastVerified;
  return out;
}

(async () => {
  // ----- Job 1: SYNC existing Canadians from cache → cebl-players.txt -----
  console.log('\n🔄 [1/3] Syncing existing Canadians from cache…');
  const cacheFiles = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
  const canadians = [];
  const suspectedCanadians = [];   // missing nationality but Canadian-looking birthCity / careerHistory
  for (const f of cacheFiles) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, f), 'utf-8'));
      const nat = (d.nationality || '').toLowerCase();
      if (nat === 'canadian' || nat === 'canada') {
        canadians.push({ file: f, name: d.fullName });
      } else if (!d.nationality) {
        // Heuristic: birth city contains Canadian province/city or careerHistory has CEBL/NBL Canada
        const text = JSON.stringify({ birthCity: d.birthCity, careerHistory: d.careerHistory });
        if (CANADIAN_HINT.test(text)) suspectedCanadians.push({ file: f, name: d.fullName, birthCity: d.birthCity });
      }
    } catch {}
  }
  console.log(`   ✅ ${canadians.length} confirmed Canadians in cache`);
  console.log(`   🤔 ${suspectedCanadians.length} suspected Canadians (missing nationality but Canadian birth city / career)`);

  // Sync names to cebl-players.txt
  let existing = '';
  try { existing = fs.readFileSync(PLAYERS_TXT, 'utf-8'); } catch {}
  const existingNames = new Set(existing.split('\n').map(l => l.trim().split('|')[0].trim()).filter(Boolean));
  const additions = canadians.map(c => c.name).filter(n => n && !existingNames.has(n)).sort();
  if (!dryRun && additions.length > 0) {
    fs.appendFileSync(PLAYERS_TXT, '\n# --- find-canadians.js sync ' + new Date().toISOString().split('T')[0] + ' ---\n' + additions.join('\n') + '\n');
    console.log(`   ✏️  Added ${additions.length} Canadian names to ${path.relative(ROOT, PLAYERS_TXT)}`);
  } else if (additions.length === 0) {
    console.log(`   ℹ️  All ${canadians.length} Canadians already tracked in cebl-players.txt`);
  }

  // ----- Job 2: DISCOVERY via EuroBasket listing pages (sparse but worth trying) -----
  let discoveredCanadians = 0;
  if (!skipDiscover) {
    await login();
    console.log('\n🌐 [2/3] Attempting EuroBasket discovery pages…');
    const discovered = new Map();
    for (const page of DISCOVERY_PAGES) {
      try {
        const players = await extractPlayersFromListPage(page.url);
        if (players.length > 0) {
          console.log(`   ✅ ${page.label}: ${players.length} player links`);
          players.forEach(p => { if (!discovered.has(p.url)) discovered.set(p.url, { ...p, label: page.label }); });
        } else {
          console.log(`   ⏭️  ${page.label}: empty (off-season behavior is normal)`);
        }
        await sleep(DELAY_MS);
      } catch (e) {
        console.warn(`   ⚠️  ${page.label}: ${e.message}`);
      }
    }

    if (discovered.size > 0) {
      console.log(`\n   🎯 ${discovered.size} discovered URLs — fetching profiles…`);
      let fetched = 0, kept = 0, skipped = 0, errors = 0;
      let i = 0;
      for (const [url, info] of discovered) {
        i++;
        const slug = info.urlSlug;
        const fp = path.join(CACHE_DIR, `${slug}.json`);
        if (!refetch && fs.existsSync(fp)) { skipped++; continue; }
        try {
          await sleep(DELAY_MS);
          const html = await fetchPage(url);
          const bio = parseBio(html, url);
          if (!bio.fullName) { errors++; continue; }
          const isCanadian = ['canadian', 'canada'].includes((bio.nationality || '').toLowerCase());
          const finalSlug = slugify(bio.fullName) || slug;
          if (!dryRun) fs.writeFileSync(path.join(CACHE_DIR, `${finalSlug}.json`), JSON.stringify(bio, null, 2));
          fetched++;
          if (isCanadian) { kept++; discoveredCanadians++; }
          if (fetched % 25 === 0 || i === discovered.size) {
            console.log(`     [${i}/${discovered.size}] ${fetched} fetched · ${kept} new Canadians`);
          }
        } catch (e) {
          errors++;
        }
      }
      console.log(`   📊 Discovery: ${fetched} fetched, ${kept} new Canadians, ${skipped} skipped (already cached), ${errors} errors`);
    }
  } else {
    console.log('\n⏭️  [2/3] Discovery skipped (--skip-discovery)');
  }

  // ----- Job 3: REPORT suspected Canadians for manual review -----
  console.log('\n🔍 [3/3] Suspected Canadians (missing nationality, Canadian-looking bio):');
  if (suspectedCanadians.length > 0) {
    suspectedCanadians.slice(0, 15).forEach(s => {
      console.log(`   • ${s.name || s.file}  ←  birthCity: ${s.birthCity || '?'}`);
    });
    if (suspectedCanadians.length > 15) console.log(`   …and ${suspectedCanadians.length - 15} more`);
  } else {
    console.log('   (none — every player with Canadian-looking data has nationality set)');
  }

  console.log('\n📊 Final summary:');
  console.log(`   🇨🇦 Confirmed Canadians:     ${canadians.length}`);
  console.log(`   🆕 Discovered this run:      ${discoveredCanadians}`);
  console.log(`   🤔 Suspected (manual review): ${suspectedCanadians.length}`);
  console.log(`   📋 Tracked in cebl-players.txt: ${[...existingNames, ...additions].length}`);
  console.log(`\n   Next: run "node tools/extract-global-pros.js" to refresh the runtime DB.`);
})().catch(e => { console.error(e); process.exit(1); });
