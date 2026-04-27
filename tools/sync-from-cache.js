#!/usr/bin/env node
/**
 * Sync from EuroBasket cache → enrich static data files
 *
 * Reads JSON cache files in /data/cache/ (one per player, slugified name)
 * and produces an enriched data summary so we can update pipeline-data.js
 * and data.js with verified bio/team/league/career details.
 *
 * Usage:
 *   node tools/sync-from-cache.js                    # report-only (no writes)
 *   node tools/sync-from-cache.js --write             # apply changes to data files
 *   node tools/sync-from-cache.js --player "Name"     # check just one player
 *
 * The static site never reads cache files at runtime — this is build-time only.
 * Cache refreshes happen via tools/cache-updater.js (which calls EuroBasket).
 */

const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '..', 'data', 'cache');
const SCOUT_ROOT = path.join(__dirname, '..');

// --- Slug helpers ---
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// --- Cache reader ---
function readCache(playerName) {
  const slug = slugify(playerName);
  const file = path.join(CACHE_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
  catch (e) { return null; }
}

function listCachedPlayers() {
  if (!fs.existsSync(CACHE_DIR)) return [];
  return fs.readdirSync(CACHE_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace(/\.json$/, ''));
}

// --- Player record extraction (parse pipeline-data.js / data.js) ---
function loadDataFile(filename) {
  const file = path.join(SCOUT_ROOT, filename);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf-8');
}

function extractPlayerNamesFromText(text) {
  const matches = text.match(/name:\s*"([^"]+)"/g) || [];
  return [...new Set(matches.map(m => m.replace(/name:\s*"|"$/g, '')))];
}

// --- Reporting ---
function buildReport() {
  const cachedFiles = listCachedPlayers();
  const pipelineText = loadDataFile('pipeline-data.js') || '';
  const dataText = loadDataFile('data.js') || '';

  const pipelineNames = extractPlayerNamesFromText(pipelineText);
  const dataNames = extractPlayerNamesFromText(dataText);
  const allNames = [...new Set([...pipelineNames, ...dataNames])];

  const matched = [];
  const missing = [];
  for (const name of allNames) {
    const c = readCache(name);
    if (c) matched.push({ name, cache: c });
    else missing.push(name);
  }

  const orphan = cachedFiles.filter(slug => !allNames.some(n => slugify(n) === slug));

  return { matched, missing, orphan, totalCached: cachedFiles.length, totalNamesInData: allNames.length };
}

// --- Single player diff ---
function reportPlayer(name) {
  const cache = readCache(name);
  if (!cache) {
    console.log(`❌ No cache for "${name}" (looked for ${slugify(name)}.json)`);
    return;
  }
  console.log(`\n📋 EuroBasket cache for "${cache.fullName || name}":\n`);
  const fields = ['fullName','position','height','heightCm','weight','weightKg','birthdate','birthCity','college','highSchool','currentTeam','currentLeague','nationality','agent'];
  fields.forEach(f => {
    if (cache[f]) console.log(`  ${f.padEnd(15)} : ${cache[f]}`);
  });
  if (cache.careerHistory && cache.careerHistory.length) {
    console.log(`\n  Career history: ${cache.careerHistory.length} season-team entries`);
    cache.careerHistory.slice(-5).forEach(h => {
      console.log(`    ${h.year}  ${h.team}  (${h.league})`);
    });
  }
}

// --- Main ---
function main() {
  const args = process.argv.slice(2);
  const playerArg = args.indexOf('--player');
  const writeMode = args.includes('--write');

  if (playerArg !== -1 && args[playerArg + 1]) {
    reportPlayer(args[playerArg + 1]);
    return;
  }

  const report = buildReport();
  console.log(`\n🏀 CEBL Scout — EuroBasket Cache Sync Report\n`);
  console.log(`  Cached player JSONs:  ${report.totalCached}`);
  console.log(`  Player names in data: ${report.totalNamesInData}`);
  console.log(`  ✅ Matched:           ${report.matched.length}`);
  console.log(`  ❌ Missing (no cache): ${report.missing.length}`);
  console.log(`  📦 Orphan cache (not in data): ${report.orphan.length}\n`);

  if (writeMode) {
    console.log(`  ✏️  Write mode is reserved — review proposed changes manually.`);
    console.log(`  Run without --write to inspect, or use --player "Name" to diff.\n`);
  }

  if (report.matched.length > 0) {
    console.log(`Sample matched players (first 10):`);
    report.matched.slice(0, 10).forEach(m => {
      console.log(`  ${m.name.padEnd(28)} → ${m.cache.currentTeam || '?'} (${m.cache.currentLeague || '?'})`);
    });
    console.log('');
  }
  if (report.missing.length > 0) {
    console.log(`Top players missing from cache (first 10):`);
    report.missing.slice(0, 10).forEach(n => console.log(`  - ${n}`));
    console.log('');
    console.log(`To fetch missing players, add their names to tools/cebl-players.txt and run:`);
    console.log(`  node tools/cache-updater.js`);
    console.log('');
  }
}

if (require.main === module) main();

module.exports = { readCache, listCachedPlayers, slugify, buildReport };
