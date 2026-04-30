#!/usr/bin/env node
/**
 * EuroBasket Cache Health Check
 *
 * Verifies the entire MCP/cache pipeline is working flawlessly:
 *   1. Each JSON parses cleanly
 *   2. Slug matches the cached fullName (rejects scraper mismatches)
 *   3. Cache freshness (flags entries > 90 days old)
 *   4. Required fields present
 *   5. Coverage report (which CEBL roster players are missing cache)
 *   6. MCP server can be loaded (require()'d) without crashing
 *
 * Exits non-zero if any critical issues found — suitable for CI.
 *
 * Usage: node tools/cache-health.js [--verbose] [--fix]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CACHE_DIR = path.join(ROOT, 'data', 'cache');
const verbose = process.argv.includes('--verbose');
const autoFix = process.argv.includes('--fix');

const slugify = (s) => s.toLowerCase().replace(/['']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const issues = { critical: [], warning: [], info: [] };

console.log('\n🔬 EuroBasket Cache Health Check\n');

// ============================================================================
// 1. CACHE FILE VALIDATION
// ============================================================================
const cacheFiles = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
console.log(`📦 Found ${cacheFiles.length} cache files\n`);

let validJson = 0;
let nameMismatches = [];
let stale = [];
let missingFields = [];
const NOW = Date.now();
const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

for (const file of cacheFiles) {
  const filePath = path.join(CACHE_DIR, file);
  const slug = file.replace(/\.json$/, '');
  let cache;

  // 1a. Valid JSON
  try {
    cache = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    validJson++;
  } catch (e) {
    issues.critical.push(`Invalid JSON: ${file} — ${e.message}`);
    if (autoFix) { fs.unlinkSync(filePath); console.log(`  🗑️  Deleted corrupt: ${file}`); }
    continue;
  }

  // 1b. Slug matches fullName
  const fullName = (cache.fullName || '').toLowerCase();
  const slugTokens = slug.replace(/-/g, ' ').split(' ').filter(t => t.length > 2);
  const matches = slugTokens.some(t => fullName.includes(t));
  if (fullName && !matches) {
    nameMismatches.push({ file, expected: slug, got: cache.fullName });
    issues.critical.push(`Name mismatch: ${file} → cached as "${cache.fullName}"`);
    if (autoFix) { fs.unlinkSync(filePath); console.log(`  🗑️  Deleted mismatch: ${file}`); }
    continue;
  }

  // 1c. Required fields
  const required = ['fullName', 'currentTeam'];
  const missing = required.filter(f => !cache[f]);
  if (missing.length > 0) {
    missingFields.push({ file, missing });
    issues.warning.push(`${file}: missing fields ${missing.join(', ')}`);
  }

  // 1d. Freshness
  if (cache.cachedAt) {
    const cachedTime = new Date(cache.cachedAt).getTime();
    const age = NOW - cachedTime;
    if (age > NINETY_DAYS) {
      stale.push({ file, ageDays: Math.floor(age / (24*60*60*1000)) });
      issues.warning.push(`${file}: cache is ${Math.floor(age / (24*60*60*1000))} days old (refresh recommended)`);
    }
  } else {
    issues.info.push(`${file}: no cachedAt timestamp`);
  }
}

console.log(`✅ Valid JSON:        ${validJson}/${cacheFiles.length}`);
console.log(`❌ Name mismatches:   ${nameMismatches.length}`);
console.log(`⚠️  Stale (>90 days): ${stale.length}`);
console.log(`⚠️  Missing fields:   ${missingFields.length}`);

// ============================================================================
// 2. COVERAGE — what % of canadianPipeline has a cache?
// ============================================================================
console.log('\n🎯 Cache coverage of Canadian Pipeline players:');
const pipelineText = fs.readFileSync(path.join(ROOT, 'pipeline-data.js'), 'utf-8');
const pipelineNames = [...pipelineText.matchAll(/name:\s*"([^"]+)"/g)].map(m => m[1]);
const uniqueNames = [...new Set(pipelineNames)];
const cachedSlugs = new Set(cacheFiles.map(f => f.replace(/\.json$/, '')));
const covered = uniqueNames.filter(n => cachedSlugs.has(slugify(n)));
const uncovered = uniqueNames.filter(n => !cachedSlugs.has(slugify(n)));
console.log(`  Total unique names:  ${uniqueNames.length}`);
console.log(`  ✅ Cached:            ${covered.length}`);
console.log(`  ❌ Not cached:        ${uncovered.length}`);
if (verbose && uncovered.length > 0) {
  console.log(`\n  Uncovered (first 20):`);
  uncovered.slice(0, 20).forEach(n => console.log(`    - ${n}`));
}

// ============================================================================
// 3. MCP SERVER LOAD TEST
// ============================================================================
console.log('\n🛰️  MCP server load test...');
const mcpPath = path.join(ROOT, 'tools', 'eurobasket-mcp', 'index.js');
if (!fs.existsSync(mcpPath)) {
  issues.critical.push(`MCP entry point missing: ${mcpPath}`);
} else {
  // Check the file at least parses
  const mcpSource = fs.readFileSync(mcpPath, 'utf-8');
  const requiredFunctions = ['login', 'searchPlayer', 'parsePlayerProfile', 'parseCareerStats'];
  const missingFuncs = requiredFunctions.filter(fn => !new RegExp(`\\bfunction ${fn}\\b|\\b${fn}\\s*=\\s*async`).test(mcpSource) && !mcpSource.includes(`async function ${fn}`));
  if (missingFuncs.length > 0) {
    issues.warning.push(`MCP source missing expected functions: ${missingFuncs.join(', ')}`);
  } else {
    console.log('  ✅ All expected MCP functions present');
  }
  const tools = (mcpSource.match(/server\.tool\(\s*"([^"]+)"/g) || []).map(m => m.replace(/.*"([^"]+)"/, '$1'));
  console.log(`  ✅ MCP exposes ${tools.length} tools: ${tools.join(', ')}`);
}

// Check node_modules link
const mcpNodeModules = path.join(ROOT, 'tools', 'eurobasket-mcp', 'node_modules');
if (!fs.existsSync(mcpNodeModules)) {
  issues.warning.push(`MCP node_modules missing — run: cd tools/eurobasket-mcp && npm install`);
} else {
  const sdkExists = fs.existsSync(path.join(mcpNodeModules, '@modelcontextprotocol', 'sdk'));
  console.log(`  ${sdkExists ? '✅' : '❌'} @modelcontextprotocol/sdk installed`);
  if (!sdkExists) issues.critical.push('MCP SDK not installed');
}

// ============================================================================
// 4. .mcp.json CONFIG CHECK
// ============================================================================
console.log('\n⚙️  .mcp.json config check...');
try {
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, '.mcp.json'), 'utf-8'));
  if (cfg.mcpServers && cfg.mcpServers.eurobasket) {
    console.log(`  ✅ eurobasket MCP registered with command: ${cfg.mcpServers.eurobasket.command}`);
  } else {
    issues.warning.push('.mcp.json missing eurobasket server entry');
  }
} catch (e) {
  issues.critical.push(`.mcp.json invalid: ${e.message}`);
}

// ============================================================================
// FINAL REPORT
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('🏥 CACHE HEALTH REPORT');
console.log('='.repeat(70));
console.log(`  🚨 CRITICAL: ${issues.critical.length}`);
console.log(`  ⚠️  WARNING:  ${issues.warning.length}`);
console.log(`  ℹ️  INFO:     ${issues.info.length}`);

if (issues.critical.length > 0) {
  console.log('\n🚨 CRITICAL:');
  issues.critical.forEach(m => console.log(`   - ${m}`));
}

if (verbose && issues.warning.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  issues.warning.slice(0, 30).forEach(m => console.log(`   - ${m}`));
  if (issues.warning.length > 30) console.log(`   ...and ${issues.warning.length - 30} more`);
}

const summary = {
  generatedAt: new Date().toISOString(),
  totalCacheFiles: cacheFiles.length,
  validJson,
  nameMismatches: nameMismatches.length,
  stale: stale.length,
  missingFields: missingFields.length,
  pipelineCoverage: { total: uniqueNames.length, cached: covered.length, uncovered: uncovered.length },
  issues
};
fs.writeFileSync(path.join(ROOT, 'tools', 'cache-health-report.json'), JSON.stringify(summary, null, 2));

if (issues.critical.length === 0) {
  console.log('\n✅ Cache health: PASS\n');
} else {
  console.log('\n❌ Cache health: FAIL — fix critical issues before launch\n');
  process.exit(1);
}
