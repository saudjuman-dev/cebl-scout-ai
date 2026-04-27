import axios from 'axios';
import * as cheerio from 'cheerio';

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export interface ScrapedPlayer {
  fullName: string;
  birthdate: string;
  birthCity: string;
  height: string;
  heightCm: string;
  weight: string;
  weightKg: string;
  position: string;
  nationality: string;
  college: string;
  highSchool: string;
  currentTeam: string;
  currentLeague: string;
  careerHistory: { year: string; team: string; league: string }[];
  seasonStats: SeasonStat[];
  personalInfo: string[];
  sources: string[];
}

export interface SeasonStat {
  year: string;
  team: string;
  league: string;
  gamesPlayed: number;
  minutes: number;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  fgPct: number;
  threePct: number;
  ftPct: number;
  totalPoints?: number;
  totalRebounds?: number;
  totalAssists?: number;
  totalSteals?: number;
  totalBlocks?: number;
  twoFgMade?: number;
  twoFgAttempted?: number;
  threeFgMade?: number;
  threeFgAttempted?: number;
  ftMade?: number;
  ftAttempted?: number;
  offRebounds?: number;
  defRebounds?: number;
  personalFouls?: number;
  turnovers?: number;
  isCollegiate?: boolean;
  highlights?: string[];
  awards?: string;
}

/** Single game log entry from NBA/G-League API */
interface GameLogEntry {
  date: string;
  matchup: string;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fgm: number;
  fga: number;
  fg3m: number;
  fg3a: number;
  ftm: number;
  fta: number;
  min: number;
  wl: string;
}

async function fetchHTML(url: string): Promise<string | null> {
  try {
    const resp = await axios.get(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
      timeout: 8000,
      maxRedirects: 5,
    });
    return typeof resp.data === 'string' ? resp.data : null;
  } catch {
    return null;
  }
}

async function fetchJSON(url: string, referer: string): Promise<unknown | null> {
  try {
    const resp = await axios.get(url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'application/json',
        'Referer': referer,
      },
      timeout: 10000,
    });
    return resp.data;
  } catch {
    return null;
  }
}

// ====== Wikipedia (RELIABLE — primary source) ======

export async function scrapeWikipedia(playerName: string): Promise<Partial<ScrapedPlayer>> {
  const result: Partial<ScrapedPlayer> = { sources: [], seasonStats: [], careerHistory: [], personalInfo: [] };

  try {
    const searchResp = await axios.get(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(playerName + ' basketball player')}&format=json`,
      { headers: { 'User-Agent': UA }, timeout: 6000 }
    );
    const pages = searchResp.data?.query?.search;
    if (!pages?.length) return result;

    // Strict name match: title must contain BOTH the first name AND the last name
    // (this prevents Wikipedia from returning "Tajh Boyd" (QB) when searching for "Tajh Green")
    const suffixes = new Set(['ii', 'iii', 'iv', 'jr', 'jr.', 'sr', 'sr.', 'v']);
    const rawParts = playerName.toLowerCase().split(/\s+/).filter(p => p.length > 1);
    const coreParts = rawParts.filter(p => !suffixes.has(p));
    const firstName = coreParts[0];
    const lastName = coreParts[coreParts.length - 1];

    if (!firstName || !lastName) return result;

    const bestPage = pages.find((p: { title: string }) => {
      const title = p.title.toLowerCase();
      // Require both first and last name present (skip disambiguators in parens)
      const titleCore = title.replace(/\s*\([^)]*\)\s*$/, '');
      return titleCore.includes(firstName) && titleCore.includes(lastName);
    });
    if (!bestPage) return result;

    const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(bestPage.title.replace(/ /g, '_'))}`;
    const html = await fetchHTML(pageUrl);
    if (!html) return result;

    // Validate: must be a basketball player page (not QB, coach, etc.)
    const $ = cheerio.load(html);
    const pageText = $('body').text().toLowerCase();
    const infoboxText = $('.infobox').text().toLowerCase();

    // Reject non-basketball sports: QB, wide receiver, football, soccer, hockey, etc.
    const nonBasketballSport = /\b(quarterback|wide receiver|running back|linebacker|defensive end|offensive tackle|cornerback|pitcher|outfielder|shortstop|goalkeeper|midfielder|striker|defenseman|winger|footballer|football player|baseball player|hockey player|soccer player|rugby|cricketer)\b/i;
    if (nonBasketballSport.test(infoboxText)) return result;

    // Must be a basketball player page
    const isBasketballPlayer = pageText.includes('basketball') &&
      ($('.infobox').length > 0 || pageText.includes('career') || pageText.includes('season'));
    const isNotPersonPage = /national.*team|draft|tournament|championship|season results/i.test(bestPage.title);
    if (isNotPersonPage || !isBasketballPlayer) return result;

    // Extra guard: infobox must mention basketball or list a basketball position
    const basketballIndicator = /\b(basketball|point guard|shooting guard|small forward|power forward|center|combo guard|swingman)\b/i;
    if (!basketballIndicator.test(infoboxText) && !/basketball/i.test(bestPage.title)) {
      // If the infobox has NO basketball mention, only trust it if the title
      // explicitly disambiguates with "basketball" (e.g. "John Smith (basketball)")
      return result;
    }

    result.sources = [pageUrl];

    // Name from bold text in first paragraph
    const boldName = $('#mw-content-text .mw-parser-output > p').first().find('b').first().text().trim();
    if (boldName) result.fullName = boldName;

    // Infobox
    const infobox = $('.infobox');
    infobox.find('tr').each((_, row) => {
      const label = $(row).find('th').text().trim().toLowerCase();
      const value = $(row).find('td').text().trim();
      if (!label || !value) return;

      if (label.includes('born')) {
        const dateMatch = value.match(/([A-Z][a-z]+ \d{1,2},?\s*\d{4})/);
        if (dateMatch) result.birthdate = dateMatch[1];
        const lines = value.split('\n').filter(l => l.trim());
        const cityLine = lines.find(l => /[A-Z].*,/.test(l) && !l.match(/\d{4}/) && l.length < 60);
        if (cityLine) result.birthCity = cityLine.trim();
      }
      if (label.includes('height') || label === 'listed height') {
        const ftMatch = value.match(/(\d+)\s*ft\s*(\d+)\s*in/);
        if (ftMatch) result.height = `${ftMatch[1]}'${ftMatch[2]}"`;
        else { const alt = value.match(/(\d+['']\d+[""])/); if (alt) result.height = alt[1]; }
        const cmMatch = value.match(/(\d+)\s*cm/);
        if (cmMatch) result.heightCm = cmMatch[1];
      }
      if (label.includes('weight') || label === 'listed weight') {
        const lbMatch = value.match(/(\d+)\s*lb/);
        if (lbMatch) result.weight = lbMatch[1];
        const kgMatch = value.match(/(\d+)\s*kg/);
        if (kgMatch) result.weightKg = kgMatch[1];
      }
      if (label.includes('position')) result.position = value.split('\n')[0].trim();
      if (label.includes('college')) result.college = value.split('\n')[0].trim();
      if (label.includes('high school')) result.highSchool = value.split('\n')[0].trim();
      if (label.includes('nationality')) result.nationality = value.split('\n')[0].trim();
    });

    // Career stats tables
    $('table.wikitable').each((_, table) => {
      // Determine if college table by walking backwards to find heading
      let isCollege = false;
      let el = $(table).prev();
      for (let i = 0; i < 10 && el.length; i++) {
        const tag = (el.prop('tagName') || '').toLowerCase();
        if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
          const heading = el.text().toLowerCase();
          if (heading.includes('college') || heading.includes('collegiate')) isCollege = true;
          break;
        }
        el = el.prev();
      }

      // Also detect college by team names
      const teamTexts: string[] = [];
      $(table).find('tr').slice(1).each((_, r) => {
        const cells = $(r).find('td');
        if (cells.length > 1) teamTexts.push($(cells.eq(1)).text().trim().toLowerCase());
      });
      const looksCollegiate = teamTexts.some(t =>
        /university|college|umass|bradley|missouri|logan|duke|kentucky|gonzaga|villanova|auburn/i.test(t)
      );

      const headers: string[] = [];
      $(table).find('tr').first().find('th').each((_, th) => {
        headers.push($(th).text().trim().toLowerCase().replace(/[^a-z0-9%]/g, ''));
      });
      if (headers.length < 3) return;

      $(table).find('tr').slice(1).each((_, row) => {
        const cells: string[] = [];
        $(row).find('td, th').each((_, cell) => { cells.push($(cell).text().trim()); });
        if (cells.length < 3 || cells[0]?.toLowerCase() === 'career') return;

        const get = (keys: string[]): string => {
          for (const k of keys) {
            const idx = headers.findIndex(h => h.includes(k));
            if (idx >= 0 && idx < cells.length) return cells[idx];
          }
          return '';
        };

        const season = cells[0];
        const team = get(['team']) || cells[1] || '';
        if (!season) return;

        const n = (v: string) => parseFloat(v) || 0;
        const gp = n(get(['gp', 'g']));
        const collegiate = isCollege || looksCollegiate;

        result.seasonStats!.push({
          year: season, team,
          league: collegiate ? 'NCAA' : '',
          gamesPlayed: gp,
          minutes: Math.round(n(get(['min', 'mpg'])) * gp),
          ppg: n(get(['pts', 'ppg'])),
          rpg: n(get(['reb', 'rpg'])),
          apg: n(get(['ast', 'apg'])),
          spg: n(get(['stl', 'spg'])),
          bpg: n(get(['blk', 'bpg'])),
          fgPct: n(get(['fg'])) > 1 ? n(get(['fg'])) / 100 : n(get(['fg'])),
          threePct: n(get(['3p', '3pt'])) > 1 ? n(get(['3p', '3pt'])) / 100 : n(get(['3p', '3pt'])),
          ftPct: n(get(['ft'])) > 1 ? n(get(['ft'])) / 100 : n(get(['ft'])),
          isCollegiate: collegiate,
        });
      });
    });

    // Career history from wikitables
    $('table.wikitable').each((_, table) => {
      const ths = $(table).find('th').map((_, th) => $(th).text().trim().toLowerCase()).get();
      if (ths.some(h => h.includes('season') || h.includes('year')) && ths.some(h => h.includes('team'))) {
        $(table).find('tbody tr').each((_, row) => {
          const cells = $(row).find('td, th');
          if (cells.length >= 2) {
            const year = $(cells.eq(0)).text().trim();
            const team = $(cells.eq(1)).text().trim();
            if (year && team && !year.toLowerCase().includes('career')) {
              result.careerHistory!.push({ year, team, league: '' });
            }
          }
        });
      }
    });

    // Extract career history from article text (professional career subsections)
    const articleText = $('#mw-content-text .mw-parser-output').text();

    // Look for team mentions in h3 headings (Wikipedia career subsections)
    $('h3 .mw-headline, h3').each((_, heading) => {
      const text = $(heading).text().trim();
      // Pattern: "Team Name (Year)" or "Team Name (Year–present)"
      const teamMatch = text.match(/^(.+?)\s*\((\d{4}(?:[–-]\d{4}|[–-]present)?)\)/i);
      if (teamMatch) {
        const team = teamMatch[1].trim();
        const year = teamMatch[2].trim();
        // Skip college sections
        if (!/college|university|high school/i.test(team)) {
          result.careerHistory!.push({ year, team, league: '' });
        }
      }
    });

    // Extract CEBL records and achievements from text
    const ceblMatch = articleText.match(/CEBL[^.]*record[^.]*\./) ||
                      articleText.match(/Canadian Elite Basketball League[^.]*\./) ||
                      articleText.match(/Honey Badgers[^.]*\./);
    if (ceblMatch) {
      result.personalInfo!.push(ceblMatch[0]);
    }

    // ====== Extract awards/honors from Wikipedia ======
    // Awards are typically in a list under "Awards and honors", "Accolades", "Achievements" heading
    // or in the infobox. Also extract from inline article text.
    const awardsHeadings = ['awards', 'honors', 'accolades', 'achievements'];
    const extractedAwards: string[] = [];

    $('h2 .mw-headline, h2, h3 .mw-headline, h3').each((_, heading) => {
      const headingText = $(heading).text().trim().toLowerCase();
      if (!awardsHeadings.some(h => headingText.includes(h))) return;

      const headingTag = ($(heading).closest('h2').length > 0 || $(heading).prop('tagName')?.toLowerCase() === 'h2') ? 'h2' : 'h3';
      let sibling = $(heading).closest(headingTag).next();

      while (sibling.length > 0) {
        const tag = (sibling.prop('tagName') || '').toLowerCase();
        if (tag === 'h2' || (headingTag === 'h3' && tag === 'h3')) break;

        if (tag === 'ul' || tag === 'ol') {
          sibling.find('li').each((_, li) => {
            const award = $(li).text().replace(/\[\d+\]/g, '').trim();
            if (award.length > 5) extractedAwards.push(award);
          });
        }
        sibling = sibling.next();
      }
    });

    // Also check infobox for awards
    infobox.find('tr').each((_, row) => {
      const label = $(row).find('th').text().trim().toLowerCase();
      if (label.includes('award') || label.includes('honor') || label.includes('career highlight') || label.includes('accolade')) {
        $(row).find('td li, td').each((_, el) => {
          const text = $(el).text().replace(/\[\d+\]/g, '').trim();
          if (text.length > 5 && text.length < 200) {
            // Split on newlines for multi-award cells
            for (const line of text.split('\n')) {
              const trimmed = line.trim();
              if (trimmed.length > 5) extractedAwards.push(trimmed);
            }
          }
        });
      }
    });

    // Store extracted awards on the ScrapedPlayer for later use
    // We attach them as personalInfo prefixed with "AWARD:" for downstream processing
    for (const award of extractedAwards) {
      result.personalInfo!.push(`AWARD:${award}`);
    }

    // ====== Extract personal/early life/background sections ======
    // Look for dedicated Wikipedia sections with personal details
    const personalSectionHeadings = ['personal life', 'personal', 'early life', 'early years', 'background', 'high school', 'high school career', 'early career'];
    const sectionContent: string[] = [];

    $('h2 .mw-headline, h2, h3 .mw-headline, h3').each((_, heading) => {
      const headingText = $(heading).text().trim().toLowerCase();
      if (!personalSectionHeadings.some(h => headingText.includes(h))) return;

      // Collect all paragraphs until the next heading of same or higher level
      const headingTag = ($(heading).closest('h2').length > 0 || $(heading).prop('tagName')?.toLowerCase() === 'h2') ? 'h2' : 'h3';
      let sibling = $(heading).closest(headingTag).next();

      while (sibling.length > 0) {
        const tag = (sibling.prop('tagName') || '').toLowerCase();
        // Stop at next heading of same or higher level
        if (tag === 'h2' || (headingTag === 'h3' && tag === 'h3')) break;

        if (tag === 'p') {
          const text = sibling.text().trim();
          if (text.length > 30) {
            sectionContent.push(text);
          }
        }
        sibling = sibling.next();
      }
    });

    // Extract individual facts from personal section paragraphs
    const personalFacts: string[] = [];
    for (const para of sectionContent) {
      // Split paragraph into sentences
      const sentences = para.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
      for (const sentence of sentences) {
        const clean = sentence.replace(/\[\d+\]/g, '').trim();
        if (clean.length < 15) continue;
        // Skip citations-only or reference-like sentences
        if (/^\[/.test(clean)) continue;
        personalFacts.push(clean);
      }
    }

    // Also extract family info from the opening paragraphs (sometimes mentions parents/family)
    const openingParagraphs = $('#mw-content-text .mw-parser-output > p')
      .map((_, p) => $(p).text().trim()).get()
      .filter(t => t.length > 40)
      .slice(0, 3);

    for (const para of openingParagraphs) {
      const sentences = para.split(/(?<=[.!?])\s+/).filter(s => s.length > 15);
      for (const sentence of sentences) {
        const clean = sentence.replace(/\[\d+\]/g, '').trim();
        // Look for family-related sentences in opening paragraphs
        if (/\b(son of|daughter of|brother|sister|sibling|father|mother|parent|family|grew up|raised)\b/i.test(clean)) {
          personalFacts.push(clean);
        }
        // Look for high school mentions
        if (/\b(high school|prep school|academy)\b/i.test(clean) && /\b(named|selected|won|earned|star|all-|champion|award|mcdonald)/i.test(clean)) {
          personalFacts.push(clean);
        }
      }
    }

    // Deduplicate personal facts
    const seenFacts = new Set<string>();
    const uniqueFacts = personalFacts.filter(f => {
      const key = f.toLowerCase().slice(0, 60);
      if (seenFacts.has(key)) return false;
      seenFacts.add(key);
      return true;
    });

    // Prioritize personal facts over generic paragraphs
    if (uniqueFacts.length > 0) {
      result.personalInfo = [...(result.personalInfo || []), ...uniqueFacts];
    } else {
      // Fallback: use first few paragraphs as before
      const paragraphs = $('#mw-content-text .mw-parser-output > p')
        .map((_, p) => $(p).text().trim()).get()
        .filter(t => t.length > 40);
      result.personalInfo = [...(result.personalInfo || []), ...paragraphs.slice(0, 4)];
    }

  } catch {}
  return result;
}

// ====== EuroBasket PUBLIC profile (no login — bio only) ======

export async function scrapeEuroBasketPublic(playerName: string): Promise<Partial<ScrapedPlayer>> {
  const result: Partial<ScrapedPlayer> = { sources: [], seasonStats: [] };

  // Try DuckDuckGo to find the profile URL
  let profileUrl: string | null = null;
  try {
    const ddg = await fetchHTML(`https://html.duckduckgo.com/html/?q=site%3Abasketball.eurobasket.com+player+${encodeURIComponent(playerName)}`);
    if (ddg) {
      const uddg = ddg.match(/uddg=([^&"]+)/g);
      if (uddg) {
        for (const m of uddg) {
          const decoded = decodeURIComponent(m.replace('uddg=', ''));
          if (decoded.includes('basketball.eurobasket.com/player/') && decoded.match(/\/\d+/)) {
            profileUrl = decoded;
            break;
          }
        }
      }
      if (!profileUrl) {
        const direct = ddg.match(/basketball\.eurobasket\.com\/player\/[^\s"&<>]+\/\d+/g);
        if (direct?.[0]) profileUrl = `https://${direct[0]}`;
      }
    }
  } catch {}

  if (!profileUrl) return result;

  const html = await fetchHTML(profileUrl);
  if (!html) return result;

  result.sources = [profileUrl];
  const $ = cheerio.load(html);
  const bodyText = $('body').text();

  // Name
  const h1 = $('h1').first().text().trim().replace(/basketball profile/i, '').replace(/\s+/g, ' ').trim();
  if (h1) {
    result.fullName = h1 === h1.toUpperCase() && h1.length > 3
      ? h1.split(' ').map(w => /^(II|III|IV|JR|SR)$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      : h1;
  }

  // Bio from text patterns
  const bornMatch = bodyText.match(/born\s+(?:on\s+)?([A-Z][a-z]+ \d{1,2},?\s*\d{4})\s+in\s+([^.]+)/i);
  if (bornMatch) { result.birthdate = bornMatch[1].trim(); result.birthCity = bornMatch[2].trim(); }

  const htMatch = bodyText.match(/(\d+['']\d+[''"]?)\s*(?:\((\d+)\s*cm\))?/);
  if (htMatch) { result.height = htMatch[1].replace(/['']/g, "'").replace(/[""]/g, '"'); if (htMatch[2]) result.heightCm = htMatch[2]; }

  const wtMatch = bodyText.match(/([\d.]+)\s*lbs?\s*\(([\d.]+)\s*kg\)/i);
  if (wtMatch) { result.weight = wtMatch[1]; result.weightKg = wtMatch[2]; }
  else {
    const kgMatch = bodyText.match(/([\d.]+)\s*kg/i);
    if (kgMatch) { result.weightKg = kgMatch[1]; result.weight = (parseFloat(kgMatch[1]) * 2.205).toFixed(0); }
  }

  const posMatch = bodyText.match(/(?:\d+['']\d+[''"]?\s+)(guard|forward|center|point guard|shooting guard|small forward|power forward)/i);
  if (posMatch) result.position = posMatch[1].charAt(0).toUpperCase() + posMatch[1].slice(1);

  const collegeMatch = bodyText.match(/(?:University|College)\s+(?:of\s+)?[\w\s]+/i);
  if (collegeMatch) result.college = collegeMatch[0].trim();

  if (bodyText.match(/\bUSA\b|United States/)) result.nationality = 'USA';
  else if (bodyText.match(/\bCanad/i)) result.nationality = 'Canada';

  // Current season stats from Summary table (always public)
  for (let i = 0; i < $('table').length; i++) {
    const table = $('table').eq(i);
    if (table.find('tr').first().text().trim() !== 'Summary') continue;

    table.find('tr').each((_, row) => {
      const cells: string[] = [];
      $(row).find('td').each((_, c) => { cells.push($(c).text().trim()); });
      if (cells.length < 15 || cells[0] === 'Team' || cells[0] === 'AVERAGES') return;

      const team = cells[0];
      const gp = parseFloat(cells[1]) || 0;
      if (!team || !gp) return;

      const parseMadeAtt = (v: string) => { const m = v.match(/(\d+)-(\d+)/); return m ? [parseInt(m[1]), parseInt(m[2])] : [0, 0]; };
      const [twoM, twoA] = parseMadeAtt(cells[4]);
      const [threeM, threeA] = parseMadeAtt(cells[5]);
      const [ftM, ftA] = parseMadeAtt(cells[6]);
      const g = gp || 1;

      result.seasonStats!.push({
        year: 'Current', team, league: '',
        gamesPlayed: gp, minutes: parseFloat(cells[2]) || 0,
        ppg: (parseFloat(cells[3]) || 0) / g,
        rpg: (parseFloat(cells[9]) || 0) / g,
        apg: (parseFloat(cells[10]) || 0) / g,
        spg: (parseFloat(cells[13]) || 0) / g,
        bpg: (parseFloat(cells[12]) || 0) / g,
        fgPct: twoA > 0 ? twoM / twoA : 0,
        threePct: threeA > 0 ? threeM / threeA : 0,
        ftPct: ftA > 0 ? ftM / ftA : 0,
        totalPoints: parseFloat(cells[3]) || 0,
        totalRebounds: parseFloat(cells[9]) || 0,
        totalAssists: parseFloat(cells[10]) || 0,
        totalSteals: parseFloat(cells[13]) || 0,
        totalBlocks: parseFloat(cells[12]) || 0,
        twoFgMade: twoM, twoFgAttempted: twoA,
        threeFgMade: threeM, threeFgAttempted: threeA,
        ftMade: ftM, ftAttempted: ftA,
        offRebounds: parseFloat(cells[7]) || 0,
        defRebounds: parseFloat(cells[8]) || 0,
        personalFouls: parseFloat(cells[11]) || 0,
        turnovers: parseFloat(cells[14]) || 0,
      });
    });
    break;
  }

  return result;
}

// ====== Game Log Fetching + Highlight Generation ======

const MONTHS_SHORT: Record<string, string> = {
  JAN: 'January', FEB: 'February', MAR: 'March', APR: 'April',
  MAY: 'May', JUN: 'June', JUL: 'July', AUG: 'August',
  SEP: 'September', OCT: 'October', NOV: 'November', DEC: 'December',
};

/**
 * Format a matchup string like "SLC vs. SBL" into a readable "vs. South Bay Lakers"
 */
function formatMatchup(matchup: string, teams: Record<string, string>): string {
  // matchup looks like "SLC vs. SBL" or "SLC @ AUS"
  const parts = matchup.split(/\s+(vs\.|@)\s+/);
  if (parts.length >= 3) {
    const opponentAbbr = parts[2].trim();
    const opponentName = teams[opponentAbbr] || opponentAbbr;
    const atVs = parts[1] === '@' ? 'at' : 'vs.';
    return `${atVs} ${opponentName}`;
  }
  return matchup;
}

/**
 * Format a game date like "JAN 15, 2025" or "2025-01-15T00:00:00" into "January 15"
 */
function formatGameDate(dateStr: string): string {
  // Handle ISO format: "2025-01-15T00:00:00"
  if (dateStr.includes('-') && dateStr.length >= 10) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[d.getMonth()]} ${d.getDate()}`;
    }
  }
  // Handle "JAN 15, 2025" or "Mar 24, 2026" format
  const m = dateStr.match(/([A-Za-z]{3})\s+(\d{1,2})/);
  if (m) return `${MONTHS_SHORT[m[1].toUpperCase()] || m[1]} ${parseInt(m[2])}`;
  return dateStr;
}

/**
 * Determine if a game qualifies as a "top game" worth highlighting.
 * Prioritizes: triple-doubles > double-doubles > high points > notable all-around games
 */
function scoreGame(g: GameLogEntry): number {
  let score = 0;
  const doubleCategories = [g.pts >= 10, g.reb >= 10, g.ast >= 10, g.stl >= 5, g.blk >= 5].filter(Boolean).length;
  if (doubleCategories >= 3) score += 500; // triple-double
  if (doubleCategories >= 2) score += 200; // double-double
  score += g.pts * 3; // weight points heavily
  score += g.reb * 2;
  score += g.ast * 2;
  score += g.stl * 5;
  score += g.blk * 5;
  // Efficiency bonus: high FG% on volume
  if (g.fga >= 10 && g.fgm / g.fga >= 0.6) score += 30;
  if (g.pts >= 30) score += 50;
  if (g.pts >= 25) score += 25;
  return score;
}

/**
 * Build a human-readable highlight string from a game log entry.
 * Format: "Scored 28 points on 11-for-16 shooting with eight rebounds and five assists January 15 vs. Agua Caliente"
 */
function buildHighlightString(g: GameLogEntry, teamLookup: Record<string, string>): string {
  const parts: string[] = [];
  const doubleCategories = [g.pts >= 10, g.reb >= 10, g.ast >= 10].filter(Boolean).length;

  // Lead verb variety
  const leadVerbs = ['Scored', 'Poured in', 'Dropped', 'Put up', 'Registered', 'Had'];
  const verb = g.pts >= 25 ? (g.pts >= 30 ? 'Poured in' : 'Dropped') :
    doubleCategories >= 2 ? 'Registered' : leadVerbs[g.pts % leadVerbs.length];

  // Points + shooting
  if (doubleCategories >= 3) {
    parts.push(`Recorded a triple-double with ${g.pts} points, ${g.reb} rebounds, and ${g.ast} assists on ${g.fgm}-for-${g.fga} shooting`);
  } else if (doubleCategories >= 2 && g.pts >= 10 && g.reb >= 10) {
    parts.push(`${verb} a double-double with ${g.pts} points and ${g.reb} rebounds on ${g.fgm}-for-${g.fga} shooting`);
    if (g.ast >= 3) parts.push(`${g.ast} assists`);
  } else if (doubleCategories >= 2 && g.pts >= 10 && g.ast >= 10) {
    parts.push(`${verb} a double-double with ${g.pts} points and ${g.ast} assists on ${g.fgm}-for-${g.fga} shooting`);
    if (g.reb >= 3) parts.push(`${g.reb} rebounds`);
  } else {
    parts.push(`${verb} ${g.pts} points on ${g.fgm}-for-${g.fga} shooting`);
    if (g.reb >= 4) parts.push(`${g.reb} rebounds`);
    if (g.ast >= 3) parts.push(`${g.ast} assists`);
  }

  if (g.stl >= 2) parts.push(`${g.stl} steals`);
  if (g.blk >= 2) parts.push(`${g.blk} blocks`);

  // Three-pointers if notable
  if (g.fg3m >= 3) parts.push(`${g.fg3m}-for-${g.fg3a} from three`);
  // Free throws if notable
  if (g.ftm >= 5) parts.push(`${g.ftm} made free throws`);

  // Combine with natural language
  let text: string;
  if (parts.length === 1) {
    text = parts[0];
  } else if (parts.length === 2) {
    text = `${parts[0]} as well as ${parts[1]}`;
  } else {
    // Join secondary stats: "X as well as A, B, and C"
    const primary = parts[0];
    const secondary = parts.slice(1);
    if (secondary.length === 1) {
      text = `${primary} as well as ${secondary[0]}`;
    } else if (secondary.length === 2) {
      text = `${primary} as well as ${secondary[0]} and ${secondary[1]}`;
    } else {
      text = `${primary} as well as ${secondary.slice(0, -1).join(', ')}, and ${secondary[secondary.length - 1]}`;
    }
  }

  // Add minutes, date, opponent
  text += ` in ${Math.round(g.min)} minutes`;
  text += ` ${formatGameDate(g.date)} ${formatMatchup(g.matchup, teamLookup)}`;

  return text;
}

/**
 * Fetch game logs from NBA/G-League API and generate top 3-5 highlights per season.
 */
async function fetchGameLogs(
  playerId: number,
  leagueId: string,
  referer: string,
  teamLookup: Record<string, string>,
  seasons: SeasonStat[],
): Promise<void> {
  for (const season of seasons) {
    try {
      // Extract the season year format the API expects (e.g., "2024-25")
      const seasonYear = season.year;
      const url = leagueId === '20'
        ? `https://stats.gleague.nba.com/stats/playergamelog?PlayerID=${playerId}&Season=${seasonYear}&SeasonType=Regular+Season&LeagueID=${leagueId}`
        : `https://stats.nba.com/stats/playergamelog?PlayerID=${playerId}&Season=${seasonYear}&SeasonType=Regular+Season&LeagueID=${leagueId}`;

      const data = await fetchJSON(url, referer) as NBAApiResponse | null;
      if (!data?.resultSets?.[0]) continue;

      const rs = data.resultSets[0];
      const h = rs.headers;
      const gi = (name: string) => h.indexOf(name);

      const games: GameLogEntry[] = [];
      for (const row of rs.rowSet) {
        const g = (name: string): number => {
          const idx = gi(name);
          return idx >= 0 ? (Number(row[idx]) || 0) : 0;
        };
        const gs = (name: string): string => {
          const idx = gi(name);
          return idx >= 0 ? String(row[idx] || '') : '';
        };

        games.push({
          date: gs('GAME_DATE'),
          matchup: gs('MATCHUP'),
          pts: g('PTS'),
          reb: g('REB'),
          ast: g('AST'),
          stl: g('STL'),
          blk: g('BLK'),
          fgm: g('FGM'),
          fga: g('FGA'),
          fg3m: g('FG3M'),
          fg3a: g('FG3A'),
          ftm: g('FTM'),
          fta: g('FTA'),
          min: g('MIN'),
          wl: gs('WL'),
        });
      }

      if (games.length === 0) continue;

      // Score and rank games, pick top 3-5
      const scoredGames = games.map(g => ({ game: g, score: scoreGame(g) }));
      scoredGames.sort((a, b) => b.score - a.score);

      // Take top 3-5 depending on how many standout games there are
      const threshold = scoredGames[0]?.score * 0.4 || 0;
      const topGames = scoredGames
        .filter(sg => sg.score >= threshold && sg.score > 30)
        .slice(0, 5);

      if (topGames.length > 0) {
        season.highlights = topGames.map(sg => buildHighlightString(sg.game, teamLookup));
      }
    } catch {
      // Game log fetch failed for this season — skip silently
    }
  }
}

// ====== NBA G-League Stats API (RELIABLE — works from cloud) ======

// G-League team abbreviation -> full name mapping
const GLEAGUE_TEAMS: Record<string, string> = {
  SBL: 'South Bay Lakers', SLC: 'Salt Lake City Stars', AUS: 'Austin Spurs',
  RGV: 'Rio Grande Valley Vipers', SCW: 'Santa Cruz Warriors', DEL: 'Delaware Blue Coats',
  WIS: 'Wisconsin Herd', MNE: 'Maine Celtics', CAP: 'Capital City Go-Go',
  BHM: 'Birmingham Squadron', RIP: 'Rip City Remix', IGN: 'Ignite',
  STO: 'Stockton Kings', GRD: 'Grand Rapids Gold', FWM: 'Fort Wayne Mad Ants',
  IWA: 'Iowa Wolves', MEM: 'Memphis Hustle', OKL: 'Oklahoma City Blue',
  OSH: 'Osceola Magic', TEX: 'Texas Legends', WES: 'Westchester Knicks',
  LIN: 'Long Island Nets', CLE: 'Cleveland Charge', GBO: 'Greensboro Swarm',
  SKY: 'Sioux Falls Skyforce', WIN: 'Windy City Bulls', MXC: 'Mexico City Capitanes',
  MCC: 'Motor City Cruise', RCR: 'Raptors 905', VAL: 'Valley Suns',
  SDS: 'San Diego Clippers', IND: 'Indiana Mad Ants', LAK: 'Lakeland Magic',
  NAZ: 'Northern Arizona Suns', ACC: 'College Park Skyhawks',
};

interface NBAApiResponse {
  resultSets: {
    name: string;
    headers: string[];
    rowSet: (string | number | null)[][];
  }[];
}

export async function scrapeGLeague(playerName: string): Promise<Partial<ScrapedPlayer>> {
  const result: Partial<ScrapedPlayer> = { sources: [], seasonStats: [], careerHistory: [] };

  try {
    // Step 1: Search for the player in the G-League player list
    const allPlayersUrl = 'https://stats.gleague.nba.com/stats/commonallplayers?LeagueID=20&Season=2024-25&IsOnlyCurrentSeason=0';
    const data = await fetchJSON(allPlayersUrl, 'https://gleague.nba.com') as NBAApiResponse | null;
    if (!data?.resultSets?.[0]) return result;

    const rs = data.resultSets[0];
    const headers = rs.headers;
    const nameIdx = headers.indexOf('DISPLAY_FIRST_LAST');
    const idIdx = headers.indexOf('PERSON_ID');

    if (nameIdx < 0 || idIdx < 0) return result;

    // Find matching player (fuzzy match)
    const searchLower = playerName.toLowerCase().replace(/[^a-z\s]/g, '');
    let playerId: number | null = null;
    let matchedName = '';

    for (const row of rs.rowSet) {
      const name = String(row[nameIdx]).toLowerCase().replace(/[^a-z\s]/g, '');
      if (name === searchLower || name.includes(searchLower) || searchLower.includes(name)) {
        playerId = Number(row[idIdx]);
        matchedName = String(row[nameIdx]);
        break;
      }
    }

    // Try splitting and matching parts
    if (!playerId) {
      const parts = searchLower.split(/\s+/);
      for (const row of rs.rowSet) {
        const name = String(row[nameIdx]).toLowerCase();
        if (parts.every(p => name.includes(p))) {
          playerId = Number(row[idIdx]);
          matchedName = String(row[nameIdx]);
          break;
        }
      }
    }

    // Fuzzy fallback: tolerate small typos (e.g. "Noley" vs "Nolley")
    // Levenshtein distance ≤ 2 per token; require first + last name alignment
    if (!playerId) {
      const suffixes = new Set(['ii', 'iii', 'iv', 'jr', 'sr', 'v']);
      const qTokens = searchLower.split(/\s+/).filter(t => t.length > 1);
      const qCore = qTokens.filter(t => !suffixes.has(t));
      if (qCore.length >= 2) {
        const editDist = (a: string, b: string): number => {
          if (a === b) return 0;
          if (!a.length) return b.length;
          if (!b.length) return a.length;
          const prev: number[] = new Array(b.length + 1);
          const curr: number[] = new Array(b.length + 1);
          for (let j = 0; j <= b.length; j++) prev[j] = j;
          for (let i = 1; i <= a.length; i++) {
            curr[0] = i;
            for (let j = 1; j <= b.length; j++) {
              const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
              curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
            }
            for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
          }
          return prev[b.length];
        };
        const matches = (a: string, b: string): boolean => {
          if (a === b) return true;
          const minLen = Math.min(a.length, b.length);
          if (minLen >= 4 && (a.startsWith(b) || b.startsWith(a))) return true;
          return editDist(a, b) <= (minLen <= 5 ? 1 : 2);
        };

        let bestRow: { id: number; name: string; score: number } | null = null;
        for (const row of rs.rowSet) {
          const rawName = String(row[nameIdx]).toLowerCase();
          const cTokens = rawName.split(/\s+/).filter(t => t.length > 1);
          const cCore = cTokens.filter(t => !suffixes.has(t));
          if (cCore.length < 2) continue;
          // Require first AND last to fuzzy-match
          const firstOk = matches(qCore[0], cCore[0]);
          const lastOk = matches(qCore[qCore.length - 1], cCore[cCore.length - 1]);
          if (!firstOk || !lastOk) continue;
          const score = -(editDist(qCore[0], cCore[0]) + editDist(qCore[qCore.length - 1], cCore[cCore.length - 1]));
          if (!bestRow || score > bestRow.score) {
            bestRow = { id: Number(row[idIdx]), name: String(row[nameIdx]), score };
          }
        }
        if (bestRow) {
          playerId = bestRow.id;
          matchedName = bestRow.name;
        }
      }
    }

    if (!playerId) return result;

    result.fullName = matchedName;
    result.sources = [`https://gleague.nba.com/player/${matchedName.replace(/\s+/g, '-').toLowerCase()}`];

    // Step 2: Get career stats
    const careerUrl = `https://stats.gleague.nba.com/stats/playercareerstats?LeagueID=20&PerMode=PerGame&PlayerID=${playerId}`;
    const careerData = await fetchJSON(careerUrl, 'https://gleague.nba.com') as NBAApiResponse | null;
    if (!careerData?.resultSets) return result;

    // Process regular season stats
    for (const rs2 of careerData.resultSets) {
      if (rs2.name !== 'SeasonTotalsRegularSeason') continue;

      const h = rs2.headers;
      const gi = (name: string) => h.indexOf(name);

      for (const row of rs2.rowSet) {
        const g = (name: string): number => {
          const idx = gi(name);
          return idx >= 0 ? (Number(row[idx]) || 0) : 0;
        };
        const gs = (name: string): string => {
          const idx = gi(name);
          return idx >= 0 ? String(row[idx] || '') : '';
        };

        const season = gs('SEASON_ID');
        const teamAbbr = gs('TEAM_ABBREVIATION');
        const teamName = GLEAGUE_TEAMS[teamAbbr] || teamAbbr;
        const gp = g('GP');
        if (!season || !gp) continue;

        const fgm = g('FGM');
        const fga = g('FGA');
        const fg3m = g('FG3M');
        const fg3a = g('FG3A');
        const ftm = g('FTM');
        const fta = g('FTA');

        // Derive 2FG from total FG - 3FG (per game values, multiply by GP for totals)
        const twoFgMade = Math.round((fgm - fg3m) * gp);
        const twoFgAttempted = Math.round((fga - fg3a) * gp);

        result.seasonStats!.push({
          year: season, team: teamName, league: 'NBA G League',
          gamesPlayed: gp,
          minutes: Math.round(g('MIN') * gp),
          ppg: g('PTS'),
          rpg: g('REB'),
          apg: g('AST'),
          spg: g('STL'),
          bpg: g('BLK'),
          fgPct: g('FG_PCT'),
          threePct: g('FG3_PCT'),
          ftPct: g('FT_PCT'),
          totalPoints: Math.round(g('PTS') * gp),
          totalRebounds: Math.round(g('REB') * gp),
          totalAssists: Math.round(g('AST') * gp),
          totalSteals: Math.round(g('STL') * gp),
          totalBlocks: Math.round(g('BLK') * gp),
          twoFgMade, twoFgAttempted,
          threeFgMade: Math.round(fg3m * gp),
          threeFgAttempted: Math.round(fg3a * gp),
          ftMade: Math.round(ftm * gp),
          ftAttempted: Math.round(fta * gp),
          offRebounds: Math.round(g('OREB') * gp),
          defRebounds: Math.round(g('DREB') * gp),
          personalFouls: Math.round(g('PF') * gp),
          turnovers: Math.round(g('TOV') * gp),
          isCollegiate: false,
        });

        result.careerHistory!.push({ year: season, team: teamName, league: 'NBA G League' });
      }
    }

    // Also get Showcase Cup stats
    for (const rs2 of careerData.resultSets) {
      if (rs2.name !== 'SeasonTotalsShowcaseSeason') continue;

      const h = rs2.headers;
      const gi = (name: string) => h.indexOf(name);

      for (const row of rs2.rowSet) {
        const g = (name: string): number => {
          const idx = gi(name);
          return idx >= 0 ? (Number(row[idx]) || 0) : 0;
        };
        const gs = (name: string): string => {
          const idx = gi(name);
          return idx >= 0 ? String(row[idx] || '') : '';
        };

        const season = gs('SEASON_ID');
        const teamAbbr = gs('TEAM_ABBREVIATION');
        const teamName = GLEAGUE_TEAMS[teamAbbr] || teamAbbr;
        const gp = g('GP');
        if (!season || !gp) continue;

        const fgm = g('FGM');
        const fga = g('FGA');
        const fg3m = g('FG3M');
        const fg3a = g('FG3A');
        const ftm = g('FTM');
        const fta = g('FTA');
        const twoFgMade = Math.round((fgm - fg3m) * gp);
        const twoFgAttempted = Math.round((fga - fg3a) * gp);

        result.seasonStats!.push({
          year: `${season} SC`, team: teamName, league: 'NBA G League Showcase',
          gamesPlayed: gp,
          minutes: Math.round(g('MIN') * gp),
          ppg: g('PTS'),
          rpg: g('REB'),
          apg: g('AST'),
          spg: g('STL'),
          bpg: g('BLK'),
          fgPct: g('FG_PCT'),
          threePct: g('FG3_PCT'),
          ftPct: g('FT_PCT'),
          totalPoints: Math.round(g('PTS') * gp),
          totalRebounds: Math.round(g('REB') * gp),
          totalAssists: Math.round(g('AST') * gp),
          totalSteals: Math.round(g('STL') * gp),
          totalBlocks: Math.round(g('BLK') * gp),
          twoFgMade, twoFgAttempted,
          threeFgMade: Math.round(fg3m * gp),
          threeFgAttempted: Math.round(fg3a * gp),
          ftMade: Math.round(ftm * gp),
          ftAttempted: Math.round(fta * gp),
          offRebounds: Math.round(g('OREB') * gp),
          defRebounds: Math.round(g('DREB') * gp),
          personalFouls: Math.round(g('PF') * gp),
          turnovers: Math.round(g('TOV') * gp),
          isCollegiate: false,
        });
      }
    }

    // Get player bio info
    const playerInfoUrl = `https://stats.gleague.nba.com/stats/commonplayerinfo?LeagueID=20&PlayerID=${playerId}`;
    const playerInfo = await fetchJSON(playerInfoUrl, 'https://gleague.nba.com') as NBAApiResponse | null;
    if (playerInfo?.resultSets?.[0]?.rowSet?.[0]) {
      const infoHeaders = playerInfo.resultSets[0].headers;
      const infoRow = playerInfo.resultSets[0].rowSet[0];
      const getInfo = (name: string): string => {
        const idx = infoHeaders.indexOf(name);
        return idx >= 0 ? String(infoRow[idx] || '') : '';
      };

      const heightRaw = getInfo('HEIGHT');
      if (heightRaw && heightRaw.includes('-')) {
        const [ft, inches] = heightRaw.split('-');
        result.height = `${ft}'${inches}"`;
        const cm = Math.round((parseInt(ft) * 12 + parseInt(inches)) * 2.54);
        result.heightCm = cm.toString();
      }
      const weightRaw = getInfo('WEIGHT');
      if (weightRaw) {
        result.weight = weightRaw;
        result.weightKg = Math.round(parseInt(weightRaw) / 2.205).toString();
      }
      const pos = getInfo('POSITION');
      if (pos) result.position = pos;

      const birthdate = getInfo('BIRTHDATE');
      if (birthdate) {
        const d = new Date(birthdate);
        if (!isNaN(d.getTime())) {
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          result.birthdate = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        }
      }

      const country = getInfo('COUNTRY');
      if (country) result.nationality = country;

      const school = getInfo('SCHOOL');
      if (school) result.college = school;
    }

    // Step 4: Fetch game logs for each season to generate top game highlights
    const regularSeasons = result.seasonStats!.filter(s => !s.year.includes('SC'));
    await fetchGameLogs(playerId, '20', 'https://gleague.nba.com', GLEAGUE_TEAMS, regularSeasons);

  } catch {}

  return result;
}

// ====== NBA Stats API (for players with NBA experience) ======

export async function scrapeNBA(playerName: string): Promise<Partial<ScrapedPlayer>> {
  const result: Partial<ScrapedPlayer> = { sources: [], seasonStats: [], careerHistory: [] };

  try {
    const allPlayersUrl = 'https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2024-25&IsOnlyCurrentSeason=0';
    const data = await fetchJSON(allPlayersUrl, 'https://www.nba.com') as NBAApiResponse | null;
    if (!data?.resultSets?.[0]) return result;

    const rs = data.resultSets[0];
    const headers = rs.headers;
    const nameIdx = headers.indexOf('DISPLAY_FIRST_LAST');
    const idIdx = headers.indexOf('PERSON_ID');

    if (nameIdx < 0 || idIdx < 0) return result;

    const searchLower = playerName.toLowerCase().replace(/[^a-z\s]/g, '');
    let playerId: number | null = null;

    for (const row of rs.rowSet) {
      const name = String(row[nameIdx]).toLowerCase().replace(/[^a-z\s]/g, '');
      if (name === searchLower) {
        playerId = Number(row[idIdx]);
        break;
      }
    }

    if (!playerId) {
      const parts = searchLower.split(/\s+/);
      for (const row of rs.rowSet) {
        const name = String(row[nameIdx]).toLowerCase();
        if (parts.every(p => name.includes(p))) {
          playerId = Number(row[idIdx]);
          break;
        }
      }
    }

    if (!playerId) return result;

    result.sources = [`https://www.nba.com/player/${playerId}`];

    const careerUrl = `https://stats.nba.com/stats/playercareerstats?LeagueID=00&PerMode=PerGame&PlayerID=${playerId}`;
    const careerData = await fetchJSON(careerUrl, 'https://www.nba.com') as NBAApiResponse | null;
    if (!careerData?.resultSets) return result;

    for (const rs2 of careerData.resultSets) {
      if (rs2.name !== 'SeasonTotalsRegularSeason') continue;

      const h = rs2.headers;
      const gi = (name: string) => h.indexOf(name);

      for (const row of rs2.rowSet) {
        const g = (name: string): number => {
          const idx = gi(name);
          return idx >= 0 ? (Number(row[idx]) || 0) : 0;
        };
        const gs = (name: string): string => {
          const idx = gi(name);
          return idx >= 0 ? String(row[idx] || '') : '';
        };

        const season = gs('SEASON_ID');
        const teamAbbr = gs('TEAM_ABBREVIATION');
        const gp = g('GP');
        if (!season || !gp) continue;

        const fgm = g('FGM');
        const fga = g('FGA');
        const fg3m = g('FG3M');
        const fg3a = g('FG3A');
        const ftm = g('FTM');
        const fta = g('FTA');

        result.seasonStats!.push({
          year: season, team: teamAbbr, league: 'NBA',
          gamesPlayed: gp,
          minutes: Math.round(g('MIN') * gp),
          ppg: g('PTS'),
          rpg: g('REB'),
          apg: g('AST'),
          spg: g('STL'),
          bpg: g('BLK'),
          fgPct: g('FG_PCT'),
          threePct: g('FG3_PCT'),
          ftPct: g('FT_PCT'),
          totalPoints: Math.round(g('PTS') * gp),
          totalRebounds: Math.round(g('REB') * gp),
          totalAssists: Math.round(g('AST') * gp),
          totalSteals: Math.round(g('STL') * gp),
          totalBlocks: Math.round(g('BLK') * gp),
          twoFgMade: Math.round((fgm - fg3m) * gp),
          twoFgAttempted: Math.round((fga - fg3a) * gp),
          threeFgMade: Math.round(fg3m * gp),
          threeFgAttempted: Math.round(fg3a * gp),
          ftMade: Math.round(ftm * gp),
          ftAttempted: Math.round(fta * gp),
          offRebounds: Math.round(g('OREB') * gp),
          defRebounds: Math.round(g('DREB') * gp),
          personalFouls: Math.round(g('PF') * gp),
          turnovers: Math.round(g('TOV') * gp),
          isCollegiate: false,
        });

        result.careerHistory!.push({ year: season, team: teamAbbr, league: 'NBA' });
      }
    }

    // Fetch game logs for NBA seasons
    const NBA_TEAMS: Record<string, string> = {
      ATL: 'Atlanta Hawks', BOS: 'Boston Celtics', BKN: 'Brooklyn Nets', CHA: 'Charlotte Hornets',
      CHI: 'Chicago Bulls', CLE: 'Cleveland Cavaliers', DAL: 'Dallas Mavericks', DEN: 'Denver Nuggets',
      DET: 'Detroit Pistons', GSW: 'Golden State Warriors', HOU: 'Houston Rockets', IND: 'Indiana Pacers',
      LAC: 'LA Clippers', LAL: 'Los Angeles Lakers', MEM: 'Memphis Grizzlies', MIA: 'Miami Heat',
      MIL: 'Milwaukee Bucks', MIN: 'Minnesota Timberwolves', NOP: 'New Orleans Pelicans', NYK: 'New York Knicks',
      OKC: 'Oklahoma City Thunder', ORL: 'Orlando Magic', PHI: 'Philadelphia 76ers', PHX: 'Phoenix Suns',
      POR: 'Portland Trail Blazers', SAC: 'Sacramento Kings', SAS: 'San Antonio Spurs', TOR: 'Toronto Raptors',
      UTA: 'Utah Jazz', WAS: 'Washington Wizards',
    };
    await fetchGameLogs(playerId, '00', 'https://www.nba.com', NBA_TEAMS, result.seasonStats!);

  } catch {}

  return result;
}

// ====== Master orchestrator ======

function normalizeStatKey(year: string, team: string): string {
  return `${year.replace(/\u2013/g, '-').replace(/^20(\d\d)/, '$1').replace(/['–]/g, '-').toLowerCase().replace(/\s+sc$/,'')}|${team.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 8)}`;
}

export async function researchPlayer(playerName: string): Promise<ScrapedPlayer> {
  // Run all scrapers in parallel for speed
  const [wiki, euroBasket, gLeague, nba] = await Promise.all([
    scrapeWikipedia(playerName).catch(() => ({} as Partial<ScrapedPlayer>)),
    scrapeEuroBasketPublic(playerName).catch(() => ({} as Partial<ScrapedPlayer>)),
    scrapeGLeague(playerName).catch(() => ({} as Partial<ScrapedPlayer>)),
    scrapeNBA(playerName).catch(() => ({} as Partial<ScrapedPlayer>)),
  ]);

  // Combine all sources in priority order (G-League API first for stats, Wikipedia for bio)
  const allPartials = [gLeague, nba, euroBasket, wiki];

  // Merge stats from all sources
  const allStats = allPartials.flatMap(p => p.seasonStats || []);

  // Deduplicate stats, keeping the entry with more data
  const statMap = new Map<string, SeasonStat>();
  for (const s of allStats) {
    const key = normalizeStatKey(s.year, s.team);
    const existing = statMap.get(key);
    if (!existing) {
      statMap.set(key, s);
    } else {
      const countFields = (st: SeasonStat) =>
        (st.ppg > 0 ? 1 : 0) + (st.rpg > 0 ? 1 : 0) + (st.apg > 0 ? 1 : 0) +
        (st.spg > 0 ? 1 : 0) + (st.bpg > 0 ? 1 : 0) + (st.fgPct > 0 ? 1 : 0) +
        (st.gamesPlayed > 0 ? 1 : 0) + (st.minutes > 0 ? 1 : 0) + (st.league ? 1 : 0) +
        (st.totalPoints ? 1 : 0) + (st.twoFgMade ? 1 : 0);
      if (countFields(s) > countFields(existing)) {
        statMap.set(key, s);
      }
    }
  }
  const dedupedStats = Array.from(statMap.values());

  // Combine career histories
  const allCareerHistory = allPartials.flatMap(p => p.careerHistory || []);
  const seenCareer = new Set<string>();
  const dedupedCareer = allCareerHistory.filter(c => {
    const key = normalizeStatKey(c.year, c.team);
    if (seenCareer.has(key)) return false;
    seenCareer.add(key);
    return true;
  });

  // Pick best bio data from all sources (first non-empty wins)
  const pick = <K extends keyof ScrapedPlayer>(field: K): ScrapedPlayer[K] => {
    for (const p of allPartials) {
      const v = p[field];
      if (v && (typeof v !== 'string' || v.length > 0)) return v as ScrapedPlayer[K];
    }
    return '' as ScrapedPlayer[K];
  };

  // For bio fields, prefer Wikipedia (more complete) but fall back to G-League API
  const bioPartials = [wiki, gLeague, nba, euroBasket];
  const pickBio = <K extends keyof ScrapedPlayer>(field: K): ScrapedPlayer[K] => {
    for (const p of bioPartials) {
      const v = p[field];
      if (v && (typeof v !== 'string' || v.length > 0)) return v as ScrapedPlayer[K];
    }
    return '' as ScrapedPlayer[K];
  };

  return {
    fullName: pickBio('fullName') || playerName,
    birthdate: pickBio('birthdate') as string,
    birthCity: pickBio('birthCity') as string,
    height: pickBio('height') as string,
    heightCm: pickBio('heightCm') as string,
    weight: pickBio('weight') as string,
    weightKg: pickBio('weightKg') as string,
    position: pickBio('position') as string,
    nationality: pickBio('nationality') as string,
    college: pickBio('college') as string,
    highSchool: pickBio('highSchool') as string,
    currentTeam: pick('currentTeam') as string,
    currentLeague: pick('currentLeague') as string,
    careerHistory: dedupedCareer,
    seasonStats: dedupedStats,
    personalInfo: wiki.personalInfo || [],
    sources: allPartials.flatMap(p => p.sources || []),
  };
}
