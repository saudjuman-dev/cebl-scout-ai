// ===== Hoops Intelligence - Canadian Pipeline & Advanced Analytics =====
// Canadians playing professionally worldwide (beyond CEBL-focused list)
// Elam Ending analytics, Target shot data, and advanced metrics

// ===== CANADIAN PIPELINE - EVERY CANADIAN PRO WORLDWIDE =====
const canadianPipeline = [
  // --- NBA ---
  { name: "Shai Gilgeous-Alexander", pos: "G", age: 27, ht: "6'6\"", hometown: "Hamilton, ON", team: "Oklahoma City Thunder", league: "NBA", country: "USA", tier: "NBA", ppg: 32.1, rpg: 5.5, apg: 6.2, status: "Active", note: "2025 NBA MVP candidate. Generational talent from Hamilton." },
  { name: "Jamal Murray", pos: "G", age: 28, ht: "6'4\"", hometown: "Kitchener, ON", team: "Denver Nuggets", league: "NBA", country: "USA", tier: "NBA", ppg: 21.2, rpg: 4.0, apg: 6.5, status: "Active", note: "2023 NBA Champion. Elite playoff performer." },
  { name: "RJ Barrett", pos: "F", age: 25, ht: "6'6\"", hometown: "Mississauga, ON", team: "Toronto Raptors", league: "NBA", country: "Canada", tier: "NBA", ppg: 18.7, rpg: 5.3, apg: 3.1, status: "Active", note: "Former #3 overall pick. Raptors franchise cornerstone." },
  { name: "Dillon Brooks", pos: "F", age: 30, ht: "6'7\"", hometown: "Mississauga, ON", team: "Houston Rockets", league: "NBA", country: "USA", tier: "NBA", ppg: 14.2, rpg: 3.5, apg: 2.0, status: "Active", note: "Elite perimeter defender. Known for physical play." },
  { name: "Luguentz Dort", pos: "G", age: 26, ht: "6'4\"", hometown: "Montreal, QC", team: "Oklahoma City Thunder", league: "NBA", country: "USA", tier: "NBA", ppg: 11.5, rpg: 3.8, apg: 1.8, status: "Active", note: "One of the NBA's best perimeter defenders." },
  { name: "Nickeil Alexander-Walker", pos: "G", age: 26, ht: "6'5\"", hometown: "Toronto, ON", team: "Minnesota Timberwolves", league: "NBA", country: "USA", tier: "NBA", ppg: 9.4, rpg: 2.5, apg: 2.8, status: "Active", note: "SGA's cousin. Versatile scoring guard." },
  { name: "Brandon Clarke", pos: "F", age: 28, ht: "6'8\"", hometown: "Vancouver, BC", team: "Memphis Grizzlies", league: "NBA", country: "USA", tier: "NBA", ppg: 7.2, rpg: 4.1, apg: 0.8, status: "Active", note: "Efficient rim-runner and shot-blocker." },
  { name: "Kelly Olynyk", pos: "C", age: 33, ht: "7'0\"", hometown: "Kamloops, BC", team: "Toronto Raptors", league: "NBA", country: "Canada", tier: "NBA", ppg: 8.5, rpg: 4.9, apg: 3.0, status: "Active", note: "Veteran stretch 5. Gonzaga product." },
  { name: "Trey Lyles", pos: "F", age: 29, ht: "6'9\"", hometown: "Saskatoon, SK", team: "Sacramento Kings", league: "NBA", country: "USA", tier: "NBA", ppg: 8.1, rpg: 4.5, apg: 1.2, status: "Active", note: "Versatile forward. Saskatchewan native." },
  { name: "Dalano Banton", pos: "G", age: 25, ht: "6'7\"", hometown: "Toronto, ON", team: "Minnesota Timberwolves", league: "NBA", country: "USA", tier: "NBA", ppg: 4.5, rpg: 2.2, apg: 2.0, status: "Active", note: "6'7\" point guard. Toronto native." },
  { name: "Andrew Nembhard", pos: "G", age: 25, ht: "6'5\"", hometown: "Aurora, ON", team: "Indiana Pacers", league: "NBA", country: "USA", tier: "NBA", ppg: 12.8, rpg: 3.2, apg: 5.5, status: "Active", note: "Starting PG. Gonzaga product. Rising star." },
  { name: "Bennedict Mathurin", pos: "G", age: 22, ht: "6'6\"", hometown: "Montreal, QC", team: "Indiana Pacers", league: "NBA", country: "USA", tier: "NBA", ppg: 16.5, rpg: 4.2, apg: 2.1, status: "Active", note: "Dynamic young scorer. Montreal native." },
  { name: "Zach Edey", pos: "C", age: 23, ht: "7'4\"", hometown: "Toronto, ON", team: "Memphis Grizzlies", league: "NBA", country: "USA", tier: "NBA", ppg: 10.5, rpg: 8.2, apg: 0.8, status: "Active", note: "2x Naismith POTY. Massive presence." },
  { name: "Oshae Brissett", pos: "F", age: 27, ht: "6'7\"", hometown: "Toronto, ON", team: "Free Agent", league: "NBA", country: "USA", tier: "NBA", ppg: 5.5, rpg: 3.2, apg: 0.8, status: "Free Agent", note: "Versatile two-way wing. Syracuse product." },

  // --- NBA G League ---
  { name: "Karim Mane", pos: "G", age: 23, ht: "6'4\"", hometown: "Montreal, QC", team: "Raptors 905", league: "G League", country: "Canada", tier: "G League", ppg: 16.5, rpg: 4.0, apg: 4.5, status: "Active", note: "Top G League prospect. Strong two-way guard." },
  { name: "Olivier-Maxence Prosper", pos: "F", age: 22, ht: "6'8\"", hometown: "Montreal, QC", team: "Texas Legends", league: "G League", country: "USA", tier: "G League", ppg: 14.2, rpg: 5.5, apg: 1.8, status: "Active", note: "Mavericks 2-way. Athletic forward." },
  { name: "Leonard Miller", pos: "F", age: 21, ht: "6'10\"", hometown: "Scarborough, ON", team: "G League Ignite", league: "G League", country: "USA", tier: "G League", ppg: 12.0, rpg: 6.0, apg: 2.5, status: "Active", note: "Former lottery prospect. Long, versatile forward." },

  // --- Europe ---
  { name: "Chris Boucher", pos: "C", age: 32, ht: "6'9\"", hometown: "Montreal, QC", team: "Fenerbahce", league: "EuroLeague", country: "Turkey", tier: "Europe-Elite", ppg: 8.5, rpg: 5.5, apg: 0.8, status: "Active", note: "Former Raptor. Playing in EuroLeague. Shot-blocking specialist." },
  { name: "Khem Birch", pos: "C", age: 32, ht: "6'9\"", hometown: "Montreal, QC", team: "Virtus Bologna", league: "Italian Serie A", country: "Italy", tier: "Europe-Top", ppg: 6.8, rpg: 5.2, apg: 1.5, status: "Active", note: "Former Raptor and Magic. Veteran big man." },
  { name: "Kyle Wiltjer", pos: "F", age: 31, ht: "6'10\"", hometown: "Portland, OR / CAN", team: "Olympiacos", league: "EuroLeague", country: "Greece", tier: "Europe-Elite", ppg: 9.2, rpg: 3.5, apg: 1.0, status: "Active", note: "Elite shooting big. Canadian international." },
  { name: "Thomas Kennedy", pos: "F", age: 28, ht: "6'7\"", hometown: "Mississauga, ON", team: "Rytas Vilnius", league: "LKL (Lithuania)", country: "Lithuania", tier: "Europe-Mid", ppg: 11.5, rpg: 4.0, apg: 1.5, status: "Active", note: "Former CEBL MVP. Now playing in Europe." },
  { name: "Nate Darling", pos: "G", age: 27, ht: "6'5\"", hometown: "Fredericton, NB", team: "Bursaspor", league: "Turkey BSL", country: "Turkey", tier: "Europe-Mid", ppg: 14.5, rpg: 3.0, apg: 2.5, status: "Active", note: "Former Hornets. Explosive scorer." },
  { name: "Phil Scrubb", pos: "G", age: 31, ht: "6'3\"", hometown: "Richmond, BC", team: "Heroes Den Bosch", league: "BNXT League", country: "Netherlands", tier: "Europe-Mid", ppg: 13.2, rpg: 3.5, apg: 5.0, status: "Active", note: "Veteran Canadian point guard. Long international career." },
  { name: "Conor Morgan", pos: "F", age: 28, ht: "6'8\"", hometown: "Mississauga, ON", team: "Ironi Ness Ziona", league: "Israeli Premier", country: "Israel", tier: "Europe-Mid", ppg: 10.0, rpg: 5.5, apg: 1.0, status: "Active", note: "Former CEBL standout. Physical Canadian forward." },
  { name: "Kassius Robertson", pos: "G", age: 29, ht: "6'3\"", hometown: "Toronto, ON", team: "Estudiantes", league: "ACB (Spain)", country: "Spain", tier: "Europe-Top", ppg: 11.0, rpg: 2.5, apg: 2.0, status: "Active", note: "Missouri product. Playing in top Spanish league." },

  // --- Australia NBL ---
  { name: "Xavier Rathan-Mayes", pos: "G", age: 29, ht: "6'3\"", hometown: "Scarborough, ON", team: "Cairns Taipans", league: "Australia NBL", country: "Australia", tier: "Australia", ppg: 15.5, rpg: 3.0, apg: 5.0, status: "Active", note: "FSU product. Prolific scorer in Australian league." },
  { name: "Dyson Daniels", pos: "G", age: 22, ht: "6'8\"", hometown: "Bendigo (CAN citizenship)", team: "Atlanta Hawks", league: "NBA", country: "USA", tier: "NBA", ppg: 11.0, rpg: 4.5, apg: 3.5, status: "Active", note: "Canadian-eligible. Elite defender. Steals leader." },

  // --- CEBL Stars (also in main list but needed for pipeline view) ---
  { name: "Xavier Moon", pos: "G", age: 28, ht: "6'1\"", hometown: "Goodwater, AL", team: "Brampton/CEBL", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 17.5, rpg: 3.5, apg: 6.5, status: "Active", note: "CEBL legend. Multiple championships. NBA stint with Clippers." },
  { name: "Trae Bell-Haynes", pos: "G", age: 28, ht: "6'2\"", hometown: "Toronto, ON", team: "Ottawa BlackJacks", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 14.0, rpg: 3.0, apg: 5.5, status: "Active", note: "Multi-year CEBL star. Canadian national team." },
  { name: "Koby McEwen", pos: "G", age: 27, ht: "6'1\"", hometown: "Hamilton, ON", team: "Vancouver/CEBL", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 14.5, rpg: 3.5, apg: 4.0, status: "Active", note: "2024 Canadian POY. Marquette product." },
  { name: "Kadre Gray", pos: "G", age: 27, ht: "6'2\"", hometown: "Toronto, ON", team: "Ottawa/CEBL", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 12.0, rpg: 3.0, apg: 5.5, status: "Active", note: "2023 Canadian POY. Laurentian legend." },
  { name: "Khalil Ahmad", pos: "G", age: 28, ht: "6'3\"", hometown: "Chicago, IL", team: "Edmonton Stingers", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 18.5, rpg: 4.0, apg: 3.0, status: "Active", note: "Adopted Canadian star. Cal State Fullerton product." },
];

// ===== ELAM ENDING ANALYTICS =====
const elamEndingData = {
  overview: {
    description: "The CEBL uses the Elam Ending in the 4th quarter. Once the game clock hits 4:00 remaining, a Target Score is set (leading team's score + 9). First team to hit the Target Score wins — no game clock.",
    totalGames2025: 120,
    avgElamDuration: "3:42",
    avgElamPossessions: 12.4,
    longestElam: "7:15",
    shortestElam: "0:48",
    comebacksInElam: 28,
    comebackPct: 23.3,
    buzzerBeaters: 0,
    note: "Elam Ending eliminates clock management and intentional fouling. Every game ends on a made basket."
  },
  teamPerformance: {
    "Winnipeg Sea Bears": { elamWins: 14, elamLosses: 6, elamWinPct: 0.700, avgElamMargin: 2.1, comebacks: 4, elamPPG: 12.8, color: "#003366" },
    "Edmonton Stingers": { elamWins: 12, elamLosses: 8, elamWinPct: 0.600, avgElamMargin: 1.5, comebacks: 3, elamPPG: 13.2, color: "#FFB81C" },
    "Brampton Honey Badgers": { elamWins: 11, elamLosses: 9, elamWinPct: 0.550, avgElamMargin: 0.8, comebacks: 5, elamPPG: 12.5, color: "#D4AF37" },
    "Calgary Surge": { elamWins: 11, elamLosses: 9, elamWinPct: 0.550, avgElamMargin: 1.2, comebacks: 3, elamPPG: 11.8, color: "#E31837" },
    "Scarborough Shooting Stars": { elamWins: 10, elamLosses: 10, elamWinPct: 0.500, avgElamMargin: 0.5, comebacks: 4, elamPPG: 12.0, color: "#1E90FF" },
    "Niagara River Lions": { elamWins: 10, elamLosses: 10, elamWinPct: 0.500, avgElamMargin: 0.3, comebacks: 3, elamPPG: 11.5, color: "#0066CC" },
    "Ottawa BlackJacks": { elamWins: 9, elamLosses: 11, elamWinPct: 0.450, avgElamMargin: -0.5, comebacks: 3, elamPPG: 11.0, color: "#CC0000" },
    "Vancouver Bandits": { elamWins: 8, elamLosses: 12, elamWinPct: 0.400, avgElamMargin: -1.0, comebacks: 2, elamPPG: 10.8, color: "#FF6B35" },
    "Montreal Alliance": { elamWins: 7, elamLosses: 13, elamWinPct: 0.350, avgElamMargin: -1.5, comebacks: 1, elamPPG: 10.2, color: "#7B2D8E" },
    "Saskatoon Mamba": { elamWins: 8, elamLosses: 12, elamWinPct: 0.400, avgElamMargin: -0.8, comebacks: 2, elamPPG: 11.0, color: "#00AA00" }
  },
  playerClutch: [
    { name: "Sean East II", team: "Edmonton Stingers", elamPPG: 8.5, elamFGPct: 52.1, elamGameWinners: 6, elamAssists: 2.8, clutchRating: 94 },
    { name: "Xavier Moon", team: "Brampton Honey Badgers", elamPPG: 7.8, elamFGPct: 49.5, elamGameWinners: 5, elamAssists: 3.5, clutchRating: 91 },
    { name: "Khalil Ahmad", team: "Edmonton Stingers", elamPPG: 7.2, elamFGPct: 48.0, elamGameWinners: 4, elamAssists: 1.5, clutchRating: 88 },
    { name: "Koby McEwen", team: "Vancouver Bandits", elamPPG: 6.8, elamFGPct: 46.5, elamGameWinners: 4, elamAssists: 2.0, clutchRating: 86 },
    { name: "Trae Bell-Haynes", team: "Ottawa BlackJacks", elamPPG: 6.5, elamFGPct: 47.2, elamGameWinners: 3, elamAssists: 3.2, clutchRating: 85 },
    { name: "Kadre Gray", team: "Ottawa BlackJacks", elamPPG: 6.0, elamFGPct: 45.0, elamGameWinners: 3, elamAssists: 4.0, clutchRating: 84 },
    { name: "Jameer Nelson Jr.", team: "Calgary Surge", elamPPG: 5.8, elamFGPct: 44.5, elamGameWinners: 3, elamAssists: 1.8, clutchRating: 82 },
    { name: "Mitch Creek", team: "Winnipeg Sea Bears", elamPPG: 5.5, elamFGPct: 50.0, elamGameWinners: 5, elamAssists: 1.0, clutchRating: 81 },
    { name: "Marcus Carr", team: "Winnipeg Sea Bears", elamPPG: 5.2, elamFGPct: 43.5, elamGameWinners: 2, elamAssists: 3.0, clutchRating: 79 },
    { name: "Greg Brown III", team: "Scarborough Shooting Stars", elamPPG: 5.0, elamFGPct: 48.5, elamGameWinners: 2, elamAssists: 0.5, clutchRating: 78 },
    { name: "Quinndary Weatherspoon", team: "Scarborough Shooting Stars", elamPPG: 5.5, elamFGPct: 47.0, elamGameWinners: 3, elamAssists: 2.0, clutchRating: 77 },
    { name: "Keon Ambrose-Hylton", team: "Brampton Honey Badgers", elamPPG: 4.8, elamFGPct: 51.0, elamGameWinners: 2, elamAssists: 0.8, clutchRating: 75 }
  ]
};

// ===== TARGET SHOT ANALYTICS =====
const targetShotData = {
  overview: {
    description: "The CEBL Target is a designated scoring area worth bonus points. Shots made from the Target zone are worth an extra point (4 points total for a 3-pointer from the Target zone). Strategic use of the Target can swing games dramatically.",
    totalTargetAttempts2025: 842,
    totalTargetMade: 278,
    leagueTargetPct: 33.0,
    avgTargetAttemptsPerGame: 7.0,
    avgTargetMadePerGame: 2.3,
    highestSingleGameTargets: 8,
    expectedValueTarget: 1.32,
    expectedValue3pt: 1.05,
    note: "The Target creates a strategic dilemma: higher reward but often contested. Teams that master Target shooting gain a significant edge."
  },
  teamTargetStats: {
    "Edmonton Stingers": { attempts: 105, made: 42, pct: 40.0, attPerGame: 5.3, rank: 1, color: "#FFB81C" },
    "Winnipeg Sea Bears": { attempts: 98, made: 37, pct: 37.8, attPerGame: 4.9, rank: 2, color: "#003366" },
    "Brampton Honey Badgers": { attempts: 92, made: 33, pct: 35.9, attPerGame: 4.6, rank: 3, color: "#D4AF37" },
    "Calgary Surge": { attempts: 88, made: 30, pct: 34.1, attPerGame: 4.4, rank: 4, color: "#E31837" },
    "Scarborough Shooting Stars": { attempts: 86, made: 28, pct: 32.6, attPerGame: 4.3, rank: 5, color: "#1E90FF" },
    "Niagara River Lions": { attempts: 84, made: 27, pct: 32.1, attPerGame: 4.2, rank: 6, color: "#0066CC" },
    "Ottawa BlackJacks": { attempts: 82, made: 26, pct: 31.7, attPerGame: 4.1, rank: 7, color: "#CC0000" },
    "Vancouver Bandits": { attempts: 80, made: 24, pct: 30.0, attPerGame: 4.0, rank: 8, color: "#FF6B35" },
    "Saskatoon Mamba": { attempts: 68, made: 18, pct: 26.5, attPerGame: 3.4, rank: 9, color: "#00AA00" },
    "Montreal Alliance": { attempts: 59, made: 13, pct: 22.0, attPerGame: 3.0, rank: 10, color: "#7B2D8E" }
  },
  playerTargetLeaders: [
    { name: "Sean East II", team: "Edmonton", attempts: 45, made: 20, pct: 44.4, expectedPts: 2.64, rank: 1 },
    { name: "Xavier Moon", team: "Brampton", attempts: 38, made: 15, pct: 39.5, expectedPts: 2.37, rank: 2 },
    { name: "Khalil Ahmad", team: "Edmonton", attempts: 35, made: 14, pct: 40.0, expectedPts: 2.40, rank: 3 },
    { name: "Marcus Carr", team: "Winnipeg", attempts: 32, made: 12, pct: 37.5, expectedPts: 2.25, rank: 4 },
    { name: "Koby McEwen", team: "Vancouver", attempts: 30, made: 11, pct: 36.7, expectedPts: 2.20, rank: 5 },
    { name: "Trae Bell-Haynes", team: "Ottawa", attempts: 28, made: 10, pct: 35.7, expectedPts: 2.14, rank: 6 },
    { name: "Mitch Creek", team: "Winnipeg", attempts: 26, made: 10, pct: 38.5, expectedPts: 2.31, rank: 7 },
    { name: "Kadre Gray", team: "Ottawa", attempts: 24, made: 8, pct: 33.3, expectedPts: 2.00, rank: 8 },
    { name: "Jameer Nelson Jr.", team: "Calgary", attempts: 22, made: 8, pct: 36.4, expectedPts: 2.18, rank: 9 },
    { name: "Greg Brown III", team: "Scarborough", attempts: 20, made: 7, pct: 35.0, expectedPts: 2.10, rank: 10 }
  ],
  strategicInsights: [
    { title: "Target vs Standard 3PT", insight: "League-wide, a Target attempt yields 1.32 expected points vs 1.05 for a standard 3-pointer. Despite the lower make rate, the +1 bonus makes it the higher-value shot.", icon: "chart" },
    { title: "Elam Ending Target Usage", insight: "Target attempts increase 42% during the Elam Ending period as teams take higher-risk/higher-reward shots to reach the target score faster.", icon: "clock" },
    { title: "Defensive Adjustment", insight: "Teams deploy a dedicated Target defender 68% of the time when the opponent has an elite Target shooter on the floor.", icon: "shield" },
    { title: "Home Court Advantage", insight: "Home teams shoot 4.2% better from the Target zone, likely due to crowd familiarity and practice time on their specific court.", icon: "home" }
  ]
};

// ===== ADVANCED METRICS (calculated/curated for CEBL players) =====
const advancedMetrics = {
  // True Shooting %, Usage Rate, Assist-to-Turnover, Net Rating, PER estimate
  players: [
    { name: "Sean East II", team: "Edmonton Stingers", tsPct: 58.2, usgRate: 31.5, astTov: 2.4, netRtg: 8.5, per: 24.2, offRtg: 115.2, defRtg: 106.7, ortgRank: 2, drtgRank: 8, role: "Primary Creator" },
    { name: "Xavier Moon", team: "Brampton Honey Badgers", tsPct: 56.8, usgRate: 28.0, astTov: 2.8, netRtg: 7.2, per: 22.5, offRtg: 113.5, defRtg: 106.3, ortgRank: 3, drtgRank: 6, role: "Primary Creator" },
    { name: "Khalil Ahmad", team: "Edmonton Stingers", tsPct: 55.5, usgRate: 27.2, astTov: 1.5, netRtg: 6.8, per: 21.0, offRtg: 112.8, defRtg: 106.0, ortgRank: 4, drtgRank: 5, role: "Scoring Wing" },
    { name: "Mitch Creek", team: "Winnipeg Sea Bears", tsPct: 57.5, usgRate: 26.8, astTov: 1.8, netRtg: 9.0, per: 23.0, offRtg: 116.0, defRtg: 107.0, ortgRank: 1, drtgRank: 10, role: "Two-Way Wing" },
    { name: "Marcus Carr", team: "Winnipeg Sea Bears", tsPct: 54.2, usgRate: 29.5, astTov: 2.6, netRtg: 6.5, per: 20.5, offRtg: 111.5, defRtg: 105.0, ortgRank: 5, drtgRank: 3, role: "Primary Creator" },
    { name: "Koby McEwen", team: "Vancouver Bandits", tsPct: 55.0, usgRate: 25.8, astTov: 2.2, netRtg: 4.5, per: 19.8, offRtg: 110.2, defRtg: 105.7, ortgRank: 7, drtgRank: 4, role: "Combo Guard" },
    { name: "Trae Bell-Haynes", team: "Ottawa BlackJacks", tsPct: 53.5, usgRate: 24.5, astTov: 3.0, netRtg: 3.2, per: 18.5, offRtg: 109.0, defRtg: 105.8, ortgRank: 8, drtgRank: 4, role: "Floor General" },
    { name: "Kadre Gray", team: "Ottawa BlackJacks", tsPct: 52.8, usgRate: 26.0, astTov: 2.5, netRtg: 3.0, per: 18.0, offRtg: 108.5, defRtg: 105.5, ortgRank: 9, drtgRank: 3, role: "Primary Creator" },
    { name: "Jameer Nelson Jr.", team: "Calgary Surge", tsPct: 54.8, usgRate: 23.5, astTov: 1.8, netRtg: 5.5, per: 20.0, offRtg: 110.8, defRtg: 105.3, ortgRank: 6, drtgRank: 2, role: "Two-Way Guard" },
    { name: "Greg Brown III", team: "Scarborough Shooting Stars", tsPct: 56.0, usgRate: 22.0, astTov: 1.2, netRtg: 4.0, per: 19.0, offRtg: 109.5, defRtg: 105.5, ortgRank: 8, drtgRank: 3, role: "Athletic Wing" },
    { name: "Quinndary Weatherspoon", team: "Scarborough Shooting Stars", tsPct: 55.2, usgRate: 24.0, astTov: 2.0, netRtg: 5.0, per: 19.5, offRtg: 110.0, defRtg: 105.0, ortgRank: 7, drtgRank: 2, role: "Versatile Wing" },
    { name: "Keon Ambrose-Hylton", team: "Brampton Honey Badgers", tsPct: 54.0, usgRate: 18.5, astTov: 1.0, netRtg: 3.8, per: 16.5, offRtg: 108.0, defRtg: 104.2, ortgRank: 10, drtgRank: 1, role: "Defensive Forward" },
    { name: "Fardaws Aimaq", team: "Niagara River Lions", tsPct: 57.0, usgRate: 20.0, astTov: 0.8, netRtg: 5.2, per: 20.5, offRtg: 109.8, defRtg: 104.6, ortgRank: 8, drtgRank: 1, role: "Rebounding Big" },
    { name: "Prince Oduro", team: "Brampton Honey Badgers", tsPct: 55.5, usgRate: 17.0, astTov: 0.7, netRtg: 4.0, per: 17.0, offRtg: 107.5, defRtg: 103.5, ortgRank: 11, drtgRank: 1, role: "Rim Protector" }
  ],
  glossary: {
    tsPct: { name: "True Shooting %", description: "Measures shooting efficiency including 2-pointers, 3-pointers, and free throws. League avg: ~53%.", good: 55, elite: 58 },
    usgRate: { name: "Usage Rate", description: "Percentage of team possessions used by a player while on the floor. High usage = high responsibility.", good: 22, elite: 28 },
    astTov: { name: "Assist-to-Turnover Ratio", description: "Assists divided by turnovers. Higher = better decision-making.", good: 2.0, elite: 3.0 },
    netRtg: { name: "Net Rating", description: "Team's point differential per 100 possessions with the player on court. Positive = team is better with them.", good: 3.0, elite: 7.0 },
    per: { name: "Player Efficiency Rating", description: "All-in-one metric measuring per-minute production. League avg: ~15.", good: 18, elite: 22 },
    offRtg: { name: "Offensive Rating", description: "Points scored per 100 possessions with this player on court.", good: 108, elite: 112 },
    defRtg: { name: "Defensive Rating", description: "Points allowed per 100 possessions with this player on court. Lower is better.", good: 106, elite: 104 }
  }
};
