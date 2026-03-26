// ===== CEBL Scout - Player Database =====
// Data compiled from CEBL.ca, RealGM, BasketballBuzz, North Pole Hoops, USBasket
// Excludes: NBA, EuroLeague, CBA, and any league paying avg >$1M USD

const CEBL_CONFIG = {
  perGameCap: 8000,
  minSalary: 400,
  maxSalary: 1500,
  maxActiveRoster: 12,
  minActiveRoster: 10,
  maxTotalRoster: 14,
  maxImportActive: 5,
  maxImportTotal: 6,
  minCanadians: 6,
  canadiansOnFloor: 2,
  maxDevOffCap: 3,
  designatedPlayers: 1,
  season: "2026",
  // Leagues EXCLUDED (avg salary >$1M or elite tier)
  excludedLeagues: ["NBA", "EuroLeague", "CBA (China)", "ACB (top clubs)"],
  // Leagues INCLUDED for scouting
  includedLeagues: [
    "Germany BBL ($100K-$300K avg)",
    "France LNB Pro A ($80K-$200K avg)",
    "France Pro B ($40K-$100K avg)",
    "Italy Lega Basket ($80K-$250K avg)",
    "Greece HEBA A1 ($60K-$250K avg)",
    "Turkey BSL ($150K-$450K avg)",
    "Adriatic League ABA ($150K-$200K avg)",
    "Australia NBL (~$120K USD avg)",
    "Japan B.League ($100K-$300K avg)",
    "South Korea KBL ($100K-$300K avg)",
    "Spain LEB Gold ($50K-$150K avg)",
    "UK BBL ($30K-$80K avg)",
    "Netherlands BNXT ($40K-$120K avg)",
    "Czech Republic NBL ($30K-$80K avg)",
    "Lebanon LBL ($30K-$100K avg)",
    "Argentina LNB ($30K-$80K avg)",
    "Philippines PBA ($20K-$500K avg)",
    "Finland Korisliiga ($40K-$100K avg)",
    "NZ NBL ($20K-$60K avg)",
    "NBA G League (~$40K avg)"
  ]
};

// Honey Badgers 2026 Confirmed Roster (ONLY verified 2026 signings from cebl.ca/honeybadgers.ca)
const honeyBadgersRoster = [
  { name: "Sean East II", pos: "G", nationality: "USA", type: "Import", status: "Signed", salary: 1400, stats: "25.3 PPG, 3.2 RPG, 5.8 APG (2025 Edmonton)", note: "2025 CEBL MVP Runner-Up, All-CEBL 1st Team. Led CEBL in total points (582) and FGM (215). 36-pt season high.", character: "Elite competitor, leadership qualities" },
  { name: "Jameer Nelson Jr.", pos: "G", nationality: "USA", type: "Import", status: "Signed", salary: 1400, stats: "17.3 PPG, 5.8 RPG, 4.0 APG (2025 Calgary)", note: "2025 CEBL DPOY. All-CEBL selection. Led CEBL in steals. NBA pedigree.", character: "High motor, defensive anchor" },
  { name: "Keon Ambrose-Hylton", pos: "F", nationality: "CAN", type: "Canadian", status: "Signed", salary: 1000, stats: "All-Canadian selection", note: "CEBL All-Canadian forward. Physical, athletic.", character: "Community-oriented, strong work ethic" },
  { name: "Danilo Djuricic", pos: "F", nationality: "CAN", type: "Canadian", status: "Signed", salary: 600, stats: "5.5 PPG, 3.7 RPG (2025 Scarborough)", note: "4 CEBL seasons with Scarborough. 2023 champion. Brampton native.", character: "Reliable team player" },
  { name: "Prince Oduro", pos: "F/C", nationality: "CAN", type: "Canadian", status: "Signed", salary: 700, stats: "9.0 PPG, 6.0 RPG, 1.0 BPG (career)", note: "5th consecutive season. All-time HB leader: games (73), rebounds (429), blocks (79). 2022 champion.", character: "Franchise cornerstone, warrior" }
];

// Canadian Players Playing Pro Overseas (CEBL-realistic leagues only, NO NBA/EuroLeague/CBA)
const canadiansPro = [
  // === CEBL Veterans (2024-2025 seasons, Canadian) ===
  { name: "Koby McEwen", pos: "G", age: 27, ht: "6'1\"", team: "Vancouver/Brampton", league: "CEBL", ppg: 14.5, rpg: 3.5, apg: 4.0, fit: "High", salary: "$1,000-$1,200", character: "Good", hometown: "Hamilton, ON", note: "2024 Canadian POY. Multi-year CEBL vet. Hamilton/Brampton/Vancouver." },
  { name: "Brody Clarke", pos: "F", age: 28, ht: "6'7\"", team: "Edmonton Stingers", league: "CEBL", ppg: 8.0, rpg: 5.0, apg: 1.5, fit: "Medium", salary: "$700-$900", character: "Good", hometown: "Edmonton, AB", note: "Multi-year Stingers veteran. Loyal franchise cornerstone." },
  { name: "Adika Peter-McNeilly", pos: "G", age: 30, ht: "6'3\"", team: "Edmonton Stingers", league: "CEBL", ppg: 10.0, rpg: 3.0, apg: 3.0, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "6th Man of Year 2021. Multi-year Stingers guard." },
  { name: "Shamiel Stevenson", pos: "G/F", age: 26, ht: "6'5\"", team: "Brampton 2024", league: "CEBL", ppg: 12.0, rpg: 4.5, apg: 1.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "Former Pittsburgh/Nevada. Physical wing." },
  { name: "Cody John", pos: "G", age: 28, ht: "6'4\"", team: "Saskatchewan", league: "CEBL", ppg: 9.0, rpg: 3.0, apg: 2.5, fit: "Medium", salary: "$700-$900", character: "Good", hometown: "Toronto, ON", note: "Multi-year CEBL vet across multiple teams." },
  { name: "Duane Notice", pos: "G", age: 30, ht: "6'1\"", team: "Vancouver", league: "CEBL", ppg: 8.5, rpg: 2.5, apg: 4.0, fit: "Medium", salary: "$700-$900", character: "Good", hometown: "Ajax, ON", note: "Syracuse product. Multi-year CEBL playmaker." },
  { name: "Diego Maffia", pos: "G", age: 24, ht: "6'0\"", team: "Vancouver Bandits", league: "CEBL", ppg: 6.0, rpg: 2.0, apg: 3.0, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Victoria, BC", note: "U SPORTS champion. Victoria Vikes product." },
  { name: "Grant Shephard", pos: "C", age: 29, ht: "6'10\"", team: "Vancouver", league: "CEBL", ppg: 7.0, rpg: 5.5, apg: 0.5, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Langley, BC", note: "Multi-year CEBL big. BC native." },
  { name: "Kalif Young", pos: "C", age: 28, ht: "6'8\"", team: "Scarborough", league: "CEBL", ppg: 9.5, rpg: 7.0, apg: 1.0, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "Multi-year Scarborough big. Robert Morris product." },
  { name: "Aaron Best", pos: "G", age: 26, ht: "6'3\"", team: "Scarborough", league: "CEBL", ppg: 8.0, rpg: 2.5, apg: 3.0, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Scarborough guard. Multi-season." },
  { name: "Jackson Rowe", pos: "F", age: 27, ht: "6'7\"", team: "Ottawa/Scarborough", league: "CEBL", ppg: 10.5, rpg: 5.5, apg: 1.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "Versatile Canadian forward. CEBL veteran." },
  { name: "Kadre Gray", pos: "G", age: 27, ht: "6'2\"", team: "Ottawa/Scarborough", league: "CEBL", ppg: 12.0, rpg: 3.0, apg: 5.5, fit: "High", salary: "$900-$1,100", character: "Good", hometown: "Toronto, ON", note: "2023 Canadian POY. Laurentian legend. Elite playmaker." },
  { name: "Malcolm Duvivier", pos: "G", age: 30, ht: "6'0\"", team: "Vancouver/Montreal", league: "CEBL", ppg: 7.5, rpg: 2.0, apg: 3.5, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Multi-year CEBL veteran. Oregon State product." },
  { name: "Mamadou Gueye", pos: "F", age: 28, ht: "6'8\"", team: "Montreal", league: "CEBL", ppg: 7.0, rpg: 5.0, apg: 0.8, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Montreal, QC", note: "Multi-year CEBL forward. Physical inside presence." },
  { name: "Jordy Tshimanga", pos: "C", age: 27, ht: "6'9\"", team: "Calgary", league: "CEBL", ppg: 8.5, rpg: 6.5, apg: 1.0, fit: "High", salary: "$700-$900", character: "Good", hometown: "Ottawa, ON", note: "Calgary big man. Multi-year CEBL." },
  { name: "Mathieu Kamba", pos: "G", age: 28, ht: "6'4\"", team: "Edmonton/Calgary", league: "CEBL", ppg: 9.0, rpg: 3.0, apg: 2.5, fit: "Medium", salary: "$700-$900", character: "Good", hometown: "Montreal, QC", note: "Multi-year CEBL guard. Edmonton/Calgary." },
  { name: "Shane Osayande", pos: "F", age: 29, ht: "6'7\"", team: "Winnipeg/Saskatchewan", league: "CEBL", ppg: 7.5, rpg: 5.0, apg: 1.0, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Windsor, ON", note: "Multi-year CEBL forward." },
  { name: "Simon Hildebrandt", pos: "F", age: 24, ht: "6'8\"", team: "Winnipeg", league: "CEBL", ppg: 7.0, rpg: 4.5, apg: 1.0, fit: "High", salary: "$500-$700", character: "Good", hometown: "Winnipeg, MB", note: "2024 Dev Player of Year. Manitoba native." },
  { name: "Chad Posthumus", pos: "C", age: 33, ht: "6'10\"", team: "Winnipeg", league: "CEBL", ppg: 6.5, rpg: 5.5, apg: 0.5, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Abbotsford, BC", note: "Multi-year CEBL veteran. Rim protector." },
  { name: "Mason Bourcier", pos: "G", age: 26, ht: "6'2\"", team: "Winnipeg/Edmonton", league: "CEBL", ppg: 7.0, rpg: 2.5, apg: 3.0, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Kingston, ON", note: "Multi-year CEBL guard." },
  { name: "Abu Kigab", pos: "F", age: 27, ht: "6'7\"", team: "Ottawa", league: "CEBL", ppg: 11.0, rpg: 5.0, apg: 2.0, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Edmonton, AB", note: "Ottawa forward. Oregon product. South Sudanese-Canadian." },
  { name: "Maxime Boursiquot", pos: "G", age: 26, ht: "6'4\"", team: "Ottawa/Montreal", league: "CEBL", ppg: 8.0, rpg: 3.0, apg: 2.5, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Montreal, QC", note: "Multi-year CEBL guard." },
  { name: "Calvin Epistola", pos: "G", age: 25, ht: "6'1\"", team: "Scarborough/Ottawa", league: "CEBL", ppg: 6.5, rpg: 2.0, apg: 3.0, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Winnipeg, MB", note: "Multi-year CEBL guard." },
  { name: "Nikola Djogo", pos: "F", age: 26, ht: "6'7\"", team: "Ottawa", league: "CEBL", ppg: 8.5, rpg: 4.0, apg: 1.5, fit: "Medium", salary: "$700-$900", character: "Good", hometown: "Mississauga, ON", note: "Notre Dame product. Versatile Canadian forward." },
  { name: "Michael Okafor", pos: "G", age: 25, ht: "6'3\"", team: "Brampton", league: "CEBL", ppg: 7.5, rpg: 2.5, apg: 2.5, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Multi-year Honey Badger." },
  { name: "Simi Shittu", pos: "F/C", age: 25, ht: "6'9\"", team: "Calgary/Winnipeg", league: "CEBL", ppg: 10.0, rpg: 6.0, apg: 1.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Burlington, ON", note: "Vanderbilt product. Former NBA Summer League." },
  { name: "Deon Ejim", pos: "F", age: 25, ht: "6'7\"", team: "Calgary", league: "CEBL", ppg: 8.0, rpg: 4.5, apg: 1.0, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Calgary Canadian forward." },
  { name: "Anthony Tsegakele", pos: "F", age: 26, ht: "6'8\"", team: "Saskatchewan", league: "CEBL", ppg: 8.0, rpg: 5.5, apg: 0.8, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Ottawa, ON", note: "Multi-year Rattlers forward." },
  { name: "Stef Smith", pos: "G", age: 27, ht: "6'2\"", team: "Calgary", league: "CEBL", ppg: 12.0, rpg: 3.0, apg: 3.5, fit: "High", salary: "$900-$1,100", character: "Good", hometown: "Burlington, ON", note: "Vermont product. Signed with G League. Scoring guard." },
  { name: "Guillaume Payen-Boucard", pos: "F", age: 30, ht: "6'7\"", team: "Niagara/Montreal", league: "CEBL", ppg: 8.0, rpg: 5.0, apg: 1.5, fit: "Medium", salary: "$700-$900", character: "Good", hometown: "Montreal, QC", note: "2019 Canadian POY. Multi-year CEBL veteran." },
  { name: "Kimbal Mackenzie", pos: "G", age: 28, ht: "6'2\"", team: "Niagara", league: "CEBL", ppg: 7.5, rpg: 2.0, apg: 3.0, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Canada", note: "Multi-year Niagara guard." },
  { name: "Jordan Tchuente", pos: "F", age: 24, ht: "6'7\"", team: "Niagara", league: "CEBL", ppg: 6.5, rpg: 4.0, apg: 0.8, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Montreal, QC", note: "Developing Niagara forward." },
  { name: "Maurice Calloo", pos: "F/C", age: 26, ht: "6'9\"", team: "Niagara/Calgary", league: "CEBL", ppg: 7.0, rpg: 5.0, apg: 0.8, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Brampton, ON", note: "BRAMPTON native. Multi-year CEBL big." },
  { name: "Meshack Lufile", pos: "C", age: 27, ht: "6'10\"", team: "Niagara/Edmonton", league: "CEBL", ppg: 6.0, rpg: 5.5, apg: 0.5, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Ottawa, ON", note: "Multi-year CEBL center. Rim presence." },
  { name: "Elijah Ifejeh", pos: "F", age: 26, ht: "6'7\"", team: "Montreal/Saskatchewan", league: "CEBL", ppg: 8.0, rpg: 4.5, apg: 1.0, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Canada", note: "Multi-year CEBL forward." },
  { name: "Abdul Mohamed", pos: "F", age: 26, ht: "6'6\"", team: "Montreal", league: "CEBL", ppg: 7.0, rpg: 4.0, apg: 1.0, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Ottawa, ON", note: "Montreal forward." },
  { name: "Abdullah Shittu", pos: "F", age: 25, ht: "6'7\"", team: "Montreal/Edmonton", league: "CEBL", ppg: 7.5, rpg: 4.5, apg: 0.8, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Multi-year CEBL forward." },
  { name: "Bahaide Haidara", pos: "F", age: 24, ht: "6'6\"", team: "Montreal", league: "CEBL", ppg: 6.0, rpg: 3.5, apg: 1.0, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Montreal, QC", note: "Montreal Canadian forward." },
  { name: "Jaheem Joseph", pos: "G", age: 23, ht: "6'1\"", team: "Montreal", league: "CEBL", ppg: 6.5, rpg: 2.0, apg: 3.0, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Montreal, QC", note: "Montreal draft pick guard." },
  { name: "Kevin Bercy", pos: "F", age: 30, ht: "6'6\"", team: "Edmonton", league: "CEBL", ppg: 8.0, rpg: 4.0, apg: 1.5, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Montreal, QC", note: "Multi-year CEBL forward." },
  { name: "Aaron Rhooms", pos: "F", age: 25, ht: "6'7\"", team: "Edmonton", league: "CEBL", ppg: 7.5, rpg: 4.5, apg: 1.0, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Edmonton forward." },
  { name: "Taye Donald", pos: "G", age: 24, ht: "6'3\"", team: "Edmonton", league: "CEBL", ppg: 7.0, rpg: 2.5, apg: 3.0, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Edmonton, AB", note: "Edmonton draft pick." },
  { name: "Sabry Philip", pos: "G", age: 24, ht: "6'2\"", team: "Edmonton", league: "CEBL", ppg: 6.5, rpg: 2.0, apg: 2.5, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Ottawa, ON", note: "Edmonton guard." },
  { name: "Geoffrey James", pos: "G", age: 24, ht: "6'3\"", team: "Winnipeg", league: "CEBL", ppg: 6.0, rpg: 2.0, apg: 2.5, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Canada", note: "Winnipeg draft pick guard." },
  { name: "Shawn Maranan", pos: "G", age: 25, ht: "6'1\"", team: "Winnipeg", league: "CEBL", ppg: 7.0, rpg: 2.0, apg: 3.0, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Winnipeg, MB", note: "Winnipeg hometown guard." },
  { name: "Kyler Filewich", pos: "F/C", age: 25, ht: "6'9\"", team: "Winnipeg", league: "CEBL", ppg: 7.0, rpg: 5.0, apg: 0.5, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Winnipeg, MB", note: "Winnipeg hometown big." },
  { name: "Glen Yang", pos: "G", age: 25, ht: "6'2\"", team: "Vancouver", league: "CEBL", ppg: 6.5, rpg: 2.0, apg: 2.5, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Canada", note: "Vancouver multi-year guard." },
  { name: "Mychael Paulo", pos: "G", age: 24, ht: "6'3\"", team: "Brampton", league: "CEBL", ppg: 7.0, rpg: 2.5, apg: 2.5, fit: "Medium", salary: "$500-$700", character: "Good", hometown: "Toronto, ON", note: "Brampton guard." },
  { name: "Jabs Newby", pos: "G", age: 27, ht: "6'1\"", team: "Brampton/Niagara", league: "CEBL", ppg: 8.0, rpg: 2.5, apg: 3.5, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Jamaica/Canada", note: "Multi-year CEBL guard." },
  { name: "Tyrrel Tate", pos: "F", age: 29, ht: "6'5\"", team: "Ottawa", league: "CEBL", ppg: 8.0, rpg: 4.0, apg: 1.5, fit: "Medium", salary: "$700-$900", character: "Good", hometown: "Toronto, ON", note: "Multi-year CEBL forward." },
  { name: "Lloyd Pandi", pos: "F", age: 26, ht: "6'7\"", team: "Ottawa", league: "CEBL", ppg: 8.5, rpg: 7.0, apg: 1.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Ottawa, ON", note: "2024 DPOY. Ottawa's defensive anchor." },
  { name: "Devonte Bandoo", pos: "G", age: 27, ht: "6'3\"", team: "Saskatchewan", league: "CEBL", ppg: 10.0, rpg: 3.0, apg: 3.0, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Brampton, ON", note: "BRAMPTON native. Baylor product. Scoring guard." },
  { name: "Karim Mane", pos: "G", age: 23, ht: "6'5\"", team: "Calgary 2025", league: "CEBL", ppg: 11.0, rpg: 4.0, apg: 3.0, fit: "High", salary: "$900-$1,100", character: "Good", hometown: "Montreal, QC", note: "Former NBA (Raptors camp). Quebec native." },
  { name: "Otas Iyekekpolor", pos: "F", age: 27, ht: "6'8\"", team: "Calgary", league: "CEBL", ppg: 7.5, rpg: 5.0, apg: 1.0, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Canada", note: "Multi-year CEBL forward." },
  { name: "Keevan Veinot", pos: "G", age: 27, ht: "6'2\"", team: "Ottawa/Hamilton", league: "CEBL", ppg: 9.0, rpg: 3.0, apg: 3.0, fit: "High", salary: "$700-$900", character: "Good", hometown: "Dartmouth, NS", note: "Atlantic Canada. Multi-year CEBL." },
  { name: "Ammanuel Diressa", pos: "G", age: 27, ht: "6'4\"", team: "Scarborough", league: "CEBL", ppg: 8.0, rpg: 3.0, apg: 2.5, fit: "Medium", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Ryerson/TMU product. Scarborough guard." },
  { name: "Aaryn Rai", pos: "F", age: 25, ht: "6'7\"", team: "Niagara", league: "CEBL", ppg: 9.0, rpg: 5.0, apg: 1.0, fit: "High", salary: "$700-$900", character: "Good", hometown: "Canada", note: "2024 6th Man of Year. Canadian." },
  // === Overseas Canadians - European/International domestic leagues ===
  { name: "Kevin Osawe", pos: "F", age: 27, ht: "6'7\"", team: "Germany Div. Pro", league: "Europe - Germany", ppg: 17.2, rpg: 7.8, apg: 1.2, fit: "High", salary: "$1,000-$1,200", character: "Good", hometown: "Brampton, ON", note: "Re-signed with Montreal Alliance for 2026. Brampton native. 87.8% FT in CEBL." },
  { name: "Emmanuel Bandoumel", pos: "G", age: 25, ht: "6'4\"", team: "Kauhajoen Karhu (Finland)", league: "Europe - Finland", ppg: 22.4, rpg: 6.0, apg: 2.1, fit: "High", salary: "$1,000-$1,300", character: "Good", hometown: "Quebec City, QC", note: "Signed with Edmonton Stingers for 2026. SMU product. 3.2 SPG overseas." },
  { name: "T.J. Lall", pos: "F", age: 26, ht: "6'6\"", team: "ZZ Leiden (BNXT)", league: "Europe - Netherlands", ppg: 8.5, rpg: 4.2, apg: 1.1, fit: "High", salary: "$700-$900", character: "Good", hometown: "Cambridge, ON", note: "Re-signed with Niagara. BNXT League experience. 2024 CEBL champion." },
  { name: "Nathan Cayo", pos: "F", age: 28, ht: "6'6\"", team: "ADA Blois Basket", league: "Europe - France Pro B", ppg: 9.4, rpg: 3.7, apg: 0.9, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Montreal, QC", note: "Re-signed Niagara. France LNB Pro B. Back-to-back CEBL champion." },
  { name: "Elijah Lufile", pos: "F", age: 25, ht: "6'7\"", team: "Nadim Souaid Academy", league: "Asia - Lebanon", ppg: 14.1, rpg: 10.6, apg: 1.0, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Ottawa, ON", note: "Signed with Niagara for 2026. Lebanon Division A. Double-double machine." },
  { name: "Marcus Carr", pos: "G", age: 26, ht: "6'2\"", team: "One Wuerzburg Baskets", league: "Europe - Germany BBL", ppg: 14.8, rpg: 2.5, apg: 5.3, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Toronto, ON", note: "BBL (Germany). Former Big Ten standout (Minnesota). Elite scorer and playmaker." },
  { name: "David Walker", pos: "G", age: 26, ht: "6'4\"", team: "Slavia (Czech Republic)", league: "Europe - Czech NBL", ppg: 12.3, rpg: 3.1, apg: 3.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "Signed with Winnipeg Sea Bears for 2026. Czech Republic NBL experience." },
  { name: "Ali Sow", pos: "F", age: 24, ht: "6'5\"", team: "Free Agent", league: "CEBL", ppg: 8.2, rpg: 4.1, apg: 1.3, fit: "High", salary: "$600-$800", character: "Good", hometown: "Kitchener, ON", note: "Former Honey Badger (2025). Laurier All-Time Great. CEBL experienced." },
  { name: "Patrick Emilien", pos: "F", age: 25, ht: "6'7\"", team: "Free Agent", league: "CEBL", ppg: 7.5, rpg: 5.0, apg: 0.8, fit: "High", salary: "$600-$800", character: "Good", hometown: "Montreal, QC", note: "Returning Honey Badger from 2025. Strong rebounder, physical forward." },
  { name: "Amari Kelly", pos: "F", age: 24, ht: "6'8\"", team: "Free Agent", league: "G League / CEBL", ppg: 9.1, rpg: 5.5, apg: 0.7, fit: "High", salary: "$700-$900", character: "Good", hometown: "Toronto, ON", note: "G League and NBA Summer League tested. Athletic forward with upside." },
  { name: "David Muenkat", pos: "G/F", age: 27, ht: "6'5\"", team: "Free Agent", league: "CEBL", ppg: 10.5, rpg: 4.3, apg: 2.1, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Brampton, ON", note: "BRAMPTON NATIVE. 4th CEBL season in 2025. Hometown fan favorite." },
  { name: "Fareed Shittu", pos: "F", age: 25, ht: "6'5\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 7.8, rpg: 4.5, apg: 1.0, fit: "High", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Signed with Winnipeg for 2026. Versatile Canadian forward." },
  { name: "Tyrese Samuel", pos: "F/C", age: 25, ht: "6'10\"", team: "Vancouver Bandits", league: "CEBL", ppg: 21.7, rpg: 10.8, apg: 1.5, fit: "High", salary: "$1,200-$1,500", character: "Good", hometown: "Montreal, QC", note: "2025 Canadian Player of the Year. 65.9 FG%. Suns Exhibit 10 (waived)." },
  { name: "Keeshawn Barthelemy", pos: "G", age: 24, ht: "6'2\"", team: "Montreal Alliance", league: "CEBL", ppg: 11.5, rpg: 2.8, apg: 4.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Montreal, QC", note: "Montreal native joining Alliance for 2026. Colorado product." },
  { name: "Alain Louis", pos: "G", age: 26, ht: "6'1\"", team: "Otago Nuggets (NZ NBL)", league: "Oceania - NZ NBL", ppg: 12.0, rpg: 3.0, apg: 5.5, fit: "High", salary: "$700-$900", character: "Good", hometown: "Montreal, QC", note: "Carleton U legend. 3x national champ. CEBL DPOY with Montreal. Spain & UK experience." },
  { name: "Jaden Bediako", pos: "C", age: 24, ht: "6'10\"", team: "Free Agent", league: "CEBL", ppg: 8.6, rpg: 8.5, apg: 0.5, fit: "High", salary: "$700-$900", character: "Good", hometown: "Brampton, ON", note: "BRAMPTON native. 2.2 BPG. Rim protector who deters paint attacks." },
  { name: "Trae Bell-Haynes", pos: "G", age: 28, ht: "6'0\"", team: "Casademont Zaragoza", league: "Europe - Spain Liga Endesa", ppg: 10.7, rpg: 2.3, apg: 6.2, fit: "Medium", salary: "$1,000-$1,300", character: "Good", hometown: "Toronto, ON", note: "Team Canada AmeriCup. Veteran PG. UVM legend. Barcelona interest reported." },
  { name: "Thomas Kennedy", pos: "C", age: 24, ht: "6'10\"", team: "Telekom Baskets Bonn", league: "Europe - Germany BBL", ppg: 11.8, rpg: 5.8, apg: 1.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "BBL & FIBA Champions League. 71.3% TS rookie year. Team Canada rep. Playmaking big." },
  { name: "Fardaws Aimaq", pos: "C", age: 24, ht: "6'11\"", team: "European Club", league: "Europe - FIBA Europe Cup", ppg: 12.0, rpg: 10.5, apg: 1.0, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Vancouver, BC", note: "BC native. Former NCAA star (Utah Valley, Texas Tech). Double-double machine. First pro season." },
  { name: "Javonte Brown-Ferguson", pos: "F/C", age: 24, ht: "6'9\"", team: "Tizona Burgos", league: "Europe - Spain Primera FEB", ppg: 10.5, rpg: 7.2, apg: 0.8, fit: "High", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Spanish 2nd division. Physical big man. Affordable Canadian talent." },
  { name: "Matteus Case", pos: "G", age: 23, ht: "6'3\"", team: "Vitoria SC", league: "Europe - Portugal Liga Betclic", ppg: 11.0, rpg: 3.0, apg: 3.5, fit: "High", salary: "$500-$700", character: "Good", hometown: "Toronto, ON", note: "Portuguese top league. Young scoring guard. Very affordable for CEBL." },
  { name: "Jahmal Abbey-Wright", pos: "G", age: 24, ht: "6'2\"", team: "KB Teuta Durres", league: "Europe - Albania Superliga", ppg: 15.5, rpg: 3.2, apg: 4.0, fit: "High", salary: "$500-$700", character: "Good", hometown: "Toronto, ON", note: "Albanian Superliga. High-volume scorer. Very cap-friendly for CEBL." },
  { name: "Ben Krikke", pos: "F/C", age: 24, ht: "6'9\"", team: "Ourense", league: "Europe - Spain LEB Gold", ppg: 9.5, rpg: 5.5, apg: 1.0, fit: "High", salary: "$600-$800", character: "Good", hometown: "Edmonton, AB", note: "Spanish 2nd division. Instinctive off-ball mover. Alberta talent." },
  { name: "Nick Ongenda", pos: "C", age: 23, ht: "6'10\"", team: "Anwil Wloclawek", league: "Europe - Poland/FIBA Europe Cup", ppg: 7.5, rpg: 6.0, apg: 0.5, fit: "High", salary: "$500-$700", character: "Good", hometown: "Montreal, QC", note: "Mobile rim protector. 7'4\" wingspan. Polish league. Very affordable." },
  { name: "Kaza Kajami-Keane", pos: "G", age: 30, ht: "6'2\"", team: "Niners Chemnitz", league: "Europe - Germany BBL", ppg: 10.0, rpg: 2.5, apg: 4.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "Germany BBL (Niners Chemnitz). Jamaican-Canadian. FIBA WC 2027 qualifier rep. Carleton product." },
  { name: "Kyle Alexander", pos: "C", age: 28, ht: "6'11\"", team: "European Club", league: "Europe", ppg: 8.0, rpg: 6.5, apg: 1.0, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Milton, ON", note: "Tennessee product. European leagues career. Rim protection and length." },
  { name: "Kassius Robertson", pos: "G", age: 29, ht: "6'3\"", team: "Valencia Basket area", league: "Europe - Spain", ppg: 11.0, rpg: 2.5, apg: 2.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "Spanish league. Missouri product. Reliable perimeter scorer." },
  { name: "Eddie Ekiyor", pos: "F/C", age: 28, ht: "6'7\"", team: "Saint-Quentin", league: "Europe - France Betclic Elite", ppg: 7.0, rpg: 3.0, apg: 3.0, fit: "High", salary: "$1,000-$1,200", character: "Good", hometown: "Ottawa, ON", note: "France Betclic Elite (Pro A). Carleton product, 2x U SPORTS champ, 2019 Final 8 MVP. CEBL DPOY with Niagara." },
  { name: "Jahvon Blair", pos: "G", age: 28, ht: "6'4\"", team: "Chorale de Roanne", league: "Europe - France Elite 2 (Pro B)", ppg: 14.5, rpg: 2.5, apg: 3.0, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "France Pro B. Career-high 34 pts vs Antibes. Georgetown product. Former Niagara River Lion." },
  { name: "Olivier Hanlan", pos: "G", age: 32, ht: "6'4\"", team: "KK Spartak Subotica", league: "Europe - Serbia KLS", ppg: 12.0, rpg: 3.0, apg: 3.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Gatineau, QC", note: "2015 NBA Draft (Utah Jazz, 42nd). Played in 11 countries. Veteran scorer." },
  { name: "Enoch Boakye", pos: "F", age: 22, ht: "6'9\"", team: "Spirou Basket Charleroi", league: "Europe - Belgium Pro Basketball League", ppg: 8.0, rpg: 5.5, apg: 0.8, fit: "High", salary: "$500-$700", character: "Good", hometown: "Toronto, ON", note: "Belgian Pro Basketball League. Young Canadian big. Previously Montenegro." },
  { name: "Daniel Sackey", pos: "G", age: 26, ht: "5'9\"", team: "Hyeres-Toulon Var Basket", league: "Europe - France Elite 2 (Pro B)", ppg: 10.5, rpg: 2.0, apg: 5.0, fit: "High", salary: "$500-$700", character: "Good", hometown: "Winnipeg, MB", note: "France Pro B. Ghanaian-Canadian. Quick, tenacious defender. Very cap-friendly." },
  { name: "Kur Jongkuch", pos: "F", age: 25, ht: "6'8\"", team: "Vancouver Bandits", league: "CEBL", ppg: 9.5, rpg: 6.0, apg: 1.0, fit: "High", salary: "$700-$900", character: "Good", hometown: "London, ON", note: "Team Canada call-up in 2025. Born in South Sudan. Physical forward." },
  { name: "Justin Ndjock-Tadjore", pos: "F", age: 25, ht: "6'8\"", team: "BK Ogre (Estonia-Latvia)", league: "Europe - Estonian-Latvian BBL", ppg: 10.0, rpg: 5.5, apg: 1.0, fit: "High", salary: "$600-$800", character: "Good", hometown: "Ottawa, ON", note: "Signed Ottawa BlackJacks for 2026. 3rd CEBL campaign. Estonian-Latvian league." },
  { name: "Devoe Joseph", pos: "G", age: 32, ht: "6'4\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 11.5, rpg: 3.5, apg: 3.0, fit: "Medium", salary: "$900-$1,100", character: "Good", hometown: "Scarborough, ON", note: "23 years pro experience. Scarborough native. Playing at home for first time since HS." },
  { name: "Nick Lewis", pos: "F", age: 31, ht: "6'7\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 10.0, rpg: 5.0, apg: 1.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Scarborough, ON", note: "23 years combined pro experience with Joseph. Scarborough native." },
  { name: "Conor Morgan", pos: "F", age: 31, ht: "6'9\"", team: "Bahcesehir Koleji Istanbul", league: "Europe - Turkey BSL", ppg: 9.0, rpg: 5.5, apg: 1.0, fit: "Medium", salary: "$1,000-$1,200", character: "Good", hometown: "Toronto, ON", note: "Turkish BSL. Physical Canadian forward. Long European career." },
  { name: "Quincy Guerrier", pos: "F", age: 25, ht: "6'7\"", team: "Raptors 905 / Montreal Alliance", league: "G League / CEBL", ppg: 14.0, rpg: 6.5, apg: 1.5, fit: "High", salary: "$1,000-$1,200", character: "Good", hometown: "Montreal, QC", note: "Expected to return to Montreal Alliance after G League. Syracuse/Oregon product. Athletic wing." },
  { name: "Nathan Bilamu", pos: "G", age: 24, ht: "6'3\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 19.7, rpg: 4.5, apg: 3.8, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Canada", note: "Signed Winnipeg 2026. 19.7 PPG senior university season. OUA First-Team All-Star. Lakehead product." },
  { name: "Mfiondu Kabengele", pos: "C", age: 28, ht: "6'10\"", team: "Reyer Venezia / BC Dubai", league: "Europe - Italy LBA / EuroCup", ppg: 13.4, rpg: 12.8, apg: 1.0, fit: "Low", salary: "$1,200-$1,500", character: "Good", hometown: "Burlington, ON", note: "Italian LBA & EuroCup (not EuroLeague). Double-double machine. Former NBA (Clippers, Cavaliers)." },
  { name: "Kevin Pangos", pos: "G", age: 32, ht: "6'2\"", team: "European Club", league: "Europe", ppg: 9.5, rpg: 2.0, apg: 5.0, fit: "Low", salary: "$1,000-$1,300", character: "Good", hometown: "Holland Landing, ON", note: "Most successful Canadian in EuroLeague history. 6 EuroLeague seasons. 2x All-EuroLeague." },
  // === Ex-NBA Canadians - Active Free Agents ===
  { name: "Nickeil Alexander-Walker", pos: "G", age: 27, ht: "6'5\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 12.0, rpg: 3.0, apg: 3.0, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Toronto, ON", note: "Former NBA (Pelicans, Jazz, Wolves, Timberwolves). Virginia Tech product. If unsigned by NBA team, CEBL target." },
  { name: "Chris Boucher", pos: "F/C", age: 33, ht: "6'9\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 9.0, rpg: 5.5, apg: 0.8, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Montreal, QC", note: "Former Raptors fan favorite. G League MVP/DPOY (2019). Montreal native. If unsigned by NBA, major CEBL addition." },
  { name: "Dalano Banton", pos: "G/F", age: 25, ht: "6'9\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 8.5, rpg: 3.5, apg: 3.0, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Toronto, ON", note: "Former Raptors. 1st Canadian born-and-raised Raptors draft pick (2021). Rexdale native." },
  { name: "Oshae Brissett", pos: "F", age: 27, ht: "6'7\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 8.0, rpg: 4.0, apg: 1.0, fit: "Medium", salary: "$1,000-$1,200", character: "Good", hometown: "Toronto, ON", note: "Former Pacers, Raptors, Celtics. Physical wing. If NBA market dries up, elite CEBL addition." },
  { name: "Mychal Mulder", pos: "G", age: 30, ht: "6'3\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 7.5, rpg: 2.0, apg: 1.0, fit: "Medium", salary: "$1,000-$1,200", character: "Good", hometown: "Windsor, ON", note: "Former Warriors. Elite 3-point shooter. Kentucky product. Windsor native." },
  { name: "Nate Darling", pos: "G", age: 27, ht: "6'4\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 10.0, rpg: 2.5, apg: 2.5, fit: "High", salary: "$1,000-$1,200", character: "Good", hometown: "Halifax, NS", note: "Former Hornets. Atlantic Canada talent. Delaware product. Strong 3-point shooter." },
  { name: "Ignas Brazdeikis", pos: "F", age: 26, ht: "6'7\"", team: "European Club", league: "Europe", ppg: 10.0, rpg: 3.5, apg: 1.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Mississauga, ON", note: "Former Knicks (2019 NBA Draft). European career. Oakville native. Michigan product." },
  { name: "Brandon Clarke", pos: "F/C", age: 29, ht: "6'8\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 10.0, rpg: 5.0, apg: 1.0, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Vancouver, BC", note: "Former Grizzlies. Gonzaga product. Vancouver native. Elite shot-blocker." },
  { name: "Trey Lyles", pos: "F/C", age: 30, ht: "6'10\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 8.5, rpg: 5.0, apg: 1.5, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Saskatoon, SK", note: "Former NBA (Jazz, Nuggets, Spurs, Kings, Pacers). Saskatchewan native. Lottery pick (12th, 2015)." },
  { name: "Lindell Wigginton", pos: "G", age: 26, ht: "6'2\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 11.0, rpg: 3.0, apg: 3.0, fit: "High", salary: "$900-$1,100", character: "Good", hometown: "Dartmouth, NS", note: "2021 Canadian POY. Iowa State product. Former NBA (Raptors). Atlantic Canada talent." }
];

// NCAA D1 Canadian Players (CEBL-realistic only - removed NBA-bound players)
const ncaaCanadians = [
  { name: "Emanuel Sharp", pos: "G", ht: "6'4\"", school: "Houston", conf: "Big 12", classYear: "Senior", hometown: "Toronto, ON", ppg: 12.1, rpg: 3.5, apg: 2.0, fit: "High", draftEligible: "2026 CEBL Draft", note: "Winningest Canadian in NCAA D1 history (128-20 record). Sharpshooter." },
  { name: "Kellen Tynes", pos: "G", ht: "6'1\"", school: "ACC Program", conf: "ACC", classYear: "Senior", hometown: "Dartmouth, NS", ppg: 9.8, rpg: 2.2, apg: 4.5, fit: "High", draftEligible: "2026 CEBL Draft", note: "Canadian NCAA steals record holder. Atlantic Canada trailblazer." },
  { name: "Amare Allen", pos: "G", ht: "6'3\"", school: "Maine", conf: "AEC", classYear: "Junior", hometown: "Toronto, ON", ppg: 14.5, rpg: 4.0, apg: 3.2, fit: "High", draftEligible: "2027", note: "One of 5 Canadians at Maine. Leading scorer." },
  { name: "Yanis Bamba", pos: "F", ht: "6'7\"", school: "Maine", conf: "AEC", classYear: "Sophomore", hometown: "Montreal, QC", ppg: 8.2, rpg: 6.1, apg: 1.0, fit: "Medium", draftEligible: "2028", note: "Athletic forward with developing skill set." },
  { name: "T.J. Biel", pos: "G", ht: "6'2\"", school: "Maine", conf: "AEC", classYear: "Junior", hometown: "Winnipeg, MB", ppg: 7.5, rpg: 2.1, apg: 2.8, fit: "Medium", draftEligible: "2027", note: "Steady Canadian guard." },
  { name: "Tristan Beckford", pos: "F", ht: "6'8\"", school: "South Florida", conf: "AAC", classYear: "Junior", hometown: "Toronto, ON", ppg: 9.8, rpg: 5.5, apg: 1.2, fit: "High", draftEligible: "2027", note: "FEIA product. One of 4 Canadians at USF." },
  { name: "Josh Omojafo", pos: "F", ht: "6'7\"", school: "South Florida", conf: "AAC", classYear: "Sophomore", hometown: "Brampton, ON", ppg: 6.5, rpg: 4.8, apg: 0.5, fit: "Medium", draftEligible: "2028", note: "BRAMPTON native. Physical forward developing at USF." },
  { name: "Augustas Brazdeikis", pos: "F", ht: "6'7\"", school: "Pacific", conf: "WCC", classYear: "Senior", hometown: "Mississauga, ON", ppg: 11.0, rpg: 4.5, apg: 1.8, fit: "High", draftEligible: "2026 CEBL Draft", note: "Versatile scorer. One of 4 Canadians at Pacific." },
  { name: "Bubu Benjamin", pos: "G", ht: "6'2\"", school: "George Washington", conf: "A-10", classYear: "Senior", hometown: "Toronto, ON", ppg: 10.5, rpg: 2.3, apg: 4.8, fit: "High", draftEligible: "2026 CEBL Draft", note: "One of 3 Canadians at GWU. Experienced point guard." },
  { name: "Jalen Rougier-Roane", pos: "G", ht: "6'4\"", school: "George Washington", conf: "A-10", classYear: "Junior", hometown: "Toronto, ON", ppg: 8.2, rpg: 3.0, apg: 2.5, fit: "Medium", draftEligible: "2027", note: "Athletic Canadian guard at GWU." },
  { name: "Sean Blake", pos: "F", ht: "6'6\"", school: "Vermont", conf: "AEC", classYear: "Senior", hometown: "Scarborough, ON", ppg: 12.5, rpg: 6.2, apg: 1.5, fit: "High", draftEligible: "2026 CEBL Draft", note: "Vermont standout. Strong Canadian forward prospect." },
  { name: "Ishan Sharma", pos: "F", ht: "6'8\"", school: "Saint Louis", conf: "A-10", classYear: "Junior", hometown: "Toronto, ON", ppg: 9.5, rpg: 5.0, apg: 1.0, fit: "High", draftEligible: "2027", note: "FEIA product. Stretch forward." },
  { name: "Elijah Mahi", pos: "G", ht: "6'3\"", school: "Santa Clara", conf: "WCC", classYear: "Junior", hometown: "Toronto, ON", ppg: 10.2, rpg: 2.5, apg: 3.8, fit: "High", draftEligible: "2027", note: "March Madness 2026 participant." },
  { name: "Adam Olsen", pos: "G/F", ht: "6'5\"", school: "South Alabama", conf: "Sun Belt", classYear: "Junior", hometown: "Vancouver, BC", ppg: 11.2, rpg: 4.5, apg: 2.3, fit: "High", draftEligible: "2027", note: "Western Canada talent. Versatile wing." },
  { name: "David Hansen", pos: "G", ht: "6'3\"", school: "Weber State", conf: "Big Sky", classYear: "Senior", hometown: "Edmonton, AB", ppg: 13.0, rpg: 3.5, apg: 3.8, fit: "High", draftEligible: "2026 CEBL Draft", note: "Alberta talent. Scoring guard." },
  { name: "Declan Peterson", pos: "F", ht: "6'7\"", school: "Western Michigan", conf: "MAC", classYear: "Junior", hometown: "Calgary, AB", ppg: 8.8, rpg: 5.2, apg: 1.0, fit: "Medium", draftEligible: "2027", note: "Alberta forward developing nicely." },
  { name: "Josh Ahayere", pos: "F", ht: "6'8\"", school: "Colgate", conf: "Patriot", classYear: "Senior", hometown: "Toronto, ON", ppg: 10.0, rpg: 6.0, apg: 0.8, fit: "High", draftEligible: "2026 CEBL Draft", note: "One of 3 Canadians at Colgate. Strong forward." },
  { name: "Frank Mitchell", pos: "F/C", ht: "6'9\"", school: "St. Bonaventure", conf: "A-10", classYear: "Senior", hometown: "Brampton, ON", ppg: 11.5, rpg: 7.0, apg: 1.2, fit: "High", draftEligible: "2026 CEBL Draft", note: "BRAMPTON native. Physical interior player." },
  { name: "Brayden Jackson", pos: "G/F", ht: "6'5\"", school: "St. Bonaventure", conf: "A-10", classYear: "Junior", hometown: "Toronto, ON", ppg: 7.8, rpg: 3.2, apg: 2.0, fit: "Medium", draftEligible: "2027", note: "Versatile Canadian at Bonnies." },
  { name: "Irish Coquia", pos: "G", ht: "6'1\"", school: "New Orleans", conf: "Southland", classYear: "Senior", hometown: "Vancouver, BC", ppg: 12.0, rpg: 2.5, apg: 4.0, fit: "High", draftEligible: "2026 CEBL Draft", note: "BC standout. Scoring point guard." },
  { name: "Cameron Brennan", pos: "F", ht: "6'9\"", school: "Colgate", conf: "Patriot", classYear: "Junior", hometown: "Toronto, ON", ppg: 9.0, rpg: 5.8, apg: 1.0, fit: "High", draftEligible: "2027", note: "Stretch forward with range." },
  { name: "Bashir Ngala", pos: "F", ht: "6'8\"", school: "Maine", conf: "AEC", classYear: "Junior", hometown: "Ottawa, ON", ppg: 8.0, rpg: 5.5, apg: 0.8, fit: "Medium", draftEligible: "2027", note: "Athletic forward prospect." },
  { name: "Kieran Mullen", pos: "G", ht: "6'3\"", school: "Pittsburgh", conf: "ACC", classYear: "Sophomore", hometown: "Vancouver, BC", ppg: 7.5, rpg: 2.0, apg: 3.0, fit: "Medium", draftEligible: "2028", note: "BC standout at ACC program." },
  { name: "Jasman Sangha", pos: "G", ht: "6'3\"", school: "N/A (Turned Pro)", conf: "N/A", classYear: "Pro", hometown: "Brampton, ON", ppg: 6.0, rpg: 2.0, apg: 2.5, fit: "High", draftEligible: "Eligible", note: "BRAMPTON NATIVE. First-time pro in 2025 with Honey Badgers." }
];

// Import Targets (Americans & Internationals) - from G League, mid-tier Euro, Asia, etc.
const importTargets = [
  { name: "Quinndary Weatherspoon", nationality: "USA", pos: "G", age: 28, ht: "6'3\"", team: "Free Agent (2025 Brampton)", league: "CEBL / CBA", ppg: 18.5, rpg: 4.2, apg: 3.8, fit: "High", salary: "$1,200-$1,500", note: "2022 NBA Champion. Played for Honey Badgers in 2025. Former Spurs. NOT confirmed for 2026 yet. Free agent target." },
  { name: "Taryn Todd", nationality: "USA", pos: "G/F", age: 24, ht: "6'5\"", team: "Free Agent", league: "CEBL", ppg: 12.3, rpg: 4.5, apg: 2.0, fit: "High", salary: "$800-$1,000", note: "Arkansas State standout. 2025 Honey Badger. Athletic wing." },
  { name: "Teddy Allen", nationality: "USA", pos: "G/F", age: 27, ht: "6'6\"", team: "Free Agent", league: "CEBL", ppg: 24.5, rpg: 5.2, apg: 3.8, fit: "High", salary: "Designated", note: "2023 CEBL MVP. One of the greatest offensive players in CEBL history. Divisive but elite." },
  { name: "Xavier Moon", nationality: "USA", pos: "G", age: 28, ht: "6'1\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 22.5, rpg: 3.5, apg: 7.2, fit: "High", salary: "Designated", note: "3x CEBL Player of the Year. Signed with Winnipeg 2026." },
  { name: "Cat Barber", nationality: "USA", pos: "G", age: 28, ht: "6'1\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 19.5, rpg: 3.0, apg: 5.5, fit: "High", salary: "$1,200-$1,500", note: "All-CEBL First Team. 2nd all-time CEBL scoring behind Ahmed Hill. Re-signed Scarborough." },
  { name: "Isiah Osborne", nationality: "USA", pos: "G", age: 26, ht: "6'4\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 10.3, rpg: 2.9, apg: 1.4, fit: "High", salary: "$800-$1,000", note: "49 CEBL career games. Signed Winnipeg 2026." },
  { name: "Christian Rohlehr", nationality: "USA", pos: "F/C", age: 26, ht: "6'9\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 11.0, rpg: 6.5, apg: 1.0, fit: "High", salary: "$900-$1,100", note: "Re-signed with Ottawa for 2026. Physical interior presence." },
  { name: "Justin Harmon", nationality: "USA", pos: "G", age: 25, ht: "6'2\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 13.5, rpg: 2.8, apg: 4.5, fit: "High", salary: "$800-$1,000", note: "Signed with Ottawa for 2026. Scoring guard." },
  { name: "Williams", nationality: "USA", pos: "F", age: 27, ht: "6'7\"", team: "Scarborough Shooting Stars", league: "CEBL / CBA", ppg: 14.0, rpg: 6.0, apg: 1.5, fit: "High", salary: "$1,000-$1,200", note: "Back from Shanghai Sharks (CBA). Re-signed Scarborough." },
  { name: "Emmanuel Akot", nationality: "USA", pos: "F", age: 26, ht: "6'8\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 13.2, rpg: 5.8, apg: 2.5, fit: "High", salary: "$1,000-$1,200", note: "Re-signed with Winnipeg for 2026. Arizona product. Versatile forward." },
  { name: "Shakur Daniel", nationality: "USA", pos: "G", age: 25, ht: "6'0\"", team: "Ottawa BlackJacks", league: "CEBL / G League", ppg: 3.7, rpg: 2.3, apg: 1.8, fit: "Medium", salary: "$500-$700", note: "Re-signed Ottawa. Defensive specialist. G League experience." },
  { name: "Yohann Sam", nationality: "CAN/FRA", pos: "F", age: 22, ht: "6'7\"", team: "Brampton (2025)", league: "CEBL", ppg: 6.5, rpg: 3.8, apg: 1.0, fit: "High", salary: "$400-$600", note: "2025 CEBL Draft 2nd overall pick (Brampton). Hometown acquisition." },
  { name: "Ja'Vonte Smart", nationality: "USA", pos: "G", age: 25, ht: "6'4\"", team: "Free Agent (2025 Ottawa)", league: "CEBL", ppg: 25.9, rpg: 3.5, apg: 5.0, fit: "High", salary: "$1,200-$1,500", note: "2025 CEBL PPG leader (25.9). LSU product. Elite scorer available for signing." },
  { name: "Isaih Moore", nationality: "USA", pos: "C", age: 25, ht: "6'10\"", team: "Free Agent (2025 Ottawa)", league: "CEBL", ppg: 14.0, rpg: 11.4, apg: 1.5, fit: "High", salary: "$900-$1,100", note: "2025 CEBL RPG leader (11.4). Dominant rebounder. NC State product." },
  { name: "Corey Davis Jr.", nationality: "USA", pos: "G", age: 27, ht: "6'1\"", team: "Niners Chemnitz (Germany BBL)", league: "Europe - Germany BBL", ppg: 15.5, rpg: 3.0, apg: 7.8, fit: "High", salary: "$1,000-$1,200", note: "2025 CEBL APG leader (7.8). Signed with Niners Chemnitz (Germany BBL) post-CEBL. Houston product." },
  { name: "Khalil Ahmad", nationality: "USA", pos: "G", age: 29, ht: "6'3\"", team: "Maccabi Rishon Lezion", league: "Israel Winner League", ppg: 21.7, rpg: 4.3, apg: 3.1, fit: "High", salary: "Designated", note: "CEBL LEGEND. Most decorated player in CEBL history. 2025 Finals MVP with Niagara. Career-high 45 pts (Italy Serie A2)." },
  { name: "Donovan Williams", nationality: "USA", pos: "G", age: 25, ht: "6'5\"", team: "Scarborough Shooting Stars", league: "CEBL / G League", ppg: 17.2, rpg: 4.0, apg: 2.5, fit: "High", salary: "$1,000-$1,200", note: "Re-signed Scarborough. 17.2 PPG with Santa Cruz (G League). 2 NBA games (Hawks). From Shanghai." },
  { name: "Tevian Jones", nationality: "USA", pos: "G/F", age: 26, ht: "6'6\"", team: "Scarborough Shooting Stars", league: "CEBL / G League", ppg: 13.5, rpg: 4.5, apg: 2.0, fit: "High", salary: "$900-$1,100", note: "NBA Summer League (Pelicans). 50 games Birmingham Squadron (G League). Athletic wing signed Scarborough." },
  { name: "Hason Ward", nationality: "BRB", pos: "F", age: 23, ht: "6'8\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 8.0, rpg: 5.0, apg: 1.0, fit: "Medium", salary: "$600-$800", note: "Barbados-born forward. Non-American international import. Professional debut with Shooting Stars." },
  { name: "Jalen Harris", nationality: "USA", pos: "G", age: 27, ht: "6'5\"", team: "CEBL", league: "CEBL", ppg: 22.0, rpg: 4.0, apg: 4.5, fit: "High", salary: "$1,200-$1,500", note: "Top scorer of the day multiple times in 2025 CEBL. Elite scoring guard. Former NBA (Raptors)." },
  { name: "Scottie Lindsey", nationality: "USA", pos: "G/F", age: 28, ht: "6'5\"", team: "CEBL", league: "CEBL", ppg: 18.5, rpg: 5.0, apg: 3.0, fit: "High", salary: "$1,000-$1,200", note: "Named top scorer of the day in 2025 CEBL. Northwestern product. Versatile two-way wing." },
  { name: "Alex Campbell", nationality: "USA", pos: "G", age: 27, ht: "6'2\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 14.0, rpg: 3.0, apg: 4.0, fit: "High", salary: "$900-$1,100", note: "Signed Winnipeg 2026. Part of Moon-Campbell backcourt." },
  { name: "Daren Watts", nationality: "USA", pos: "G", age: 26, ht: "6'3\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 12.0, rpg: 3.5, apg: 3.0, fit: "Medium", salary: "$800-$1,000", note: "Signed Winnipeg 2026. Part of deep Sea Bears guard rotation." },
  { name: "Izaiah Brockington", nationality: "USA", pos: "G/F", age: 26, ht: "6'4\"", team: "NZ Breakers (Australia NBL)", league: "Oceania - Australia NBL", ppg: 14.5, rpg: 5.0, apg: 2.0, fit: "High", salary: "$1,000-$1,200", note: "From Vancouver Bandits to NZ Breakers (Aus NBL). 2025 NBA Summer League (Clippers). Iowa State product." },
  { name: "Ahmed Hill", nationality: "USA", pos: "G", age: 28, ht: "6'1\"", team: "CEBL", league: "CEBL", ppg: 20.0, rpg: 3.5, apg: 5.0, fit: "High", salary: "$1,200-$1,500", note: "All-time CEBL leading scorer. Virginia Tech product. Proven CEBL performer." },
  { name: "Chase Jeter", nationality: "USA", pos: "F/C", age: 27, ht: "6'10\"", team: "Waived - Austin Spurs", league: "G League (waived)", ppg: 10.5, rpg: 7.2, apg: 1.0, fit: "High", salary: "$800-$1,000", note: "Duke product. Waived from Austin Spurs. Physical big available for summer." },
  { name: "Zhuric Phelps", nationality: "USA", pos: "G", age: 23, ht: "6'4\"", team: "Waived - Texas Legends", league: "G League (waived)", ppg: 15.2, rpg: 3.5, apg: 2.8, fit: "High", salary: "$800-$1,000", note: "Waived from Texas Legends. Young scoring guard with upside." },
  { name: "Javan Johnson", nationality: "USA", pos: "G/F", age: 25, ht: "6'5\"", team: "Waived - College Park Skyhawks", league: "G League (waived)", ppg: 12.8, rpg: 4.0, apg: 2.2, fit: "High", salary: "$800-$1,000", note: "DePaul product. Waived from Skyhawks. Athletic wing." },
  { name: "Trae Hannibal", nationality: "USA", pos: "G", age: 24, ht: "6'3\"", team: "Waived - Grand Rapids Gold", league: "G League (waived)", ppg: 11.5, rpg: 3.2, apg: 3.5, fit: "High", salary: "$700-$900", note: "LSU product. Explosive athleticism. Waived from Gold." },
  { name: "Manny Obaseki", nationality: "USA", pos: "G", age: 23, ht: "6'4\"", team: "Waived - Westchester Knicks", league: "G League (waived)", ppg: 9.8, rpg: 3.0, apg: 2.0, fit: "Medium", salary: "$600-$800", note: "Texas A&M product. Waived from Westchester. Developing talent." },
  { name: "Keanu Rasmussen", nationality: "NZL", pos: "G", age: 24, ht: "6'4\"", team: "Hawke's Bay Hawks", league: "Oceania - NBL1/NZ", ppg: 23.0, rpg: 7.0, apg: 5.8, fit: "High", salary: "$800-$1,000", note: "Tall Blacks national team. NBL1 Central MVP. Championship winner. Elite stats." },
  { name: "Nathan Bilamu", nationality: "International", pos: "F", age: 24, ht: "6'7\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 8.0, rpg: 5.0, apg: 1.0, fit: "Medium", salary: "$600-$800", note: "Agreed to terms with Winnipeg for 2026." },
  { name: "Jackson", nationality: "USA", pos: "G", age: 25, ht: "6'3\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 10.5, rpg: 2.8, apg: 3.5, fit: "Medium", salary: "$700-$900", note: "Welcomed back by Ottawa for 2026." },
  // === New 2024-2025 CEBL Imports ===
  { name: "Taze Moore", nationality: "USA", pos: "G/F", age: 26, ht: "6'5\"", team: "Vancouver 2024", league: "CEBL", ppg: 20.5, rpg: 5.5, apg: 4.0, fit: "High", salary: "$1,200-$1,500", note: "2024 CEBL MVP. Houston product. Elite two-way player." },
  { name: "Mitch Creek", nationality: "AUS", pos: "F", age: 33, ht: "6'5\"", team: "Vancouver 2025", league: "CEBL", ppg: 22.0, rpg: 7.0, apg: 4.0, fit: "High", salary: "Designated", note: "2025 CEBL MVP. Australian NBL legend. Elite competitor." },
  { name: "Greg Brown III", nationality: "USA", pos: "F", age: 24, ht: "6'9\"", team: "Calgary 2025", league: "CEBL", ppg: 18.0, rpg: 7.0, apg: 2.5, fit: "High", salary: "$1,200-$1,500", note: "2025 All-CEBL 1st Team. Former NBA (Blazers, Pacers). Texas product." },
  { name: "Khyri Thomas", nationality: "USA", pos: "G", age: 27, ht: "6'3\"", team: "Calgary 2025", league: "CEBL", ppg: 15.0, rpg: 3.5, apg: 4.0, fit: "High", salary: "$1,000-$1,200", note: "Former NBA (Pistons). Creighton product. Two-way guard." },
  { name: "Omari Moore", nationality: "USA", pos: "G", age: 26, ht: "6'4\"", team: "Niagara 2024", league: "CEBL", ppg: 14.5, rpg: 4.0, apg: 6.0, fit: "High", salary: "$1,000-$1,200", note: "2024 CEBL champion. San Jose State product." },
  { name: "Loudon Love", nationality: "USA", pos: "C", age: 26, ht: "6'8\"", team: "Niagara 2024", league: "CEBL", ppg: 12.0, rpg: 9.0, apg: 1.5, fit: "High", salary: "$900-$1,100", note: "2024 CEBL champion. Wright State product. Rebounder." },
  { name: "Ron Curry", nationality: "USA", pos: "G", age: 26, ht: "6'3\"", team: "Niagara 2025", league: "CEBL", ppg: 13.0, rpg: 3.0, apg: 4.0, fit: "High", salary: "$900-$1,100", note: "Niagara import guard." },
  { name: "Leon Ayers III", nationality: "USA", pos: "G", age: 24, ht: "6'4\"", team: "Niagara 2025", league: "CEBL", ppg: 14.0, rpg: 4.0, apg: 2.5, fit: "High", salary: "$900-$1,100", note: "Niagara scoring guard." },
  { name: "Keyshawn Bryant", nationality: "USA", pos: "F", age: 25, ht: "6'6\"", team: "Niagara 2025", league: "CEBL", ppg: 12.5, rpg: 5.5, apg: 1.5, fit: "High", salary: "$800-$1,000", note: "South Carolina product. Athletic wing." },
  { name: "Tevin Brown", nationality: "USA", pos: "G", age: 26, ht: "6'5\"", team: "Ottawa 2024", league: "CEBL", ppg: 15.0, rpg: 4.0, apg: 3.5, fit: "High", salary: "$1,000-$1,200", note: "2024 Clutch POY. Murray State product." },
  { name: "Peter Jok", nationality: "USA", pos: "G/F", age: 28, ht: "6'6\"", team: "Ottawa 2024", league: "CEBL", ppg: 16.0, rpg: 5.0, apg: 2.5, fit: "High", salary: "$1,000-$1,200", note: "Iowa product. South Sudanese-American." },
  { name: "Brandon Sampson", nationality: "USA", pos: "G", age: 27, ht: "6'5\"", team: "Ottawa 2024", league: "CEBL", ppg: 14.0, rpg: 3.5, apg: 2.5, fit: "High", salary: "$900-$1,100", note: "LSU product. Athletic guard." },
  { name: "Jakeenan Gant", nationality: "USA", pos: "F", age: 29, ht: "6'8\"", team: "Ottawa 2024", league: "CEBL", ppg: 13.0, rpg: 8.0, apg: 2.0, fit: "High", salary: "$900-$1,100", note: "Multi-year CEBL. Physical forward." },
  { name: "Terry Roberts", nationality: "USA", pos: "G", age: 24, ht: "6'0\"", team: "Winnipeg 2025", league: "CEBL", ppg: 12.0, rpg: 3.0, apg: 5.0, fit: "High", salary: "$800-$1,000", note: "Bradley product. Quick PG." },
  { name: "Darius Days", nationality: "USA", pos: "F", age: 26, ht: "6'7\"", team: "Winnipeg 2024", league: "CEBL", ppg: 14.0, rpg: 7.0, apg: 1.5, fit: "High", salary: "$900-$1,100", note: "LSU product. Physical stretch 4." },
  { name: "Justin Wright-Foreman", nationality: "USA", pos: "G", age: 27, ht: "6'1\"", team: "Winnipeg/Saskatchewan", league: "CEBL", ppg: 16.0, rpg: 3.0, apg: 4.0, fit: "High", salary: "$1,000-$1,200", note: "Hofstra product. Prolific scorer." },
  { name: "Billy Preston Jr.", nationality: "USA", pos: "F", age: 27, ht: "6'10\"", team: "Calgary 2024", league: "CEBL", ppg: 12.0, rpg: 6.0, apg: 1.5, fit: "High", salary: "$800-$1,000", note: "Kansas product. Athletic big." },
  { name: "Kyler Edwards", nationality: "USA", pos: "G", age: 26, ht: "6'4\"", team: "Calgary 2024", league: "CEBL", ppg: 14.0, rpg: 3.5, apg: 3.0, fit: "High", salary: "$900-$1,100", note: "Houston product. National champion (Baylor)." },
  { name: "Cameron McGriff", nationality: "USA", pos: "F", age: 27, ht: "6'7\"", team: "Edmonton 2025", league: "CEBL", ppg: 13.0, rpg: 6.0, apg: 1.5, fit: "High", salary: "$900-$1,100", note: "Oklahoma State product. Physical wing." },
  { name: "Terquavion Smith", nationality: "USA", pos: "G", age: 22, ht: "6'4\"", team: "Scarborough 2025", league: "CEBL", ppg: 16.0, rpg: 3.0, apg: 4.0, fit: "High", salary: "$1,000-$1,200", note: "NC State product. Young scoring guard." },
  { name: "Michael Foster Jr.", nationality: "USA", pos: "F", age: 22, ht: "6'9\"", team: "Scarborough 2025", league: "CEBL", ppg: 14.0, rpg: 7.0, apg: 1.5, fit: "High", salary: "$1,000-$1,200", note: "G League Ignite product. Athletic forward." },
  { name: "Yuri Collins", nationality: "USA", pos: "G", age: 24, ht: "6'0\"", team: "Scarborough 2025", league: "CEBL", ppg: 8.0, rpg: 2.5, apg: 7.0, fit: "High", salary: "$800-$1,000", note: "Saint Louis product. Elite assist man." },
  { name: "Dontay Bassett", nationality: "USA", pos: "F", age: 27, ht: "6'8\"", team: "Montreal 2025", league: "CEBL", ppg: 13.0, rpg: 6.0, apg: 1.5, fit: "High", salary: "$900-$1,100", note: "Montreal import forward." },
  { name: "Curtis Hollis", nationality: "USA", pos: "G", age: 28, ht: "6'4\"", team: "Vancouver", league: "CEBL", ppg: 13.5, rpg: 3.5, apg: 3.0, fit: "High", salary: "$900-$1,100", note: "Multi-year Bandits import." },
  { name: "Elijah Harkless", nationality: "USA", pos: "F", age: 25, ht: "6'6\"", team: "Saskatchewan 2024", league: "CEBL", ppg: 14.0, rpg: 5.0, apg: 2.0, fit: "High", salary: "$900-$1,100", note: "Weber State product." },
  { name: "Jacob Evans III", nationality: "USA", pos: "G", age: 28, ht: "6'4\"", team: "Edmonton 2024", league: "CEBL", ppg: 14.5, rpg: 4.0, apg: 3.5, fit: "High", salary: "$1,000-$1,200", note: "Former NBA (Warriors, Timberwolves). Cincinnati product." },
  { name: "Nick Hornsby", nationality: "USA", pos: "G/F", age: 27, ht: "6'6\"", team: "Edmonton", league: "CEBL", ppg: 12.0, rpg: 4.0, apg: 2.5, fit: "High", salary: "$800-$1,000", note: "Multi-year Stingers import." },
  { name: "Sean Miller-Moore", nationality: "USA", pos: "G", age: 28, ht: "6'3\"", team: "Calgary", league: "CEBL", ppg: 11.0, rpg: 3.0, apg: 3.5, fit: "High", salary: "$800-$1,000", note: "Multi-year CEBL. 'Rugzy'." }
];

// League-wide 2026 Signings
const leagueSignings = {
  "Brampton Honey Badgers": {
    color: "#D4AF37", bg: "#1a1500", emoji: "🦡",
    players: [
      { name: "Sean East II", pos: "G", type: "New Signing", detail: "From Edmonton Stingers | 2025 CEBL MVP Runner-Up | Led CEBL in points (582)" },
      { name: "Jameer Nelson Jr.", pos: "G", type: "New Signing", detail: "From Calgary Surge | 2025 CEBL DPOY | 17.3 PPG, 5.8 RPG, 4.0 APG" },
      { name: "Keon Ambrose-Hylton", pos: "F", type: "New Signing", detail: "CEBL All-Canadian Forward | Physical, athletic" },
      { name: "Danilo Djuricic", pos: "F", type: "New Signing", detail: "From Scarborough | 4 CEBL seasons | 2023 Champion | Brampton native" },
      { name: "Prince Oduro", pos: "F/C", type: "Re-Signing", detail: "5th consecutive season | All-time HB leader in games (73), rebounds (429), blocks (79)" },
      { name: "Alex Cerda (HC)", pos: "Coach", type: "New Hire", detail: "Head Coach | 10 years NBA experience | LA Clippers staff (2018-2020)" }
    ]
  },
  "Niagara River Lions": {
    color: "#0066CC", bg: "#001122", emoji: "🦁",
    players: [
      { name: "Elijah Lufile", pos: "F", type: "Re-Signing", detail: "3rd season | From Lebanon Div. A | 14.1 PPG, 10.6 RPG | Double-double machine" },
      { name: "T.J. Lall", pos: "F", type: "Re-Signing", detail: "3rd season with Niagara | From ZZ Leiden (BNXT Netherlands) | 2024 CEBL champion" },
      { name: "Nathan Cayo", pos: "F", type: "Re-Signing", detail: "Back-to-back champion (2024, 2025) | 9.8 PPG, 5.5 RPG, 3.0 APG | Montreal native" },
      { name: "Kimbal Mackenzie (HC/GM)", pos: "Coach", type: "New Hire", detail: "Promoted from captain to Head Coach & GM | Replaces Victor Raso (now Sr. Advisor)" }
    ]
  },
  "Vancouver Bandits": {
    color: "#FF6B35", bg: "#1a0d00", emoji: "🏴‍☠️",
    players: [
      { name: "Tyrese Samuel", pos: "F/C", type: "Re-Signing", detail: "2025 Canadian Player of the Year | 21.7 PPG, 10.8 RPG | 65.9% FG" },
      { name: "Sam Maillet", pos: "G", type: "Re-Signing", detail: "U SPORTS Champion & Finals MVP | Victoria Vikes | Moncton NB native" },
      { name: "Tristan Jass", pos: "G", type: "New Signing", detail: "Content creator (5.6M YouTube) | 28 pts in preseason debut | Kenosha WI" }
    ]
  },
  "Winnipeg Sea Bears": {
    color: "#003366", bg: "#000d1a", emoji: "🐻",
    players: [
      { name: "Xavier Moon", pos: "G", type: "New Signing", detail: "3x CEBL Player of the Year | 23.1 PPG (2021) | 2x CEBL Champion | 28 NBA games (Clippers)" },
      { name: "Emmanuel Akot", pos: "F", type: "Re-Signing", detail: "Winnipeg native | 11.2 PPG, 5.3 RPG, 2.2 APG | Arizona product" },
      { name: "David Walker", pos: "G", type: "New Signing", detail: "From Ottawa BlackJacks | Playoff hero (19 PTS, 4 REB, 3 STL)" },
      { name: "Fareed Shittu", pos: "F", type: "New Signing", detail: "Canadian forward from Edmonton | 2 years CEBL exp | High-level athlete" },
      { name: "Isiah Osborne", pos: "G", type: "New Signing", detail: "49 career CEBL games | 10.3 PPG | 2x U SPORTS champion (Carleton) | 2020 championship MVP" }
    ]
  },
  "Ottawa BlackJacks": {
    color: "#CC0000", bg: "#1a0000", emoji: "🃏",
    players: [
      { name: "Christian Rohlehr", pos: "F/C", type: "Re-Signing", detail: "Top shot-blocker | 1.3 BPG (tied 23rd all-time CEBL)" },
      { name: "Justin Harmon", pos: "G", type: "New Signing", detail: "From Salt Lake City Stars (G League) | 11.4 PPG, 50.7% FG, 47.2% 3PT" },
      { name: "Justin Ndjock-Tadjoré", pos: "F", type: "Re-Signing", detail: "3rd campaign | First standard contract | Currently BK Ogre (Estonia-Latvia)" },
      { name: "Shakur Daniel", pos: "G", type: "Re-Signing", detail: "22 games, 13 starts in 2025 | 3.7 PPG, 2.3 RPG, 1.8 APG | Defensive specialist" }
    ]
  },
  "Montreal Alliance": {
    color: "#7B2D8E", bg: "#0d0011", emoji: "⚜️",
    players: [
      { name: "Kevin Osawe", pos: "F", type: "Re-Signing", detail: "9.3 PPG, 5.5 RPG in 2025 CEBL | 17.2 PPG in Germany | 87.8% FT | Brampton native" },
      { name: "Keeshawn Barthelemy", pos: "G", type: "New Signing", detail: "Montreal native | Colorado/Oregon product | Cyprus Div. A (2025-26) | Score-first PG" },
      { name: "Abdullah Shittu", pos: "F", type: "Re-Signing", detail: "Edmonton native | Slovakia, Mongolia, Portugal experience | U of Alberta product" }
    ]
  },
  "Edmonton Stingers": {
    color: "#FFB81C", bg: "#1a1500", emoji: "🐝",
    players: [
      { name: "Emmanuel Bandoumel", pos: "G", type: "New Signing", detail: "Quebec City native | SMU product | Scoring punch" },
      { name: "Elijah Miller", pos: "G", type: "Re-Signing", detail: "8.6 PPG, 3.0 APG in 2025 (14 games) | Returning from ankle injury" }
    ]
  },
  "Calgary Surge": {
    color: "#E31837", bg: "#1a0005", emoji: "⚡",
    players: [
      { name: "Perry Huang (HC)", pos: "Coach", type: "New Hire", detail: "Head Coach from South Bay Lakers (G League) | 2 WNBA titles, 1 G League title" }
    ]
  },
  "Scarborough Shooting Stars": {
    color: "#1E90FF", bg: "#000d1a", emoji: "⭐",
    players: [
      { name: "Kyree Walker", pos: "F", type: "Re-Signing", detail: "12.8 PPG, 4.8 RPG | 2023 champion returning" },
      { name: "Cat Barber", pos: "G", type: "Re-Signing", detail: "All-time CEBL leading scorer | All-CEBL First Team" },
      { name: "Donovan Williams", pos: "G", type: "New Signing", detail: "17.2 PPG Santa Cruz (G League) | 2 NBA games (Hawks) | 10th roster addition" },
      { name: "Hason Ward", pos: "F", type: "Re-Signing", detail: "Barbados native | 5.5 PPG, 1.5 BPG | 2nd season | Maine Celtics (G League) experience" }
    ]
  },
  "Saskatoon Mamba": {
    color: "#00AA00", bg: "#001a00", emoji: "🐍",
    players: [
      { name: "Isaiah Fox (HC)", pos: "Coach", type: "New Hire", detail: "Head Coach | From Salt Lake City Stars (G League) | Previously LA Lakers staff" }
    ]
  }
};

// Recommended scouting targets for Brampton (no AI label)
const scoutTargets = [
  { name: "David Muenkat", pos: "G/F", from: "Free Agent (2025 HB)", type: "Canadian", ppg: 10.5, rpg: 4.3, apg: 2.1, salary: "$800-$1,000", fit: "High", tags: ["Brampton Native", "4th CEBL Season", "Fan Favorite", "Hometown"], reason: "Brampton native with CEBL experience. Fan connection. Returner from 2025 Honey Badgers." },
  { name: "Jaden Bediako", pos: "C", from: "Free Agent", type: "Canadian", ppg: 8.6, rpg: 8.5, apg: 0.5, salary: "$700-$900", fit: "High", tags: ["Brampton Native", "Rim Protector", "2.2 BPG", "Physical"], reason: "Brampton native. Elite shot-blocker (2.2 BPG). Fills need for interior defense." },
  { name: "Ali Sow", pos: "F", from: "Free Agent (2025 HB)", type: "Canadian", ppg: 8.2, rpg: 4.1, apg: 1.3, salary: "$600-$800", fit: "High", tags: ["Former HB", "Laurier Great", "Cap Friendly"], reason: "Former Honey Badger. Knows the system. Affordable Canadian forward." },
  { name: "Frank Mitchell", pos: "F/C", from: "St. Bonaventure (NCAA)", type: "Canadian", ppg: 11.5, rpg: 7.0, apg: 1.2, salary: "$400-$600 (Dev)", fit: "High", tags: ["Brampton Native", "NCAA Senior", "Physical", "Draft Target"], reason: "BRAMPTON native senior at St. Bonaventure. Physical big man ready to go pro." },
  { name: "Teddy Allen", pos: "G/F", from: "Free Agent", type: "Import", ppg: 24.5, rpg: 5.2, apg: 3.8, salary: "Designated Player", fit: "High", tags: ["2023 CEBL MVP", "Elite Scorer", "Designated Player Candidate"], reason: "Greatest offensive player in CEBL history. Designated Player candidate (off-cap)." },
  { name: "Amari Kelly", pos: "F", from: "Free Agent", type: "Canadian", ppg: 9.1, rpg: 5.5, apg: 0.7, salary: "$700-$900", fit: "High", tags: ["G League Tested", "Athletic", "Upside"], reason: "Athletic forward with G League and NBA Summer League experience. Upside at affordable cost." },
  { name: "Patrick Emilien", pos: "F", from: "Free Agent (2025 HB)", type: "Canadian", ppg: 7.5, rpg: 5.0, apg: 0.8, salary: "$600-$800", fit: "High", tags: ["Former HB", "Rebounder", "Physical"], reason: "Returning Honey Badger. Knows the culture. Physical rebounder at low cost." },
  { name: "Zhuric Phelps", pos: "G", from: "Waived - Texas Legends (G League)", type: "Import", ppg: 15.2, rpg: 3.5, apg: 2.8, salary: "$800-$1,000", fit: "High", tags: ["G League", "Scoring Guard", "Young", "Available"], reason: "Young scoring guard waived from G League. Available for CEBL summer. High ceiling." },
  { name: "Quinndary Weatherspoon", pos: "G", from: "Qingdao Eagles (CBA)", type: "Import", ppg: 18.5, rpg: 4.2, apg: 3.8, salary: "$1,200-$1,500", fit: "High", tags: ["NBA Champion", "Former HB", "Elite"], reason: "2022 NBA Champion who played for Honey Badgers in 2025. Proven at highest level." },
  { name: "Josh Omojafo", pos: "F", from: "South Florida (NCAA)", type: "Canadian", ppg: 6.5, rpg: 4.8, apg: 0.5, salary: "$400-$500 (Dev)", fit: "Medium", tags: ["Brampton Native", "NCAA D1", "Development"], reason: "BRAMPTON native at South Florida. Developmental player candidate (off-cap)." }
];
