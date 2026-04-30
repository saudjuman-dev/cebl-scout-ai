#!/usr/bin/env node
/**
 * CEBL Scout — Comprehensive Data Audit
 *
 * Scans all data files for issues that would be embarrassing in a public launch.
 *
 * Checks:
 *   1. Cache name-mismatches (Cat Barber → Chris Jones bug)
 *   2. Player names with typos / inconsistent spellings across files
 *   3. Suspicious stats (out of realistic ranges)
 *   4. Empty/missing required fields
 *   5. Cross-file inconsistencies (player on team A here, team B there)
 *   6. Career-data.js entries with extrapolated/round-number stats (likely fabricated)
 *   7. Records / awards that lack a verifiable date or source
 *
 * Usage:  node tools/audit-data.js [--verbose]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CACHE_DIR = path.join(ROOT, 'data', 'cache');

const verbose = process.argv.includes('--verbose');

// --- Helpers ---
const slugify = (s) => s.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const readFile = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf-8');
const issues = { critical: [], warning: [], info: [] };
const log = (level, msg) => issues[level].push(msg);

// ============================================================================
// 1. CACHE NAME-MISMATCH AUDIT
// ============================================================================
console.log('\n📦 [1/7] Auditing cache JSONs for name-mismatch bugs...');
const cacheFiles = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
const cacheMismatches = [];

for (const file of cacheFiles) {
  const slug = file.replace(/\.json$/, '');
  const requested = slug.replace(/-/g, ' ');
  let cache;
  try { cache = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, file), 'utf-8')); }
  catch (e) { log('critical', `Cache file ${file} is invalid JSON`); continue; }

  const cachedName = (cache.fullName || '').toLowerCase();
  const requestedTokens = requested.split(' ').filter(t => t.length > 2);
  // Soft match: at least one significant requested token must appear in cached name
  const matches = requestedTokens.some(t => cachedName.includes(t));
  if (!matches && cachedName) {
    cacheMismatches.push({ file, requested, cached: cache.fullName });
    log('critical', `Cache mismatch: ${file} requested="${requested}" but cached="${cache.fullName}"`);
  }
  if (!cache.fullName) {
    log('warning', `Cache ${file} has no fullName field`);
  }
}
console.log(`   Found ${cacheMismatches.length} mismatched cache files`);

// ============================================================================
// 2. PLAYER-NAME CONSISTENCY ACROSS FILES
// ============================================================================
console.log('\n📚 [2/7] Cross-referencing player names across data files...');
function extractNames(text) {
  return [...new Set((text.match(/name:\s*"([^"]+)"/g) || []).map(m => m.replace(/name:\s*"|"$/g, '')))];
}
const dataNames = extractNames(readFile('data.js'));
const pipelineNames = extractNames(readFile('pipeline-data.js'));
const careerNames = [...readFile('career-data.js').matchAll(/^\s*"([A-Z][^"]+)":\s*\{/gm)]
  .map(m => m[1])
  .filter(n => !n.includes('Honey Badgers') && !n.includes('Surge') && !n.includes('Stingers') && !n.includes('Alliance') && !n.includes('Lions') && !n.includes('BlackJacks') && !n.includes('Mamba') && !n.includes('Stars') && !n.includes('Bandits') && !n.includes('Bears'));
const recordsNames = [...readFile('cebl-records.js').matchAll(/player:\s*"([^"]+)"/g)].map(m => m[1]);

const allNames = [...new Set([...dataNames, ...pipelineNames, ...careerNames, ...recordsNames])];

// Find near-duplicate names (suggests typos)
function levenshtein(a, b) {
  if (!a) return b.length; if (!b) return a.length;
  const m = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) m[i][0] = i;
  for (let j = 0; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    m[i][j] = a[i-1] === b[j-1] ? m[i-1][j-1] : 1 + Math.min(m[i-1][j], m[i][j-1], m[i-1][j-1]);
  }
  return m[a.length][b.length];
}
const dupes = [];
for (let i = 0; i < allNames.length; i++) for (let j = i+1; j < allNames.length; j++) {
  const a = allNames[i], b = allNames[j];
  if (a === b) continue;
  const d = levenshtein(a.toLowerCase(), b.toLowerCase());
  if (d > 0 && d <= 2 && Math.min(a.length, b.length) > 4) {
    dupes.push([a, b, d]);
  }
}
if (dupes.length > 0) {
  console.log(`   ${dupes.length} potential typo/duplicate name pairs:`);
  dupes.slice(0, 10).forEach(([a, b]) => log('warning', `Possible typo: "${a}" vs "${b}"`));
}

// ============================================================================
// 3. SUSPICIOUS STATS (out-of-range)
// ============================================================================
console.log('\n📊 [3/7] Scanning for unrealistic stats...');
const text = readFile('data.js') + readFile('pipeline-data.js');
let suspectCount = 0;
// PPG > 35 is suspicious for any league
const ppgMatches = [...text.matchAll(/name:\s*"([^"]+)"[^}]*?ppg:\s*([\d.]+)/g)];
ppgMatches.forEach(m => {
  const ppg = parseFloat(m[2]);
  if (ppg > 35) { log('warning', `${m[1]}: PPG=${ppg} is unusually high`); suspectCount++; }
  if (ppg === 0) { log('info', `${m[1]}: PPG=0 (free agent or rookie?)`); }
});
console.log(`   ${suspectCount} stat anomalies flagged`);

// ============================================================================
// 4. CROSS-FILE TEAM INCONSISTENCIES
// ============================================================================
console.log('\n🔁 [4/7] Cross-checking team assignments across files...');
function getPlayerTeam(text, name) {
  const re = new RegExp(`name:\\s*"${name.replace(/[^a-zA-Z0-9 ]/g, '\\$&')}"[\\s\\S]{0,200}team:\\s*"([^"]+)"`);
  const m = text.match(re);
  return m ? m[1] : null;
}
const dataText = readFile('data.js');
const pipelineText = readFile('pipeline-data.js');
let inconsistencies = 0;
allNames.forEach(name => {
  const teamA = getPlayerTeam(dataText, name);
  const teamB = getPlayerTeam(pipelineText, name);
  if (teamA && teamB && teamA !== teamB && !teamA.includes(teamB) && !teamB.includes(teamA)) {
    // Skip cases like "Vancouver 2025" in data.js vs "Vancouver Bandits" in pipeline-data.js (close enough)
    const aShort = teamA.split(/\s+/)[0];
    const bShort = teamB.split(/\s+/)[0];
    if (aShort !== bShort) {
      log('warning', `Team inconsistency: ${name} → data.js="${teamA}", pipeline-data.js="${teamB}"`);
      inconsistencies++;
    }
  }
});
console.log(`   ${inconsistencies} cross-file team inconsistencies`);

// ============================================================================
// 5. EXTRAPOLATED CAREER STATS (likely fabricated)
// ============================================================================
console.log('\n🤔 [5/7] Looking for round-number career stats (fabrication signal)...');
// Heuristic: a careerStats entry where multiple sequential seasons have suspiciously round numbers
const careerText = readFile('career-data.js');
const allRoundedSeasons = [...careerText.matchAll(/ppg:\s*(\d+)\.0,\s*rpg:\s*(\d+)\.0/g)];
if (allRoundedSeasons.length > 20) {
  log('warning', `${allRoundedSeasons.length} season entries have all-zero decimal PPG/RPG (likely extrapolated). Recommend marking these as "estimated" or verifying.`);
}
console.log(`   ${allRoundedSeasons.length} suspiciously-round season stat lines`);

// ============================================================================
// 6. RECORDS / AWARDS WITHOUT SOURCES
// ============================================================================
console.log('\n📖 [6/7] Auditing CEBL Records for verifiability...');
const records = readFile('cebl-records.js');
const recordCount = (records.match(/value:/g) || []).length;
const datedRecords = (records.match(/date:\s*"\d{4}/g) || []).length;
log('info', `${recordCount} record values defined; ${datedRecords} have a year reference`);

// Look for "X+" or vague values that suggest extrapolation
const vagueValues = [...records.matchAll(/value:\s*"([^"]+)"/g)].filter(m => /\+|approx|~/.test(m[1]));
if (vagueValues.length > 0) {
  log('warning', `${vagueValues.length} records use vague values (e.g. "1,400+"). Recommend confirming exact figure or flagging as approximate.`);
}

// ============================================================================
// 7. RUNTIME CHECKS — empty fields, broken refs
// ============================================================================
console.log('\n🩺 [7/7] Checking for empty required fields...');
let emptyFields = 0;
const emptyTeam = [...dataText.matchAll(/name:\s*"([^"]+)"[^}]*?team:\s*"\s*"/g)];
const emptyHometown = [...dataText.matchAll(/name:\s*"([^"]+)"[^}]*?hometown:\s*"\s*"/g)];
emptyTeam.forEach(m => { log('warning', `${m[1]}: empty team field`); emptyFields++; });
emptyHometown.forEach(m => { log('warning', `${m[1]}: empty hometown field`); emptyFields++; });
console.log(`   ${emptyFields} empty critical fields`);

// ============================================================================
// FINAL REPORT
// ============================================================================
console.log('\n' + '='.repeat(72));
console.log('🏀 CEBL SCOUT DATA AUDIT REPORT');
console.log('='.repeat(72));
console.log(`\n  🚨 CRITICAL: ${issues.critical.length}`);
console.log(`  ⚠️  WARNING:  ${issues.warning.length}`);
console.log(`  ℹ️  INFO:     ${issues.info.length}`);
console.log('\n');

if (issues.critical.length > 0) {
  console.log('🚨 CRITICAL ISSUES (must fix before public launch):');
  issues.critical.forEach(m => console.log(`   - ${m}`));
  console.log('');
}
if (issues.warning.length > 0 && verbose) {
  console.log('⚠️  WARNINGS:');
  issues.warning.slice(0, 30).forEach(m => console.log(`   - ${m}`));
  if (issues.warning.length > 30) console.log(`   ...and ${issues.warning.length - 30} more (re-run with --verbose for full list)`);
  console.log('');
} else if (issues.warning.length > 0) {
  console.log(`⚠️  ${issues.warning.length} warnings (run with --verbose to see)`);
}

const passOk = issues.critical.length === 0;
if (passOk) {
  console.log('✅ No critical issues — safe for public launch on critical-blocker basis.');
} else {
  console.log('❌ Critical issues found — DO NOT launch publicly until resolved.');
  process.exit(1);
}

// Write structured report for CI/UI consumption
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    critical: issues.critical.length,
    warning: issues.warning.length,
    info: issues.info.length
  },
  issues
};
fs.writeFileSync(path.join(ROOT, 'tools', 'audit-report.json'), JSON.stringify(report, null, 2));
console.log(`\n📝 Full report saved to tools/audit-report.json`);
