// ===== CEBL Records, Leaders, Awards & Trivia =====
// Source: CEBL.ca, BasketballBuzz, league press releases
// Last updated: April 2026

// ===== ALL-TIME CEBL RECORDS =====
const ceblRecords = {
  singleGame: [
    { record: "Most Points (Regular Season)", value: "45", player: "Cat Barber", team: "Scarborough Shooting Stars", date: "2024", note: "vs. Saskatchewan Rattlers" },
    { record: "Most Points (Playoffs)", value: "39", player: "Jameer Nelson Jr.", team: "Calgary Surge", date: "Aug 8, 2025", note: "Playoff win vs. Fraser Valley" },
    { record: "Most 3-Pointers Made", value: "11", player: "Brody Clarke", team: "Niagara River Lions", date: "2024", note: "" },
    { record: "Most Rebounds", value: "23", player: "Tyrese Samuel", team: "Vancouver Bandits", date: "2025", note: "" },
    { record: "Most Assists", value: "14", player: "Nate Pierre-Louis", team: "Saskatchewan Rattlers", date: "2025", note: "" },
    { record: "Most Steals", value: "8", player: "Khalil Ahmad", team: "Edmonton Stingers", date: "2021", note: "" },
    { record: "Most Blocks", value: "8", player: "Mfiondu Kabengele", team: "Niagara River Lions", date: "2022", note: "" },
    { record: "Most Consecutive Points", value: "24", player: "Cat Barber", team: "Scarborough Shooting Stars", date: "Jul 13", note: "Consecutive points in single game" }
  ],

  singleSeason: [
    { record: "Most Total Points", value: "582", player: "Sean East II", team: "Edmonton Stingers", date: "2025", note: "Broke Teddy Allen's 2023 record (544)" },
    { record: "Highest PPG (qualified)", value: "26.3", player: "Teddy Allen", team: "Niagara River Lions", date: "2023", note: "MVP season" },
    { record: "Most Rebounds (Total)", value: "237", player: "Tyrese Samuel", team: "Vancouver Bandits", date: "2025", note: "10.8 RPG, 65.9% FG" },
    { record: "Highest FG%", value: "65.9%", player: "Tyrese Samuel", team: "Vancouver Bandits", date: "2025", note: "Min. 100 attempts" },
    { record: "Most Assists (Total)", value: "174", player: "Nate Pierre-Louis", team: "Saskatchewan Rattlers", date: "2025", note: "7.9 APG (CEBL leader)" },
    { record: "Most Steals (Total)", value: "57", player: "Jameer Nelson Jr.", team: "Calgary Surge", date: "2025", note: "DPOY season" },
    { record: "Most Blocks", value: "41", player: "Greg Brown III", team: "Calgary Surge", date: "2025", note: "All-CEBL 1st Team" },
    { record: "Best Team Record", value: "19-5", player: "Vancouver Bandits", team: "(team)", date: "2025", note: "League-best record" }
  ],

  careerLeaders: [
    { rank: 1, category: "Career Points", player: "Cat Barber", value: "1,400+", team: "Scarborough Shooting Stars", note: "All-time CEBL leading scorer" },
    { rank: 2, category: "Career Points", player: "Ahmed Hill", value: "1,200+", team: "Multiple teams", note: "Former #1 all-time" },
    { rank: 3, category: "Career Points", player: "Xavier Moon", value: "1,100+", team: "Edmonton/Saskatchewan", note: "3x MVP" },
    { rank: 1, category: "Career Assists", player: "Cat Barber", value: "300+", team: "Scarborough", note: "2nd to 300 club" },
    { rank: 1, category: "Career Rebounds (HB)", player: "Prince Oduro", value: "429", team: "Brampton Honey Badgers", note: "All-time HB rebound leader" },
    { rank: 1, category: "Career Games (HB)", player: "Prince Oduro", value: "73", team: "Brampton Honey Badgers", note: "All-time HB games leader" },
    { rank: 1, category: "Career Blocks (HB)", player: "Prince Oduro", value: "79", team: "Brampton Honey Badgers", note: "All-time HB blocks leader" }
  ],

  // 1,000-point club
  thousandPointClub: [
    { player: "Cat Barber", team: "Scarborough Shooting Stars", points: "1,400+", year: "2023", note: "First & all-time leader" },
    { player: "Ahmed Hill", team: "Multiple", points: "1,200+", year: "2024", note: "" },
    { player: "Xavier Moon", team: "Edmonton/Saskatchewan", points: "1,100+", year: "2024", note: "3x MVP" }
  ]
};

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

// ===== STAT LEADERS - 2025 SEASON =====
// Pulled from actual CEBL data; players ranked by category
const statLeaders2025 = {
  ppg: [
    { rank: 1, player: "Ja'Vonte Smart", team: "Ottawa BlackJacks", value: 25.9, note: "League PPG leader" },
    { rank: 2, player: "Sean East II", team: "Edmonton Stingers", value: 25.3, note: "Total points record (582)" },
    { rank: 3, player: "Mitch Creek", team: "Vancouver Bandits", value: 24.4, note: "MVP" },
    { rank: 4, player: "Cat Barber", team: "Scarborough Shooting Stars", value: 19.2, note: "Career CEBL leader" },
    { rank: 5, player: "Greg Brown III", team: "Calgary Surge", value: 19.7, note: "All-CEBL 1st Team" },
    { rank: 6, player: "Quinndary Weatherspoon", team: "Brampton Honey Badgers", value: 18.5, note: "2022 NBA champion" },
    { rank: 7, player: "Donovan Williams", team: "Scarborough Shooting Stars", value: 17.2, note: "" },
    { rank: 8, player: "Jameer Nelson Jr.", team: "Calgary Surge", value: 17.3, note: "DPOY" },
    { rank: 9, player: "Khalil Ahmad", team: "Niagara River Lions", value: 22.0, note: "Finals MVP" },
    { rank: 10, player: "Xavier Moon", team: "Saskatchewan Rattlers", value: 21.0, note: "3x MVP (2019-2021)" }
  ],
  rpg: [
    { rank: 1, player: "Isaiah Moore", team: "Ottawa BlackJacks", value: 11.4, note: "League RPG leader" },
    { rank: 2, player: "Tyrese Samuel", team: "Vancouver Bandits", value: 10.8, note: "Canadian POY" },
    { rank: 3, player: "Elijah Lufile", team: "Niagara River Lions", value: 10.6, note: "Double-double machine" },
    { rank: 4, player: "Greg Brown III", team: "Calgary Surge", value: 8.2, note: "" },
    { rank: 5, player: "Jaden Bediako", team: "Free Agent", value: 8.5, note: "Brampton native" },
    { rank: 6, player: "Keon Ambrose-Hylton", team: "Edmonton Stingers", value: 8.1, note: "All-Canadian" },
    { rank: 7, player: "Mitch Creek", team: "Vancouver Bandits", value: 7.0, note: "MVP" },
    { rank: 8, player: "Christian Rohlehr", team: "Ottawa BlackJacks", value: 6.5, note: "Re-signed 2026" },
    { rank: 9, player: "Loudon Love", team: "Niagara River Lions", value: 9.0, note: "2024 champion" },
    { rank: 10, player: "Lloyd Pandi", team: "Ottawa BlackJacks", value: 7.0, note: "DPOY (2024)" }
  ],
  apg: [
    { rank: 1, player: "Nate Pierre-Louis", team: "Saskatchewan Rattlers", value: 7.9, note: "League APG leader" },
    { rank: 2, player: "Corey Davis Jr.", team: "Brampton Honey Badgers", value: 7.8, note: "Now in Germany BBL" },
    { rank: 3, player: "Xavier Moon", team: "Saskatchewan Rattlers", value: 7.0, note: "" },
    { rank: 4, player: "Kadre Gray", team: "Scarborough Shooting Stars", value: 5.5, note: "" },
    { rank: 5, player: "Sean East II", team: "Edmonton Stingers", value: 5.8, note: "" },
    { rank: 6, player: "Marcus Carr", team: "Vancouver Bandits", value: 5.3, note: "Toronto native" },
    { rank: 7, player: "Trae Bell-Haynes", team: "Casademont Zaragoza", value: 4.7, note: "Spain Liga ACB" },
    { rank: 8, player: "Cat Barber", team: "Scarborough Shooting Stars", value: 3.9, note: "" },
    { rank: 9, player: "Justin Harmon", team: "Ottawa BlackJacks", value: 4.5, note: "Re-signed 2026" },
    { rank: 10, player: "Jameer Nelson Jr.", team: "Calgary Surge", value: 4.0, note: "DPOY" }
  ],
  spg: [
    { rank: 1, player: "Jameer Nelson Jr.", team: "Calgary Surge", value: 2.6, note: "57 total (record), DPOY" },
    { rank: 2, player: "Khalil Ahmad", team: "Niagara River Lions", value: 1.6, note: "Finals MVP" },
    { rank: 3, player: "Sean East II", team: "Edmonton Stingers", value: 1.5, note: "" },
    { rank: 4, player: "Mitch Creek", team: "Vancouver Bandits", value: 1.6, note: "MVP" }
  ],
  bpg: [
    { rank: 1, player: "Greg Brown III", team: "Calgary Surge", value: 1.8, note: "41 total (3rd all-time)" },
    { rank: 2, player: "Mfiondu Kabengele", team: "Pre-Dubai", value: 1.5, note: "Now EuroLeague" },
    { rank: 3, player: "Christian Rohlehr", team: "Ottawa BlackJacks", value: 1.3, note: "" },
    { rank: 4, player: "Jaden Bediako", team: "Free Agent", value: 2.2, note: "Brampton native" }
  ],
  fg: [
    { rank: 1, player: "Tyrese Samuel", team: "Vancouver Bandits", value: 65.9, note: "Best (min 100 att.)" },
    { rank: 2, player: "Keon Ambrose-Hylton", team: "Edmonton Stingers", value: 64.5, note: "All-Canadian" },
    { rank: 3, player: "Greg Brown III", team: "Calgary Surge", value: 54.0, note: "" },
    { rank: 4, player: "Xavier Moon", team: "Saskatchewan Rattlers", value: 48.0, note: "" }
  ],
  threePt: [
    { rank: 1, player: "Mitch Creek", team: "Vancouver Bandits", value: 48.6, note: "3rd in CEBL" },
    { rank: 2, player: "Justin Harmon", team: "Ottawa BlackJacks", value: 47.2, note: "From G League" },
    { rank: 3, player: "Brody Clarke", team: "Niagara River Lions", value: 42.0, note: "Sharpshooter" },
    { rank: 4, player: "Koby McEwen", team: "Vancouver Bandits", value: 42.3, note: "Canadian POY 2024" }
  ],
  ft: [
    { rank: 1, player: "Sean East II", team: "Edmonton Stingers", value: 90.0, note: "50/40/90 club" },
    { rank: 2, player: "Kevin Osawe", team: "Montreal Alliance", value: 87.8, note: "" }
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
