#!/usr/bin/env node
/**
 * Refetch player bio data for cached files missing nationality / birthdate / etc.
 *
 * Why this exists: Run #7 scraped 2,902 new players, but the original
 * bio-extraction regex was too strict (required nationality + birthdate +
 * birth city all in one match). Most player pages have those facts spread
 * across separate sentences, so the regex missed them — leaving most
 * profiles with no nationality field.
 *
 * This script:
 *   1. Iterates every JSON in data/cache/
 *   2. If nationality is missing AND we have a sourceUrl → re-fetch
 *   3. Re-parses with the new lenient regex (nationality / birthdate /
 *      birth city as 3 independent matches)
 *   4. Saves the file, preserving any fields the new parse didn't find
 *
 * Idempotent — only refetches files that need it.
 *
 * Usage:
 *   node tools/refetch-missing-bio.js
 *   node tools/refetch-missing-bio.js --limit 100        # for testing
 *   node tools/refetch-missing-bio.js --field birthCity  # require this field too
 */
try { require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); } catch {}

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '..', 'data', 'cache');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const DELAY_MS = parseInt(process.env.SCRAPE_DELAY_MS || '1800', 10);

const args = process.argv.slice(2);
const argVal = (key, fallback) => {
  const i = args.indexOf(key);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const limit = parseInt(argVal('--limit', '0'), 10) || Infinity;
const requireField = argVal('--field', 'nationality');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

let sessionCookies = null;

async function login() {
  if (!process.env.EUROBASKET_EMAIL || !process.env.EUROBASKET_PASSWORD) {
    console.warn('⚠️  No EuroBasket credentials — running unauthenticated');
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

async function fetchPage(url) {
  const headers = { 'User-Agent': USER_AGENT };
  if (sessionCookies) headers['Cookie'] = sessionCookies;
  for (let i = 1; i <= 3; i++) {
    try {
      const r = await axios.get(url, { headers, timeout: 30000 });
      return r.data;
    } catch (e) {
      const status = e.response?.status;
      if (status === 429 || status >= 500) {
        await sleep(Math.pow(2, i) * 1000);
        continue;
      }
      if (i === 3) throw e;
    }
  }
}

// Lenient bio parser — independent regexes for each field.
function parseBio(html) {
  const $ = cheerio.load(html);
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const out = {};

  // Nationality — "Name is Slovenian basketball player"
  const natMatch = bodyText.match(/\bis\s+([A-Z][a-zA-Z]{1,30}?)\s+basketball\s+player\b/i);
  if (natMatch) out.nationality = natMatch[1];

  // Birthdate — "born on January 26 2001" / "born January 26, 2001" / "Jan.26, 2001"
  const dateMatch = bodyText.match(/born\s+(?:on\s+)?([A-Z][a-z]+\.?\s*\d{1,2}[,]?\s*\d{4})/i);
  if (dateMatch) out.birthdate = dateMatch[1].replace(/\s+/g, ' ').replace(/\./g, '. ').replace(/\s+/g, ' ').trim();

  // Birth city — "born in Jesenice"
  const cityMatch = bodyText.match(/born\s+(?:on\s+[A-Z][a-z]+\.?\s*\d{1,2}[,]?\s*\d{4}\s+)?in\s+([A-Z][^.,()]{1,60}?)(?=\s*[.,(]|\s+is\s|\s+was\s|$)/);
  if (cityMatch) out.birthCity = cityMatch[1].trim();
  if (!out.birthCity) {
    const faqCity = bodyText.match(/was\s+born\s+in\s+([A-Z][^.,()]{1,60}?)\s*\(/);
    if (faqCity) out.birthCity = faqCity[1].trim();
  }

  // Height
  const hwMatch = bodyText.match(/(\d+['']\d+[''"]?)\s*(?:\((\d+)\s*cm\))?/);
  if (hwMatch) {
    out.height = hwMatch[1].replace(/['']/g, "'").replace(/[""]/g, '"');
    if (hwMatch[2]) out.heightCm = hwMatch[2];
  }

  // Weight
  const wtMatch = bodyText.match(/([\d.]+)\s*lbs?\s*\(([\d.]+)\s*kg\)/i);
  if (wtMatch) { out.weight = wtMatch[1]; out.weightKg = wtMatch[2]; }

  // Position
  const posMatch = bodyText.match(/\d+['']\d+[''"]?\s+(guard|forward|center|point guard|shooting guard|small forward|power forward)/i);
  if (posMatch) out.position = posMatch[1];

  return out;
}

(async () => {
  await login();

  const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
  const todo = [];
  for (const file of files) {
    const fp = path.join(CACHE_DIR, file);
    let data;
    try { data = JSON.parse(fs.readFileSync(fp, 'utf-8')); }
    catch { continue; }
    if (data[requireField]) continue;     // already has it
    if (!data.sourceUrl) continue;        // can't refetch
    todo.push({ file, fp, data });
  }

  console.log(`📋 ${todo.length} cache files missing "${requireField}". Re-fetching…\n`);
  if (todo.length === 0) { console.log('Nothing to do.'); return; }

  let fixed = 0, stillMissing = 0, errors = 0;
  const cap = Math.min(todo.length, limit);

  for (let i = 0; i < cap; i++) {
    const { file, fp, data } = todo[i];
    try {
      await sleep(DELAY_MS);
      const html = await fetchPage(data.sourceUrl);
      const bio = parseBio(html);
      // Merge — preserve existing fields, fill gaps
      const updated = { ...data, ...bio, _lastVerified: new Date().toISOString() };
      fs.writeFileSync(fp, JSON.stringify(updated, null, 2));
      if (updated[requireField]) { fixed++; }
      else { stillMissing++; }
      if ((i + 1) % 25 === 0 || i + 1 === cap) {
        console.log(`  [${i+1}/${cap}] ✅ ${fixed} fixed · ${stillMissing} still missing · ${errors} errors`);
      }
    } catch (e) {
      errors++;
      console.warn(`  ❌ ${file}: ${e.message}`);
    }
  }

  console.log(`\n📊 Done!`);
  console.log(`   ✅ Fixed:         ${fixed}`);
  console.log(`   ⚠️  Still missing: ${stillMissing}`);
  console.log(`   ❌ Errors:        ${errors}`);
})().catch(e => { console.error(e); process.exit(1); });
