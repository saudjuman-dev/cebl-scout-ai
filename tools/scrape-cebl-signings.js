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
  // Lowercase, strip diacritics, trim trailing punctuation
  const k = t.toLowerCase()
              .normalize('NFD').replace(/[̀-ͯ]/g, '') // accents
              .replace(/\s+/g, ' ')
              .replace(/[:;,.\s]+$/g, '')
              .trim();
  return TEAM_ALIASES[k] || t.trim().replace(/[:;,.\s]+$/g, '');
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

  // Some Duda collection pages use infinite scroll — keep scrolling to bottom
  // until the row count stops growing (or we've waited 30s).
  let lastRowCount = 0;
  const startScroll = Date.now();
  while (Date.now() - startScroll < 30_000) {
    const rowCount = await page.evaluate(() => document.querySelectorAll('table tbody tr').length);
    if (rowCount === lastRowCount) {
      // No new rows since last tick — try one more scroll, then bail if still nothing
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1500);
      const after = await page.evaluate(() => document.querySelectorAll('table tbody tr').length);
      if (after === rowCount) break;
      lastRowCount = after;
    } else {
      lastRowCount = rowCount;
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
  }
  console.log(`→ Found ${lastRowCount} table rows after scroll`);

  if (debug) {
    await page.screenshot({ path: '/tmp/cebl-transactions.png', fullPage: true });
    console.log('🖼  Screenshot: /tmp/cebl-transactions.png');
  }

  // Extract: cebl.ca/transactions renders as a real <table>. Layout:
  //   - Header row (<th> cells) holds a DATE; date headers can group multiple
  //     transactions that share that date.
  //   - Data rows (<td> cells) follow: first cell = team, second cell =
  //     "Player Name signed to a Standard Player Contract" (or similar).
  //
  // Algorithm: walk rows in order, track the most recent date header, and
  // emit one record per data row. Reset when we hit a new header.
  const rows = await page.evaluate(() => {
    const trs = [...document.querySelectorAll('table tbody tr')];
    const out = [];
    const dateRe = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i;

    // Action patterns for parsing the second cell into player + type
    const actionPatterns = [
      { re: /^(.+?)\s+signed to (?:a|an)?\s*(.+?)$/i,    kind: (m) => m[2].trim() },
      { re: /^(.+?)\s+re-signed to (?:a|an)?\s*(.+?)$/i, kind: (m) => 'Re-signed: ' + m[2].trim() },
      { re: /^(.+?)\s+re-signed as\s+(.+?)$/i,           kind: (m) => 'Re-signed: ' + m[2].trim() },
      { re: /^(.+?)\s+named\s+(.+?)$/i,                  kind: (m) => m[2].trim() },
    ];

    let currentDate = null;
    for (const tr of trs) {
      // Check if this row is a header row (date)
      const ths = tr.querySelectorAll('th, .header-cell');
      if (ths.length > 0) {
        const text = (ths[0].innerText || ths[0].textContent || '').trim();
        if (dateRe.test(text)) currentDate = text;
        continue;
      }

      // Otherwise it should be a data row (td cells)
      const tds = tr.querySelectorAll('td, .cell');
      if (tds.length < 2 || !currentDate) continue;

      const team   = (tds[0].innerText || tds[0].textContent || '').trim();
      const action = (tds[1].innerText || tds[1].textContent || '').trim();
      if (!team || !action) continue;
      if (/^transaction|^view all|^search|^filter/i.test(action)) continue;

      let player = '', type = '';
      for (const pat of actionPatterns) {
        const m = action.match(pat.re);
        if (m) {
          player = m[1].trim();
          type = pat.kind(m);
          break;
        }
      }
      if (!player) { player = action; type = action; }

      out.push({ player, team, date: currentDate, type });
    }
    return out;
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
