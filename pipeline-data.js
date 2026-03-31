// ===== Hoops Intelligence - Canadian Pipeline & Advanced Analytics =====
// Canadians playing professionally worldwide (beyond CEBL-focused list)
// Elam Ending analytics, Target shot data, and advanced metrics

// ===== CANADIAN PIPELINE - EVERY CANADIAN PRO WORLDWIDE =====
const canadianPipeline = [
  // ==================== NBA ====================
  { name: "Shai Gilgeous-Alexander", pos: "G", age: 27, ht: "6'6\"", hometown: "Hamilton, ON", team: "Oklahoma City Thunder", league: "NBA", country: "USA", tier: "NBA", ppg: 32.1, rpg: 5.5, apg: 6.2, status: "Active", note: "2025 NBA MVP candidate. Generational talent from Hamilton.", college: "Kentucky" },
  { name: "Jamal Murray", pos: "G", age: 28, ht: "6'4\"", hometown: "Kitchener, ON", team: "Denver Nuggets", league: "NBA", country: "USA", tier: "NBA", ppg: 21.2, rpg: 4.0, apg: 6.5, status: "Active", note: "2023 NBA Champion. Elite playoff performer.", college: "Kentucky" },
  { name: "RJ Barrett", pos: "F", age: 25, ht: "6'6\"", hometown: "Mississauga, ON", team: "Toronto Raptors", league: "NBA", country: "Canada", tier: "NBA", ppg: 18.7, rpg: 5.3, apg: 3.1, status: "Active", note: "Former #3 overall pick. Raptors franchise cornerstone.", college: "Duke" },
  { name: "Dillon Brooks", pos: "F", age: 30, ht: "6'7\"", hometown: "Mississauga, ON", team: "Houston Rockets", league: "NBA", country: "USA", tier: "NBA", ppg: 14.2, rpg: 3.5, apg: 2.0, status: "Active", note: "Elite perimeter defender. Known for physical play.", college: "Oregon" },
  { name: "Luguentz Dort", pos: "G", age: 26, ht: "6'4\"", hometown: "Montreal, QC", team: "Oklahoma City Thunder", league: "NBA", country: "USA", tier: "NBA", ppg: 11.5, rpg: 3.8, apg: 1.8, status: "Active", note: "One of the NBA's best perimeter defenders.", college: "Arizona State" },
  { name: "Andrew Nembhard", pos: "G", age: 25, ht: "6'5\"", hometown: "Aurora, ON", team: "Indiana Pacers", league: "NBA", country: "USA", tier: "NBA", ppg: 12.8, rpg: 3.2, apg: 5.5, status: "Active", note: "Starting PG. Rising star.", college: "Gonzaga" },
  { name: "Bennedict Mathurin", pos: "G", age: 22, ht: "6'6\"", hometown: "Montreal, QC", team: "Indiana Pacers", league: "NBA", country: "USA", tier: "NBA", ppg: 16.5, rpg: 4.2, apg: 2.1, status: "Active", note: "Dynamic young scorer. Montreal native.", college: "Arizona" },
  { name: "Zach Edey", pos: "C", age: 23, ht: "7'4\"", hometown: "Toronto, ON", team: "Memphis Grizzlies", league: "NBA", country: "USA", tier: "NBA", ppg: 10.5, rpg: 8.2, apg: 0.8, status: "Active", note: "2x Naismith POTY. Massive presence.", college: "Purdue" },
  { name: "Nickeil Alexander-Walker", pos: "G", age: 26, ht: "6'5\"", hometown: "Toronto, ON", team: "Minnesota Timberwolves", league: "NBA", country: "USA", tier: "NBA", ppg: 9.4, rpg: 2.5, apg: 2.8, status: "Active", note: "SGA's cousin. Versatile scoring guard.", college: "Virginia Tech" },
  { name: "Kelly Olynyk", pos: "C", age: 33, ht: "7'0\"", hometown: "Kamloops, BC", team: "Toronto Raptors", league: "NBA", country: "Canada", tier: "NBA", ppg: 8.5, rpg: 4.9, apg: 3.0, status: "Active", note: "Veteran stretch 5.", college: "Gonzaga" },
  { name: "Brandon Clarke", pos: "F", age: 28, ht: "6'8\"", hometown: "Vancouver, BC", team: "Memphis Grizzlies", league: "NBA", country: "USA", tier: "NBA", ppg: 7.2, rpg: 4.1, apg: 0.8, status: "Active", note: "Efficient rim-runner and shot-blocker.", college: "Gonzaga" },
  { name: "Trey Lyles", pos: "F", age: 29, ht: "6'9\"", hometown: "Saskatoon, SK", team: "Sacramento Kings", league: "NBA", country: "USA", tier: "NBA", ppg: 8.1, rpg: 4.5, apg: 1.2, status: "Active", note: "Versatile forward. Saskatchewan native.", college: "Kentucky" },
  { name: "Dalano Banton", pos: "G", age: 25, ht: "6'7\"", hometown: "Toronto, ON", team: "Minnesota Timberwolves", league: "NBA", country: "USA", tier: "NBA", ppg: 4.5, rpg: 2.2, apg: 2.0, status: "Active", note: "6'7\" point guard. Toronto native.", college: "Nebraska" },
  { name: "Dwight Powell", pos: "C", age: 33, ht: "6'10\"", hometown: "Toronto, ON", team: "Dallas Mavericks", league: "NBA", country: "USA", tier: "NBA", ppg: 5.8, rpg: 4.0, apg: 1.0, status: "Active", note: "Long-time Maverick. Stanford product.", college: "Stanford" },
  { name: "Oshae Brissett", pos: "F", age: 27, ht: "6'7\"", hometown: "Toronto, ON", team: "Free Agent", league: "NBA", country: "USA", tier: "NBA", ppg: 5.5, rpg: 3.2, apg: 0.8, status: "Free Agent", note: "Versatile two-way wing.", college: "Syracuse" },
  { name: "Dyson Daniels", pos: "G", age: 22, ht: "6'8\"", hometown: "Bendigo / CAN dual", team: "Atlanta Hawks", league: "NBA", country: "USA", tier: "NBA", ppg: 11.0, rpg: 4.5, apg: 3.5, status: "Active", note: "Canadian-eligible. Elite defender. Steals leader.", college: "G League Ignite" },
  { name: "Caleb Houstan", pos: "F", age: 22, ht: "6'8\"", hometown: "Mississauga, ON", team: "Cleveland Cavaliers", league: "NBA", country: "USA", tier: "NBA", ppg: 3.5, rpg: 1.5, apg: 0.5, status: "Active", note: "Young 3-and-D wing prospect.", college: "Michigan" },
  { name: "Eugene Omoruyi", pos: "F", age: 27, ht: "6'6\"", hometown: "Toronto, ON", team: "Free Agent", league: "NBA", country: "USA", tier: "NBA", ppg: 4.0, rpg: 2.0, apg: 0.5, status: "Free Agent", note: "Athletic forward. Oregon product.", college: "Oregon" },

  // ==================== NBA G LEAGUE ====================
  { name: "Karim Mane", pos: "G", age: 23, ht: "6'4\"", hometown: "Montreal, QC", team: "Raptors 905", league: "G League", country: "Canada", tier: "G League", ppg: 16.5, rpg: 4.0, apg: 4.5, status: "Active", note: "Top G League prospect. Strong two-way guard.", college: "Vanier College" },
  { name: "Olivier-Maxence Prosper", pos: "F", age: 22, ht: "6'8\"", hometown: "Montreal, QC", team: "Texas Legends", league: "G League", country: "USA", tier: "G League", ppg: 14.2, rpg: 5.5, apg: 1.8, status: "Active", note: "Mavericks 2-way. Athletic forward.", college: "Marquette" },
  { name: "Leonard Miller", pos: "F", age: 21, ht: "6'10\"", hometown: "Scarborough, ON", team: "G League", league: "G League", country: "USA", tier: "G League", ppg: 12.0, rpg: 6.0, apg: 2.5, status: "Active", note: "Former lottery prospect. Long, versatile forward.", college: "G League Ignite" },
  { name: "Ryan Nembhard", pos: "G", age: 22, ht: "6'1\"", hometown: "Aurora, ON", team: "Indiana Mad Ants", league: "G League", country: "USA", tier: "G League", ppg: 8.5, rpg: 2.0, apg: 4.5, status: "Active", note: "Andrew's brother. Pacers draft pick.", college: "Creighton" },
  { name: "Josh Primo", pos: "G", age: 22, ht: "6'5\"", hometown: "Toronto, ON", team: "Free Agent", league: "G League", country: "USA", tier: "G League", ppg: 10.0, rpg: 2.5, apg: 2.5, status: "Free Agent", note: "Former Spurs lottery pick.", college: "Alabama" },
  { name: "AJ Lawson", pos: "G", age: 24, ht: "6'6\"", hometown: "Toronto, ON", team: "G League", league: "G League", country: "USA", tier: "G League", ppg: 13.5, rpg: 3.5, apg: 1.5, status: "Active", note: "Athletic scorer. Former Timberwolves.", college: "South Carolina" },
  { name: "Keon Ambrose-Hylton", pos: "F", age: 24, ht: "6'8\"", hometown: "Toronto, ON", team: "Brampton Honey Badgers", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 13.7, rpg: 8.1, apg: 1.2, status: "Active", note: "2025 CEBL All-Canadian (Edmonton). Signed Brampton 2026. 64.5 FG%.", college: "Alabama" },

  // ==================== EUROPE - EUROLEAGUE / TOP TIER ====================
  { name: "Chris Boucher", pos: "C", age: 33, ht: "6'9\"", hometown: "Montreal, QC", team: "Free Agent", league: "NBA", country: "USA", tier: "NBA", ppg: 2.3, rpg: 2.0, apg: 0.3, status: "Free Agent", note: "2025 EuroLeague champ (Fenerbahce). Celtics Aug 2025, traded to Jazz Feb 2026, waived.", college: "Oregon" },
  { name: "Khem Birch", pos: "C", age: 33, ht: "6'9\"", hometown: "Montreal, QC", team: "Fenerbahce", league: "EuroLeague", country: "Turkey", tier: "Europe-Elite", ppg: 6.8, rpg: 5.2, apg: 1.5, status: "Active", note: "EuroLeague champion 2025. Re-signed with Fenerbahce.", college: "UNLV" },
  { name: "Isiaha Mike", pos: "F", age: 28, ht: "6'8\"", hometown: "Scarborough, ON", team: "FC Bayern Munich", league: "BBL / EuroLeague", country: "Germany", tier: "Europe-Elite", ppg: 7.2, rpg: 3.3, apg: 1.2, status: "Active", note: "EuroLeague starter. 29 pts vs Real Madrid. Canadian international.", college: "SMU" },
  { name: "Xavier Rathan-Mayes", pos: "G", age: 31, ht: "6'2\"", hometown: "Scarborough, ON", team: "FC Bayern Munich", league: "BBL / EuroLeague", country: "Germany", tier: "Europe-Elite", ppg: 6.5, rpg: 2.0, apg: 4.7, status: "Active", note: "Former Real Madrid. Canadian intl. NBA games with Memphis.", college: "Florida State" },
  { name: "Cory Joseph", pos: "G", age: 34, ht: "6'3\"", hometown: "Toronto, ON", team: "Olympiacos", league: "EuroLeague", country: "Greece", tier: "Europe-Elite", ppg: 5.0, rpg: 1.5, apg: 3.0, status: "Active", note: "14-yr NBA vet. 2014 NBA Champion. Canada captain.", college: "Texas" },
  { name: "Ignas Brazdeikis", pos: "G/F", age: 27, ht: "6'7\"", hometown: "Oakville, ON", team: "Zalgiris Kaunas", league: "LKL / EuroLeague", country: "Lithuania", tier: "Europe-Elite", ppg: 5.0, rpg: 2.0, apg: 1.2, status: "Active", note: "2019 NBA draft pick. Lithuanian-Canadian dual. Big Ten Freshman of Year.", college: "Michigan" },
  { name: "Mfiondu Kabengele", pos: "C", age: 28, ht: "6'10\"", hometown: "Toronto, ON", team: "Dubai Basketball", league: "ABA League / EuroLeague", country: "UAE", tier: "Europe-Elite", ppg: 15.4, rpg: 9.7, apg: 1.5, status: "Active", note: "2025 All-EuroCup First Team. EuroCup top rebounder. Former Clippers.", college: "Florida State" },
  { name: "Kyle Wiltjer", pos: "F", age: 32, ht: "6'10\"", hometown: "Portland, OR / CAN", team: "Reyer Venezia", league: "Italian Serie A", country: "Italy", tier: "Europe-Top", ppg: 12.2, rpg: 3.5, apg: 1.0, status: "Active", note: "Multi-year deal with Venezia. EuroCup MVP Round 14. Canadian intl.", college: "Gonzaga" },
  { name: "Trae Bell-Haynes", pos: "G", age: 30, ht: "6'2\"", hometown: "Toronto, ON", team: "Casademont Zaragoza", league: "Liga Endesa (ACB)", country: "Spain", tier: "Europe-Top", ppg: 15.6, rpg: 2.1, apg: 4.7, status: "Injured", note: "Under contract thru 2027. Season-ending hand surgery Jan 2026 (scapholunate ligament). Canada intl.", college: "Vermont" },
  { name: "Dylan Ennis", pos: "G", age: 34, ht: "6'2\"", hometown: "Toronto, ON", team: "UCAM Murcia", league: "Liga Endesa (ACB)", country: "Spain", tier: "Europe-Top", ppg: 11.7, rpg: 3.7, apg: 3.5, status: "Active", note: "Also plays FIBA Europe Cup. 9 AST vs Barcelona. Canadian-Jamaican.", college: "Oregon" },
  { name: "Aaron Best", pos: "G", age: 32, ht: "6'4\"", hometown: "Toronto, ON", team: "MoraBanc Andorra", league: "Liga Endesa (ACB)", country: "Andorra", tier: "Europe-Top", ppg: 11.0, rpg: 3.5, apg: 1.8, status: "Active", note: "Liga Endesa debut. 'Extraordinary defensive player.' Long Euro career.", college: "Stony Brook" },
  { name: "Kassius Robertson", pos: "G", age: 29, ht: "6'3\"", hometown: "Toronto, ON", team: "Dreamland Gran Canaria", league: "Liga Endesa (ACB) / BCL", country: "Spain", tier: "Europe-Top", ppg: 9.8, rpg: 2.5, apg: 2.0, status: "Active", note: "Signed Jan 2026. Former Lokomotiv Kuban / Joventut Badalona.", college: "Missouri" },
  { name: "Kevin Pangos", pos: "G", age: 32, ht: "6'1\"", hometown: "Newmarket, ON", team: "Esenler Erokspor", league: "Turkey BSL", country: "Turkey", tier: "Europe-Top", ppg: 10.5, rpg: 2.0, apg: 5.5, status: "Active", note: "Long EuroLeague career. Former Cavaliers. Sharpshooting PG.", college: "Gonzaga" },
  { name: "Melvin Ejim", pos: "F", age: 34, ht: "6'6\"", hometown: "Toronto, ON", team: "Força Lleida", league: "Liga Endesa (ACB)", country: "Spain", tier: "Europe-Top", ppg: 10.9, rpg: 5.4, apg: 0.9, status: "Active", note: "2-year deal from Jul 2025. Former Unicaja (2x BCL champ). Canadian natl team staple.", college: "Iowa State" },
  // Brady Heslip - RETIRED from playing (2019). Now GM of Scarborough Shooting Stars (CEBL). Removed from active pipeline.

  // ==================== EUROPE - MID TIER ====================
  { name: "Thomas Kennedy", pos: "F", age: 25, ht: "6'9\"", hometown: "Windsor, ON", team: "Cedevita Olimpija", league: "ABA League / EuroCup", country: "Slovenia", tier: "Europe-Top", ppg: 10.5, rpg: 7.0, apg: 1.8, status: "Active", note: "Former Telekom Bonn captain. 1-yr deal with Cedevita. Also played CEBL (Fraser Valley, Scarborough). Canadian intl.", college: "Windsor" },
  { name: "Nate Darling", pos: "G", age: 27, ht: "6'5\"", hometown: "Fredericton, NB", team: "Élan Chalon", league: "France LNB Pro A / BCL", country: "France", tier: "Europe-Mid", ppg: 10.3, rpg: 3.0, apg: 2.5, status: "Injured", note: "Signed Aug 2025. First European stint. Former Hornets. Hand fracture (metacarpal). Canada AmeriCup 2025.", college: "Delaware" },
  { name: "Phil Scrubb", pos: "G", age: 33, ht: "6'3\"", hometown: "Richmond, BC", team: "Palmer Basket Mallorca", league: "Spain Primera FEB (LEB Gold)", country: "Spain", tier: "Europe-Mid", ppg: 17.4, rpg: 2.6, apg: 6.9, status: "Active", note: "Signed Dec 2025. Previously Aliaga Petkim (Turkey BSL). 2023 FIBA World Cup bronze. Veteran Canadian PG.", college: "Carleton" },
  { name: "Thomas Scrubb", pos: "F", age: 34, ht: "6'6\"", hometown: "Richmond, BC", team: "La Laguna Tenerife", league: "Liga Endesa (ACB) / BCL", country: "Spain", tier: "Europe-Top", ppg: 6.6, rpg: 3.4, apg: 1.3, status: "Active", note: "2nd year with Tenerife. 16 pts vs Valencia (Mar 2026). 2023 FIBA World Cup. Phil's brother.", college: "Carleton" },
  { name: "Conor Morgan", pos: "F", age: 31, ht: "6'9\"", hometown: "Victoria, BC", team: "Beşiktaş Fibabanka", league: "Turkey BSL / EuroCup", country: "Turkey", tier: "Europe-Top", ppg: 10.0, rpg: 4.4, apg: 2.6, status: "Active", note: "Extended Jun 2025. Irish-Canadian dual. 19 pts/7 reb vs Trento. Canada Senior Natl Team.", college: "UBC" },
  { name: "Johnny Berhanemeskel", pos: "G", age: 27, ht: "6'2\"", hometown: "Ottawa, ON", team: "Kapfenberg Bulls", league: "Austrian BSL", country: "Austria", tier: "Europe-Mid", ppg: 12.0, rpg: 2.5, apg: 3.0, status: "Active", note: "Ottawa native. Sharpshooting guard.", college: "Ottawa (USports)" },
  { name: "Owen Klassen", pos: "C", age: 28, ht: "6'11\"", hometown: "Winnipeg, MB", team: "Okapi Aalst", league: "BNXT League", country: "Belgium", tier: "Europe-Mid", ppg: 8.0, rpg: 6.5, apg: 0.8, status: "Active", note: "Canadian international big man.", college: "Trinity Western" },
  { name: "Mamadou Gueye", pos: "F", age: 24, ht: "6'7\"", hometown: "Montreal, QC", team: "Promitheas Patras", league: "Greek A1", country: "Greece", tier: "Europe-Mid", ppg: 7.5, rpg: 4.0, apg: 1.0, status: "Active", note: "Athletic wing. Canadian youth team product.", college: "LSU" },
  { name: "Muon Reath", pos: "F", age: 27, ht: "6'9\"", hometown: "Ottawa, ON", team: "Trefl Sopot", league: "Polish PLK", country: "Poland", tier: "Europe-Mid", ppg: 11.0, rpg: 6.0, apg: 1.0, status: "Active", note: "Athletic big. LSU product.", college: "LSU" },
  { name: "Enoch Boakye", pos: "C", age: 22, ht: "6'11\"", hometown: "Brampton, ON", team: "Spirou Charleroi", league: "Pro Basketball League", country: "Belgium", tier: "Europe-Mid", ppg: 6.0, rpg: 6.5, apg: 0.5, status: "Active", note: "Former Villanova. Elite rebounder. Canada U16 standout.", college: "Villanova" },
  { name: "Trevon Blues", pos: "G", age: 25, ht: "6'4\"", hometown: "Toronto, ON", team: "Legia Warszawa", league: "Polish PLK", country: "Poland", tier: "Europe-Mid", ppg: 9.5, rpg: 2.5, apg: 2.0, status: "Active", note: "Athletic guard. Toronto native.", college: "Southern Miss" },
  { name: "Nathan Bilamu", pos: "F", age: 25, ht: "6'5\"", hometown: "Ottawa, ON", team: "Esgueira/Aveiro", league: "Liga Betclic (Portugal)", country: "Portugal", tier: "Europe-Mid", ppg: 11.7, rpg: 4.0, apg: 1.5, status: "Active", note: "Canadian forward in Portuguese top flight.", college: "TBD" },
  { name: "Matteus Case", pos: "G", age: 24, ht: "6'5\"", hometown: "Toronto, ON", team: "Vitoria SC", league: "Liga Betclic (Portugal)", country: "Portugal", tier: "Europe-Mid", ppg: 6.0, rpg: 2.0, apg: 1.5, status: "Active", note: "Young Canadian guard developing in Portugal.", college: "TBD" },
  { name: "Mychal Mulder", pos: "G", age: 29, ht: "6'3\"", hometown: "Windsor, ON", team: "Boulogne Metropolitans 92", league: "France LNB Pro A", country: "France", tier: "Europe-Mid", ppg: 10.0, rpg: 2.0, apg: 1.5, status: "Active", note: "Former Warriors/Heat. Sharpshooter.", college: "Kentucky" },
  { name: "Jean-Victor Mukama", pos: "F", age: 24, ht: "6'6\"", hometown: "Gatineau, QC", team: "Chorale Roanne", league: "France Pro B", country: "France", tier: "Europe-Mid", ppg: 7.5, rpg: 3.5, apg: 1.0, status: "Active", note: "Young Canadian forward developing in France.", college: "Colorado State" },
  { name: "Hernst Laroche", pos: "G", age: 26, ht: "6'3\"", hometown: "Montreal, QC", team: "Poitiers Basket 86", league: "France Pro B", country: "France", tier: "Europe-Mid", ppg: 9.0, rpg: 2.5, apg: 3.0, status: "Active", note: "Montreal product. Playmaker in France.", college: "Drexel" },

  // ==================== EUROPE - LOWER / EMERGING ====================
  { name: "Jermaine Haley Jr.", pos: "G/F", age: 26, ht: "6'5\"", hometown: "Vancouver, BC", team: "Bristol Flyers", league: "UK BBL", country: "UK", tier: "Europe-Mid", ppg: 14.5, rpg: 5.0, apg: 3.0, status: "Active", note: "Dominant in BBL. West Virginia product.", college: "West Virginia" },
  { name: "Junior Cadougan", pos: "G", age: 33, ht: "6'1\"", hometown: "Toronto, ON", team: "KK Ibar", league: "Serbia KLS", country: "Serbia", tier: "Europe-Mid", ppg: 8.5, rpg: 2.0, apg: 4.5, status: "Active", note: "Veteran Canadian guard. Marquette product.", college: "Marquette" },
  { name: "Amidou Bamba", pos: "C", age: 24, ht: "6'11\"", hometown: "Montreal, QC", team: "Nanterre 92", league: "France LNB Pro A", country: "France", tier: "Europe-Mid", ppg: 5.5, rpg: 4.5, apg: 0.5, status: "Active", note: "Young Canadian big developing in France.", college: "Georgetown" },

  // ==================== AUSTRALIA NBL ====================
  { name: "Branden Grace", pos: "G", age: 26, ht: "6'4\"", hometown: "Toronto, ON", team: "Brisbane Bullets", league: "Australia NBL", country: "Australia", tier: "Australia", ppg: 9.0, rpg: 2.5, apg: 2.0, status: "Active", note: "Canadian guard in Australian league.", college: "Monmouth" },
  { name: "Shea Ili", pos: "G", age: 30, ht: "6'2\"", hometown: "NZ / CAN dual", team: "New Zealand Breakers", league: "Australia NBL", country: "New Zealand", tier: "Australia", ppg: 8.0, rpg: 3.0, apg: 4.5, status: "Active", note: "Canadian-eligible dual national. NBL veteran.", college: "Victoria Univ. (NZ)" },

  // ==================== JAPAN B.LEAGUE ====================
  { name: "Julian Chua", pos: "G", age: 25, ht: "6'2\"", hometown: "Vancouver, BC", team: "Nagoya Diamond Dolphins", league: "Japan B.League", country: "Japan", tier: "Asia", ppg: 7.5, rpg: 2.0, apg: 3.0, status: "Active", note: "Canadian guard in Japan's top league.", college: "Portland" },
  { name: "Brody Clarke", pos: "F", age: 28, ht: "6'7\"", hometown: "Edmonton, AB", team: "Shinshu Brave Warriors", league: "Japan B.League", country: "Japan", tier: "Asia", ppg: 9.0, rpg: 5.5, apg: 1.0, status: "Active", note: "Former CEBL. Now in Japan.", college: "Idaho" },

  // ==================== SOUTH AMERICA ====================
  { name: "Simi Shittu", pos: "F", age: 25, ht: "6'10\"", hometown: "Burlington, ON", team: "San Lorenzo", league: "Argentina LNB", country: "Argentina", tier: "Americas", ppg: 11.0, rpg: 7.5, apg: 1.5, status: "Active", note: "Former Vanderbilt. Playing in Argentina.", college: "Vanderbilt" },

  // ==================== MEXICO / AMERICAS ====================

  // ==================== CEBL STARS (Canadian players) ====================
  { name: "Koby McEwen", pos: "G", age: 27, ht: "6'1\"", hometown: "Hamilton, ON", team: "Vancouver Bandits", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 14.5, rpg: 3.5, apg: 4.0, status: "Active", note: "2024 Canadian POY.", college: "Marquette" },
  { name: "Kadre Gray", pos: "G", age: 27, ht: "6'2\"", hometown: "Toronto, ON", team: "Ottawa BlackJacks", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 12.0, rpg: 3.0, apg: 5.5, status: "Active", note: "2023 Canadian POY. Laurentian legend.", college: "Laurentian" },
  { name: "Jackson Rowe", pos: "F", age: 27, ht: "6'7\"", hometown: "Toronto, ON", team: "Scarborough Shooting Stars", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 10.5, rpg: 5.5, apg: 1.5, status: "Active", note: "Versatile Canadian forward. CEBL veteran.", college: "St. Bonaventure" },
  { name: "Kalif Young", pos: "C", age: 28, ht: "6'8\"", hometown: "Toronto, ON", team: "Scarborough Shooting Stars", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 9.5, rpg: 7.0, apg: 1.0, status: "Active", note: "Multi-year Scarborough big.", college: "Robert Morris" },
  { name: "Shamiel Stevenson", pos: "G/F", age: 26, ht: "6'5\"", hometown: "Toronto, ON", team: "Brampton Honey Badgers", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 12.0, rpg: 4.5, apg: 1.5, status: "Active", note: "Physical wing. Toronto native.", college: "Pittsburgh / Nevada" },
  { name: "Duane Notice", pos: "G", age: 30, ht: "6'1\"", hometown: "Ajax, ON", team: "Vancouver Bandits", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 8.5, rpg: 2.5, apg: 4.0, status: "Active", note: "Syracuse product. CEBL playmaker.", college: "Syracuse" },
  { name: "Fardaws Aimaq", pos: "C", age: 27, ht: "6'11\"", hometown: "Vancouver, BC", team: "Lietkabelis Panevėžys", league: "Lithuania LKL / EuroCup", country: "Lithuania", tier: "Europe-Mid", ppg: 10.6, rpg: 7.8, apg: 1.3, status: "Active", note: "2025 Canada AmeriCup. Former NCAA star. Lithuania LKL.", college: "Utah Valley / Texas Tech" },
  { name: "Adika Peter-McNeilly", pos: "G", age: 30, ht: "6'3\"", hometown: "Toronto, ON", team: "Edmonton Stingers", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 10.0, rpg: 3.0, apg: 3.0, status: "Active", note: "6th Man of Year 2021.", college: "Stony Brook" },
  { name: "Cody John", pos: "G", age: 28, ht: "6'4\"", hometown: "Toronto, ON", team: "Saskatoon Mamba", league: "CEBL", country: "Canada", tier: "CEBL", ppg: 9.0, rpg: 3.0, apg: 2.5, status: "Active", note: "Multi-year CEBL vet.", college: "Towson" },
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
    { name: "Sean East II", team: "Edmonton Stingers", elamPPG: 8.5, elamFGPct: 52.1, elamGameWinners: 6, elamAssists: 2.8, clutchRating: 94, elamFTA: 3.2, elamFTPct: 88.5, elamTov: 1.1, elamPlusMinus: "+4.2", playTypes: { iso: 38, pnr: 32, spot: 18, transition: 12 } },
    { name: "Xavier Moon", team: "Saskatoon Mamba", elamPPG: 7.8, elamFGPct: 49.5, elamGameWinners: 5, elamAssists: 3.5, clutchRating: 91, elamFTA: 2.8, elamFTPct: 82.0, elamTov: 0.8, elamPlusMinus: "+3.8", playTypes: { iso: 25, pnr: 40, spot: 15, transition: 20 } },
    { name: "Khalil Ahmad", team: "Niagara River Lions", elamPPG: 7.2, elamFGPct: 48.0, elamGameWinners: 4, elamAssists: 1.5, clutchRating: 88, elamFTA: 2.5, elamFTPct: 80.0, elamTov: 1.3, elamPlusMinus: "+3.0", playTypes: { iso: 42, pnr: 22, spot: 28, transition: 8 } },
    { name: "Koby McEwen", team: "Brampton Honey Badgers", elamPPG: 6.8, elamFGPct: 46.5, elamGameWinners: 4, elamAssists: 2.0, clutchRating: 86, elamFTA: 2.0, elamFTPct: 85.0, elamTov: 1.0, elamPlusMinus: "+2.5", playTypes: { iso: 30, pnr: 35, spot: 22, transition: 13 } },
    { name: "Trae Bell-Haynes", team: "Edmonton Stingers", elamPPG: 6.5, elamFGPct: 47.2, elamGameWinners: 3, elamAssists: 3.2, clutchRating: 85, elamFTA: 1.8, elamFTPct: 78.5, elamTov: 0.7, elamPlusMinus: "+2.0", playTypes: { iso: 15, pnr: 50, spot: 10, transition: 25 } },
    { name: "Kadre Gray", team: "Scarborough Shooting Stars", elamPPG: 6.0, elamFGPct: 45.0, elamGameWinners: 3, elamAssists: 4.0, clutchRating: 84, elamFTA: 2.2, elamFTPct: 75.0, elamTov: 0.9, elamPlusMinus: "+1.8", playTypes: { iso: 20, pnr: 45, spot: 12, transition: 23 } },
    { name: "Jameer Nelson Jr.", team: "Calgary Surge", elamPPG: 5.8, elamFGPct: 44.5, elamGameWinners: 3, elamAssists: 1.8, clutchRating: 82, elamFTA: 1.5, elamFTPct: 82.0, elamTov: 1.2, elamPlusMinus: "+1.5", playTypes: { iso: 28, pnr: 30, spot: 25, transition: 17 } },
    { name: "Mitch Creek", team: "Vancouver Bandits", elamPPG: 5.5, elamFGPct: 50.0, elamGameWinners: 5, elamAssists: 1.0, clutchRating: 81, elamFTA: 3.0, elamFTPct: 72.0, elamTov: 0.5, elamPlusMinus: "+3.5", playTypes: { iso: 35, pnr: 15, spot: 10, transition: 40 } },
    { name: "Marcus Carr", team: "Vancouver Bandits", elamPPG: 5.2, elamFGPct: 43.5, elamGameWinners: 2, elamAssists: 3.0, clutchRating: 79, elamFTA: 1.5, elamFTPct: 80.0, elamTov: 1.5, elamPlusMinus: "+1.0", playTypes: { iso: 22, pnr: 42, spot: 18, transition: 18 } },
    { name: "Greg Brown III", team: "Calgary Surge", elamPPG: 5.0, elamFGPct: 48.5, elamGameWinners: 2, elamAssists: 0.5, clutchRating: 78, elamFTA: 2.0, elamFTPct: 70.0, elamTov: 0.8, elamPlusMinus: "+1.2", playTypes: { iso: 45, pnr: 10, spot: 5, transition: 40 } },
    { name: "Quinndary Weatherspoon", team: "Brampton Honey Badgers", elamPPG: 5.5, elamFGPct: 47.0, elamGameWinners: 3, elamAssists: 2.0, clutchRating: 77, elamFTA: 1.8, elamFTPct: 77.0, elamTov: 1.0, elamPlusMinus: "+1.5", playTypes: { iso: 32, pnr: 28, spot: 20, transition: 20 } },
    { name: "Keon Ambrose-Hylton", team: "Edmonton Stingers", elamPPG: 4.8, elamFGPct: 51.0, elamGameWinners: 2, elamAssists: 0.8, clutchRating: 75, elamFTA: 1.2, elamFTPct: 68.0, elamTov: 0.6, elamPlusMinus: "+1.0", playTypes: { iso: 10, pnr: 15, spot: 15, transition: 60 } }
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
    { name: "Sean East II", team: "Edmonton", attempts: 45, made: 20, pct: 44.4, expectedPts: 2.64, rank: 1, catchShoot: 55, offDribble: 45, contested: 40, open: 60, elamTarget: 8 },
    { name: "Xavier Moon", team: "Saskatoon", attempts: 38, made: 15, pct: 39.5, expectedPts: 2.37, rank: 2, catchShoot: 60, offDribble: 40, contested: 35, open: 65, elamTarget: 6 },
    { name: "Khalil Ahmad", team: "Niagara", attempts: 35, made: 14, pct: 40.0, expectedPts: 2.40, rank: 3, catchShoot: 42, offDribble: 58, contested: 50, open: 50, elamTarget: 5 },
    { name: "Marcus Carr", team: "Vancouver", attempts: 32, made: 12, pct: 37.5, expectedPts: 2.25, rank: 4, catchShoot: 50, offDribble: 50, contested: 45, open: 55, elamTarget: 5 },
    { name: "Koby McEwen", team: "Brampton", attempts: 30, made: 11, pct: 36.7, expectedPts: 2.20, rank: 5, catchShoot: 65, offDribble: 35, contested: 30, open: 70, elamTarget: 4 },
    { name: "Trae Bell-Haynes", team: "Edmonton", attempts: 28, made: 10, pct: 35.7, expectedPts: 2.14, rank: 6, catchShoot: 48, offDribble: 52, contested: 42, open: 58, elamTarget: 3 },
    { name: "Mitch Creek", team: "Vancouver", attempts: 26, made: 10, pct: 38.5, expectedPts: 2.31, rank: 7, catchShoot: 70, offDribble: 30, contested: 25, open: 75, elamTarget: 4 },
    { name: "Kadre Gray", team: "Scarborough", attempts: 24, made: 8, pct: 33.3, expectedPts: 2.00, rank: 8, catchShoot: 52, offDribble: 48, contested: 38, open: 62, elamTarget: 2 },
    { name: "Jameer Nelson Jr.", team: "Calgary", attempts: 22, made: 8, pct: 36.4, expectedPts: 2.18, rank: 9, catchShoot: 58, offDribble: 42, contested: 35, open: 65, elamTarget: 3 },
    { name: "Greg Brown III", team: "Calgary", attempts: 20, made: 7, pct: 35.0, expectedPts: 2.10, rank: 10, catchShoot: 40, offDribble: 60, contested: 55, open: 45, elamTarget: 2 }
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
    { name: "Xavier Moon", team: "Saskatoon Mamba", tsPct: 56.8, usgRate: 28.0, astTov: 2.8, netRtg: 7.2, per: 22.5, offRtg: 113.5, defRtg: 106.3, ortgRank: 3, drtgRank: 6, role: "Primary Creator" },
    { name: "Khalil Ahmad", team: "Niagara River Lions", tsPct: 55.5, usgRate: 27.2, astTov: 1.5, netRtg: 6.8, per: 21.0, offRtg: 112.8, defRtg: 106.0, ortgRank: 4, drtgRank: 5, role: "Scoring Wing" },
    { name: "Mitch Creek", team: "Vancouver Bandits", tsPct: 57.5, usgRate: 26.8, astTov: 1.8, netRtg: 9.0, per: 23.0, offRtg: 116.0, defRtg: 107.0, ortgRank: 1, drtgRank: 10, role: "Two-Way Wing" },
    { name: "Marcus Carr", team: "Vancouver Bandits", tsPct: 54.2, usgRate: 29.5, astTov: 2.6, netRtg: 6.5, per: 20.5, offRtg: 111.5, defRtg: 105.0, ortgRank: 5, drtgRank: 3, role: "Primary Creator" },
    { name: "Koby McEwen", team: "Brampton Honey Badgers", tsPct: 55.0, usgRate: 25.8, astTov: 2.2, netRtg: 4.5, per: 19.8, offRtg: 110.2, defRtg: 105.7, ortgRank: 7, drtgRank: 4, role: "Combo Guard" },
    { name: "Trae Bell-Haynes", team: "Edmonton Stingers", tsPct: 53.5, usgRate: 24.5, astTov: 3.0, netRtg: 3.2, per: 18.5, offRtg: 109.0, defRtg: 105.8, ortgRank: 8, drtgRank: 4, role: "Floor General" },
    { name: "Kadre Gray", team: "Scarborough Shooting Stars", tsPct: 52.8, usgRate: 26.0, astTov: 2.5, netRtg: 3.0, per: 18.0, offRtg: 108.5, defRtg: 105.5, ortgRank: 9, drtgRank: 3, role: "Primary Creator" },
    { name: "Jameer Nelson Jr.", team: "Calgary Surge", tsPct: 54.8, usgRate: 23.5, astTov: 1.8, netRtg: 5.5, per: 20.0, offRtg: 110.8, defRtg: 105.3, ortgRank: 6, drtgRank: 2, role: "Two-Way Guard" },
    { name: "Greg Brown III", team: "Calgary Surge", tsPct: 56.0, usgRate: 22.0, astTov: 1.2, netRtg: 4.0, per: 19.0, offRtg: 109.5, defRtg: 105.5, ortgRank: 8, drtgRank: 3, role: "Athletic Wing" },
    { name: "Quinndary Weatherspoon", team: "Brampton Honey Badgers", tsPct: 55.2, usgRate: 24.0, astTov: 2.0, netRtg: 5.0, per: 19.5, offRtg: 110.0, defRtg: 105.0, ortgRank: 7, drtgRank: 2, role: "Versatile Wing" },
    { name: "Keon Ambrose-Hylton", team: "Edmonton Stingers", tsPct: 54.0, usgRate: 18.5, astTov: 1.0, netRtg: 3.8, per: 16.5, offRtg: 108.0, defRtg: 104.2, ortgRank: 10, drtgRank: 1, role: "Defensive Forward" },
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
