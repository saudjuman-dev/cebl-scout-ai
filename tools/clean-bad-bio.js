#!/usr/bin/env node
/**
 * Clean garbage values from cache files (e.g. "storing language!'); } });")
 *
 * The original eurobasket-mcp parser sometimes captured JavaScript code
 * from EuroBasket pages as the birthCity / position / etc. value. This
 * script wipes those bad values so refetch-missing-bio.js can re-populate
 * them properly with the new lenient regex.
 *
 * Usage:
 *   node tools/clean-bad-bio.js          # dry run, prints what would change
 *   node tools/clean-bad-bio.js --apply  # actually clean
 */
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '..', 'data', 'cache');
const apply = process.argv.includes('--apply');

// Garbage indicators — JS code, brackets, function syntax
const BAD_PATTERNS = /storing|}\);|{ }|function\s|var\s|document\.|window\.|<script|localStorage|<\/[a-z]+>/i;

const FIELDS_TO_CHECK = ['birthCity', 'birthdate', 'position', 'college', 'highSchool', 'currentTeam'];

const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
let cleaned = 0, fileChanges = 0;

for (const f of files) {
  const fp = path.join(CACHE_DIR, f);
  let d;
  try { d = JSON.parse(fs.readFileSync(fp, 'utf-8')); } catch { continue; }
  let changed = false;
  for (const field of FIELDS_TO_CHECK) {
    const val = d[field];
    if (typeof val === 'string' && BAD_PATTERNS.test(val)) {
      console.log(`  ${d.fullName || f}: ${field} = ${JSON.stringify(val).substring(0, 80)} → blanked`);
      delete d[field];   // remove, so refetch script picks it up as missing
      changed = true;
      cleaned++;
    }
  }
  if (changed) {
    fileChanges++;
    if (apply) fs.writeFileSync(fp, JSON.stringify(d, null, 2));
  }
}

console.log(`\n📊 Done${apply ? '' : ' (DRY RUN — pass --apply to write)'}`);
console.log(`   ${fileChanges} files affected`);
console.log(`   ${cleaned} fields cleaned`);
if (!apply && fileChanges > 0) console.log(`\n   To clean: node tools/clean-bad-bio.js --apply`);
