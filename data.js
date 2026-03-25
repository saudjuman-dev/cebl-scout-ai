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

// Honey Badgers 2026 Confirmed Roster
const honeyBadgersRoster = [
  { name: "Sean East II", pos: "G", nationality: "USA", type: "Import", status: "Signed", salary: 1400, stats: "25.3 PPG, 3.2 RPG, 5.8 APG (2025 Edmonton)", note: "2025 CEBL MVP Runner-Up, All-CEBL 1st Team. Led CEBL in total points (582) and FGM (215).", character: "Elite competitor, leadership qualities" },
  { name: "Quinndary Weatherspoon", pos: "G", nationality: "USA", type: "Import", status: "Signed", salary: 1400, stats: "18.5 PPG, 4.2 RPG, 3.8 APG (CBA/CEBL)", note: "2022 NBA Champion. Played for Honey Badgers in 2025. Former Spurs. CBA stint.", character: "NBA champion, proven winner" },
  { name: "Keon Ambrose-Hylton", pos: "F", nationality: "CAN", type: "Canadian", status: "Signed", salary: 1000, stats: "All-Canadian selection", note: "CEBL All-Canadian forward. Physical, athletic.", character: "Community-oriented, strong work ethic" },
  { name: "Danilo Djuricic", pos: "F", nationality: "CAN", type: "Canadian", status: "Signed", salary: 600, stats: "5.5 PPG, 3.7 RPG (2025 Scarborough)", note: "Experienced CEBL forward. 17 games with Shooting Stars.", character: "Reliable team player" },
  { name: "Prince Oduro", pos: "F/C", nationality: "CAN", type: "Canadian", status: "Signed", salary: 700, stats: "CEBL experience", note: "Canadian big man, physical interior presence.", character: "Developing talent, coachable" }
];

// Canadian Players Playing Pro Overseas (CEBL-realistic leagues only, NO NBA/EuroLeague/CBA)
const canadiansPro = [
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
  // Overseas Canadians - European domestic leagues (non-EuroLeague)
  { name: "Trae Bell-Haynes", pos: "G", age: 28, ht: "6'0\"", team: "Casademont Zaragoza", league: "Europe - Spain Liga Endesa", ppg: 10.7, rpg: 2.3, apg: 6.2, fit: "Medium", salary: "$1,000-$1,300", character: "Good", hometown: "Toronto, ON", note: "Team Canada AmeriCup. Veteran PG. UVM legend. Barcelona interest reported." },
  { name: "Thomas Kennedy", pos: "C", age: 24, ht: "6'10\"", team: "Telekom Baskets Bonn", league: "Europe - Germany BBL", ppg: 11.8, rpg: 5.8, apg: 1.5, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "BBL & FIBA Champions League. 71.3% TS rookie year. Team Canada rep. Playmaking big." },
  { name: "Fardaws Aimaq", pos: "C", age: 24, ht: "6'11\"", team: "European Club", league: "Europe - FIBA Europe Cup", ppg: 12.0, rpg: 10.5, apg: 1.0, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Vancouver, BC", note: "BC native. Former NCAA star (Utah Valley, Texas Tech). Double-double machine. First pro season." },
  // O'Shae Brissett moved to ex-NBA free agents section below
  { name: "Javonte Brown-Ferguson", pos: "F/C", age: 24, ht: "6'9\"", team: "Tizona Burgos", league: "Europe - Spain Primera FEB", ppg: 10.5, rpg: 7.2, apg: 0.8, fit: "High", salary: "$600-$800", character: "Good", hometown: "Toronto, ON", note: "Spanish 2nd division. Physical big man. Affordable Canadian talent." },
  { name: "Matteus Case", pos: "G", age: 23, ht: "6'3\"", team: "Vitoria SC", league: "Europe - Portugal Liga Betclic", ppg: 11.0, rpg: 3.0, apg: 3.5, fit: "High", salary: "$500-$700", character: "Good", hometown: "Toronto, ON", note: "Portuguese top league. Young scoring guard. Very affordable for CEBL." },
  { name: "Jahmal Abbey-Wright", pos: "G", age: 24, ht: "6'2\"", team: "KB Teuta Durres", league: "Europe - Albania Superliga", ppg: 15.5, rpg: 3.2, apg: 4.0, fit: "High", salary: "$500-$700", character: "Good", hometown: "Toronto, ON", note: "Albanian Superliga. High-volume scorer. Very cap-friendly for CEBL." },
  { name: "Phil Scrubb", pos: "G", age: 33, ht: "6'3\"", team: "European Club", league: "Europe - Germany/Greece", ppg: 9.5, rpg: 2.5, apg: 4.0, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Richmond, BC", note: "Veteran Canadian. FIBA Europe Cup champion. Frankfurt, AEK Athens career. Team Canada." },
  { name: "Thomas Scrubb", pos: "F", age: 33, ht: "6'7\"", team: "European Club", league: "Europe", ppg: 8.5, rpg: 4.5, apg: 1.5, fit: "Medium", salary: "$700-$900", character: "Good", hometown: "Richmond, BC", note: "Veteran forward. Long European career. Team Canada. Phil's brother." },
  { name: "Ben Krikke", pos: "F/C", age: 24, ht: "6'9\"", team: "Ourense", league: "Europe - Spain LEB Gold", ppg: 9.5, rpg: 5.5, apg: 1.0, fit: "High", salary: "$600-$800", character: "Good", hometown: "Edmonton, AB", note: "Spanish 2nd division. Instinctive off-ball mover. Alberta talent." },
  { name: "Nick Ongenda", pos: "C", age: 23, ht: "6'10\"", team: "Anwil Wloclawek", league: "Europe - Poland/FIBA Europe Cup", ppg: 7.5, rpg: 6.0, apg: 0.5, fit: "High", salary: "$500-$700", character: "Good", hometown: "Montreal, QC", note: "Mobile rim protector. 7'4\" wingspan. Polish league. Very affordable." },
  // NOTE: Isiaha Mike now at Bayern Munich (EuroLeague) - EXCLUDED as EuroLeague player
  // NOTE: Xavier Rathan-Mayes now at Bayern Munich (EuroLeague) - EXCLUDED as EuroLeague player
  { name: "Melvin Ejim", pos: "F", age: 33, ht: "6'6\"", team: "European Club", league: "Europe - Italy", ppg: 8.0, rpg: 4.5, apg: 1.0, fit: "Medium", salary: "$700-$900", character: "Good", hometown: "Toronto, ON", note: "Italian league veteran. Championship winner with Reyer Venezia. Team Canada." },
  { name: "Kaza Kajami-Keane", pos: "G", age: 30, ht: "6'2\"", team: "Niners Chemnitz", league: "Europe - Germany BBL", ppg: 10.0, rpg: 2.5, apg: 4.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "Germany BBL (Niners Chemnitz). Jamaican-Canadian. FIBA WC 2027 qualifier rep. Carleton product. Spartak Subotica (Serbia) previously." },
  { name: "Kyle Alexander", pos: "C", age: 28, ht: "6'11\"", team: "European Club", league: "Europe", ppg: 8.0, rpg: 6.5, apg: 1.0, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Milton, ON", note: "Tennessee product. European leagues career. Rim protection and length." },
  { name: "Kassius Robertson", pos: "G", age: 29, ht: "6'3\"", team: "Valencia Basket area", league: "Europe - Spain", ppg: 11.0, rpg: 2.5, apg: 2.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "Spanish league. Missouri product. Reliable perimeter scorer." },
  // KEY MISSING PLAYERS - added per GM request
  { name: "Eddie Ekiyor", pos: "F/C", age: 28, ht: "6'7\"", team: "Saint-Quentin", league: "Europe - France Betclic Elite", ppg: 7.0, rpg: 3.0, apg: 3.0, fit: "High", salary: "$1,000-$1,200", character: "Good", hometown: "Ottawa, ON", note: "France Betclic Elite (Pro A). Carleton product, 2x U SPORTS champ, 2019 Final 8 MVP. CEBL DPOY with Niagara. Israel, Portugal, Georgia, France experience." },
  { name: "Jahvon Blair", pos: "G", age: 28, ht: "6'4\"", team: "Chorale de Roanne", league: "Europe - France Elite 2 (Pro B)", ppg: 14.5, rpg: 2.5, apg: 3.0, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Toronto, ON", note: "France Pro B. Career-high 34 pts vs Antibes. Georgetown product. Former Niagara River Lion. 5/12 from three in career game." },
  { name: "Olivier Hanlan", pos: "G", age: 32, ht: "6'4\"", team: "KK Spartak Subotica", league: "Europe - Serbia KLS", ppg: 12.0, rpg: 3.0, apg: 3.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Gatineau, QC", note: "2015 NBA Draft (Utah Jazz, 42nd). Played in 11 countries: Canada, China, Spain, France, Germany, Greece, Italy, Lithuania, Russia, Turkey, USA. Veteran scorer." },
  { name: "Enoch Boakye", pos: "F", age: 22, ht: "6'9\"", team: "Spirou Basket Charleroi", league: "Europe - Belgium Pro Basketball League", ppg: 8.0, rpg: 5.5, apg: 0.8, fit: "High", salary: "$500-$700", character: "Good", hometown: "Toronto, ON", note: "Belgian Pro Basketball League. Young Canadian big. Previously Montenegro. Multiple leagues this year." },
  { name: "Daniel Sackey", pos: "G", age: 26, ht: "5'9\"", team: "Hyères-Toulon Var Basket", league: "Europe - France Elite 2 (Pro B)", ppg: 10.5, rpg: 2.0, apg: 5.0, fit: "High", salary: "$500-$700", character: "Good", hometown: "Winnipeg, MB", note: "France Pro B. Ghanaian-Canadian. Quick, tenacious defender. Very cap-friendly." },
  { name: "Kur Jongkuch", pos: "F", age: 25, ht: "6'8\"", team: "Vancouver Bandits", league: "CEBL", ppg: 9.5, rpg: 6.0, apg: 1.0, fit: "High", salary: "$700-$900", character: "Good", hometown: "London, ON", note: "Team Canada call-up in 2025. Born in South Sudan. First ever senior national team selection. Physical forward." },
  { name: "Justin Ndjock-Tadjore", pos: "F", age: 25, ht: "6'8\"", team: "BK Ogre (Estonia-Latvia)", league: "Europe - Estonian-Latvian BBL", ppg: 10.0, rpg: 5.5, apg: 1.0, fit: "High", salary: "$600-$800", character: "Good", hometown: "Ottawa, ON", note: "Signed Ottawa BlackJacks for 2026. 3rd CEBL campaign. First standard contract. Estonian-Latvian league." },
  { name: "Devoe Joseph", pos: "G", age: 32, ht: "6'4\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 11.5, rpg: 3.5, apg: 3.0, fit: "Medium", salary: "$900-$1,100", character: "Good", hometown: "Scarborough, ON", note: "23 years pro experience. Scarborough native. Playing at home for first time since HS. Fan favourite." },
  { name: "Nick Lewis", pos: "F", age: 31, ht: "6'7\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 10.0, rpg: 5.0, apg: 1.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Scarborough, ON", note: "23 years combined pro experience with Joseph. Scarborough native. Playing at home." },
  { name: "Conor Morgan", pos: "F", age: 31, ht: "6'9\"", team: "Bahcesehir Koleji Istanbul", league: "Europe - Turkey BSL", ppg: 9.0, rpg: 5.5, apg: 1.0, fit: "Medium", salary: "$1,000-$1,200", character: "Good", hometown: "Toronto, ON", note: "Turkish BSL. Physical Canadian forward. Long European career." },
  { name: "Quincy Guerrier", pos: "F", age: 25, ht: "6'7\"", team: "Raptors 905 / Montreal Alliance", league: "G League / CEBL", ppg: 14.0, rpg: 6.5, apg: 1.5, fit: "High", salary: "$1,000-$1,200", character: "Good", hometown: "Montreal, QC", note: "Expected to return to Montreal Alliance after G League. Syracuse/Oregon product. Athletic wing." },
  { name: "Nathan Bilamu", pos: "G", age: 24, ht: "6'3\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 19.7, rpg: 4.5, apg: 3.8, fit: "High", salary: "$800-$1,000", character: "Good", hometown: "Canada", note: "Signed Winnipeg 2026. 19.7 PPG senior university season. OUA First-Team All-Star. Lakehead product." },
  { name: "Lien Phillip", pos: "F", age: 36, ht: "6'8\"", team: "Lille Metropole (France Pro B)", league: "Europe - France Elite 2 (Pro B)", ppg: 12.0, rpg: 6.0, apg: 1.5, fit: "Low", salary: "$700-$900", character: "Good", hometown: "Canada", note: "French Pro B veteran. Led Lille to key wins. Veteran presence." },
  // Mfiondu Kabengele - EuroCup level (Reyer Venezia) - included as non-EuroLeague
  { name: "Mfiondu Kabengele", pos: "C", age: 28, ht: "6'10\"", team: "Reyer Venezia / BC Dubai", league: "Europe - Italy LBA / EuroCup", ppg: 13.4, rpg: 12.8, apg: 1.0, fit: "Low", salary: "$1,200-$1,500", character: "Good", hometown: "Burlington, ON", note: "Italian LBA & EuroCup (not EuroLeague). Double-double machine. 17.0 PPG AmeriCup qualifiers. Former NBA (Clippers, Cavaliers)." },
  { name: "Kyle Wiltjer", pos: "F", age: 31, ht: "6'10\"", team: "European Club", league: "Europe", ppg: 10.0, rpg: 4.5, apg: 1.5, fit: "Low", salary: "$1,000-$1,300", character: "Good", hometown: "Portland, OR (CAN citizenship)", note: "Canadian international. Gonzaga product. Greece (Olympiacos), Turkey (Turk Telekom) career. Team Canada staple." },
  { name: "Kevin Pangos", pos: "G", age: 32, ht: "6'2\"", team: "European Club", league: "Europe", ppg: 9.5, rpg: 2.0, apg: 5.0, fit: "Low", salary: "$1,000-$1,300", character: "Good", hometown: "Holland Landing, ON", note: "Most successful Canadian in EuroLeague history. 6 EuroLeague seasons. 2x All-EuroLeague. Spain, Lithuania, Russia, Italy career." },
  { name: "Nickeil Alexander-Walker", pos: "G", age: 27, ht: "6'5\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 12.0, rpg: 3.0, apg: 3.0, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Toronto, ON", note: "Former NBA (Pelicans, Jazz, Wolves, Timberwolves). Virginia Tech product. If unsigned by NBA team, CEBL target." },
  { name: "Luguentz Dort", pos: "G", age: 26, ht: "6'3\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 11.0, rpg: 3.5, apg: 2.0, fit: "Low", salary: "Over Cap", character: "Good", hometown: "Montreal, QC", note: "Former OKC Thunder starter. ASU product. Likely NBA return but monitoring. Montreal native." },
  { name: "Chris Boucher", pos: "F/C", age: 33, ht: "6'9\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 9.0, rpg: 5.5, apg: 0.8, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Montreal, QC", note: "Former Raptors fan favorite. G League MVP/DPOY (2019). Montreal native. If unsigned by NBA, major CEBL addition." },
  { name: "Dalano Banton", pos: "G/F", age: 25, ht: "6'9\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 8.5, rpg: 3.5, apg: 3.0, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Toronto, ON", note: "Former Raptors. 1st Canadian born-and-raised Raptors draft pick (2021). Rexdale native. Checking NBA market." },
  { name: "Oshae Brissett", pos: "F", age: 27, ht: "6'7\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 8.0, rpg: 4.0, apg: 1.0, fit: "Medium", salary: "$1,000-$1,200", character: "Good", hometown: "Toronto, ON", note: "Former Pacers, Raptors, Celtics. Physical wing. If NBA market dries up, elite CEBL addition." },
  { name: "Mychal Mulder", pos: "G", age: 30, ht: "6'3\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 7.5, rpg: 2.0, apg: 1.0, fit: "Medium", salary: "$1,000-$1,200", character: "Good", hometown: "Windsor, ON", note: "Former Warriors. Elite 3-point shooter. Kentucky product. Windsor native." },
  { name: "Nate Darling", pos: "G", age: 27, ht: "6'4\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 10.0, rpg: 2.5, apg: 2.5, fit: "High", salary: "$1,000-$1,200", character: "Good", hometown: "Halifax, NS", note: "Former Hornets. Atlantic Canada talent. Delaware product. Strong 3-point shooter." },
  { name: "Andrew Nembhard", pos: "G", age: 26, ht: "6'5\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 8.0, rpg: 3.0, apg: 5.0, fit: "Low", salary: "Over Cap", character: "Good", hometown: "Aurora, ON", note: "Former Pacers starter. Gonzaga product. NBA champion 2025 (if applicable). Likely NBA return." },
  { name: "Tristan Thompson", pos: "C", age: 35, ht: "6'9\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 6.0, rpg: 7.0, apg: 1.0, fit: "Low", salary: "Over Cap", character: "Mixed", hometown: "Brampton, ON", note: "BRAMPTON NATIVE. Former Cavaliers, 2016 NBA Champion. Veteran big. Marketable name. Fan draw." },
  { name: "Ignas Brazdeikis", pos: "F", age: 26, ht: "6'7\"", team: "European Club", league: "Europe", ppg: 10.0, rpg: 3.5, apg: 1.5, fit: "Medium", salary: "$800-$1,000", character: "Good", hometown: "Mississauga, ON", note: "Former Knicks (2019 NBA Draft). European career. Oakville native. Michigan product." },
  { name: "Trey Lyles", pos: "F/C", age: 30, ht: "6'10\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 8.5, rpg: 5.0, apg: 1.5, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Saskatoon, SK", note: "Former NBA (Jazz, Nuggets, Spurs, Kings, Pacers). Saskatchewan native. Lottery pick (12th, 2015)." },
  { name: "Cory Joseph", pos: "G", age: 34, ht: "6'3\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 6.5, rpg: 2.5, apg: 3.5, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Toronto, ON", note: "2014 NBA Champion (Spurs). 13+ NBA seasons. Raptors, Pacers, Kings, Pistons, Warriors. Veteran leader." },
  { name: "Dwight Powell", pos: "F/C", age: 33, ht: "6'10\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 7.0, rpg: 4.5, apg: 1.0, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Toronto, ON", note: "Former Mavericks (10 seasons). Toronto native. Stanford product. Rim-running big." },
  { name: "Khem Birch", pos: "C", age: 33, ht: "6'9\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 6.0, rpg: 5.0, apg: 1.5, fit: "Medium", salary: "$1,000-$1,200", character: "Good", hometown: "Montreal, QC", note: "Former Raptors, Magic. Montreal native. UNLV product. Tough interior defender." },
  { name: "Brandon Clarke", pos: "F/C", age: 29, ht: "6'8\"", team: "Free Agent", league: "Free Agent (ex-NBA)", ppg: 10.0, rpg: 5.0, apg: 1.0, fit: "Medium", salary: "$1,200-$1,500", character: "Good", hometown: "Vancouver, BC", note: "Former Grizzlies. Gonzaga product. Vancouver native. Elite shot-blocker." }
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
  { name: "Quinndary Weatherspoon", nationality: "USA", pos: "G", age: 28, ht: "6'3\"", team: "Qingdao Eagles (CBA)", league: "G League / CBA", ppg: 18.5, rpg: 4.2, apg: 3.8, fit: "High", salary: "$1,200-$1,500", note: "2022 NBA Champion. Played for Honey Badgers in 2025. Former Spurs. CBA stint ending." },
  { name: "Taryn Todd", pos: "G/F", nationality: "USA", age: 24, ht: "6'5\"", team: "Free Agent", league: "CEBL", ppg: 12.3, rpg: 4.5, apg: 2.0, fit: "High", salary: "$800-$1,000", note: "Arkansas State standout. 2025 Honey Badger. Athletic wing." },
  { name: "Teddy Allen", pos: "G/F", nationality: "USA", age: 27, ht: "6'6\"", team: "Free Agent", league: "CEBL", ppg: 24.5, rpg: 5.2, apg: 3.8, fit: "High", salary: "Designated", note: "2023 CEBL MVP. One of the greatest offensive players in CEBL history. Divisive but elite." },
  { name: "Xavier Moon", nationality: "USA", pos: "G", age: 28, ht: "6'1\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 22.5, rpg: 3.5, apg: 7.2, fit: "High", salary: "Designated", note: "3x CEBL Player of the Year. Signed with Winnipeg 2026." },
  { name: "Cat Barber", nationality: "USA", pos: "G", age: 28, ht: "6'1\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 19.5, rpg: 3.0, apg: 5.5, fit: "High", salary: "$1,200-$1,500", note: "All-CEBL First Team. 2nd all-time CEBL scoring behind Ahmed Hill. Re-signed Scarborough." },
  { name: "Isiah Osborne", nationality: "USA", pos: "G", age: 26, ht: "6'4\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 10.3, rpg: 2.9, apg: 1.4, fit: "High", salary: "$800-$1,000", note: "49 CEBL career games. Signed Winnipeg 2026." },
  { name: "Christian Rohlehr", nationality: "USA", pos: "F/C", age: 26, ht: "6'9\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 11.0, rpg: 6.5, apg: 1.0, fit: "High", salary: "$900-$1,100", note: "Re-signed with Ottawa for 2026. Physical interior presence." },
  { name: "Justin Harmon", nationality: "USA", pos: "G", age: 25, ht: "6'2\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 13.5, rpg: 2.8, apg: 4.5, fit: "High", salary: "$800-$1,000", note: "Signed with Ottawa for 2026. Scoring guard." },
  { name: "Williams", nationality: "USA", pos: "F", age: 27, ht: "6'7\"", team: "Scarborough Shooting Stars", league: "CEBL / CBA", ppg: 14.0, rpg: 6.0, apg: 1.5, fit: "High", salary: "$1,000-$1,200", note: "Back from Shanghai Sharks (CBA). Re-signed Scarborough." },
  { name: "Emmanuel Akot", nationality: "USA", pos: "F", age: 26, ht: "6'8\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 13.2, rpg: 5.8, apg: 2.5, fit: "High", salary: "$1,000-$1,200", note: "Re-signed with Winnipeg for 2026. Arizona product. Versatile forward." },
  { name: "Shakur Daniel", nationality: "USA", pos: "G", age: 25, ht: "6'0\"", team: "Ottawa BlackJacks", league: "CEBL / G League", ppg: 3.7, rpg: 2.3, apg: 1.8, fit: "Medium", salary: "$500-$700", note: "Re-signed Ottawa. Defensive specialist. G League experience." },
  { name: "Yohann Sam", nationality: "CAN/FRA", pos: "F", age: 22, ht: "6'7\"", team: "Brampton (2025)", league: "CEBL", ppg: 6.5, rpg: 3.8, apg: 1.0, fit: "High", salary: "$400-$600", note: "2025 CEBL Draft 2nd overall pick (Brampton). Hometown acquisition." },
  // 2025 CEBL stat leaders (Americans) - free agents
  { name: "Ja'Vonte Smart", nationality: "USA", pos: "G", age: 25, ht: "6'4\"", team: "Free Agent (2025 Ottawa)", league: "CEBL", ppg: 25.9, rpg: 3.5, apg: 5.0, fit: "High", salary: "$1,200-$1,500", note: "2025 CEBL PPG leader (25.9). LSU product. Elite scorer available for signing." },
  { name: "Isaih Moore", nationality: "USA", pos: "C", age: 25, ht: "6'10\"", team: "Free Agent (2025 Ottawa)", league: "CEBL", ppg: 14.0, rpg: 11.4, apg: 1.5, fit: "High", salary: "$900-$1,100", note: "2025 CEBL RPG leader (11.4). Dominant rebounder. NC State product." },
  { name: "Corey Davis Jr.", nationality: "USA", pos: "G", age: 27, ht: "6'1\"", team: "Niners Chemnitz (Germany BBL)", league: "Europe - Germany BBL", ppg: 15.5, rpg: 3.0, apg: 7.8, fit: "High", salary: "$1,000-$1,200", note: "2025 CEBL APG leader (7.8). Signed with Niners Chemnitz (Germany BBL) post-CEBL. Houston product." },
  // KEY MISSING IMPORTS - added per GM request
  { name: "Khalil Ahmad", nationality: "USA", pos: "G", age: 29, ht: "6'3\"", team: "Maccabi Rishon Lezion", league: "Israel Winner League", ppg: 21.7, rpg: 4.3, apg: 3.1, fit: "High", salary: "Designated", note: "CEBL LEGEND. Most decorated player in CEBL history. 2025 Finals MVP with Niagara. Career-high 45 pts (Italy Serie A2). CEBL history re-sign with Niagara. Iceland, Denmark, Israel, Belgium, Italy experience." },
  { name: "Donovan Williams", nationality: "USA", pos: "G", age: 25, ht: "6'5\"", team: "Scarborough Shooting Stars", league: "CEBL / G League", ppg: 17.2, rpg: 4.0, apg: 2.5, fit: "High", salary: "$1,000-$1,200", note: "Re-signed Scarborough. 17.2 PPG with Santa Cruz (G League). 2 NBA games (Hawks). 2023 NBA Summer League (Wizards). From Shanghai." },
  { name: "Tevian Jones", nationality: "USA", pos: "G/F", age: 26, ht: "6'6\"", team: "Scarborough Shooting Stars", league: "CEBL / G League", ppg: 13.5, rpg: 4.5, apg: 2.0, fit: "High", salary: "$900-$1,100", note: "NBA Summer League (Pelicans). 50 games Birmingham Squadron (G League). Athletic wing signed Scarborough." },
  { name: "Hason Ward", nationality: "BRB", pos: "F", age: 23, ht: "6'8\"", team: "Scarborough Shooting Stars", league: "CEBL", ppg: 8.0, rpg: 5.0, apg: 1.0, fit: "Medium", salary: "$600-$800", note: "Barbados-born forward. Non-American international import. Professional debut with Shooting Stars." },
  { name: "Jalen Harris", nationality: "USA", pos: "G", age: 27, ht: "6'5\"", team: "CEBL", league: "CEBL", ppg: 22.0, rpg: 4.0, apg: 4.5, fit: "High", salary: "$1,200-$1,500", note: "Top scorer of the day multiple times in 2025 CEBL. Elite scoring guard. Former NBA (Raptors)." },
  { name: "Scottie Lindsey", nationality: "USA", pos: "G/F", age: 28, ht: "6'5\"", team: "CEBL", league: "CEBL", ppg: 18.5, rpg: 5.0, apg: 3.0, fit: "High", salary: "$1,000-$1,200", note: "Named top scorer of the day in 2025 CEBL. Northwestern product. Versatile two-way wing." },
  { name: "Alex Campbell", nationality: "USA", pos: "G", age: 27, ht: "6'2\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 14.0, rpg: 3.0, apg: 4.0, fit: "High", salary: "$900-$1,100", note: "Signed Winnipeg 2026. Part of Moon-Campbell backcourt." },
  { name: "Daren Watts", nationality: "USA", pos: "G", age: 26, ht: "6'3\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 12.0, rpg: 3.5, apg: 3.0, fit: "Medium", salary: "$800-$1,000", note: "Signed Winnipeg 2026. Part of deep Sea Bears guard rotation." },
  { name: "Izaiah Brockington", nationality: "USA", pos: "G/F", age: 26, ht: "6'4\"", team: "NZ Breakers (Australia NBL)", league: "Oceania - Australia NBL", ppg: 14.5, rpg: 5.0, apg: 2.0, fit: "High", salary: "$1,000-$1,200", note: "From Vancouver Bandits to NZ Breakers (Aus NBL). 2025 NBA Summer League (Clippers). Iowa State product." },
  { name: "Ahmed Hill", nationality: "USA", pos: "G", age: 28, ht: "6'1\"", team: "CEBL", league: "CEBL", ppg: 20.0, rpg: 3.5, apg: 5.0, fit: "High", salary: "$1,200-$1,500", note: "All-time CEBL leading scorer. Virginia Tech product. Proven CEBL performer." },
  // G League waived / released players available for CEBL summer
  { name: "Chase Jeter", nationality: "USA", pos: "F/C", age: 27, ht: "6'10\"", team: "Waived - Austin Spurs", league: "G League (waived)", ppg: 10.5, rpg: 7.2, apg: 1.0, fit: "High", salary: "$800-$1,000", note: "Duke product. Waived from Austin Spurs. Physical big available for summer." },
  { name: "Zhuric Phelps", nationality: "USA", pos: "G", age: 23, ht: "6'4\"", team: "Waived - Texas Legends", league: "G League (waived)", ppg: 15.2, rpg: 3.5, apg: 2.8, fit: "High", salary: "$800-$1,000", note: "Waived from Texas Legends. Young scoring guard with upside." },
  { name: "Javan Johnson", nationality: "USA", pos: "G/F", age: 25, ht: "6'5\"", team: "Waived - College Park Skyhawks", league: "G League (waived)", ppg: 12.8, rpg: 4.0, apg: 2.2, fit: "High", salary: "$800-$1,000", note: "DePaul product. Waived from Skyhawks. Athletic wing." },
  { name: "Trae Hannibal", nationality: "USA", pos: "G", age: 24, ht: "6'3\"", team: "Waived - Grand Rapids Gold", league: "G League (waived)", ppg: 11.5, rpg: 3.2, apg: 3.5, fit: "High", salary: "$700-$900", note: "LSU product. Explosive athleticism. Waived from Gold." },
  { name: "Manny Obaseki", nationality: "USA", pos: "G", age: 23, ht: "6'4\"", team: "Waived - Westchester Knicks", league: "G League (waived)", ppg: 9.8, rpg: 3.0, apg: 2.0, fit: "Medium", salary: "$600-$800", note: "Texas A&M product. Waived from Westchester. Developing talent." },
  // International mid-tier league players
  { name: "Keanu Rasmussen", nationality: "NZL", pos: "G", age: 24, ht: "6'4\"", team: "Hawke's Bay Hawks", league: "Oceania - NBL1/NZ", ppg: 23.0, rpg: 7.0, apg: 5.8, fit: "High", salary: "$800-$1,000", note: "Tall Blacks national team. NBL1 Central MVP. Championship winner. Elite stats." },
  { name: "Nathan Bilamu", nationality: "International", pos: "F", age: 24, ht: "6'7\"", team: "Winnipeg Sea Bears", league: "CEBL", ppg: 8.0, rpg: 5.0, apg: 1.0, fit: "Medium", salary: "$600-$800", note: "Agreed to terms with Winnipeg for 2026." },
  { name: "Jackson", nationality: "USA", pos: "G", age: 25, ht: "6'3\"", team: "Ottawa BlackJacks", league: "CEBL", ppg: 10.5, rpg: 2.8, apg: 3.5, fit: "Medium", salary: "$700-$900", note: "Welcomed back by Ottawa for 2026." }
];

// League-wide 2026 Signings
const leagueSignings = {
  "Brampton Honey Badgers": {
    color: "#D4AF37", bg: "#1a1500", emoji: "🦡",
    players: [
      { name: "Sean East II", pos: "G", type: "New Signing", detail: "From Edmonton Stingers | 2025 CEBL MVP Runner-Up" },
      { name: "Quinndary Weatherspoon", pos: "G", type: "Returning", detail: "2022 NBA Champion | Former Spurs | CBA experience" },
      { name: "Amari Kelly", pos: "F", type: "New Signing", detail: "G League & NBA Summer League tested | Athletic forward" },
      { name: "Keon Ambrose-Hylton", pos: "F", type: "New Signing", detail: "CEBL All-Canadian Forward" },
      { name: "Danilo Djuricic", pos: "F", type: "New Signing", detail: "From Scarborough | 5.5 PPG, 3.7 RPG" },
      { name: "Prince Oduro", pos: "F/C", type: "New Signing", detail: "Canadian big man" }
    ]
  },
  "Niagara River Lions": {
    color: "#0066CC", bg: "#001122", emoji: "🦁",
    players: [
      { name: "Khalil Ahmad", pos: "G", type: "Re-Signing", detail: "Most decorated CEBL player ever | 2025 Finals MVP | 21.7 PPG Italy Serie A2 | Career-high 45 pts" },
      { name: "Eddie Ekiyor", pos: "F/C", type: "Re-Signing", detail: "CEBL DPOY | France Betclic Elite (Saint-Quentin) | Carleton product" },
      { name: "T.J. Lall", pos: "F", type: "Re-Signing", detail: "Return from BNXT League (Netherlands) | 2024 CEBL Champion" },
      { name: "Nathan Cayo", pos: "F", type: "Re-Signing", detail: "Back-to-back CEBL Champion | France Pro B experience" },
      { name: "Elijah Lufile", pos: "F", type: "New Signing", detail: "From Lebanon Div. A | 14.1 PPG, 10.6 RPG | Double-double machine" }
    ]
  },
  "Vancouver Bandits": {
    color: "#FF6B35", bg: "#1a0d00", emoji: "🏴‍☠️",
    players: [
      { name: "Tyrese Samuel", pos: "F/C", type: "Re-Signing", detail: "2025 Canadian Player of the Year | 21.7 PPG" },
      { name: "Diego Maffia", pos: "G", type: "Re-Signing", detail: "U SPORTS Champion | Victoria Vikes" },
      { name: "Jass", pos: "G", type: "New Signing", detail: "Basketball content creator turned player" }
    ]
  },
  "Winnipeg Sea Bears": {
    color: "#003366", bg: "#000d1a", emoji: "🐻",
    players: [
      { name: "Xavier Moon", pos: "G", type: "New Signing", detail: "3x CEBL Player of the Year | 23.1 PPG (2021) | 2x CEBL Champion | 28 NBA games (Clippers)" },
      { name: "Alex Campbell", pos: "G", type: "New Signing", detail: "Part of Moon-Campbell backcourt" },
      { name: "Daren Watts", pos: "G", type: "New Signing", detail: "Deep guard rotation addition" },
      { name: "Emmanuel Akot", pos: "F", type: "Re-Signing", detail: "Arizona product. Versatile forward." },
      { name: "David Walker", pos: "G", type: "New Signing", detail: "From Czech Republic NBL | Ottawa playoff hero (19 PTS, 3 STL)" },
      { name: "Isiah Osborne", pos: "G", type: "Re-Signing", detail: "49 career CEBL games" },
      { name: "Fareed Shittu", pos: "F", type: "New Signing", detail: "Canadian forward" },
      { name: "Nathan Bilamu", pos: "G", type: "New Signing", detail: "19.7 PPG senior year | OUA First-Team All-Star | Lakehead product" }
    ]
  },
  "Ottawa BlackJacks": {
    color: "#CC0000", bg: "#1a0000", emoji: "🃏",
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
    color: "#7B2D8E", bg: "#0d0011", emoji: "⚜️",
    players: [
      { name: "Kevin Osawe", pos: "F", type: "Re-Signing", detail: "Brampton native | 17.2 PPG in Germany" },
      { name: "Keeshawn Barthelemy", pos: "G", type: "New Signing", detail: "Montreal native | Colorado product" }
    ]
  },
  "Edmonton Stingers": {
    color: "#FFB81C", bg: "#1a1500", emoji: "🐝",
    players: [
      { name: "Emmanuel Bandoumel", pos: "G", type: "New Signing", detail: "22.4 PPG in Finland | SMU product" }
    ]
  },
  "Calgary Surge": {
    color: "#E31837", bg: "#1a0005", emoji: "⚡",
    players: [
      { name: "Perry Huang (HC)", pos: "Coach", type: "New Hire", detail: "Head Coach from South Bay Lakers (G League) | 2 WNBA titles, 1 G League title" },
      { name: "Jameer Nelson Jr.", pos: "G", type: "New Signing", detail: "2025 CEBL DPOY | 20.1 PPG, 2.8 SPG | All-CEBL 2nd Team" }
    ]
  },
  "Scarborough Shooting Stars": {
    color: "#1E90FF", bg: "#000d1a", emoji: "⭐",
    players: [
      { name: "Cat Barber", pos: "G", type: "Re-Signing", detail: "All-CEBL First-Team Guard | 2nd all-time CEBL scorer" },
      { name: "Donovan Williams", pos: "G", type: "Re-Signing", detail: "17.2 PPG Santa Cruz (G League) | 2 NBA games (Hawks) | From Shanghai" },
      { name: "Tevian Jones", pos: "G/F", type: "New Signing", detail: "NBA Summer League (Pelicans) | 50 games Birmingham Squadron (G League)" },
      { name: "Hason Ward", pos: "F", type: "New Signing", detail: "Barbados-born international import | Pro debut" },
      { name: "Devoe Joseph", pos: "G", type: "New Signing", detail: "Scarborough native | 23 yrs pro experience | Hometown hero" },
      { name: "Nick Lewis", pos: "F", type: "New Signing", detail: "Scarborough native | Combined 23 yrs pro experience with Joseph" }
    ]
  },
  "Saskatoon Mamba": {
    color: "#00AA00", bg: "#001a00", emoji: "🐍",
    players: [
      { name: "TBD", pos: "-", type: "Rebranded", detail: "Formerly Saskatchewan Rattlers. Signings pending." }
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
