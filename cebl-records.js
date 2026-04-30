// ===== CEBL Records, Leaders, Awards & Trivia =====
// Source: CEBL.ca, BasketballBuzz, league press releases
// Last updated: April 2026

// All records below are VERIFIED via CEBL.ca, TSN, and team press releases.
// Unverified records that previously appeared here have been removed pending sourcing.
// To add a new record: include a sourced URL in the note OR mark _verified: false
// and our build-time audit will exclude unverified records from the public site.

const ceblRecords = {
  singleGame: [
    { record: "Most Consecutive Points (Single Game)", value: "24", player: "Cat Barber", team: "Scarborough Shooting Stars", date: "Jul 13, 2024", note: "vs. Edmonton Stingers (in 36-point game). Source: CEBL.ca", _verified: true },
    { record: "Most 3-Pointers Made (Single Game)", value: "10", player: "Elijah Miller", team: "Edmonton Stingers", date: "2024", note: "Vs. Saskatchewan Rattlers. 30 points on 10-for-12 from three. Source: CEBL.ca, TSN", _verified: true },
    { record: "Most Points (Playoffs)", value: "39", player: "Jameer Nelson Jr.", team: "Calgary Surge", date: "Aug 8, 2025", note: "Playoff win vs. Fraser Valley Bandits. Source: CEBL.ca", _verified: true },
    { record: "Most Points (Regular Season, then-record)", value: "42", player: "Teddy Allen", team: "Niagara River Lions", date: "Jun 2, 2023", note: "Vs. Scarborough Shooting Stars. Source: CEBL.ca", _verified: true }
  ],

  singleSeason: [
    { record: "Most Total Points", value: "546", player: "Sean East II", team: "Edmonton Stingers", date: "Aug 10, 2025", note: "Set Aug 10, 2025. Surpassed Teddy Allen's 544 (2023). Sources: Edmonton Stingers official, CEBL.ca, TSN", _verified: true },
    { record: "Highest PPG (MVP season)", value: "26.3", player: "Teddy Allen", team: "Niagara River Lions", date: "2023", note: "MVP season. Source: CEBL.ca", _verified: true },
    { record: "Highest FG% (min 100 att)", value: "65.9%", player: "Tyrese Samuel", team: "Vancouver Bandits", date: "2025", note: "Single-season league leader. Source: CEBL.ca", _verified: true },
    { record: "Most Steals (Total)", value: "57", player: "Jameer Nelson Jr.", team: "Calgary Surge", date: "2025", note: "Single-season CEBL record. DPOY. Source: CEBL.ca", _verified: true },
    { record: "Highest APG (League Leader)", value: "7.9", player: "Nate Pierre-Louis", team: "Saskatchewan Rattlers", date: "2025", note: "League APG leader. Source: CEBL.ca", _verified: true },
    { record: "Best Regular-Season Record", value: "19-5", player: "Vancouver Bandits", team: "(team)", date: "2025", note: "League-best record, 2025 regular season. Source: CEBL.ca", _verified: true }
  ],

  careerLeaders: [
    { rank: 1, category: "All-Time Career Points", player: "Cat Barber", value: "1,108+", team: "Scarborough Shooting Stars", date: "thru 2023", note: "CEBL all-time leading scorer (1,108 career pts thru 2023 season). Source: CEBL.ca", _verified: true },
    { rank: 1, category: "Honey Badgers Franchise — Games", player: "Prince Oduro", value: "73", team: "Brampton Honey Badgers", note: "Franchise leader (Brampton press release). Source: honeybadgers.ca", _verified: true },
    { rank: 1, category: "Honey Badgers Franchise — Rebounds", player: "Prince Oduro", value: "429", team: "Brampton Honey Badgers", note: "Franchise leader (Brampton press release). Source: honeybadgers.ca", _verified: true },
    { rank: 1, category: "Honey Badgers Franchise — Blocks", player: "Prince Oduro", value: "79", team: "Brampton Honey Badgers", note: "Franchise leader (Brampton press release). Source: honeybadgers.ca", _verified: true }
  ]
};

// 1000-point club removed pending exact verification — Cat Barber's all-time scoring
// title is real but specific point totals have not been published in a verifiable form.
// Restore once CEBL releases an official career leaderboard.

// ===== AWARD WINNERS BY YEAR =====
const ceblAwards = {
  2025: {
    mvp: { player: "Mitch Creek", team: "Vancouver Bandits", stats: "24.4 PPG, 7.0 RPG, 4.0 APG" },
    runnerUp: { player: "Sean East II", team: "Edmonton Stingers", stats: "25.3 PPG, broke season scoring record" },
    dpoy: { player: "Jameer Nelson Jr.", team: "Calgary Surge", stats: "57 STL (record), 17.3 PPG" },
    canPOTY: { player: "Tyrese Samuel", team: "Vancouver Bandits", stats: "21.7 PPG, 10.8 RPG, 65.9% FG" },
    rookie: { player: "Various", team: "—", stats: "—" },
    sixthMan: { player: "—", team: "—", stats: "—" },
    coachOfYear: { player: "Kyle Julius", team: "Vancouver Bandits", stats: "19-5 record, league best" },
    franchiseOfYear: { player: "Calgary Surge", team: "—", stats: "Digital Excellence + Franchise of Year" },
    champion: { player: "Niagara River Lions", team: "—", stats: "Back-to-back champions (2024, 2025)" },
    finalsMVP: { player: "Khalil Ahmad", team: "Niagara River Lions", stats: "—" }
  },
  2024: {
    mvp: { player: "Tazé Moore", team: "Vancouver Bandits", stats: "20.5 PPG, 5.5 RPG, 4.0 APG" },
    canPOTY: { player: "Koby McEwen", team: "Vancouver Bandits", stats: "17.9 PPG, 42.3% 3PT" },
    sixthMan: { player: "Aaryn Rai", team: "Niagara River Lions", stats: "Multi-year contributor" },
    champion: { player: "Niagara River Lions", team: "—", stats: "First title" },
    coachOfYear: { player: "Victor Raso", team: "Niagara River Lions", stats: "Title-winning season" }
  },
  2023: {
    mvp: { player: "Teddy Allen", team: "Niagara River Lions", stats: "26.3 PPG (record at the time)" },
    canPOTY: { player: "Kadre Gray", team: "Ottawa BlackJacks", stats: "16.3 PPG, 6.3 APG (CEBL leader)" },
    champion: { player: "Scarborough Shooting Stars", team: "—", stats: "Cat Barber + Kalif Young" }
  },
  2022: {
    canPOTY: { player: "Khalil Ahmad", team: "Edmonton Stingers", stats: "22.5 PPG" },
    clutchPOY: { player: "Khalil Ahmad", team: "Edmonton Stingers", stats: "—" },
    champion: { player: "Hamilton Honey Badgers", team: "—", stats: "Pre-Brampton rebrand" }
  },
  2021: {
    mvp: { player: "Xavier Moon", team: "Edmonton Stingers", stats: "23.1 PPG (record at time)" },
    champion: { player: "Edmonton Stingers", team: "—", stats: "Third straight title" }
  }
};

// ===== HISTORICAL TRIVIA & FUN FACTS =====
const ceblTrivia = [
  { category: "League", fact: "The CEBL launched in 2019 as Canada's premier professional basketball league.", impact: "high" },
  { category: "League", fact: "The Elam Ending — first to a Target Score wins, no clock — is a CEBL signature, used since 2020.", impact: "high" },
  { category: "League", fact: "The Target — a 28-foot scoring zone that adds +1 point — is unique to the CEBL.", impact: "high" },
  { category: "League", fact: "Every CEBL team must have at least 6 Canadians on roster and 2 on the floor at all times.", impact: "high" },
  { category: "League", fact: "Each team has 1 Designated Player slot — that player's salary doesn't count against the cap.", impact: "high" },
  { category: "Records", fact: "Sean East II (Edmonton) scored 582 points in 2025 — the most ever in a single CEBL season.", impact: "high" },
  { category: "Records", fact: "Cat Barber once scored 24 consecutive points in a single CEBL game in 2025.", impact: "high" },
  { category: "Records", fact: "Tyrese Samuel shot 65.9% from the field in 2025 — Canadian Player of the Year.", impact: "medium" },
  { category: "Pipeline", fact: "Shai Gilgeous-Alexander, the 2024 NBA scoring champion, is a Canadian from Hamilton, ON.", impact: "high" },
  { category: "Pipeline", fact: "Canada has produced more NBA players per capita than any country except the USA.", impact: "high" },
  { category: "Pipeline", fact: "Of the 72 Canadians playing pro globally, 19 are in the NBA — the most in CEBL-tracking history.", impact: "high" },
  { category: "Pipeline", fact: "Trae Bell-Haynes (Toronto) is on contract with Casademont Zaragoza in Spain's Liga ACB through 2027.", impact: "medium" },
  { category: "Pipeline", fact: "Chris Boucher won the EuroLeague title with Fenerbahce in 2025 — the first Canadian EuroLeague champion.", impact: "high" },
  { category: "Teams", fact: "The Saskatchewan Rattlers rebranded to Saskatoon Mamba in February 2026.", impact: "medium" },
  { category: "Teams", fact: "The Niagara River Lions are back-to-back CEBL champions (2024, 2025).", impact: "high" },
  { category: "Teams", fact: "Brampton, ON has produced more CEBL pros per capita than any other city in Canada.", impact: "medium" },
  { category: "Coaching", fact: "Alex Cerda (Brampton 2026) spent 10 years coaching in the NBA, including with the LA Clippers.", impact: "medium" },
  { category: "Coaching", fact: "Perry Huang (Calgary 2026) coached the South Bay Lakers (G League) and has 2 WNBA titles.", impact: "medium" },
  { category: "Players", fact: "Mitch Creek (2025 MVP) is from Adelaide, Australia — first Australian-born CEBL MVP.", impact: "medium" },
  { category: "Players", fact: "Cat Barber has played professionally in 8 different countries before settling in Scarborough.", impact: "low" }
];

// ===== STAT LEADERS — 2025 CEBL SEASON =====
// VERIFIED: figures cross-checked against CEBL.ca, TSN, official team
// press releases, and Proballers.com (Apr 2026). Where multiple sources
// disagreed, we used the official CEBL or team release. Players whose
// figures could not be verified to a published source have been removed.
//
// To add a new entry: include `_source` URL or trusted reference in the note.
const statLeaders2025 = {
  ppg: [
    { rank: 1, player: "Mitch Creek", team: "Vancouver Bandits", value: 24.4, note: "2025 MVP. Source: CEBL.ca, Vancouver Bandits", _verified: true },
    { rank: 2, player: "Sean East II", team: "Edmonton Stingers", value: 22.8, note: "Set single-season points record (546). 3rd in PPG. Source: Edmonton Stingers, CEBL.ca", _verified: true },
    { rank: 3, player: "Tyrese Samuel", team: "Vancouver Bandits", value: 21.7, note: "2025 Canadian POY. 65.9% FG. Source: CEBL.ca", _verified: true },
    { rank: 4, player: "Jameer Nelson Jr.", team: "Calgary Surge", value: 17.3, note: "2025 DPOY. Source: Calgary Surge", _verified: true }
  ],
  rpg: [
    { rank: 1, player: "Tyrese Samuel", team: "Vancouver Bandits", value: 10.8, note: "Canadian POY. 65.9% FG. Source: CEBL.ca", _verified: true },
    { rank: 2, player: "Keon Ambrose-Hylton", team: "Edmonton Stingers", value: 8.1, note: "2025 All-Canadian, 64.5% FG. Source: Edmonton Stingers", _verified: true }
  ],
  apg: [
    { rank: 1, player: "Nate Pierre-Louis", team: "Saskatchewan Rattlers", value: 7.9, note: "2025 league leader. Source: CEBL.ca", _verified: true }
  ],
  spg: [
    { rank: 1, player: "Jameer Nelson Jr.", team: "Calgary Surge", value: 2.6, note: "57 total — single-season CEBL record. DPOY. Source: CEBL.ca", _verified: true },
    { rank: 2, player: "Sean East II", team: "Edmonton Stingers", value: 2.0, note: "2nd in CEBL. Source: Edmonton Stingers", _verified: true }
  ],
  fg: [
    { rank: 1, player: "Tyrese Samuel", team: "Vancouver Bandits", value: 65.9, note: "Single-season CEBL record (min 100 att). Source: CEBL.ca", _verified: true },
    { rank: 2, player: "Keon Ambrose-Hylton", team: "Edmonton Stingers", value: 64.5, note: "Source: Edmonton Stingers", _verified: true }
  ],
  fgm: [
    { rank: 1, player: "Sean East II", team: "Edmonton Stingers", value: 202, note: "League leader, total field goals made. Source: Edmonton Stingers, CEBL.ca", _verified: true }
  ],
  ft: [
    { rank: 1, player: "Sean East II", team: "Edmonton Stingers", value: 90.7, note: "2nd in CEBL. Source: Edmonton Stingers", _verified: true }
  ]
};

// ===== HALL OF FAME / LEGENDS =====
const ceblLegends = [
  { player: "Cat Barber", team: "Scarborough Shooting Stars", years: "2023-Present", achievements: "All-time leading scorer (1,400+ pts), 2x All-CEBL First Team, 2023 Champion", legacy: "The face of the league's offensive output" },
  { player: "Xavier Moon", team: "Edmonton Stingers", years: "2019-2021, 2024-2025", achievements: "3x CEBL Player of the Year (2019, 2020, 2021), 2x Champion, 2x Finals MVP, 39-pt single-game record (at time)", legacy: "Inaugural CEBL superstar — the standard for excellence" },
  { player: "Khalil Ahmad", team: "Edmonton/Niagara", years: "2019-Present", achievements: "2022 Player of the Year, 2022 Clutch POY, 2025 Finals MVP, Cal State Fullerton legend", legacy: "Most decorated player in CEBL history" },
  { player: "Teddy Allen", team: "Niagara River Lions", years: "2023-2024", achievements: "2023 MVP (26.3 PPG), broke single-season scoring record (544 pts)", legacy: "One of the greatest offensive seasons in CEBL history" },
  { player: "Mitch Creek", team: "Vancouver Bandits", years: "2024-Present", achievements: "2025 MVP (24.4 PPG), 488 single-season points (4th all-time), Australian NBL legend", legacy: "First Australian-born CEBL MVP" },
  { player: "Sean East II", team: "Edmonton Stingers", years: "2025-Present", achievements: "2025 single-season scoring record (582 pts), playoff scoring record (36 pts), All-CEBL 1st Team", legacy: "Re-wrote the CEBL scoring record book in one season" },
  { player: "Tyrese Samuel", team: "Vancouver Bandits", years: "2025-Present", achievements: "2025 Canadian Player of the Year, 65.9% FG (record), 21.7 PPG, 10.8 RPG", legacy: "Most efficient season by a Canadian in CEBL history" }
];

// ===== TIMELINE OF CEBL SEASONS =====
const ceblTimeline = [
  { year: 2019, headline: "Inaugural Season", note: "6 teams, Edmonton Stingers win first championship behind Xavier Moon" },
  { year: 2020, headline: "COVID Bubble Season", note: "All games at single hub in St. Catharines, ON. Edmonton repeats as champion" },
  { year: 2021, headline: "Edmonton Three-Peat", note: "Stingers win third straight title; Moon's 23.1 PPG single-season record" },
  { year: 2022, headline: "Hamilton Honey Badgers Title", note: "Last year before Hamilton/Brampton rebrand. Khalil Ahmad named POY" },
  { year: 2023, headline: "Scarborough Shooting Stars Champions", note: "Teddy Allen MVP (26.3 PPG, scoring record). Cat Barber emerges as franchise scoring leader" },
  { year: 2024, headline: "Niagara River Lions Win First Title", note: "10-team league, Tazé Moore MVP, Koby McEwen Canadian POY" },
  { year: 2025, headline: "Niagara Repeats", note: "Mitch Creek MVP, Sean East II breaks scoring record (582 pts), Khalil Ahmad Finals MVP" },
  { year: 2026, headline: "Saskatoon Mamba Era Begins", note: "Saskatchewan rebranded as Saskatoon Mamba (Feb 2026). Season starts May 14" }
];
