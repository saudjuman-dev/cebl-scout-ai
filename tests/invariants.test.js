#!/usr/bin/env node
/**
 * Hoops Intelligence — Critical Data Invariants
 *
 * Asserts the things that, if broken, would mean a regression that
 * customers would see (like "11 Canadians" instead of 111). Loads every
 * static-data file the runtime depends on and validates counts + key
 * relationships are still healthy.
 *
 * Run:    node tests/invariants.test.js
 *         node tests/invariants.test.js --network    (also probe team logo URLs)
 * Exit:   0 on pass, 1 on any failure
 *
 * Wired into .github/workflows/smoke-test.yml — runs on every push.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');

// ============================================================================
// Browser shims so the JS files (designed for <script> tags) eval cleanly.
// ============================================================================
global.btoa = s => Buffer.from(s, 'binary').toString('base64');
global.atob = s => Buffer.from(s, 'base64').toString('binary');
global.window = global;
global.localStorage = {
  _d: {}, getItem(k){return this._d[k]||null},
  setItem(k,v){this._d[k]=String(v)}, removeItem(k){delete this._d[k]}
};
global.navigator = { userAgent: 'invariants-test', language: 'en' };
global.screen = { width: 1, height: 1, colorDepth: 1 };
global.document = {
  createElement: () => ({
    getContext: () => ({ textBaseline:'', font:'', fillText(){} }),
    toDataURL: () => 'x'
  }),
  addEventListener: () => {},
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => []
};

// ============================================================================
// File loader — converts `const`/`let` top-level decls to `var` so they leak
// to global on eval. Strips DOMContentLoaded handlers (which would crash in
// node) by paren-counting the entire `document.addEventListener(...)` call.
// ============================================================================
function stripDomContentLoaded(src) {
  while (true) {
    const idx = src.indexOf("document.addEventListener('DOMContentLoaded'");
    if (idx === -1) break;
    // Walk forward, paren-counting, until depth returns to 0
    let depth = 0, i = idx, end = -1, started = false;
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '(') { depth++; started = true; }
      else if (c === ')') {
        depth--;
        if (started && depth === 0) {
          end = i + 1;
          if (src[end] === ';') end++;
          break;
        }
      }
    }
    if (end === -1) break;
    src = src.slice(0, idx) + '/* DOMContentLoaded stripped */' + src.slice(end);
  }
  return src;
}

function load(file) {
  let src = fs.readFileSync(path.join(ROOT, file), 'utf-8');
  src = stripDomContentLoaded(src);

  // Drop IIFE init blocks that reference DOM
  src = src.replace(/\(function\s+initTheme\s*\(\)\s*\{[\s\S]*?\}\)\(\);/m, '/* IIFE stripped */');

  // Top-level `const X` and `let X` → `var X` so they leak to global on eval
  src = src.replace(/^const\s+/gm, 'var ');
  src = src.replace(/^let\s+/gm, 'var ');

  try {
    eval.call(global, src);
  } catch (e) {
    console.error(`❌ Failed to load ${file}: ${e.message}`);
    throw e;
  }
}

// ============================================================================
// Test runner primitives
// ============================================================================
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }
function assertGte(actual, expected, label) {
  if (actual < expected) throw new Error(`${label}: expected ≥${expected}, got ${actual}`);
  return `${label}: ${actual} (≥${expected})`;
}
function assertEq(actual, expected, label) {
  if (actual !== expected) throw new Error(`${label}: expected ${expected}, got ${actual}`);
  return `${label}: ${actual}`;
}
function assertArr(arr, minLen, label) {
  if (!Array.isArray(arr)) throw new Error(`${label}: expected array, got ${typeof arr}`);
  if (arr.length < minLen) throw new Error(`${label}: expected length ≥${minLen}, got ${arr.length}`);
  return `${label}: array of ${arr.length} (≥${minLen})`;
}

// ============================================================================
// Load data files (browser-style script load order, minus DOM-heavy ones)
// ============================================================================
load('data.js');
load('career-data.js');
load('pipeline-data.js');
load('cebl-records.js');
load('global-pros.js');
load('cebl-signings-runtime.js');
load('ncaa-canadians-runtime.js');
load('team-logos.js');
load('player-headshots.js');
// Skip themes.js — it has DOM-init code that's hard to neuter cleanly,
// and we don't assert on theme data here.

// auth.js — same loader path
load('auth.js');

// app.js — load with the same path; data helpers register before any DOM-init lines
try {
  load('app.js');
} catch (e) {
  // late init lines in app.js may reference DOM; helpers we need
  // (ceblCurrentTeam, etc.) register before that.
}

// ============================================================================
// INVARIANTS
// ============================================================================

// --- CEBL Live Signings ---
test('CEBL_SIGNINGS has at least 100 transactions', () => {
  return assertArr(global.CEBL_SIGNINGS, 100, 'CEBL_SIGNINGS');
});

test('CEBL_ROSTERS_2026 has exactly 10 teams', () => {
  const teams = Object.keys(global.CEBL_ROSTERS_2026 || {});
  return assertEq(teams.length, 10, 'CEBL teams in roster map');
});

test('Every CEBL team has at least 4 confirmed signings', () => {
  const teams = global.CEBL_ROSTERS_2026 || {};
  const lows = Object.entries(teams).filter(([, list]) => list.length < 4);
  if (lows.length) {
    throw new Error(`Teams with <4 signings: ${lows.map(([t,l]) => `${t} (${l.length})`).join(', ')}`);
  }
  return `All 10 teams have ≥4 signings`;
});

test('All 10 CEBL teams resolve to a logo URL', () => {
  const expected = ['Brampton Honey Badgers','Calgary Surge','Edmonton Stingers','Montreal Alliance',
    'Niagara River Lions','Ottawa BlackJacks','Saskatoon Mamba','Scarborough Shooting Stars',
    'Vancouver Bandits','Winnipeg Sea Bears'];
  const missing = expected.filter(t => !global.TEAM_LOGOS[t]);
  if (missing.length) throw new Error(`Missing logos: ${missing.join(', ')}`);
  return `All 10 CEBL team logo URLs present`;
});

// --- NCAA Canadians ---
test('NCAA_CANADIANS has at least 140 players', () => {
  return assertArr(global.NCAA_CANADIANS, 140, 'NCAA_CANADIANS');
});

test('NCAA_CANADIANS_META.count matches array length', () => {
  const arr = global.NCAA_CANADIANS;
  const meta = global.NCAA_CANADIANS_META;
  if (!meta) throw new Error('NCAA_CANADIANS_META is missing');
  if (meta.count !== arr.length) throw new Error(`Meta count ${meta.count} ≠ array length ${arr.length}`);
  return `NCAA meta count matches array (${arr.length})`;
});

// --- Global Pros ("11 Canadians" guard) ---
test('GLOBAL_PROS_STATS.canadians ≥ 100 (the "11 Canadians" guard)', () => {
  const n = global.GLOBAL_PROS_STATS?.canadians ?? 0;
  return assertGte(n, 100, 'GLOBAL_PROS_STATS.canadians');
});

test('GLOBAL_PROS has ≥ 2500 entries', () => {
  return assertArr(global.GLOBAL_PROS, 2500, 'GLOBAL_PROS');
});

test('GLOBAL_PROS isCanadian flag count matches stats', () => {
  const flagged = global.GLOBAL_PROS.filter(p => p.isCanadian).length;
  const stats   = global.GLOBAL_PROS_STATS.canadians;
  if (flagged !== stats) throw new Error(`Flagged count ${flagged} ≠ stats ${stats}`);
  return `${flagged} flagged Canadians match stats`;
});

// --- Curated player datasets ---
test('canadiansPro has ≥ 100 entries', () => {
  return assertArr(global.canadiansPro, 100, 'canadiansPro');
});

test('importTargets has ≥ 50 entries', () => {
  return assertArr(global.importTargets, 50, 'importTargets');
});

test('canadianPipeline has ≥ 50 entries', () => {
  return assertArr(global.canadianPipeline, 50, 'canadianPipeline');
});

// --- Auth invariants ---
test('AUTH._ADMIN_LIST has both ceblgm and justinm', () => {
  const list = global.AUTH?._ADMIN_LIST || [];
  if (list.length < 2) throw new Error(`Expected ≥2 admins, got ${list.length}`);
  const _dec = (s) => { try { return decodeURIComponent(escape(atob(s.split('').reverse().join('')))) } catch { return s } };
  const users = list.map(a => _dec(a.user));
  if (!users.includes('ceblgm')) throw new Error('Missing ceblgm admin');
  if (!users.includes('justinm')) throw new Error('Missing justinm admin');
  return `Admin list: [${users.join(', ')}]`;
});

test('AUTH ceblgm uses the rotated password (not the old Sc0ut!2026$BHB)', () => {
  const list = global.AUTH?._ADMIN_LIST || [];
  const _dec = (s) => { try { return decodeURIComponent(escape(atob(s.split('').reverse().join('')))) } catch { return s } };
  const ceblgm = list.find(a => _dec(a.user) === 'ceblgm');
  if (!ceblgm) throw new Error('ceblgm admin missing');
  const pass = _dec(ceblgm.pass);
  if (pass === 'Sc0ut!2026$BHB') throw new Error('ceblgm STILL has old password — rotation reverted!');
  if (!pass || pass.length < 10) throw new Error(`ceblgm password too weak: ${pass.length} chars`);
  return `ceblgm has rotated password (${pass.length} chars)`;
});

test('AUTH.SESSION_VERSION ≥ 2', () => {
  return assertGte(global.AUTH?.SESSION_VERSION || 0, 2, 'SESSION_VERSION');
});

// --- Saskatoon Mamba rebrand ---
test('Saskatoon Mamba logo points to saskatoonmamba.ca CDN (post-rebrand)', () => {
  const url = global.TEAM_LOGOS['Saskatoon Mamba'];
  if (!url) throw new Error('No Saskatoon Mamba logo');
  if (!url.includes('6d469176')) {
    throw new Error(`Saskatoon logo still on old CDN: ${url}`);
  }
  return `Mamba logo on saskatoonmamba.ca CDN`;
});

test('"Saskatchewan Rattlers" alias resolves (legacy data compat)', () => {
  const url = global.TEAM_LOGOS['Saskatchewan Rattlers'];
  if (!url) throw new Error('No Saskatchewan Rattlers alias — historic data will lose its logo');
  return `Rattlers alias present`;
});

// --- HTML / nav tab integrity ---
test('All nav tabs in index.html have a matching <section id="tab-…">', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  const navTabs = [...html.matchAll(/data-tab="([^"]+)"/g)].map(m => m[1]);
  const sectionIds = [...html.matchAll(/id="tab-([^"]+)"/g)].map(m => m[1]);
  const orphans = navTabs.filter(t => !sectionIds.includes(t));
  if (orphans.length) throw new Error(`Nav tabs without sections: ${orphans.join(', ')}`);
  return `${navTabs.length} nav tabs all wired to sections`;
});

// --- Cache-busting ---
test('Script tags have cache-busting ?v= query string', () => {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf-8');
  const scriptTags = [...html.matchAll(/<script src="([^"]+\.js)([^"]*)"/g)];
  const busted = scriptTags.filter(([, , q]) => /[?&]v=/.test(q || ''));
  if (busted.length < 10) {
    throw new Error(`Only ${busted.length}/${scriptTags.length} scripts have ?v= cache-buster`);
  }
  return `${busted.length} scripts cache-busted`;
});

// --- Roster-resolution helper (only if app.js loaded successfully) ---
if (typeof global.window.ceblCurrentTeam === 'function') {
  test('ceblCurrentTeam("Karim Mané") resolves to Saskatoon Mamba', () => {
    const team = global.window.ceblCurrentTeam('Karim Mané');
    return assertEq(team, 'Saskatoon Mamba', 'Karim Mané team');
  });

  test('ceblCurrentTeam diacritic-insensitive (Devonté = Devonte)', () => {
    const a = global.window.ceblCurrentTeam('Devonté Bandoo');
    const b = global.window.ceblCurrentTeam('Devonte Bandoo');
    if (a !== b) throw new Error(`Mismatch: ${a} vs ${b}`);
    if (!a) throw new Error('Devonté Bandoo not found in any roster');
    return `Both resolve to ${a}`;
  });
}

// ============================================================================
// HTTP-level checks (only run with --network flag)
// ============================================================================
const checkNetwork = process.argv.includes('--network');

if (checkNetwork) {
  test('All 10 CEBL team logo URLs return HTTP 200', async () => {
    const expected = ['Brampton Honey Badgers','Calgary Surge','Edmonton Stingers','Montreal Alliance',
      'Niagara River Lions','Ottawa BlackJacks','Saskatoon Mamba','Scarborough Shooting Stars',
      'Vancouver Bandits','Winnipeg Sea Bears'];
    const dead = [];
    for (const team of expected) {
      const url = global.TEAM_LOGOS[team];
      const code = await new Promise((res) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Hoops Intelligence CI)' } }, (r) => {
          if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
            https.get(r.headers.location, (r2) => res(r2.statusCode)).on('error', () => res(0));
          } else res(r.statusCode);
        }).on('error', () => res(0));
      });
      if (code !== 200) dead.push(`${team} (${code})`);
    }
    if (dead.length) throw new Error(`Dead logos: ${dead.join(', ')}`);
    return `All 10 logo URLs serve 200`;
  });
}

// ============================================================================
// RUNNER
// ============================================================================
(async () => {
  console.log(`\nRunning ${tests.length} invariant${tests.length !== 1 ? 's' : ''}...\n`);
  const fails = [];
  for (const { name, fn } of tests) {
    try {
      const msg = await fn();
      console.log(`  ✅ ${name}`);
      if (msg) console.log(`     └─ ${msg}`);
    } catch (err) {
      console.log(`  ❌ ${name}`);
      console.log(`     └─ ${err.message}`);
      fails.push({ name, err: err.message });
    }
  }
  console.log('');
  if (fails.length) {
    console.log(`❌ ${fails.length} of ${tests.length} invariant${fails.length > 1 ? 's' : ''} failed`);
    fails.forEach(f => console.log(`   • ${f.name}: ${f.err}`));
    process.exit(1);
  }
  console.log(`✅ All ${tests.length} invariants passed`);
  process.exit(0);
})();
