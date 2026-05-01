#!/usr/bin/env node
/**
 * CEBL Transactions Scraper
 *
 * Source: https://www.cebl.ca/transactions
 * Output: data/cebl-signings.json (canonical signings record)
 *
 * The transactions page is rendered client-side by Duda CMS, so axios+cheerio
 * alone returns no rows. We use Playwright (headless Chromium) to execute the
 * page's JS, then read the rendered DOM.
 *
 * Usage:
 *   node tools/scrape-cebl-signings.js              # writes data/cebl-signings.json
 *   node tools/scrape-cebl-signings.js --dry-run    # prints summary, doesn't write
 *   node tools/scrape-cebl-signings.js --debug      # screenshots + verbose log
 *
 * GitHub Actions: this script lives in the weekly data-refresh workflow.
 * Playwright is installed via `npx playwright install --with-deps chromium`.
 */

const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '..', 'data', 'cebl-signings.json');
const URL = 'https://www.cebl.ca/transactions';
const dryRun = process.argv.includes('--dry-run');
const debug = process.argv.includes('--debug');

// Map various team-name spellings → canonical CEBL team name
const TEAM_ALIASES = {
  'brampton': 'Brampton Honey Badgers',
  'brampton honey badgers': 'Brampton Honey Badgers',
  'honey badgers': 'Brampton Honey Badgers',
  'calgary': 'Calgary Surge',
  'calgary surge': 'Calgary Surge',
  'edmonton': 'Edmonton Stingers',
  'edmonton stingers': 'Edmonton Stingers',
  'montreal': 'Montreal Alliance',
  'montréal': 'Montreal Alliance',
  'montreal alliance': 'Montreal Alliance',
  'niagara': 'Niagara River Lions',
  'niagara river lions': 'Niagara River Lions',
  'river lions': 'Niagara River Lions',
  'ottawa': 'Ottawa BlackJacks',
  'ottawa blackjacks': 'Ottawa BlackJacks',
  'blackjacks': 'Ottawa BlackJacks',
  'saskatchewan': 'Saskatoon Mamba',          // legacy
  'saskatchewan rattlers': 'Saskatoon Mamba',  // legacy
  'saskatoon': 'Saskatoon Mamba',
  'saskatoon mamba': 'Saskatoon Mamba',
  'mamba': 'Saskatoon Mamba',
  'scarborough': 'Scarborough Shooting Stars',
  'scarborough shooting stars': 'Scarborough Shooting Stars',
  'shooting stars': 'Scarborough Shooting Stars',
  'vancouver': 'Vancouver Bandits',
  'vancouver bandits': 'Vancouver Bandits',
  'bandits': 'Vancouver Bandits',
  'winnipeg': 'Winnipeg Sea Bears',
  'winnipeg sea bears': 'Winnipeg Sea Bears',
  'sea bears': 'Winnipeg Sea Bears'
};

function canonicalTeam(t) {
  if (!t) return '';
  const k = t.toLowerCase().replace(/\s+/g, ' ').trim();
  return TEAM_ALIASES[k] || t.trim();
}

// "April 30, 2026" → "2026-04-30"
function normalizeDate(s) {
  if (!s) return '';
  const m = s.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i);
  if (!m) return s.trim();
  const months = { january:1, february:2, march:3, april:4, may:5, june:6, july:7, august:8, september:9, october:10, november:11, december:12 };
  const mo = String(months[m[1].toLowerCase()]).padStart(2, '0');
  const d = String(m[2]).padStart(2, '0');
  return `${m[3]}-${mo}-${d}`;
}

async function scrape() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch (err) {
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

  console.log('→ Navigating to', URL);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60_000 });

  // Wait for at least one transaction row to render. Duda Collection rows
  // typically use a wrapper with the player name embedded.
  console.log('→ Waiting for transactions to render…');
  try {
    await page.waitForFunction(
      () => document.body.innerText.includes('Standard Player Contract') ||
            document.body.innerText.includes('Player Contract') ||
            document.body.innerText.includes('Head Coach'),
      { timeout: 30_000 }
    );
  } catch (err) {
    console.warn('⚠️  Could not detect contract rows within 30s — proceeding anyway');
  }

  // Give the lazy-loader a beat to finish injecting all rows
  await page.waitForTimeout(2500);

  // Try to click "Load more" if present, repeatedly
  for (let i = 0; i < 10; i++) {
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('a, button, span')].find(el => {
        const t = (el.innerText || '').trim().toLowerCase();
        return t === 'load more' || t === 'show more' || t.startsWith('load more');
      });
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (!clicked) break;
    await page.waitForTimeout(1500);
  }

  if (debug) {
    await page.screenshot({ path: '/tmp/cebl-transactions.png', fullPage: true });
    console.log('🖼  Screenshot: /tmp/cebl-transactions.png');
  }

  // Extract: Duda Collection multi-content rows. The page text follows the
  // pattern "PlayerName\nTeamName\nMonth Day, Year\nContract Type" repeating.
  const rows = await page.evaluate(() => {
    // First try: row-shaped containers
    const candidates = [...document.querySelectorAll(
      '[class*="dCollectionContent"], [class*="dCollection"], .d-multi-content, .d-multi-paged-content > *, [data-binding] [class*="row"]'
    )];

    const out = [];
    for (const el of candidates) {
      const txt = (el.innerText || '').trim();
      if (!txt) continue;
      // Look for a date line + a contract-type line in the block
      const lines = txt.split(/\n+/).map(s => s.trim()).filter(Boolean);
      if (lines.length < 3) continue;
      const dateIdx = lines.findIndex(l => /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d/i.test(l));
      if (dateIdx < 1) continue;
      const player = lines[0];
      const team = lines[1];
      const date = lines[dateIdx];
      const type = lines[dateIdx + 1] || lines[lines.length - 1];
      // Sanity: skip if "player" looks like a header
      if (/transaction|view all|search|filter/i.test(player)) continue;
      out.push({ player, team, date, type });
    }
    if (out.length > 0) return out;

    // Fallback: walk the entire page text and look for groups of 4 lines
    const all = document.body.innerText.split(/\n+/).map(s => s.trim()).filter(Boolean);
    const result = [];
    for (let i = 0; i < all.length - 3; i++) {
      const dateMatch = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i.test(all[i + 2]);
      const typeMatch = /(Player Contract|Head Coach|General Manager|Assistant)/i.test(all[i + 3]);
      if (dateMatch && typeMatch && all[i].length >= 3 && all[i].length <= 60 && !/transaction|view all/i.test(all[i])) {
        result.push({ player: all[i], team: all[i + 1], date: all[i + 2], type: all[i + 3] });
      }
    }
    return result;
  });

  await browser.close();

  // Normalize, dedupe
  const seen = new Set();
  const transactions = [];
  for (const r of rows) {
    const player = r.player.trim();
    const team = canonicalTeam(r.team);
    const date = normalizeDate(r.date);
    const type = r.type.trim();
    const key = `${player.toLowerCase()}|${team}|${date}`;
    if (seen.has(key)) continue;
    seen.add(key);
    transactions.push({ player, team, date, type });
  }

  // Sort by date descending
  transactions.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  console.log(`✅ Scraped ${transactions.length} transactions`);

  if (transactions.length === 0) {
    console.error('❌ Zero rows extracted — selector likely changed. Aborting write.');
    process.exit(2);
  }

  // Quick stats by team
  const byTeam = {};
  for (const t of transactions) byTeam[t.team] = (byTeam[t.team] || 0) + 1;
  console.log('\n📊 By team:');
  for (const [team, n] of Object.entries(byTeam).sort((a, b) => b[1] - a[1])) {
    console.log(`   ${team.padEnd(36)} ${n}`);
  }

  if (dryRun) {
    console.log('\n💧 DRY RUN — not writing file. First 5:');
    transactions.slice(0, 5).forEach(t => console.log(`   ${t.date}  ${t.player} → ${t.team} (${t.type})`));
    return;
  }

  const out = {
    _lastScraped: new Date().toISOString(),
    _source: URL,
    _method: 'playwright (headless chromium)',
    season: '2026',
    transactions
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + '\n');
  console.log(`\n💾 Wrote ${OUT_FILE}`);
}

scrape().catch(err => {
  console.error('❌ Scrape failed:', err.message);
  if (debug) console.error(err.stack);
  process.exit(1);
});
