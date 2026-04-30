#!/usr/bin/env node
/**
 * EuroBasket Cache Updater
 *
 * Reads player names from cebl-players.txt, logs into EuroBasket,
 * fetches each player's full career data, and saves as cache JSON files.
 *
 * Run manually:   node cache-updater.js
 * Run via cron:    launchd triggers daily-cache.sh which calls this
 */

// Load .env file if present
try { require('dotenv').config({ path: require('path').join(__dirname, '.env') }); } catch {}

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────
const EMAIL = process.env.EUROBASKET_EMAIL || '';
const PASSWORD = process.env.EUROBASKET_PASSWORD || '';
const CACHE_DIR = path.join(__dirname, 'app', 'src', 'data', 'cache');
const PLAYER_LIST = path.join(__dirname, 'cebl-players.txt');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const DELAY_MS = 2500; // 2.5s between requests to avoid rate limiting

// ─── State ────────────────────────────────────────────────────────────────────
let sessionCookies = null;

// ─── HTTP Helpers ─────────────────────────────────────────────────────────────

async function login() {
  console.log('🔐 Logging into EuroBasket...');
  try {
    const resp = await axios.post(
      'https://www.eurobasket.com/news_system/ndverifikacijasub.aspx',
      `email=${encodeURIComponent(EMAIL)}&pwd=${encodeURIComponent(PASSWORD)}&B1=Login&Referal=`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': 'https://www.eurobasket.com/news_system/login.aspx',
        },
        maxRedirects: 0,
        validateStatus: () => true,
        timeout: 15000,
      }
    );
    const setCookies = resp.headers['set-cookie'] || [];
    if (setCookies.length > 0) {
      sessionCookies = setCookies.map(c => c.split(';')[0]).join('; ');
      console.log('✅ Login successful');
      return true;
    }
    console.error('❌ Login failed: no cookies returned');
    return false;
  } catch (err) {
    console.error('❌ Login failed:', err.message);
    return false;
  }
}

async function fetchPage(url) {
  const headers = { 'User-Agent': USER_AGENT };
  if (sessionCookies) headers['Cookie'] = sessionCookies;
  const resp = await axios.get(url, { headers, timeout: 45000 });
  return resp.data;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Player List ──────────────────────────────────────────────────────────────

/**
 * Reads cebl-players.txt. Supports two formats:
 *   Player Name
 *   Player Name | 501340       (with EuroBasket player ID)
 */
function readPlayerList() {
  if (!fs.existsSync(PLAYER_LIST)) {
    console.error(`❌ Player list not found: ${PLAYER_LIST}`);
    console.log('   Create cebl-players.txt with one player name per line.');
    return [];
  }
  const lines = fs.readFileSync(PLAYER_LIST, 'utf-8').split('\n');
  return lines
    .map(l => l.trim())
    .filter(l => l.length > 2 && !l.startsWith('#'))
    .map(l => {
      const parts = l.split('|').map(p => p.trim());
      return { name: parts[0], eurobasketId: parts[1] || null };
    });
}

// ─── EuroBasket Search ────────────────────────────────────────────────────────

// Both domains share the same database; usbasket.com sometimes resolves better
const DOMAINS = ['basketball.eurobasket.com', 'basketball.usbasket.com'];

async function searchPlayer(name, eurobasketId) {
  const slug = name.replace(/\s+/g, '-');
  const firstName = name.split(' ')[0];

  // 1. If we have a player ID, go straight to it (most reliable)
  if (eurobasketId) {
    for (const domain of DOMAINS) {
      const url = `https://${domain}/player/${slug}/${eurobasketId}`;
      try {
        const html = await fetchPage(url);
        if (html && html.includes(firstName)) {
          return { url, found: true };
        }
      } catch {}
    }
  }

  // 2. Try direct URL with name slug on both domains
  for (const domain of DOMAINS) {
    const directUrl = `https://${domain}/player/${slug}`;
    try {
      const html = await fetchPage(directUrl);
      if (html && html.includes(firstName) && html.toLowerCase().includes(name.split(' ').pop().toLowerCase())) {
        // Extract player ID from the page to build canonical URL
        const idMatch = html.match(/playerid[=:](\d+)/i) || html.match(/\/player\/[^/]+\/(\d+)/);
        if (idMatch) {
          return { url: `${directUrl}/${idMatch[1]}`, found: true };
        }
        return { url: directUrl, found: true };
      }
    } catch {}
  }

  // 3. Try reversed name slug (Last-First) on both domains
  const nameParts = name.split(' ');
  if (nameParts.length >= 2) {
    const reversedSlug = `${nameParts.slice(-1)[0]}-${nameParts.slice(0, -1).join('-')}`;
    for (const domain of DOMAINS) {
      const url = `https://${domain}/player/${reversedSlug}`;
      try {
        const html = await fetchPage(url);
        if (html && html.includes(firstName)) {
          const idMatch = html.match(/playerid[=:](\d+)/i) || html.match(/\/player\/[^/]+\/(\d+)/);
          if (idMatch) return { url: `${url}/${idMatch[1]}`, found: true };
          return { url, found: true };
        }
      } catch {}
    }
  }

  // 4. Use EuroBasket's native search form (POST to Basketball-Search.aspx)
  //    NOTE: EuroBasket's search only matches the LAST NAME field — querying the full
  //    name like "Nathan Cayo" returns nothing. We search by last name alone, then
  //    filter candidates client-side by first name. Try multiple query variants
  //    (last name, last two tokens, full) and multiple "last name" candidates
  //    (for suffixes like "II"/"Jr."/"III", the real last name is the preceding token).
  const suffixes = new Set(['ii', 'iii', 'iv', 'jr', 'jr.', 'sr', 'sr.', 'v']);
  const targetParts = name.toLowerCase().split(/\s+/);
  const targetSlug = name.replace(/\s+/g, '-').toLowerCase();

  // Determine the real "last name" for searching (skip suffixes)
  let lastNameIdx = targetParts.length - 1;
  while (lastNameIdx > 0 && suffixes.has(targetParts[lastNameIdx])) lastNameIdx--;
  const lastName = targetParts[lastNameIdx];

  // Try multiple search strategies — EuroBasket returns max ~100 alphabetized results
  // so very common last names (Green, Smith) won't surface rarer first names.
  // Order: last name (usually best), first name (for common surnames), full name, last-two.
  const queries = [lastName, targetParts[0], name];
  if (targetParts.length > 2) queries.push(targetParts.slice(-2).join(' '));

  for (const domain of DOMAINS) {
    for (const query of queries) {
      try {
        const resp = await axios.post(
          `https://${domain}/Basketball-Search.aspx`,
          new URLSearchParams({
            SearchTypeGlobal: 'Player',
            PageNo: '0',
            Favorite: '',
            txtSearchGlobal: query,
            SearchFrom: 'Name',
          }).toString(),
          {
            headers: {
              'User-Agent': USER_AGENT,
              'Content-Type': 'application/x-www-form-urlencoded',
              ...(sessionCookies ? { Cookie: sessionCookies } : {}),
            },
            timeout: 20000,
          }
        );
        const html = resp.data || '';
        const candidates = [...html.matchAll(/\/player\/([^"<>/ ]+)\/(\d+)/g)]
          .map(m => ({ slug: m[1], slugLower: m[1].toLowerCase(), id: m[2], url: `https://${domain}/player/${m[1]}/${m[2]}` }));
        if (candidates.length === 0) continue;

        // Prefer exact slug match (e.g. "sean-east-ii" === "sean-east-ii")
        const exact = candidates.find(c => c.slugLower === targetSlug);
        if (exact) return { url: exact.url, found: true };

        // Slug contains all name tokens (first, last, and suffix if present)
        const containsAll = candidates.find(c => targetParts.every(p => c.slugLower.includes(p)));
        if (containsAll) return { url: containsAll.url, found: true };

        // Slug starts with "firstname-lastname" — handles CEBL-style "Nathan-Cayo" matches
        const firstName = targetParts[0];
        const firstLast = candidates.find(c =>
          c.slugLower.startsWith(`${firstName}-${lastName}`) ||
          c.slugLower === `${firstName}-${lastName}`
        );
        if (firstLast) return { url: firstLast.url, found: true };
      } catch {}
    }
  }

  return { url: null, found: false };
}

// ─── EuroBasket Parsing ───────────────────────────────────────────────────────

const num = v => parseFloat(v) || 0;

function parseMadeAttempted(v) {
  const m = (v || '').match(/(\d+)-(\d+)/);
  return m ? { made: parseInt(m[1]), attempted: parseInt(m[2]) } : { made: 0, attempted: 0 };
}

function capitalizeName(name) {
  if (!name) return name;
  return name.split(' ').map(w => {
    if (!w) return w;
    if (/^(II|III|IV|JR|SR)$/i.test(w)) return w.toUpperCase();
    if (w === w.toUpperCase() && w.length > 2) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }
    return w;
  }).join(' ');
}

function parsePlayerProfile(html) {
  const $ = cheerio.load(html);
  const bodyText = $('body').text();
  const profile = {};

  // Name
  const h1 = $('h1').first().text().trim()
    .replace(/basketball profile/i, '').replace(/\s+/g, ' ').trim();
  profile.fullName = capitalizeName(h1);

  // EuroBasket profile format: "6'7''Position: ForwardBorn: Jul.2, 2000  in  Brampton, ONWeight: 95kg / 209lbs"
  // Parse position
  const posMatch = bodyText.match(/Position:\s*(Guard|Forward|Center|Point Guard|Shooting Guard|Small Forward|Power Forward)/i);
  if (posMatch) profile.position = posMatch[1].charAt(0).toUpperCase() + posMatch[1].slice(1).toLowerCase();

  // Parse birthdate: "Born: Jul.2, 2000" or "Born: July 2, 2000" or "Born: 02.07.2000"
  const bornMatch = bodyText.match(/Born:\s*([A-Z][a-z]{2,8})\s*\.?\s*(\d{1,2}),?\s*(\d{4})/i);
  if (bornMatch) {
    const monthAbbrs = { jan:'January', feb:'February', mar:'March', apr:'April', may:'May', jun:'June',
      jul:'July', aug:'August', sep:'September', oct:'October', nov:'November', dec:'December' };
    const monthKey = bornMatch[1].toLowerCase().substring(0, 3);
    const monthFull = monthAbbrs[monthKey] || bornMatch[1];
    profile.birthdate = `${monthFull} ${parseInt(bornMatch[2])}, ${bornMatch[3]}`;
  }

  // Parse birth city: "in  Brampton, ON" after birthdate
  const cityMatch = bodyText.match(/Born:[^]*?in\s{1,4}([A-Z][^W]*?)(?:Weight:|$)/i);
  if (cityMatch) {
    let city = cityMatch[1].trim().replace(/\s+/g, ' ');
    // Clean up trailing junk
    city = city.replace(/\s*Weight.*$/, '').replace(/\s*$/, '');
    if (city.length > 2 && city.length < 60) profile.birthCity = city;
  }

  // Parse height: "6'7''" or "7'0''" — EuroBasket uses '' for inches sometimes
  const htMatch = bodyText.match(/(\d)['''](\d+)[''"]{1,2}/);
  if (htMatch) {
    profile.height = `${htMatch[1]}'${htMatch[2]}"`;
  }

  // Parse height in cm from a nearby "(201 cm)" or "201cm"
  const cmMatch = bodyText.match(/(\d{3})\s*cm/);
  if (cmMatch) profile.heightCm = cmMatch[1];
  else if (htMatch) {
    // Calculate from ft/in if cm not shown
    const ft = parseInt(htMatch[1]);
    const inches = parseInt(htMatch[2]);
    profile.heightCm = String(Math.round((ft * 12 + inches) * 2.54));
  }

  // Parse weight: "95kg / 209lbs" or "209lbs (95kg)" or "95 kg"
  const wtMatch1 = bodyText.match(/(\d+)\s*kg\s*\/\s*(\d+)\s*lbs/i);
  const wtMatch2 = bodyText.match(/(\d+)\s*lbs?\s*(?:\(|\/)\s*(\d+)\s*kg/i);
  if (wtMatch1) { profile.weightKg = wtMatch1[1]; profile.weight = wtMatch1[2]; }
  else if (wtMatch2) { profile.weight = wtMatch2[1]; profile.weightKg = wtMatch2[2]; }
  else {
    const kgOnly = bodyText.match(/Weight:\s*(\d+)\s*kg/i);
    if (kgOnly) { profile.weightKg = kgOnly[1]; profile.weight = String(Math.round(parseFloat(kgOnly[1]) * 2.205)); }
  }

  // Bio sentence: "Muenkat is Canadian basketball player..."
  const bioMatch = bodyText.match(
    /is\s+(\w+)\s+basketball player[^.]*born\s+(?:on\s+)?([^,]+,?\s*\d{4})\s+in\s+([^.]+)/i
  );
  if (bioMatch) {
    profile.nationality = bioMatch[1];
    if (!profile.birthdate) profile.birthdate = bioMatch[2].trim();
    if (!profile.birthCity) profile.birthCity = bioMatch[3].trim();
  }

  // Parse nationality from "Country: Canada" or from bio text
  const natMatch = bodyText.match(/(?:nationality|country)[:\s]+([A-Za-z]+)/i);
  if (natMatch && !profile.nationality) profile.nationality = natMatch[1];

  // College — extract from career history table rather than free text
  // (free text match is unreliable; we'll set it from seasonStats in cachePlayer)

  // High school — look for pattern like "Archb.Carroll (DC)" before year markers
  const hsMatch = bodyText.match(/(?:High School|HS)[:\s]+([A-Za-z][A-Za-z0-9\s.''()-]{2,40}?)(?:\s*['']?\d{4}|Class:|Social|Height:|Position:|Born:|Weight:|$)/i);
  if (hsMatch) {
    let hs = hsMatch[1].trim().replace(/[''"]+$/, '').trim();
    if (hs.length >= 3 && hs.length <= 50) profile.highSchool = hs;
  }

  return profile;
}

function parseCareerStats(html) {
  const $ = cheerio.load(html);
  const seasons = [];

  // Strategy 1: Parse "CLUB COMPETITIONS" table (full career with made-attempted)
  // The table header contains "CLUB COMPETITIONS" text
  $('table').each((_, table) => {
    const headerText = $(table).find('tr').first().text().trim();
    if (!headerText.toLowerCase().includes('club competitions')) return;

    $(table).find('tr').slice(1).each((_, row) => {
      const cells = [];
      $(row).find('td').each((_, cell) => cells.push($(cell).text().trim()));

      // Skip header rows, empty rows, and asterisked (paywalled) rows
      if (cells.length < 15) return;
      if (cells[0] === 'Season' || cells[0] === '') return;
      if (cells.some(v => v.includes('*'))) return;

      const season = cells[0];
      const team = cells[1];
      const league = cells[2];
      if (!season || !team) return;

      const gp = num(cells[3]);
      const g = gp || 1;

      // The full subscriber format interleaves totals and per-game values
      // Pattern: Season|Team|League|G|MIN|MIN/G|PTS|PTS/G|2FG(M-A)|2FG%|2FG%|3FG(M-A)|3FG%|3FG%|FT(M-A)|FT%|FT%|RO|RO/G|RD|RD/G|RT|RT/G|AS|AS/G|PF|PF/G|BS|BS/G|ST|ST/G|TO|TO/G|RNK|RNK/G
      if (cells.length >= 30) {
        const twoFg = parseMadeAttempted(cells[8]);
        const threeFg = parseMadeAttempted(cells[11]);
        const ft = parseMadeAttempted(cells[14]);

        seasons.push({
          year: season, team, league, gamesPlayed: gp,
          minutes: num(cells[4]),
          ppg: parseFloat((num(cells[6]) / g).toFixed(1)),
          rpg: parseFloat((num(cells[21]) / g).toFixed(1)),
          apg: parseFloat((num(cells[23]) / g).toFixed(1)),
          spg: parseFloat((num(cells[29]) / g).toFixed(1)),
          bpg: parseFloat((num(cells[27]) / g).toFixed(1)),
          fgPct: twoFg.attempted > 0 ? parseFloat((twoFg.made / twoFg.attempted).toFixed(3)) : 0,
          threePct: threeFg.attempted > 0 ? parseFloat((threeFg.made / threeFg.attempted).toFixed(3)) : 0,
          ftPct: ft.attempted > 0 ? parseFloat((ft.made / ft.attempted).toFixed(3)) : 0,
          totalPoints: num(cells[6]),
          totalRebounds: num(cells[21]),
          totalAssists: num(cells[23]),
          totalSteals: num(cells[29]),
          totalBlocks: num(cells[27]),
          twoFgMade: twoFg.made, twoFgAttempted: twoFg.attempted,
          threeFgMade: threeFg.made, threeFgAttempted: threeFg.attempted,
          ftMade: ft.made, ftAttempted: ft.attempted,
          offRebounds: num(cells[17]),
          defRebounds: num(cells[19]),
          personalFouls: num(cells[25]),
          turnovers: num(cells[31]),
          isCollegiate: /ncaa|college|university|juco|u.?sports|uspo/i.test(league) ||
            /university|college|st\.?\s*francis/i.test(team),
        });
      } else if (cells.length >= 17) {
        // Averages-only format
        seasons.push({
          year: season, team, league, gamesPlayed: gp,
          minutes: Math.round(num(cells[4]) * g),
          ppg: num(cells[5]),
          rpg: num(cells[11]),
          apg: num(cells[12]),
          spg: num(cells[15]),
          bpg: num(cells[14]),
          fgPct: num(cells[6]) > 1 ? num(cells[6]) / 100 : num(cells[6]),
          threePct: num(cells[7]) > 1 ? num(cells[7]) / 100 : num(cells[7]),
          ftPct: num(cells[8]) > 1 ? num(cells[8]) / 100 : num(cells[8]),
          isCollegiate: /ncaa|college|university|juco|u.?sports|uspo/i.test(league) ||
            /university|college|st\.?\s*francis/i.test(team),
        });
      }
    });
  });

  // Strategy 2: If no club table, parse Summary tables (current season only)
  if (seasons.length === 0) {
    $('table').each((_, table) => {
      if ($(table).find('tr').first().text().trim() !== 'Summary') return;
      $(table).find('tr').each((_, row) => {
        const cells = [];
        $(row).find('td').each((_, c) => cells.push($(c).text().trim()));
        if (cells.length < 15 || cells[0] === 'Team' || cells[0] === 'AVERAGES') return;

        const team = cells[0];
        const gp = num(cells[1]);
        if (!team || !gp) return;
        const g = gp || 1;

        const twoFg = parseMadeAttempted(cells[4]);
        const threeFg = parseMadeAttempted(cells[5]);
        const ft = parseMadeAttempted(cells[6]);

        seasons.push({
          year: 'Current', team, league: '',
          gamesPlayed: gp, minutes: num(cells[2]),
          ppg: parseFloat((num(cells[3]) / g).toFixed(1)),
          rpg: parseFloat((num(cells[9]) / g).toFixed(1)),
          apg: parseFloat((num(cells[10]) / g).toFixed(1)),
          spg: parseFloat((num(cells[13]) / g).toFixed(1)),
          bpg: parseFloat((num(cells[12]) / g).toFixed(1)),
          fgPct: twoFg.attempted > 0 ? parseFloat((twoFg.made / twoFg.attempted).toFixed(3)) : 0,
          threePct: threeFg.attempted > 0 ? parseFloat((threeFg.made / threeFg.attempted).toFixed(3)) : 0,
          ftPct: ft.attempted > 0 ? parseFloat((ft.made / ft.attempted).toFixed(3)) : 0,
          totalPoints: num(cells[3]),
          totalRebounds: num(cells[9]),
          totalAssists: num(cells[10]),
          totalSteals: num(cells[13]),
          totalBlocks: num(cells[12]),
          twoFgMade: twoFg.made, twoFgAttempted: twoFg.attempted,
          threeFgMade: threeFg.made, threeFgAttempted: threeFg.attempted,
          ftMade: ft.made, ftAttempted: ft.attempted,
          offRebounds: num(cells[7]),
          defRebounds: num(cells[8]),
          personalFouls: num(cells[11]),
          turnovers: num(cells[14]),
          isCollegiate: false,
        });
      });
    });
  }

  return seasons;
}

// ─── Game Log Parsing ─────────────────────────────────────────────────────────

function parseGameLog(html) {
  const $ = cheerio.load(html);
  const games = [];

  $('table').each((_, table) => {
    if ($(table).find('tr').first().text().trim() !== 'Details') return;
    $(table).find('tr').slice(1).each((_, row) => {
      const cells = [];
      $(row).find('td').each((_, c) => cells.push($(c).text().trim()));
      if (cells.length < 15) return;
      const date = cells[0];
      if (!date || !date.match(/\d+\/\d+\/\d+/)) return;

      const twoFg = parseMadeAttempted(cells[6]);
      const threeFg = parseMadeAttempted(cells[7]);
      const ft = parseMadeAttempted(cells[8]);

      games.push({
        date, team: cells[1], opponent: cells[2], score: cells[3],
        minutes: num(cells[4]), points: num(cells[5]),
        twoFgMade: twoFg.made, twoFgAttempted: twoFg.attempted,
        threeFgMade: threeFg.made, threeFgAttempted: threeFg.attempted,
        ftMade: ft.made, ftAttempted: ft.attempted,
        offRebounds: num(cells[9]), defRebounds: num(cells[10]),
        totalRebounds: num(cells[11]), assists: num(cells[12]),
        personalFouls: num(cells[13]),
        blocks: num(cells[14]), steals: num(cells[15]),
        turnovers: num(cells[16] || 0),
      });
    });
  });
  return games;
}

function scoreGame(g) {
  let score = 0;
  const doubles = [g.points >= 10, g.totalRebounds >= 10, g.assists >= 10, g.steals >= 5, g.blocks >= 5].filter(Boolean).length;
  if (doubles >= 3) score += 500;
  if (doubles >= 2) score += 200;
  score += g.points * 3 + g.totalRebounds * 2 + g.assists * 2 + g.steals * 5 + g.blocks * 5;
  const fga = g.twoFgAttempted + g.threeFgAttempted;
  if (fga >= 10 && (g.twoFgMade + g.threeFgMade) / fga >= 0.6) score += 30;
  if (g.points >= 30) score += 50;
  if (g.points >= 25) score += 25;
  return score;
}

function formatDate(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length >= 3) {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${months[parseInt(parts[0]) - 1]} ${parseInt(parts[1])}`;
  }
  return dateStr;
}

function buildHighlight(g) {
  const fgm = g.twoFgMade + g.threeFgMade;
  const fga = g.twoFgAttempted + g.threeFgAttempted;
  const parts = [];
  const doubles = [g.points >= 10, g.totalRebounds >= 10, g.assists >= 10].filter(Boolean).length;
  const verb = g.points >= 25 ? 'Poured in' : doubles >= 2 ? 'Registered' : ['Scored','Dropped','Put up','Had'][g.points % 4];

  if (doubles >= 3) {
    parts.push(`Recorded a triple-double with ${g.points} points, ${g.totalRebounds} rebounds, and ${g.assists} assists on ${fgm}-for-${fga} shooting`);
  } else if (doubles >= 2 && g.points >= 10 && g.totalRebounds >= 10) {
    parts.push(`${verb} a double-double with ${g.points} points and ${g.totalRebounds} rebounds on ${fgm}-for-${fga} shooting`);
    if (g.assists >= 3) parts.push(`${g.assists} assists`);
  } else {
    parts.push(`${verb} ${g.points} points on ${fgm}-for-${fga} shooting`);
    if (g.totalRebounds >= 4) parts.push(`${g.totalRebounds} rebounds`);
    if (g.assists >= 3) parts.push(`${g.assists} assists`);
  }
  if (g.steals >= 2) parts.push(`${g.steals} steals`);
  if (g.blocks >= 2) parts.push(`${g.blocks} blocks`);
  if (g.threeFgMade >= 3) parts.push(`${g.threeFgMade}-for-${g.threeFgAttempted} from three`);

  let text;
  if (parts.length <= 2) text = parts.join(' as well as ');
  else text = `${parts[0]} as well as ${parts.slice(1, -1).join(', ')} and ${parts[parts.length - 1]}`;

  text += ` in ${Math.round(g.minutes)} minutes ${formatDate(g.date)} vs. ${g.opponent}`;
  return text;
}

// ─── Cache Builder ────────────────────────────────────────────────────────────

function toFileName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') + '.json';
}

async function cachePlayer(playerName, eurobasketId) {
  const fileName = toFileName(playerName);
  const filePath = path.join(CACHE_DIR, fileName);

  // Search for player on EuroBasket
  const search = await searchPlayer(playerName, eurobasketId);
  if (!search.found || !search.url) {
    return { success: false, error: 'Not found on EuroBasket' };
  }

  try {
    const html = await fetchPage(search.url);
    const profile = parsePlayerProfile(html);
    const seasons = parseCareerStats(html);
    const gameLog = parseGameLog(html);

    // Career history
    const careerHistory = seasons.map(s => ({
      year: s.year, team: s.team, league: s.league,
    }));

    // Assign top game highlights to seasons
    if (gameLog.length > 0) {
      const assignedGames = new Set(); // track which games are assigned to avoid duplication

      // Sort seasons by gamesPlayed descending — seasons with more games are easier to match
      // correctly, so process them first. Use a copy to avoid mutating the original order.
      const seasonsByGames = [...seasons].sort((a, b) => (b.gamesPlayed || 0) - (a.gamesPlayed || 0));

      for (const s of seasonsByGames) {
        // Determine the date range for this season based on the year field
        // Year formats: "25-26", "2025", "24-25", "20-21"
        const yearMatch = s.year.match(/(\d{2,4})-(\d{2,4})/);
        let startYear, endYear;
        if (yearMatch) {
          startYear = yearMatch[1].length === 2 ? 2000 + parseInt(yearMatch[1]) : parseInt(yearMatch[1]);
          endYear = yearMatch[2].length === 2 ? 2000 + parseInt(yearMatch[2]) : parseInt(yearMatch[2]);
        } else {
          // Single year like "2025" — CEBL seasons run May-Aug
          startYear = parseInt(s.year);
          endYear = startYear;
        }

        const candidateGames = gameLog.filter(g => {
          if (assignedGames.has(g)) return false;
          // Match by team name (partial)
          const teamMatch = g.team.toLowerCase().includes(s.team.toLowerCase().substring(0, 5)) ||
            s.team.toLowerCase().includes(g.team.toLowerCase().substring(0, 5));
          if (!teamMatch) return false;
          // Match by year from game date (format: M/D/YYYY)
          const parts = g.date.split('/');
          if (parts.length >= 3) {
            const gameYear = parseInt(parts[2]);
            const gameMonth = parseInt(parts[0]);
            // For split-year seasons (e.g. 24-25): games from Sep-Dec of startYear or Jan-Aug of endYear
            if (startYear !== endYear) {
              return (gameYear === startYear && gameMonth >= 8) || (gameYear === endYear && gameMonth <= 8);
            }
            // For single-year seasons: games in that year
            return gameYear === startYear;
          }
          return true; // if date parsing fails, include the game
        });

        if (candidateGames.length === 0) continue;

        // Validate game count: if gamesPlayed is known, don't assign more games than expected.
        // This prevents a season with 1 game from absorbing 20+ game logs that belong elsewhere
        // (e.g. same team playing in multiple leagues like GER-20, GER-1, and BCL-1).
        let seasonGames = candidateGames;
        if (s.gamesPlayed && s.gamesPlayed > 0 && candidateGames.length > s.gamesPlayed) {
          // Too many candidates — this season likely shares team+date range with another season.
          // Take only gamesPlayed count, preferring games whose points are closest to the season
          // ppg to improve accuracy.
          const sorted = [...candidateGames].sort((a, b) => {
            const aDiff = Math.abs(a.points - (s.ppg || 0));
            const bDiff = Math.abs(b.points - (s.ppg || 0));
            return aDiff - bDiff;
          });
          seasonGames = sorted.slice(0, s.gamesPlayed);
        }

        // Mark as assigned
        seasonGames.forEach(g => assignedGames.add(g));

        // Only surface games that EXCEED the player's season averages.
        // A "standout" game must beat the season average in at least one major category
        // (points, rebounds, assists) by a meaningful margin, OR be a true statistical
        // anomaly (double-double, triple-double, big shooting night).
        const seasonPpg = s.ppg || 0;
        const seasonRpg = s.rpg || 0;
        const seasonApg = s.apg || 0;

        // Margin: 20% above average OR +5 absolute (whichever larger), to handle
        // low-volume players where +20% might be < 1 point.
        const ptsThreshold = Math.max(seasonPpg * 1.2, seasonPpg + 5, 15);
        const rebThreshold = Math.max(seasonRpg * 1.4, seasonRpg + 3, 8);
        const astThreshold = Math.max(seasonApg * 1.4, seasonApg + 3, 6);

        const exceedsAverage = (g) => {
          // Triple-doubles and double-doubles always qualify
          const doubles = [g.points >= 10, g.totalRebounds >= 10, g.assists >= 10].filter(Boolean).length;
          if (doubles >= 2) return true;
          // Hot shooting night (big 3-point game)
          if (g.threeFgMade >= 5) return true;
          // Big defensive game (5+ steals or 5+ blocks)
          if (g.steals >= 5 || g.blocks >= 5) return true;
          // Beat season average in any major category
          if (g.points >= ptsThreshold) return true;
          if (g.totalRebounds >= rebThreshold) return true;
          if (g.assists >= astThreshold) return true;
          return false;
        };

        const standoutGames = seasonGames.filter(exceedsAverage);
        if (standoutGames.length === 0) {
          // No games exceeded averages — leave highlights empty so auto-stats narrative
          // (e.g. ".387 from three") fills in instead. Don't force weak highlights.
          continue;
        }
        const scored = standoutGames.map(g => ({ game: g, score: scoreGame(g) }));
        scored.sort((a, b) => b.score - a.score);
        const topGames = scored.slice(0, 5);
        if (topGames.length > 0) {
          s.highlights = topGames.map(sg => buildHighlight(sg.game));

          // Validate highlights against season stats — drop if wildly inconsistent
          if (s.gamesPlayed <= 2) {
            // For seasons with very few games, highlights must roughly match the stats
            const avgPtsInHighlights = topGames.reduce((sum, sg) => sum + sg.game.points, 0) / topGames.length;
            if (s.ppg < 1 && avgPtsInHighlights > 5) {
              // Season avg is near 0 but highlights show scoring — wrong season
              delete s.highlights;
            }
          }
        }
      }
    }

    // Personal info
    const personalInfo = [];
    const bodyText = cheerio.load(html)('body').text();
    const natMatch = bodyText.match(/is\s+(\w+)\s+basketball/i);
    if (natMatch && /canad/i.test(natMatch[1])) {
      personalInfo.push(`Canadian basketball player from ${profile.birthCity || 'Canada'}.`);
    }
    const ntMatch = bodyText.match(/(?:represented|played for|member of)\s+(?:the\s+)?(?:Canadian|Team Canada|Canada)\s+(?:national team|in FIBA|internationally)[^.]*\./i);
    if (ntMatch) personalInfo.push(ntMatch[0]);
    const agentMatch = bodyText.match(/agent is\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/);
    if (agentMatch) personalInfo.push(`Agent: ${agentMatch[1]}.`);

    // Derive college from career stats (more reliable than text parsing)
    if (!profile.college) {
      const collegeSeason = seasons.filter(s => s.isCollegiate && !/juco/i.test(s.league));
      if (collegeSeason.length > 0) {
        profile.college = collegeSeason[collegeSeason.length - 1].team; // last NCAA/U SPORTS team
      }
    }

    // Save cache
    const cacheData = {
      fullName: profile.fullName || playerName,
      birthdate: profile.birthdate || '',
      birthCity: profile.birthCity || '',
      height: profile.height || '',
      heightCm: profile.heightCm || '',
      weight: profile.weight || '',
      weightKg: profile.weightKg || '',
      position: profile.position || '',
      nationality: profile.nationality || '',
      college: profile.college || '',
      highSchool: profile.highSchool || '',
      currentTeam: seasons.length > 0 ? seasons[seasons.length - 1].team : '',
      currentLeague: seasons.length > 0 ? seasons[seasons.length - 1].league : '',
      careerHistory,
      seasonStats: seasons,
      personalInfo,
      sources: [search.url],
      cachedAt: new Date().toISOString(),
      // Verification metadata
      _lastVerified: new Date().toISOString(),
      _sources: ['eurobasket.com'],
      _dataConfidence: (profile.fullName && (seasons.length > 0 || careerHistory.length > 0)) ? 'high' : 'medium',
    };

    fs.writeFileSync(filePath, JSON.stringify(cacheData, null, 2));
    return { success: true, seasons: seasons.length, games: gameLog.length };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const startTime = Date.now();
  console.log('═══════════════════════════════════════════');
  console.log('  EUROBASKET CACHE UPDATER');
  console.log(`  ${new Date().toLocaleString()}`);
  console.log('═══════════════════════════════════════════\n');

  if (!EMAIL || !PASSWORD) {
    console.error('❌ Missing credentials. Set EUROBASKET_EMAIL and EUROBASKET_PASSWORD environment variables.');
    console.log('   You can add them to .env file or export them in your shell.');
    process.exit(1);
  }

  // Ensure cache directory exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Step 1: Login
  const loggedIn = await login();
  if (!loggedIn) {
    console.error('⚠️  Continuing without login — will get limited stats');
  }

  // Step 2: Read player list (or use CLI args if provided)
  const cliNames = process.argv.slice(2).filter(a => !a.startsWith('-'));
  const players = cliNames.length > 0
    ? cliNames.map(name => ({ name, eurobasketId: null }))
    : readPlayerList();
  console.log(`\n📋 Players to cache: ${players.length}${cliNames.length > 0 ? ' (from CLI args)' : ''}`);
  players.forEach(p => console.log(`   • ${p.name}${p.eurobasketId ? ` (ID: ${p.eurobasketId})` : ''}`));

  if (players.length === 0) {
    console.log('\n⚠️  No players in cebl-players.txt. Add player names and re-run.');
    process.exit(0);
  }

  // Step 3: Cache each player
  let cached = 0, failed = 0, skipped = 0;

  for (let i = 0; i < players.length; i++) {
    const { name, eurobasketId } = players[i];
    const fileName = toFileName(name);
    const filePath = path.join(CACHE_DIR, fileName);

    // Skip if cached within last 20 hours
    if (fs.existsSync(filePath)) {
      try {
        const stat = fs.statSync(filePath);
        const hoursSince = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60);
        if (hoursSince < 20) {
          process.stdout.write(`[${i + 1}/${players.length}] ${name} — skipped (cached ${hoursSince.toFixed(0)}h ago)\n`);
          skipped++;
          continue;
        }
      } catch {}
    }

    process.stdout.write(`[${i + 1}/${players.length}] ${name}... `);
    const result = await cachePlayer(name, eurobasketId);
    if (result.success) {
      console.log(`✅ ${result.seasons} seasons, ${result.games} game logs`);
      cached++;
    } else {
      console.log(`❌ ${result.error}`);
      failed++;
    }
    await sleep(DELAY_MS);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  const cacheCount = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json')).length;

  console.log('\n═══════════════════════════════════════════');
  console.log(`  DONE in ${elapsed}s`);
  console.log(`  ✅ Cached: ${cached}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📁 Total cache files: ${cacheCount}`);
  console.log('═══════════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
