const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const axios = require("axios");
const cheerio = require("cheerio");

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

// Session state
let sessionCookies = null;
let isLoggedIn = false;

// --- EuroBasket HTTP helpers ---

async function login(email, password) {
  try {
    const resp = await axios.post(
      "https://www.eurobasket.com/news_system/ndverifikacijasub.aspx",
      `email=${encodeURIComponent(email)}&pwd=${encodeURIComponent(password)}&B1=Login&Referal=`,
      {
        headers: {
          "User-Agent": USER_AGENT,
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: "https://www.eurobasket.com/news_system/login.aspx",
        },
        maxRedirects: 0,
        validateStatus: (s) => true,
        timeout: 15000,
      }
    );

    const setCookies = resp.headers["set-cookie"] || [];
    if (setCookies.length > 0) {
      sessionCookies = setCookies.map((c) => c.split(";")[0]).join("; ");
      isLoggedIn = true;
      return { success: true, message: "Logged in successfully" };
    }
    return { success: false, message: "No cookies returned" };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

async function fetchPage(url) {
  const headers = { "User-Agent": USER_AGENT };
  if (sessionCookies) headers["Cookie"] = sessionCookies;
  const resp = await axios.get(url, { headers, timeout: 15000 });
  return resp.data;
}

// --- Player search ---

async function searchPlayer(name) {
  // Try direct URL pattern
  const slug = name.replace(/\s+/g, "-");
  const directUrl = `https://basketball.eurobasket.com/player/${slug}`;
  try {
    const html = await fetchPage(directUrl);
    if (html && html.includes(name.split(" ")[0])) {
      // Extract player ID from page
      const idMatch = html.match(/playerid[=:](\d+)/i) || html.match(/\/player\/[^/]+\/(\d+)/);
      return {
        url: directUrl,
        playerId: idMatch ? idMatch[1] : null,
        found: true,
      };
    }
  } catch {}

  // Try search
  try {
    const searchUrl = `https://basketball.eurobasket.com/search/search-results.asp?search=${encodeURIComponent(name)}`;
    const html = await fetchPage(searchUrl);
    const $ = cheerio.load(html);
    let found = null;
    $("a").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (href.includes("/player/") && !found) {
        found = href.startsWith("http") ? href : `https://basketball.eurobasket.com${href}`;
      }
    });
    if (found) {
      const idMatch = found.match(/\/(\d+)$/);
      return { url: found, playerId: idMatch ? idMatch[1] : null, found: true };
    }
  } catch {}

  return { url: null, playerId: null, found: false };
}

// --- Parse player profile ---

function parsePlayerProfile(html) {
  const $ = cheerio.load(html);
  const bodyText = $("body").text();

  const profile = {};

  // Name from h1
  const h1 = $("h1").first().text().trim();
  profile.fullName = h1.replace(/basketball profile/i, "").replace(/\s+/g, " ").trim();

  // Bio sentence pattern: "X is USA basketball player born on..."
  const bioMatch = bodyText.match(
    /is\s+(\w+)\s+basketball player born\s+(?:on\s+)?([A-Z][a-z]+ \d{1,2},?\s*\d{4})\s+in\s+([^.]+)/i
  );
  if (bioMatch) {
    profile.nationality = bioMatch[1];
    profile.birthdate = bioMatch[2].trim();
    profile.birthCity = bioMatch[3].trim();
  }

  // Height & weight from bio
  const hwMatch = bodyText.match(/(\d+['']\d+[''"]?)\s*(?:\((\d+)\s*cm\))?/);
  if (hwMatch) {
    profile.height = hwMatch[1].replace(/['']/g, "'").replace(/[""]/g, '"');
    if (hwMatch[2]) profile.heightCm = hwMatch[2];
  }
  const wtMatch = bodyText.match(/([\d.]+)\s*lbs?\s*\(([\d.]+)\s*kg\)/i);
  if (wtMatch) {
    profile.weightLbs = wtMatch[1];
    profile.weightKg = wtMatch[2];
  } else {
    const kgMatch = bodyText.match(/([\d.]+)\s*kg/i);
    if (kgMatch) {
      profile.weightKg = kgMatch[1];
      profile.weightLbs = (parseFloat(kgMatch[1]) * 2.205).toFixed(1);
    }
  }

  // Position from bio sentence
  const posMatch = bodyText.match(/\d+['']\d+[''"]?\s+(guard|forward|center|point guard|shooting guard|small forward|power forward)/i);
  if (posMatch) profile.position = posMatch[1];

  // College
  const collegeMatch = bodyText.match(/(?:University|College)\s+(?:of\s+)?[\w\s]+/i);
  if (collegeMatch) profile.college = collegeMatch[0].trim();

  // Graduation year
  const gradMatch = bodyText.match(/graduated?\s+(\d{4})/i);
  if (gradMatch) profile.graduationYear = gradMatch[1];

  // High school
  const hsMatch = bodyText.match(/(?:High School|HS)[:\s]+([^,\n]+)/i);
  if (hsMatch) profile.highSchool = hsMatch[1].trim();

  // Agent - extract cleanly from the FAQ pattern "agent is X"
  const agentMatch = bodyText.match(/agent is\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/);
  if (agentMatch) profile.agent = agentMatch[1].trim();

  return profile;
}

// --- Parse career stats ---
// EuroBasket has multiple table formats depending on subscription level.
// We parse: Summary table (current season totals+averages), CLUB competitions table,
// and Details table (game-by-game logs).

function parseCareerStats(html) {
  const $ = cheerio.load(html);
  const stats = [];
  const num = (v) => parseFloat(v) || 0;
  const parseMadeAttempted = (v) => {
    const m = (v || "").match(/(\d+)-(\d+)/);
    return m ? { made: parseInt(m[1]), attempted: parseInt(m[2]) } : { made: 0, attempted: 0 };
  };

  // Strategy 1: Parse Summary table (always available, current season)
  // Format: Team | G | MIN | PTS | 2FGP | 3FGP | FT | RO | RD | RT | AS | PF | BS | ST | TO | RNK
  for (let i = 0; i < $("table").length; i++) {
    const table = $("table").eq(i);
    const firstRow = table.find("tr").first().text().trim();
    if (firstRow !== "Summary") continue;

    // Totals row (row index 2 typically)
    table.find("tr").each((_, row) => {
      const cells = [];
      $(row).find("td").each((_, cell) => cells.push($(cell).text().trim()));
      if (cells.length < 15) return;
      // Skip header rows and AVERAGES label
      if (cells[0] === "Team" || cells[0] === "AVERAGES") return;

      const team = cells[0];
      const gp = num(cells[1]);
      if (!team || !gp) return;

      const twoFg = parseMadeAttempted(cells[4]);
      const threeFg = parseMadeAttempted(cells[5]);
      const ft = parseMadeAttempted(cells[6]);
      const g = gp || 1;

      stats.push({
        season: "Current",
        team,
        league: "",
        gamesPlayed: gp,
        minutes: num(cells[2]),
        minutesPerGame: (num(cells[2]) / g).toFixed(1),
        points: num(cells[3]),
        ppg: (num(cells[3]) / g).toFixed(1),
        twoFgMade: twoFg.made,
        twoFgAttempted: twoFg.attempted,
        twoFgPct: twoFg.attempted > 0 ? ((twoFg.made / twoFg.attempted) * 100).toFixed(1) + "%" : "",
        threeFgMade: threeFg.made,
        threeFgAttempted: threeFg.attempted,
        threeFgPct: threeFg.attempted > 0 ? ((threeFg.made / threeFg.attempted) * 100).toFixed(1) + "%" : "",
        ftMade: ft.made,
        ftAttempted: ft.attempted,
        ftPct: ft.attempted > 0 ? ((ft.made / ft.attempted) * 100).toFixed(1) + "%" : "",
        offRebounds: num(cells[7]),
        defRebounds: num(cells[8]),
        totalRebounds: num(cells[9]),
        rpg: (num(cells[9]) / g).toFixed(1),
        assists: num(cells[10]),
        apg: (num(cells[10]) / g).toFixed(1),
        personalFouls: num(cells[11]),
        blocks: num(cells[12]),
        bpg: (num(cells[12]) / g).toFixed(1),
        steals: num(cells[13]),
        spg: (num(cells[13]) / g).toFixed(1),
        turnovers: num(cells[14]),
        ranking: cells[15] || "",
        source: "summary",
      });
    });
    break;
  }

  // Strategy 2: Parse CLUB competitions table (may be paywalled)
  for (let i = 0; i < $("table").length; i++) {
    const table = $("table").eq(i);
    const firstRow = table.find("tr").first().text().trim();
    if (!firstRow.toLowerCase().includes("club competitions")) continue;

    table.find("tr").slice(2).each((_, row) => {
      const cells = [];
      $(row).find("td").each((_, cell) => cells.push($(cell).text().trim()));
      if (cells.length < 10) return;
      // Skip asterisked (paywalled) rows
      if (cells.some(v => v.includes("*"))) return;

      const season = cells[0];
      const team = cells[1];
      const league = cells[2];
      if (!season || !team) return;

      const gp = num(cells[3]);
      const g = gp || 1;

      // Handle both 18-cell and 35-cell formats
      if (cells.length >= 30) {
        // Interleaved total/avg format (full subscriber)
        const twoFg = parseMadeAttempted(cells[8]);
        const threeFg = parseMadeAttempted(cells[11]);
        const ft = parseMadeAttempted(cells[14]);

        stats.push({
          season, team, league, gamesPlayed: gp,
          minutes: num(cells[4]), minutesPerGame: num(cells[5]),
          points: num(cells[6]), ppg: (num(cells[6]) / g).toFixed(1),
          twoFgMade: twoFg.made, twoFgAttempted: twoFg.attempted, twoFgPct: cells[9],
          threeFgMade: threeFg.made, threeFgAttempted: threeFg.attempted, threeFgPct: cells[12],
          ftMade: ft.made, ftAttempted: ft.attempted, ftPct: cells[15],
          offRebounds: num(cells[17]), defRebounds: num(cells[19]), totalRebounds: num(cells[21]),
          rpg: (num(cells[21]) / g).toFixed(1),
          assists: num(cells[23]), apg: (num(cells[23]) / g).toFixed(1),
          personalFouls: num(cells[25]),
          blocks: num(cells[27]), bpg: (num(cells[27]) / g).toFixed(1),
          steals: num(cells[29]), spg: (num(cells[29]) / g).toFixed(1),
          turnovers: num(cells[31]),
          ranking: cells[33] || "", source: "club_full",
        });
      } else if (cells.length >= 17) {
        // 18-cell averages format (basic subscriber)
        stats.push({
          season, team, league, gamesPlayed: gp,
          minutesPerGame: cells[4], ppg: cells[5],
          twoFgPct: cells[6], threeFgPct: cells[7], ftPct: cells[8],
          offReboundsPerGame: cells[9], defReboundsPerGame: cells[10],
          rpg: cells[11], apg: cells[12],
          personalFoulsPerGame: cells[13],
          bpg: cells[14], spg: cells[15], turnoversPerGame: cells[16],
          ranking: cells[17] || "", source: "club_avg",
        });
      }
    });
    break;
  }

  return stats;
}

// --- Parse game-by-game data (Details table) ---

function parseGameLog(html) {
  const $ = cheerio.load(html);
  const games = [];

  for (let i = 0; i < $("table").length; i++) {
    const table = $("table").eq(i);
    const firstRow = table.find("tr").first().text().trim();
    if (firstRow !== "Details") continue;

    table.find("tr").slice(1).each((_, row) => {
      const cells = [];
      $(row).find("td").each((_, cell) => cells.push($(cell).text().trim()));
      if (cells.length < 15) return;

      // Game row format: Date | Team | Opponent | Score | MIN | PTS | 2PM-2PA | 3PM-3PA | FTM-FTA | RO | RD | RT | AS | PF | BS | ST | TO | RNK
      const date = cells[0];
      if (!date || !date.match(/\d+\/\d+\/\d+/)) return;

      games.push({
        date,
        team: cells[1],
        opponent: cells[2],
        score: cells[3],
        minutes: cells[4],
        points: cells[5],
        shooting: cells[6],
        threePoint: cells[7],
        freeThrows: cells[8],
        offReb: cells[9],
        defReb: cells[10],
        totalReb: cells[11],
        assists: cells[12],
        fouls: cells[13],
        blocks: cells[14],
        steals: cells[15],
        turnovers: cells[16],
      });
    });
    break;
  }

  return games;
}

// --- Parse per-league average tables ---

function parseLeagueAverages(html) {
  const $ = cheerio.load(html);
  const averages = {};

  $("table").each((_, table) => {
    const headerRow = $(table).find("tr").first().text().trim();
    const leagueMatch = headerRow.match(/AVERAGE\s+(.+?)\s+STATS/i);
    if (!leagueMatch) return;

    const leagueName = leagueMatch[1];
    const rows = $(table).find("tr");
    if (rows.length < 3) return;

    // Header row
    const headers = [];
    rows.eq(1).find("td, th").each((_, cell) => {
      headers.push($(cell).text().trim());
    });

    // Data row
    const cells = [];
    rows.eq(2).find("td").each((_, cell) => {
      cells.push($(cell).text().trim());
    });

    const getValue = (header) => {
      const idx = headers.indexOf(header);
      return idx >= 0 && idx < cells.length ? cells[idx] : "";
    };

    averages[leagueName] = {
      gamesPlayed: getValue("G"),
      minutesPerGame: getValue("MIN"),
      pointsPerGame: getValue("PTS"),
      twoFgPct: getValue("2FGP%"),
      threeFgPct: getValue("3FGP%"),
      ftPct: getValue("FT%"),
      reboundsPerGame: getValue("RT"),
      assistsPerGame: getValue("AS"),
      stealsPerGame: getValue("ST"),
      blocksPerGame: getValue("BS"),
      turnoversPerGame: getValue("TO"),
    };
  });

  return averages;
}

// ====== MCP Server Setup ======

const server = new McpServer({
  name: "eurobasket",
  version: "1.0.0",
  description: "EuroBasket.com player data - search, profiles, and career stats",
});

// Tool: Login
server.tool(
  "eurobasket_login",
  "Login to EuroBasket.com to access subscriber-only stats. Requires email and password.",
  {
    email: z.string().describe("EuroBasket account email"),
    password: z.string().describe("EuroBasket account password"),
  },
  async ({ email, password }) => {
    const result = await login(email, password);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Tool: Search player
server.tool(
  "eurobasket_search",
  "Search for a basketball player on EuroBasket.com by name. Returns the profile URL if found.",
  {
    playerName: z.string().describe("Player name to search for (e.g. 'Sean East II')"),
  },
  async ({ playerName }) => {
    const result = await searchPlayer(playerName);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }
);

// Tool: Get player profile
server.tool(
  "eurobasket_player_profile",
  "Get a player's biographical info from their EuroBasket profile page (name, height, weight, birthdate, position, nationality, college, etc.)",
  {
    url: z.string().describe("EuroBasket player profile URL (e.g. 'https://basketball.eurobasket.com/player/Sean-East-II/422538')"),
  },
  async ({ url }) => {
    try {
      const html = await fetchPage(url);
      const profile = parsePlayerProfile(html);
      return {
        content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get career stats
server.tool(
  "eurobasket_career_stats",
  "Get a player's full career statistics from EuroBasket (all seasons, all leagues). Requires login for full stats. Returns season-by-season totals including games, minutes, points, shooting splits, rebounds, assists, steals, blocks, turnovers.",
  {
    url: z.string().describe("EuroBasket player profile URL"),
  },
  async ({ url }) => {
    try {
      if (!isLoggedIn) {
        return {
          content: [{ type: "text", text: "Not logged in. Call eurobasket_login first to access full career stats." }],
        };
      }
      const html = await fetchPage(url);
      const stats = parseCareerStats(html);
      const averages = parseLeagueAverages(html);
      const gameLog = parseGameLog(html);
      return {
        content: [{
          type: "text",
          text: JSON.stringify({ careerStats: stats, leagueAverages: averages, gameLog: gameLog.slice(0, 20) }, null, 2),
        }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get full player data (combined profile + stats)
server.tool(
  "eurobasket_full_player",
  "Get complete player data in one call: search by name, then fetch profile bio and full career stats. Auto-logs in using provided credentials if not already logged in.",
  {
    playerName: z.string().describe("Player name (e.g. 'Sean East II')"),
    email: z.string().optional().describe("EuroBasket login email (optional if already logged in)"),
    password: z.string().optional().describe("EuroBasket login password (optional if already logged in)"),
  },
  async ({ playerName, email, password }) => {
    try {
      // Auto-login if needed
      if (!isLoggedIn && email && password) {
        await login(email, password);
      }

      // Search for player
      const search = await searchPlayer(playerName);
      if (!search.found || !search.url) {
        return {
          content: [{ type: "text", text: `Player "${playerName}" not found on EuroBasket.` }],
        };
      }

      // Fetch profile
      const html = await fetchPage(search.url);
      const profile = parsePlayerProfile(html);
      const stats = parseCareerStats(html);
      const averages = parseLeagueAverages(html);
      const gameLog = parseGameLog(html);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            profileUrl: search.url,
            profile,
            careerStats: stats,
            leagueAverages: averages,
            gameLog: gameLog.slice(0, 20),
            loggedIn: isLoggedIn,
            note: stats.length > 0 ? `Found ${stats.length} season(s) and ${gameLog.length} game(s)` : "Limited stats available - historical data requires higher subscription",
          }, null, 2),
        }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("EuroBasket MCP server running on stdio");
}

main().catch(console.error);
