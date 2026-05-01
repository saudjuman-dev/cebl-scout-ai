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
  // EuroBasket alternate codes (career history uses these instead of league IDs):
  'TUR-1':      { name: 'Turkey BSL',                    country: 'Turkey',     tier: 'Elite',      fibaEligible: true },
  'TUR-2':      { name: 'Turkey TBL (2nd div)',          country: 'Turkey',     tier: 'Mid',        fibaEligible: true },
  'Eurocup-1':  { name: 'EuroCup',                       country: 'Europe',     tier: 'Elite',      fibaEligible: true },
  'FEL-1':      { name: 'Belgium Pro Basketball League', country: 'Belgium',    tier: 'Mid',        fibaEligible: true },
  'BEL-1':      { name: 'Belgium Pro Basketball League', country: 'Belgium',    tier: 'Mid',        fibaEligible: true },
  'NED-1':      { name: 'Netherlands DBL',               country: 'Netherlands',tier: 'Mid',        fibaEligible: true },
  'LTU-2':      { name: 'Lithuania NKL',                 country: 'Lithuania',  tier: 'Mid',        fibaEligible: true },
  'LTU-6':      { name: 'Lithuania RKL (Reg.)',          country: 'Lithuania',  tier: 'Lower',      fibaEligible: true },
  'GRE-5':      { name: 'Greece Lower Div.',             country: 'Greece',     tier: 'Lower',      fibaEligible: true },
  'POR-2':      { name: 'Portugal Proliga',              country: 'Portugal',   tier: 'Mid',        fibaEligible: true },
  'ESP-4':      { name: 'Spain Tercera FEB',             country: 'Spain',      tier: 'Lower',      fibaEligible: true },
  'ITA-3':      { name: 'Italy Serie B',                 country: 'Italy',      tier: 'Mid',        fibaEligible: true },
  'GER-3':      { name: 'Germany ProB',                  country: 'Germany',    tier: 'Mid',        fibaEligible: true },
  'FRA-3':      { name: 'France NM1',                    country: 'France',     tier: 'Mid',        fibaEligible: true },
  'NCAA-1':     { name: 'NCAA Division 1',               country: 'USA',        tier: 'College',    fibaEligible: true },
  'ANGT-1':     { name: 'Adidas Next Generation Tour',   country: 'Europe',     tier: 'Junior',     fibaEligible: true },
  'EYBL-1':     { name: 'EYBL (Junior)',                 country: 'Europe',     tier: 'Junior',     fibaEligible: true },
  'CL-1':       { name: 'Champions League',              country: 'Europe',     tier: 'Elite',      fibaEligible: true },
  'BCL-2':      { name: 'BCL Qualifiers',                country: 'Europe',     tier: 'Elite',      fibaEligible: true },
  'ABA-1':      { name: 'ABA League',                    country: 'Adriatic',   tier: 'Top',        fibaEligible: true },
  'ABA-2':      { name: 'ABA Liga 2',                    country: 'Adriatic',   tier: 'Mid',        fibaEligible: true },
  'SRB-1':      { name: 'Serbia KLS',                    country: 'Serbia',     tier: 'Top',        fibaEligible: true },
  'HUN-1':      { name: 'Hungary NB I/A',                country: 'Hungary',    tier: 'Mid',        fibaEligible: true },
  'SUI-1':      { name: 'Switzerland SBL',               country: 'Switzerland',tier: 'Mid',        fibaEligible: true },
  'UKR-1':      { name: 'Ukraine SuperLeague',           country: 'Ukraine',    tier: 'Mid',        fibaEligible: true },
  'BLR-1':      { name: 'Belarus Premier',               country: 'Belarus',    tier: 'Mid',        fibaEligible: true },
  'EST-1':      { name: 'Estonia LBL',                   country: 'Estonia',    tier: 'Mid',        fibaEligible: true },
  'LAT-1':      { name: 'Latvia LBL',                    country: 'Latvia',     tier: 'Mid',        fibaEligible: true },
  'CYP-1':      { name: 'Cyprus Basket League',          country: 'Cyprus',     tier: 'Mid',        fibaEligible: true },
  'TBL':        { name: 'TBL (League)',                  country: 'Unknown',    tier: 'Mid',        fibaEligible: true },
  'GBR-1':      { name: 'UK Super League',               country: 'UK',         tier: 'Mid',        fibaEligible: true },
  'IRL-1':      { name: 'Ireland National League',       country: 'Ireland',    tier: 'Mid',        fibaEligible: true },
  'BRA-1':      { name: 'Brazil NBB',                    country: 'Brazil',     tier: 'Top',        fibaEligible: true },
  'ARG-1':      { name: 'Argentina LNB',                 country: 'Argentina',  tier: 'Top',        fibaEligible: true },
  'PUR-1':      { name: 'Puerto Rico BSN',               country: 'Puerto Rico',tier: 'Top',        fibaEligible: true },
  'URU-1':      { name: 'Uruguay LUB',                   country: 'Uruguay',    tier: 'Mid',        fibaEligible: true },
  'DOM-1':      { name: 'Dominican LNB',                 country: 'Dominican',  tier: 'Mid',        fibaEligible: true },
  'NZL-1':      { name: 'NZ NBL',                        country: 'New Zealand',tier: 'Mid',        fibaEligible: true },
  'TPE-1':      { name: 'Taiwan T1 / P. League+',        country: 'Taiwan',     tier: 'Mid',        fibaEligible: true },
  'IRN-1':      { name: 'Iran Super League',             country: 'Iran',       tier: 'Mid',        fibaEligible: true },
  'LBN-1':      { name: 'Lebanon LBL',                   country: 'Lebanon',    tier: 'Mid',        fibaEligible: true },
  'EGY-1':      { name: 'Egypt Super League',            country: 'Egypt',      tier: 'Mid',        fibaEligible: true },
  'BAL-1':      { name: 'Basketball Africa League',      country: 'Africa',     tier: 'Top',        fibaEligible: true },
  'ANG-1':      { name: 'Angola Basketball League',      country: 'Angola',     tier: 'Mid',        fibaEligible: true },
  'TUN-1':      { name: 'Tunisia Pro League',            country: 'Tunisia',    tier: 'Mid',        fibaEligible: true },
  'JOR-1':      { name: 'Jordan Premier League',         country: 'Jordan',     tier: 'Mid',        fibaEligible: true },
  'KSA-1':      { name: 'Saudi Premier',                 country: 'Saudi Arabia',tier: 'Mid',       fibaEligible: true },
  'UAE-1':      { name: 'UAE National League',           country: 'UAE',        tier: 'Mid',        fibaEligible: true },
  'IND-1':      { name: 'India INBL',                    country: 'India',      tier: 'Mid',        fibaEligible: true },
};

const cacheFiles = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
const players = [];
let skipped = 0;

for (const file of cacheFiles) {
  let cache;
  try { cache = JSON.parse(fs.readFileSync(path.join(CACHE_DIR, file), 'utf-8')); }
  catch { skipped++; continue; }

  if (!cache.fullName || !cache.currentTeam) { skipped++; continue; }

  // Determine league: prefer currentLeague; otherwise pull from the most recent
  // careerHistory entry that matches the player's currentTeam. (League-scraper
  // cache files don't set currentLeague, but careerHistory is reliable.)
  let leagueCode = cache.currentLeague || '';
  if (!leagueCode && Array.isArray(cache.careerHistory) && cache.careerHistory.length > 0) {
    // Find the most recent entry whose team matches currentTeam (or the very
    // last entry as fallback).
    const sortedHistory = [...cache.careerHistory].reverse();
    const teamMatch = sortedHistory.find(h => h.team && cache.currentTeam &&
      h.team.toLowerCase().includes(cache.currentTeam.toLowerCase().split(' ')[0]));
    leagueCode = (teamMatch || sortedHistory[0]).league || '';
  }
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
