#!/usr/bin/env node
/**
 * NCAA D1 Canadians Scraper
 *
 * Source: NorthPoleHoops annual "Canadians Playing NCAA D1" article.
 *         (The article slug rolls over each season — we resolve it via search.)
 *
 * Output: data/ncaa-canadians.json (canonical NCAA D1 Canadian roster)
 *
 * The article body has each player as a structured line:
 *   "Hassan Abdul-Hakim | Memphis | G | Senior | Mississauga, ON"
 *
 * Some seasons NPH publishes plain text; other seasons it's an HTML table.
 * We accept both via Playwright.
 *
 * Usage:
 *   node tools/scrape-ncaa-canadians.js                # default season URL
 *   node tools/scrape-ncaa-canadians.js --url <URL>    # override URL
 *   node tools/scrape-ncaa-canadians.js --dry-run
 */

const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '..', 'data', 'ncaa-canadians.json');

// 2025-26 article. Update when the next season's roundup is published —
// look for "###+ Canadians Playing NCAA D1 Basketball - YYYY-YYYY" on
// https://northpolehoops.com/tag/canadians-in-ncaa/
const DEFAULT_URL = 'https://northpolehoops.com/2025/10/09/150-canadians-playing-ncaa-d1-basketball-2025-2026/';

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const debug  = argv.includes('--debug');
const urlIdx = argv.indexOf('--url');
const URL = urlIdx >= 0 && argv[urlIdx + 1] ? argv[urlIdx + 1] : DEFAULT_URL;

// Province / state matchers for hometown validation
const CANADIAN_PROV = /\b(ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|YT|NT|NU)\b/;
const CITY_FALLBACK_CA = new Set([
  'Toronto', 'Mississauga', 'Brampton', 'Vaughan', 'Markham',
  'Calgary', 'Edmonton', 'Vancouver', 'Surrey', 'Burnaby',
  'Montreal', 'Quebec City', 'Quebec', 'Ottawa', 'Winnipeg',
  'Hamilton', 'Halifax', 'Saskatoon', 'Regina'
]);

// Position normalize: "GF" → "G/F", "FC" → "F/C"
function normPos(p) {
  if (!p) return '';
  const t = p.trim().replace(/\s+/g, '').toUpperCase();
  if (t === 'GF') return 'G/F';
  if (t === 'FC') return 'F/C';
  if (t === 'PGSG') return 'G';
  return t.replace(/\//g, '/');
}

// Hometown cleanup: "Monreal, QC" → "Montreal, QC"; "Quebec City" → "Quebec City, QC"
const TYPO_FIXES = {
  'monreal': 'Montreal',
  'fredericton': 'Fredericton',
  'frederticton': 'Fredericton',
  'margrath': 'Magrath'
};
function cleanHometown(h) {
  if (!h) return '';
  let s = h.trim().replace(/\s+/g, ' ');
  // Apply typo fixes to leading word
  const parts = s.split(',').map(p => p.trim());
  const first = (parts[0] || '').toLowerCase();
  if (TYPO_FIXES[first]) parts[0] = TYPO_FIXES[first];
  s = parts.filter(Boolean).join(', ');
  // If it's a known Canadian city without province, append best-effort
  if (!CANADIAN_PROV.test(s)) {
    const city = parts[0] || '';
    if (city === 'Quebec City' || city === 'Quebec') s = 'Quebec City, QC';
    else if (city === 'Montreal') s = 'Montreal, QC';
  }
  return s;
}

// Expected line shape: NAME | SCHOOL | POS | YEAR | HOMETOWN
function parsePlayerLine(line) {
  const parts = line.split('|').map(s => s.trim());
  if (parts.length < 4) return null;
  const [name, school, pos, year, ...rest] = parts;
  if (!name || !school) return null;
  // Reject obviously-non-player lines
  if (/^(name|school|college|team|year|player)$/i.test(name)) return null;
  if (name.length > 60) return null;
  return {
    name,
    school: school.replace(/\s+/g, ' ').trim(),
    pos: normPos(pos),
    year: (year || '').trim(),
    hometown: cleanHometown(rest.join(', '))
  };
}

async function scrape() {
  let playwright;
  try { playwright = require('playwright'); }
  catch (err) {
    console.error('❌ playwright not installed. Run: npm install --no-save playwright && npx playwright install --with-deps chromium');
    process.exit(1);
  }

  const { chromium } = playwright;
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 }
  });
  const page = await ctx.newPage();

  console.log(`→ Navigating to ${URL}`);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(1500);

  if (debug) {
    await page.screenshot({ path: '/tmp/ncaa-canadians.png', fullPage: true });
    console.log('🖼  Screenshot: /tmp/ncaa-canadians.png');
  }

  // Two extraction strategies:
  //   A) Article body text — split by lines, find pipe-delimited rows
  //   B) <table> rows with <td>name</td><td>school</td>...
  const extracted = await page.evaluate(() => {
    const out = [];

    // Strategy A: pipe-delimited lines anywhere in main content
    const main = document.querySelector('article, .entry-content, main, body') || document.body;
    const text = main.innerText || '';
    for (const line of text.split(/\n+/)) {
      const trimmed = line.trim();
      if (trimmed.split('|').length >= 4) out.push({ kind: 'line', value: trimmed });
    }

    // Strategy B: tables
    const tables = document.querySelectorAll('table');
    for (const tbl of tables) {
      for (const tr of tbl.querySelectorAll('tr')) {
        const cells = [...tr.querySelectorAll('td')].map(td => td.innerText.trim());
        if (cells.length >= 4) out.push({ kind: 'table', value: cells.join(' | ') });
      }
    }

    return out;
  });

  await browser.close();

  if (debug) console.log(`→ Raw extraction yielded ${extracted.length} candidate rows`);

  // Parse + dedupe
  const seen = new Set();
  const players = [];
  for (const item of extracted) {
    const p = parsePlayerLine(item.value);
    if (!p) continue;
    const key = (p.name + '|' + p.school).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    players.push(p);
  }

  // Sort alphabetically by name
  players.sort((a, b) => a.name.localeCompare(b.name));

  console.log(`✅ Parsed ${players.length} players`);

  if (players.length === 0) {
    console.error('❌ Zero players extracted — selector likely changed. Aborting write.');
    console.error('   Tip: re-run with --debug, inspect /tmp/ncaa-canadians.png, and check the source URL.');
    process.exit(2);
  }

  // Province distribution
  const byProv = {};
  for (const p of players) {
    const m = p.hometown.match(CANADIAN_PROV);
    const prov = m ? m[0] : 'OTHER';
    byProv[prov] = (byProv[prov] || 0) + 1;
  }
  console.log('\n📊 By province:');
  for (const [prov, n] of Object.entries(byProv).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${prov.padEnd(8)} ${n}`);
  }

  // Top schools by Canadian count
  const bySchool = {};
  for (const p of players) bySchool[p.school] = (bySchool[p.school] || 0) + 1;
  const topSchools = Object.entries(bySchool).sort((a, b) => b[1] - a[1]).slice(0, 10);
  console.log('\n📊 Top schools:');
  for (const [school, n] of topSchools) console.log(`   ${school.padEnd(28)} ${n}`);

  if (dryRun) {
    console.log('\n💧 DRY RUN — not writing. First 5 players:');
    players.slice(0, 5).forEach(p => console.log(`   ${p.name.padEnd(28)} ${p.school.padEnd(22)} ${p.pos.padEnd(5)} ${p.year.padEnd(10)} ${p.hometown}`));
    return;
  }

  const out = {
    _lastScraped: new Date().toISOString(),
    _source: URL,
    _method: 'playwright (headless chromium)',
    season: '2025-26',
    players
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + '\n');
  console.log(`\n💾 Wrote ${OUT_FILE}`);
}

scrape().catch(err => {
  console.error('❌ Scrape failed:', err.message);
  if (debug) console.error(err.stack);
  process.exit(1);
});
