#!/usr/bin/env node
/**
 * Extract Global Pros from cache → produces a clean JS data file at /global-pros.js
 *
 * The cache contains 100+ FIBA-tier pros (mostly Canadians playing
 * overseas + import-tier players). We map league codes to readable
 * names, normalize country, and expose for the runtime filterable view.
 *
 * Run:  node tools/extract-global-pros.js
 */
const fs = require('fs');
const path = require('path');

const CACHE_DIR = path.join(__dirname, '..', 'data', 'cache');
const OUTPUT = path.join(__dirname, '..', 'global-pros.js');

// Map cache league codes → human-readable + tier classification
const LEAGUE_MAP = {
  'CEBL':       { name: 'CEBL',                          country: 'Canada',     tier: 'CEBL',       fibaEligible: true },
  'G League':   { name: 'NBA G League',                  country: 'USA',        tier: 'Development',fibaEligible: true },
  'NBA':        { name: 'NBA',                           country: 'USA',        tier: 'NBA',        fibaEligible: false },
  'USPO':       { name: 'USA Other / Pro',               country: 'USA',        tier: 'Development',fibaEligible: true },
  'NCAA1':      { name: 'NCAA Division 1',               country: 'USA',        tier: 'College',    fibaEligible: true },
  'NCAA2':      { name: 'NCAA Division 2',               country: 'USA',        tier: 'College',    fibaEligible: true },
  'NCAA3':      { name: 'NCAA Division 3',               country: 'USA',        tier: 'College',    fibaEligible: true },
  'NAIA':       { name: 'NAIA',                          country: 'USA',        tier: 'College',    fibaEligible: true },
  'BCL-1':      { name: 'Basketball Champions League',   country: 'Europe',     tier: 'Elite',      fibaEligible: true },
  'EUROL-1':    { name: 'EuroLeague',                    country: 'Europe',     tier: 'Elite',      fibaEligible: false },
  'BSL':        { name: 'Turkey BSL',                    country: 'Turkey',     tier: 'Elite',      fibaEligible: true },
  'GER-1':      { name: 'Germany BBL',                   country: 'Germany',    tier: 'Top',        fibaEligible: true },
  'GER-2':      { name: 'Germany ProA / 2.BBL',          country: 'Germany',    tier: 'Mid',        fibaEligible: true },
  'ESP-1':      { name: 'Spain Liga Endesa (ACB)',       country: 'Spain',      tier: 'Elite',      fibaEligible: true },
  'ESP-2':      { name: 'Spain LEB Oro',                 country: 'Spain',      tier: 'Top',        fibaEligible: true },
  'ESP-3':      { name: 'Spain LEB Plata',               country: 'Spain',      tier: 'Mid',        fibaEligible: true },
  'FRA-1':      { name: 'France LNB Pro A',              country: 'France',     tier: 'Top',        fibaEligible: true },
  'FRA-2':      { name: 'France LNB Pro B',              country: 'France',     tier: 'Mid',        fibaEligible: true },
  'ITA-1':      { name: 'Italy Lega Basket Serie A',     country: 'Italy',      tier: 'Top',        fibaEligible: true },
  'ITA-2':      { name: 'Italy Serie A2',                country: 'Italy',      tier: 'Mid',        fibaEligible: true },
  'GRE-1':      { name: 'Greece HEBA A1',                country: 'Greece',     tier: 'Top',        fibaEligible: true },
  'GRE-2':      { name: 'Greece A2',                     country: 'Greece',     tier: 'Mid',        fibaEligible: true },
  'POR-1':      { name: 'Portugal LPB',                  country: 'Portugal',   tier: 'Mid',        fibaEligible: true },
  'BNXT-1':     { name: 'Belgium-Netherlands BNXT',      country: 'Benelux',    tier: 'Mid',        fibaEligible: true },
  'POL-1':      { name: 'Poland EBL',                    country: 'Poland',     tier: 'Top',        fibaEligible: true },
  'POL-2':      { name: 'Poland 1 Liga',                 country: 'Poland',     tier: 'Mid',        fibaEligible: true },
  'CZE-1':      { name: 'Czech NBL',                     country: 'Czech Rep.', tier: 'Mid',        fibaEligible: true },
  'AUT-1':      { name: 'Austria Superliga',             country: 'Austria',    tier: 'Mid',        fibaEligible: true },
  'CRO-1':      { name: 'Croatia Premijer',              country: 'Croatia',    tier: 'Mid',        fibaEligible: true },
  'SLO-1':      { name: 'Slovenia Liga Nova KBM',        country: 'Slovenia',   tier: 'Mid',        fibaEligible: true },
  'BUL-1':      { name: 'Bulgaria NBL',                  country: 'Bulgaria',   tier: 'Mid',        fibaEligible: true },
  'ROM-1':      { name: 'Romania Liga Nationala',        country: 'Romania',    tier: 'Mid',        fibaEligible: true },
  'LTU-1':      { name: 'Lithuania LKL',                 country: 'Lithuania',  tier: 'Top',        fibaEligible: true },
  'FIN-1':      { name: 'Finland Korisliiga',            country: 'Finland',    tier: 'Mid',        fibaEligible: true },
  'GEO-2':      { name: 'Georgia A League',              country: 'Georgia',    tier: 'Mid',        fibaEligible: true },
  'AZE-1':      { name: 'Azerbaijan Superliqa',          country: 'Azerbaijan', tier: 'Mid',        fibaEligible: true },
  'EAEU-1':     { name: 'Eurasian League',               country: 'Eurasia',    tier: 'Mid',        fibaEligible: true },
  'VTB-1':      { name: 'VTB United League',             country: 'Russia',     tier: 'Top',        fibaEligible: true },
  'ISR-1':      { name: 'Israel Premier League',         country: 'Israel',     tier: 'Top',        fibaEligible: true },
  'ISR-2':      { name: 'Israel Liga Leumit',            country: 'Israel',     tier: 'Mid',        fibaEligible: true },
  'QAT-1':      { name: 'Qatar Basketball League',       country: 'Qatar',      tier: 'Mid',        fibaEligible: true },
  'AUS-1':      { name: 'Australia NBL',                 country: 'Australia',  tier: 'Top',        fibaEligible: true },
  'AUS-2':      { name: 'Australia NBL1',                country: 'Australia',  tier: 'Mid',        fibaEligible: true },
  'JPN-1':      { name: 'Japan B.League',                country: 'Japan',      tier: 'Top',        fibaEligible: true },
  'KOR-1':      { name: 'South Korea KBL',               country: 'South Korea',tier: 'Top',        fibaEligible: true },
  'PHI-1':      { name: 'Philippines PBA',               country: 'Philippines',tier: 'Top',        fibaEligible: true },
  'CHN-1':      { name: 'China NBL',                     country: 'China',      tier: 'Mid',        fibaEligible: true },
  'IDN-1':      { name: 'Indonesia IBL',                 country: 'Indonesia',  tier: 'Mid',        fibaEligible: true },
  'MEX-1':      { name: 'Mexico LNBP',                   country: 'Mexico',     tier: 'Mid',        fibaEligible: true },
  'VEN-1':      { name: 'Venezuela Superliga',           country: 'Venezuela',  tier: 'Mid',        fibaEligible: true },
  'RWA-1':      { name: 'Rwanda BAL',                    country: 'Rwanda',     tier: 'Mid',        fibaEligible: true },
  'EYBL U16-1': { name: 'EYBL U16 (Junior)',             country: 'Europe',     tier: 'Junior',     fibaEligible: true },
};

const cacheFiles = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
const players = [];
let skipped = 0;

for (const file of cacheFiles) {
  let cache;
  try { cache = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, file), 'utf-8')); }
  catch { skipped++; continue; }

  if (!cache.fullName || !cache.currentTeam) { skipped++; continue; }

  const leagueCode = cache.currentLeague || '';
  const leagueMeta = LEAGUE_MAP[leagueCode] || { name: leagueCode || 'Unknown', country: 'Unknown', tier: 'Unknown', fibaEligible: true };

  // Skip NBA players — out of scope per user requirement
  if (leagueMeta.tier === 'NBA') { skipped++; continue; }

  players.push({
    slug: file.replace(/\.json$/, ''),
    name: cache.fullName,
    pos: cache.position || '',
    height: cache.height || '',
    heightCm: cache.heightCm || '',
    weight: cache.weight || '',
    weightKg: cache.weightKg || '',
    birthdate: cache.birthdate || '',
    birthCity: cache.birthCity || '',
    nationality: cache.nationality || '',
    college: cache.college || '',
    highSchool: cache.highSchool || '',
    currentTeam: cache.currentTeam,
    leagueCode,
    league: leagueMeta.name,
    country: leagueMeta.country,
    tier: leagueMeta.tier,
    fibaEligible: leagueMeta.fibaEligible,
    careerHistory: (cache.careerHistory || []).slice(-10),  // last 10 stops
    cachedAt: cache.cachedAt || null
  });
}

players.sort((a, b) => a.name.localeCompare(b.name));

// Aggregate stats for the runtime
const byTier = {};
const byCountry = {};
const byLeague = {};
players.forEach(p => {
  byTier[p.tier] = (byTier[p.tier] || 0) + 1;
  byCountry[p.country] = (byCountry[p.country] || 0) + 1;
  byLeague[p.league] = (byLeague[p.league] || 0) + 1;
});

// Render JS
const out = `// ===== Global Pros Database (FIBA-eligible / non-NBA pros) =====
// Auto-generated by tools/extract-global-pros.js from data/cache/*.json
// Last extracted: ${new Date().toISOString()}
// ${players.length} players across ${Object.keys(byLeague).length} leagues, ${Object.keys(byCountry).length} countries.
//
// Scope: every non-NBA professional we have cache data for. Strong FIBA
// emphasis — these are realistic CEBL import / scouting candidates.
// Re-run extract script after refreshing cache via tools/cache-updater.js.

const GLOBAL_PROS = ${JSON.stringify(players, null, 2)};

const GLOBAL_PROS_STATS = {
  total: ${players.length},
  byTier: ${JSON.stringify(byTier, null, 2)},
  byCountry: ${JSON.stringify(byCountry, null, 2)},
  byLeague: ${JSON.stringify(byLeague, null, 2)}
};
`;

fs.writeFileSync(OUTPUT, out);
console.log(`✅ Wrote ${players.length} players to global-pros.js`);
console.log(`   Skipped ${skipped} (NBA / invalid)`);
console.log(`   Tiers:    ${Object.entries(byTier).map(([k,v]) => k+':'+v).join(', ')}`);
console.log(`   Top leagues: ${Object.entries(byLeague).sort((a,b) => b[1] - a[1]).slice(0, 5).map(([k,v]) => k+'('+v+')').join(', ')}`);
