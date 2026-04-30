#!/usr/bin/env node
/**
 * Backfill _lastVerified, _sources, _dataConfidence on existing cache JSONs.
 *
 * Existing cache files were written before we added verification metadata.
 * This is a one-shot script to add those fields based on what's already
 * in each file. After this runs, every cache JSON has the metadata that
 * the UI freshness badges expect.
 *
 * Idempotent — safe to run multiple times.
 */
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '..', 'data', 'cache');

const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
let backfilled = 0, alreadyOk = 0, errors = 0;

for (const file of files) {
  const fp = path.join(CACHE_DIR, file);
  let data;
  try { data = JSON.parse(fs.readFileSync(fp, 'utf-8')); }
  catch (e) { errors++; console.warn(`❌ ${file}: ${e.message}`); continue; }

  let changed = false;
  if (!data._lastVerified) {
    data._lastVerified = data.cachedAt || new Date().toISOString();
    changed = true;
  }
  if (!data._sources) {
    data._sources = data.sources || ['eurobasket.com'];
    changed = true;
  }
  if (!data._dataConfidence) {
    // Heuristic: high if has both currentTeam + careerHistory entries,
    // medium otherwise.
    const hasTeam   = !!(data.currentTeam && data.currentTeam.length > 0);
    const hasCareer = Array.isArray(data.careerHistory) && data.careerHistory.length >= 3;
    data._dataConfidence = (hasTeam && hasCareer) ? 'high' : (hasTeam ? 'medium' : 'low');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fp, JSON.stringify(data, null, 2));
    backfilled++;
  } else {
    alreadyOk++;
  }
}

console.log(`✅ Backfilled ${backfilled} cache files`);
console.log(`✓  ${alreadyOk} already had metadata`);
if (errors > 0) console.log(`❌ ${errors} errors`);
