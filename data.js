// ===== CEBL Scout AI - Player Database =====
// Data compiled from CEBL.ca, RealGM, BasketballBuzz, North Pole Hoops, USBasket

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
  season: "2026"
};

// Honey Badgers 2026 Confirmed Roster
const honeyBadgersRoster = [
  { name: "Sean East II", pos: "G", nationality: "USA", type: "Import", status: "Signed", salary: 1400, stats: "25.3 PPG, 3.2 RPG, 5.8 APG (2025 Edmonton)", note: "2025 CEBL MVP Runner-Up, All-CEBL 1st Team, NBA G League Rising Star. Led CEBL in total points (582) and FGM (215).", character: "Elite competitor, leadership qualities" },
  { name: "Jameer Nelson Jr.", pos: "G", nationality: "USA", type: "Import", status: "Signed", salary: 1400, stats: "20.1 PPG, 4.7 RPG, 4.3 APG, 2.8 SPG (2025 Calgary)", note: "2025 CEBL Defensive Player of the Year, All-CEBL 2nd Team. Led CEBL in steals.", character: "NBA pedigree (son of Jameer Nelson), high motor" },
  { name: "Keon Ambrose-Hylton", pos: "F", nationality: "CAN", type: "Canadian", status: "Signed", salary: 1000, stats: "All-Canadian selection", note: "CEBL All-Canadian forward. Physical, athletic forward with pro experience.", character: "Community-oriented, strong work ethic" },
  { name: "Danilo Djuricic", pos: "F", nationality: "CAN", type: "Canadian", status: "Signed", salary: 600, stats: "5.5 PPG, 3.7 RPG (2025 Scarborough)", note: "Experienced CEBL forward. 17 games with Shooting Stars in 2025.", character: "Reliable team player" },
  { name: "Prince Oduro", pos: "F/C", nationality: "CAN", type: "Canadian", status: "Signed", salary: 700, stats: "CEBL experience", note: "Canadian big man, physical interior presence.", character: "Developing talent, coachable" }
];

// Canadian Players Playing Pro Overseas (CEBL salary-range fits)
const canadiansPro = [
  { name: "Kevin Osawe", pos: "F", age: 27, ht: "6'7\"", team: "Germany Div. Pro", league: "Europe", ppg: 17.2, rpg: 7.8, apg: 1.2, fit: "High", salary: "$1,000-$1,200", character: "Good", hometown: "Brampton, ON", note: "Re-signed with Montreal Alliance for 2026. Brampton native. 87.8% FT in CEBL." },
  { name: "Emmanuel Bandoumel", pos: "G", age: 25, ht: "6'4\"", team: "Finland Pro League", league: "Europe", ppg: 22.4, rpg: 6.0, apg: 2.1, fit: "High", salary: "$1,000-$1,300", character: "Good", hometown: "Quebec City, QC", note: "Signed with Edmonton Stingers for 2026. SMU product. 3.2 SPG overseas." },
  { name: "T.J. Lall", pos: "F", age: 26, ht: "6'6\"", team: "ZZ Leiden", league: "Europe", ppg: 8.5, rpg: 4.2, apg: 1.1, fit: "High", salary: "$700-$900", character: "Good", hometown: "Cambridge, ON", note: "Re-signed with Niagara. BNXT League (Netherlands) experience. 2024 CEBL champion." },
  { name: "Nathan Cayo", pos: "F", age: 28, ht: "6'6\"", team: "ADA Blois Basket", league: "Europe", ppg: 9.4, rpg: 3.7, apg: 0.9, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Montreal, QC", note: "Re-signed Niagara. Playing France LNB Pro B. Back-to-back CEBL champion." },
  { name: "Elijah Lufile", pos: "F", age: 25, ht: "6'7\"", team: "Nadim Souaid Academy", league: "Asia", ppg: 14.1, rpg: 10.6, apg: 1.0, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Ottawa, ON", note: "Signed with Niagara for 2026. Lebanon Division A. Double-double machine." },
  { name: "Marcus Carr", pos: "G", age: 26, ht: "6'2\"", team: "One Wuerzburg Baskets", league: "Europe", ppg: 14.8, rpg: 2.5, apg: 5.3, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Toronto, ON", note: "BBL (Germany). Former Big Ten standout (Minnesota). Elite scorer and playmaker." },
  { name: "Ignas Brazdeikis", pos: "G/F", age: 25, ht: "6'6\"", team: "Zalgiris Kaunas", league: "Europe", ppg: 10.2, rpg: 3.8, apg: 1.5, fit: "Medium", salary: "$1,200-$1,500", character: "Neutral", hometown: "Mississauga, ON", note: "LKL (Lithuania). Former Michigan Wolverine & NBA experience. Versatile wing." },
  { name: "Trae Bell-Haynes", pos: "G", age: 28, ht: "6'0\"", team: "European Club", league: "Europe", ppg: 10.7, rpg: 2.3, apg: 6.2, fit: "Medium", salary: "$1,000-$1,300", character: "Good", hometown: "Toronto, ON", note: "Team Canada AmeriCup. Veteran floor general. UVM legend." },
  { name: "Kyle Wiltjer", pos: "F", age: 30, ht: "6'10\"", team: "European Club", league: "Europe", ppg: 13.5, rpg: 5.2, apg: 1.8, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Portland, OR (Canadian citizen)", note: "Team Canada veteran. Gonzaga product. Elite stretch-four with shooting range." },
  { name: "David Walker", pos: "G", age: 26, ht: "6'4\"", team: "Slavia (Czech Republic)", league: "Europe", ppg: 12.3, rpg: 3.1, apg: 3.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "Signed with Winnipeg Sea Bears for 2026. NBL Czech Republic experience." },
  { name: "Mfiondu Kabengele", pos: "C", age: 27, ht: "6'10\"", team: "European Club", league: "Europe", ppg: 17.0, rpg: 9.8, apg: 1.0, fit: "Low", salary: "$1,500+", character: "Good", hometown: "Burlington, ON", note: "Team Canada. Former NBA (Clippers, Cavs). High-end Euro salary likely above CEBL range." },
  { name: "Ali Sow", pos: "F", age: 24, ht: "6'5\"", team: "Free Agent", league: "CEBL", ppg: 8.2, rpg: 4.1, apg: 1.3, fit: "High", salary: "$600-$800", character: "Good", hometown: "Kitchener, ON", note: "Former Honey Badger (2025). Laurier All-Time Great. CEBL experienced." },
  { name: "Patrick Emilien", pos: "F", age: 25, ht: "6'7\"", team: "Free Agent", league: "CEBL", ppg: 7.5, rpg: 5.0, apg: 0.8, fit: "High", salary: "$600-$800", character: "Good", hometown: "Montreal, QC", note: "Returning Honey Badger from 2025 season. Strong rebounder, physical forward." },
  { name: "Amari Kelly", pos: "F", age: 24, ht: "6'8\"", team: "Free Agent", league: "CEBL/G League", ppg: 9.1, rpg: 5.5, apg: 0.7, fit: "High", salary: "$700-$900", character: "Good", hometown: "Toronto, ON", note: "NBA Summer League tested. Athletic forward with upside." },
  { name: "David Muenkat", pos: "G/F", age: 27, ht: "6'5\"", team: "Free Agent", league: "CEBL", ppg: 10.5, rpg: 4.3, apg: 2.1, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Brampton, ON", note: "BRAMPTON NATIVE. 4th CEBL season in 2025. Hometown fan favorite." },
  { name: "Fareed Shittu", pos: "F", age: 25, ht: "6'5\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 7.8, rpg: 4.5, apg: 1.0, fit: "High", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Signed with Winnipeg for 2026. Versatile Canadian forward." },
  { name: "Tyrese Samuel", pos: "F/C", age: 25, ht: "6'10\"", team: "Vancouver Bandits", league: "CEBL", ppg: 21.7, rpg: 10.8, apg: 1.5, fit: "High", salary: "$1,200-$1,500", character: "Good", hometown: "Montreal, QC", note: "2025 Canadian Player of the Year. 65.9 FG%. NBA Summer League (Nets). Suns Exhibit 10." },
  { name: "Keeshawn Barthelemy", pos: "G", age: 24, ht: "6'2\"", team: "Montreal Alliance", league: "CEBL", ppg: 11.5, rpg: 2.8, apg: 4.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Montreal, QC", note: "Montreal native joining Alliance for 2026. Colorado product." }
];

// NCAA D1 Canadian Players (key prospects for CEBL)
const ncaaCanadians = [
  { name: "Ryan Nembhard", pos: "G", ht: "6'0\"", school: "Gonzaga", conf: "WCC", classYear: "Senior", hometown: "Aurora, ON", ppg: 13.8, rpg: 3.2, apg: 7.5, fit: "High", draftEligible: "2026 CEBL Draft", note: "NCAA all-time assists record holder. Elite playmaker." },
  { name: "Xaivian Lee", pos: "G", ht: "6'4\"", school: "Florida", conf: "SEC", classYear: "Sophomore", hometown: "Toronto, ON", ppg: 11.5, rpg: 3.8, apg: 4.2, fit: "Medium", draftEligible: "2028", note: "March Madness standout. SEC contributor as sophomore." },
  { name: "Emanuel Sharp", pos: "G", ht: "6'4\"", school: "Houston", conf: "Big 12", classYear: "Senior", hometown: "Toronto, ON", ppg: 12.1, rpg: 3.5, apg: 2.0, fit: "High", draftEligible: "2026 CEBL Draft", note: "Winningest Canadian in NCAA D1 history (128-20 record)." },
  { name: "Aden Holloway", pos: "G", ht: "6'2\"", school: "Alabama", conf: "SEC", classYear: "Sophomore", hometown: "Ottawa, ON", ppg: 8.5, rpg: 2.0, apg: 3.2, fit: "Medium", draftEligible: "2028", note: "March Madness participant. High-ceiling guard." },
  { name: "Elijah Mahi", pos: "G", ht: "6'3\"", school: "Santa Clara", conf: "WCC", classYear: "Junior", hometown: "Toronto, ON", ppg: 10.2, rpg: 2.5, apg: 3.8, fit: "High", draftEligible: "2027", note: "March Madness 2026 participant." },
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
  { name: "Marial Akuentok", pos: "F/C", ht: "6'9\"", school: "Texas Tech", conf: "Big 12", classYear: "Sophomore", hometown: "Toronto, ON", ppg: 5.8, rpg: 4.2, apg: 0.5, fit: "Medium", draftEligible: "2028", note: "FEIA product at Big 12 program. High-major experience." },
  { name: "Kieran Mullen", pos: "G", ht: "6'3\"", school: "Pittsburgh", conf: "ACC", classYear: "Sophomore", hometown: "Vancouver, BC", ppg: 7.5, rpg: 2.0, apg: 3.0, fit: "Medium", draftEligible: "2028", note: "BC standout at ACC program." },
  { name: "Adam Olsen", pos: "G/F", ht: "6'5\"", school: "South Alabama", conf: "Sun Belt", classYear: "Junior", hometown: "Vancouver, BC", ppg: 11.2, rpg: 4.5, apg: 2.3, fit: "High", draftEligible: "2027", note: "Western Canada talent. Versatile wing." },
  { name: "David Hansen", pos: "G", ht: "6'3\"", school: "Weber State", conf: "Big Sky", classYear: "Senior", hometown: "Edmonton, AB", ppg: 13.0, rpg: 3.5, apg: 3.8, fit: "High", draftEligible: "2026 CEBL Draft", note: "Alberta talent. Scoring guard." },
  { name: "Declan Peterson", pos: "F", ht: "6'7\"", school: "Western Michigan", conf: "MAC", classYear: "Junior", hometown: "Calgary, AB", ppg: 8.8, rpg: 5.2, apg: 1.0, fit: "Medium", draftEligible: "2027", note: "Alberta forward developing nicely." },
  { name: "Josh Ahayere", pos: "F", ht: "6'8\"", school: "Colgate", conf: "Patriot", classYear: "Senior", hometown: "Toronto, ON", ppg: 10.0, rpg: 6.0, apg: 0.8, fit: "High", draftEligible: "2026 CEBL Draft", note: "One of 3 Canadians at Colgate. Strong forward." },
  { name: "Frank Mitchell", pos: "F/C", ht: "6'9\"", school: "St. Bonaventure", conf: "A-10", classYear: "Senior", hometown: "Brampton, ON", ppg: 11.5, rpg: 7.0, apg: 1.2, fit: "High", draftEligible: "2026 CEBL Draft", note: "BRAMPTON native. Physical interior player. One of 3 Canadians at Bonnies." },
  { name: "Brayden Jackson", pos: "G/F", ht: "6'5\"", school: "St. Bonaventure", conf: "A-10", classYear: "Junior", hometown: "Toronto, ON", ppg: 7.8, rpg: 3.2, apg: 2.0, fit: "Medium", draftEligible: "2027", note: "Versatile Canadian at Bonnies." },
  { name: "Irish Coquia", pos: "G", ht: "6'1\"", school: "New Orleans", conf: "Southland", classYear: "Senior", hometown: "Vancouver, BC", ppg: 12.0, rpg: 2.5, apg: 4.0, fit: "High", draftEligible: "2026 CEBL Draft", note: "BC standout. Scoring point guard." },
  { name: "Bashir Ngala", pos: "F", ht: "6'8\"", school: "Maine", conf: "AEC", classYear: "Junior", hometown: "Ottawa, ON", ppg: 8.0, rpg: 5.5, apg: 0.8, fit: "Medium", draftEligible: "2027", note: "Athletic forward prospect." },
  { name: "Keelan Steele", pos: "G/F", ht: "6'5\"", school: "Maine", conf: "AEC", classYear: "Freshman", hometown: "Hamilton, ON", ppg: 5.5, rpg: 2.8, apg: 1.0, fit: "Medium", draftEligible: "2029", note: "Young Canadian with upside." },
  { name: "Onyx Nnani", pos: "F", ht: "6'7\"", school: "South Florida", conf: "AAC", classYear: "Sophomore", hometown: "Toronto, ON", ppg: 5.0, rpg: 3.5, apg: 0.5, fit: "Medium", draftEligible: "2028", note: "Developing forward at USF." },
  { name: "Cameron Brennan", pos: "F", ht: "6'9\"", school: "Colgate", conf: "Patriot", classYear: "Junior", hometown: "Toronto, ON", ppg: 9.0, rpg: 5.8, apg: 1.0, fit: "High", draftEligible: "2027", note: "Stretch forward with range." },
  { name: "John Ikpotokin", pos: "C", ht: "6'10\"", school: "St. Bonaventure", conf: "A-10", classYear: "Sophomore", hometown: "Toronto, ON", ppg: 6.2, rpg: 5.5, apg: 0.5, fit: "Medium", draftEligible: "2028", note: "Physical center developing." },
  { name: "Jasman Sangha", pos: "G", ht: "6'3\"", school: "N/A (Turned Pro)", conf: "N/A", classYear: "Pro", hometown: "Brampton, ON", ppg: 6.0, rpg: 2.0, apg: 2.5, fit: "High", draftEligible: "Eligible", note: "BRAMPTON NATIVE. First-time pro in 2025 with Honey Badgers." }
];

// Import Targets (Americans & Internationals for CEBL)
const importTargets = [
  { name: "Quinndary Weatherspoon", nationality: "USA", pos: "G", age: 28, ht: "6'3\"", team: "Qingdao Eagles (CBA)", league: "Asia", ppg: 18.5, rpg: 4.2, apg: 3.8, fit: "High", salary: "$1,200-$1,500", note: "2022 NBA Champion. Played for Honey Badgers in 2025. Former Spurs." },
  { name: "Taryn Todd", pos: "G/F", nationality: "USA", age: 24, ht: "6'5\"", team: "Free Agent", league: "CEBL", ppg: 12.3, rpg: 4.5, apg: 2.0, fit: "High", salary: "$800-$1,000", note: "Arkansas State standout. 2025 Honey Badger. Athletic wing." },
  { name: "Xavier Moon", nationality: "USA", pos: "G", age: 28, ht: "6'1\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 22.5, rpg: 3.5, apg: 7.2, fit: "High", salary: "Designated", note: "3x CEBL Player of the Year. Signed with Winnipeg for 2026. Elite scorer." },
  { name: "Isiah Osborne", nationality: "USA", pos: "G", age: 26, ht: "6'4\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 10.3, rpg: 2.9, apg: 1.4, fit: "High", salary: "$800-$1,000", note: "49 CEBL career games. Signed Winnipeg 2026." },
  { name: "Christian Rohlehr", nationality: "USA", pos: "F/C", age: 26, ht: "6'9\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 11.0, rpg: 6.5, apg: 1.0, fit: "High", salary: "$900-$1,100", note: "Re-signed with Ottawa for 2026. Physical interior presence." },
  { name: "Justin Harmon", nationality: "USA", pos: "G", age: 25, ht: "6'2\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 13.5, rpg: 2.8, apg: 4.5, fit: "High", salary: "$800-$1,000", note: "Signed with Ottawa for 2026. Scoring guard." },
  { name: "Shakur Daniel", nationality: "USA", pos: "G", age: 25, ht: "6'0\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 3.7, rpg: 2.3, apg: 1.8, fit: "Medium", salary: "$500-$700", note: "Re-signed with Ottawa. 22 games in 2025, 13 starts." },
  { name: "Barber", nationality: "USA", pos: "G", age: 26, ht: "6'3\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 16.5, rpg: 3.5, apg: 4.0, fit: "High", salary: "$1,100-$1,300", note: "All-CEBL First Team guard. Re-signed with Scarborough." },
  { name: "Williams", nationality: "USA", pos: "F", age: 27, ht: "6'7\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 14.0, rpg: 6.0, apg: 1.5, fit: "High", salary: "$1,000-$1,200", note: "Back from Shanghai Sharks (CBA). Re-signed Scarborough." },
  { name: "Emmanuel Akot", nationality: "USA", pos: "F", age: 26, ht: "6'8\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 13.2, rpg: 5.8, apg: 2.5, fit: "High", salary: "$1,000-$1,200", note: "Re-signed with Winnipeg for 2026. Arizona product. Versatile forward." },
  { name: "Nathan Bilamu", nationality: "International", pos: "F", age: 24, ht: "6'7\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 8.0, rpg: 5.0, apg: 1.0, fit: "Medium", salary: "$600-$800", note: "Agreed to terms with Winnipeg for 2026." },
  { name: "Jackson", nationality: "USA", pos: "G", age: 25, ht: "6'3\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 10.5, rpg: 2.8, apg: 3.5, fit: "Medium", salary: "$700-$900", note: "Welcomed back by Ottawa for 2026." },
  { name: "Justin Ndjock-Tadjore", nationality: "CAN/INT", pos: "F", age: 24, ht: "6'8\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 7.5, rpg: 4.5, apg: 0.8, fit: "High", salary: "$600-$800", note: "Third season with Ottawa. First standard contract (was developmental)." },
  { name: "Diego Maffia", nationality: "CAN/INT", pos: "G", age: 23, ht: "6'2\"", team: "Vancouver Bandits", league: "CEBL", ppg: 8.0, rpg: 2.5, apg: 3.0, fit: "Medium", salary: "$500-$700", note: "Victoria Vikes star, U SPORTS champion. Re-signed with Bandits." },
  { name: "Yohann Sam", nationality: "CAN/INT", pos: "F", age: 22, ht: "6'7\"", team: "Brampton (2025)", league: "CEBL", ppg: 6.5, rpg: 3.8, apg: 1.0, fit: "High", salary: "$400-$600", note: "2025 CEBL Draft 2nd overall pick (Brampton). Hometown acquisition." }
];

// League-wide 2026 Signings
const leagueSignings = {
  "Brampton Honey Badgers": {
    color: "#D4AF37",
    bg: "#1a1500",
    emoji: "🦡",
    players: [
      { name: "Sean East II", pos: "G", type: "New Signing", detail: "From Edmonton Stingers | 2025 CEBL MVP Runner-Up" },
      { name: "Jameer Nelson Jr.", pos: "G", type: "New Signing", detail: "From Calgary Surge | 2025 DPOY" },
      { name: "Keon Ambrose-Hylton", pos: "F", type: "New Signing", detail: "CEBL All-Canadian Forward" },
      { name: "Danilo Djuricic", pos: "F", type: "New Signing", detail: "From Scarborough | 5.5 PPG, 3.7 RPG" },
      { name: "Prince Oduro", pos: "F/C", type: "New Signing", detail: "Canadian big man" }
    ]
  },
  "Niagara River Lions": {
    color: "#0066CC",
    bg: "#001122",
    emoji: "🦁",
    players: [
      { name: "T.J. Lall", pos: "F", type: "Re-Signing", detail: "Return from BNXT League (Netherlands)" },
      { name: "Nathan Cayo", pos: "F", type: "Re-Signing", detail: "Back-to-back CEBL Champion" },
      { name: "Elijah Lufile", pos: "F", type: "New Signing", detail: "From Lebanon Div. A | 14.1 PPG, 10.6 RPG" }
    ]
  },
  "Vancouver Bandits": {
    color: "#FF6B35",
    bg: "#1a0d00",
    emoji: "🏴‍☠️",
    players: [
      { name: "Tyrese Samuel", pos: "F/C", type: "Re-Signing", detail: "2025 Canadian Player of the Year | 21.7 PPG" },
      { name: "Diego Maffia", pos: "G", type: "Re-Signing", detail: "U SPORTS Champion | Victoria Vikes" },
      { name: "Jass", pos: "G", type: "New Signing", detail: "Basketball content creator turned player" }
    ]
  },
  "Winnipeg Sea Bears": {
    color: "#003366",
    bg: "#000d1a",
    emoji: "🐻",
    players: [
      { name: "Xavier Moon", pos: "G", type: "New Signing", detail: "3x CEBL Player of the Year" },
      { name: "Emmanuel Akot", pos: "F", type: "Re-Signing", detail: "Arizona product. Versatile forward." },
      { name: "David Walker", pos: "G", type: "New Signing", detail: "From Czech Republic NBL" },
      { name: "Isiah Osborne", pos: "G", type: "Re-Signing", detail: "49 career CEBL games" },
      { name: "Fareed Shittu", pos: "F", type: "New Signing", detail: "Canadian forward" },
      { name: "Nathan Bilamu", pos: "F", type: "New Signing", detail: "International forward" }
    ]
  },
  "Ottawa BlackJacks": {
    color: "#CC0000",
    bg: "#1a0000",
    emoji: "🃏",
    players: [
      { name: "Christian Rohlehr", pos: "F/C", type: "Re-Signing", detail: "Physical interior presence" },
      { name: "Shakur Daniel", pos: "G", type: "Re-Signing", detail: "22 games, 13 starts in 2025" },
      { name: "Justin Harmon", pos: "G", type: "New Signing", detail: "Scoring guard" },
      { name: "Justin Ndjock-Tadjore", pos: "F", type: "New Signing", detail: "3rd season, now standard contract" },
      { name: "Jackson", pos: "G", type: "Re-Signing", detail: "Returning for 2026" },
      { name: "Tyrrel Tate", pos: "F", type: "Signed", detail: "Canadian forward" }
    ]
  },
  "Montreal Alliance": {
    color: "#7B2D8E",
    bg: "#0d0011",
    emoji: "⚜️",
    players: [
      { name: "Kevin Osawe", pos: "F", type: "Re-Signing", detail: "Brampton native | 17.2 PPG in Germany" },
      { name: "Keeshawn Barthelemy", pos: "G", type: "New Signing", detail: "Montreal native | Colorado product" }
    ]
  },
  "Edmonton Stingers": {
    color: "#FFB81C",
    bg: "#1a1500",
    emoji: "🐝",
    players: [
      { name: "Emmanuel Bandoumel", pos: "G", type: "New Signing", detail: "22.4 PPG in Finland | SMU product" }
    ]
  },
  "Calgary Surge": {
    color: "#E31837",
    bg: "#1a0005",
    emoji: "⚡",
    players: [
      { name: "Perry Huang (HC)", pos: "Coach", type: "New Hire", detail: "From LA Lakers G League affiliate" }
    ]
  },
  "Scarborough Shooting Stars": {
    color: "#1E90FF",
    bg: "#000d1a",
    emoji: "⭐",
    players: [
      { name: "Barber", pos: "G", type: "Re-Signing", detail: "All-CEBL First-Team Guard" },
      { name: "Williams", pos: "F", type: "Re-Signing", detail: "From Shanghai Sharks (CBA)" }
    ]
  },
  "Saskatoon Mamba": {
    color: "#00AA00",
    bg: "#001a00",
    emoji: "🐍",
    players: [
      { name: "TBD", pos: "-", type: "Rebranded", detail: "Formerly Saskatchewan Rattlers. Signings pending." }
    ]
  }
};

// AI-recommended scouting targets for Brampton
const scoutTargets = [
  { name: "David Muenkat", pos: "G/F", from: "Free Agent (2025 HB)", type: "Canadian", ppg: 10.5, rpg: 4.3, apg: 2.1, salary: "$800-$1,000", fit: "High", tags: ["Brampton Native", "4th CEBL Season", "Fan Favorite", "Hometown"], reason: "Brampton native with CEBL experience. Fan connection. Returner from 2025 Honey Badgers." },
  { name: "Ali Sow", pos: "F", from: "Free Agent (2025 HB)", type: "Canadian", ppg: 8.2, rpg: 4.1, apg: 1.3, salary: "$600-$800", fit: "High", tags: ["Former HB", "Laurier Great", "Cap Friendly"], reason: "Former Honey Badger. Knows the system. Affordable Canadian forward." },
  { name: "Frank Mitchell", pos: "F/C", from: "St. Bonaventure (NCAA)", type: "Canadian", ppg: 11.5, rpg: 7.0, apg: 1.2, salary: "$400-$600 (Dev)", fit: "High", tags: ["Brampton Native", "NCAA Senior", "Physical", "Draft Target"], reason: "BRAMPTON native senior at St. Bonaventure. Physical big man ready to go pro. Local connection." },
  { name: "Amari Kelly", pos: "F", from: "Free Agent", type: "Canadian", ppg: 9.1, rpg: 5.5, apg: 0.7, salary: "$700-$900", fit: "High", tags: ["NBA SL Tested", "Athletic", "Upside"], reason: "Athletic forward with NBA Summer League experience. Upside play at affordable cost." },
  { name: "Patrick Emilien", pos: "F", from: "Free Agent (2025 HB)", type: "Canadian", ppg: 7.5, rpg: 5.0, apg: 0.8, salary: "$600-$800", fit: "High", tags: ["Former HB", "Rebounder", "Physical"], reason: "Returning Honey Badger. Knows the culture. Physical rebounder at low cost." },
  { name: "Josh Omojafo", pos: "F", from: "South Florida (NCAA)", type: "Canadian", ppg: 6.5, rpg: 4.8, apg: 0.5, salary: "$400-$500 (Dev)", fit: "Medium", tags: ["Brampton Native", "NCAA D1", "Development"], reason: "BRAMPTON native at South Florida. Developmental player candidate (off-cap)." },
  { name: "Jasman Sangha", pos: "G", from: "2025 HB / Brampton", type: "Canadian", ppg: 6.0, rpg: 2.0, apg: 2.5, salary: "$400-$500 (Dev)", fit: "High", tags: ["Brampton Native", "Hometown", "Development"], reason: "Brampton hometown hero. First-time pro in 2025 with Honey Badgers. Dev player candidate." },
  { name: "Quinndary Weatherspoon", pos: "G", from: "Qingdao Eagles (CBA)", type: "Import", ppg: 18.5, rpg: 4.2, apg: 3.8, salary: "$1,200-$1,500", fit: "High", tags: ["NBA Champion", "Former HB", "Elite"], reason: "2022 NBA Champion who played for Honey Badgers in 2025. Proven at highest level." }
];
