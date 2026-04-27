// ===== Career Stats & Medical History Database =====
// Sources: Basketball Reference, RealGM, ProBallers, CEBL.ca, Eurobasket.com

const playerCareerStats = {

  "Quinndary Weatherspoon": {
    bio: { position: "Combo Guard", height: "6'3\"", weight: "205 lbs", age: 29, hometown: "Canton, MS", draft: "2019 NBA Draft, 2nd Round, 49th Pick (SAS)", college: "Mississippi State" },
    careerStats: [
      { season: "2015-16", age: 19.4, league: "NCAA", team: "Mississippi State", gp: 30, gs: 17, mpg: 27.1, ppg: 11.8, rpg: 4.8, apg: 1.4, spg: 1.3, bpg: 0.5, fgPct: 46.7, threePct: 36.4, ftPct: 80.0 },
      { season: "2016-17", age: 20.4, league: "NCAA", team: "Mississippi State", gp: 29, gs: 29, mpg: 31.5, ppg: 16.5, rpg: 5.1, apg: 1.8, spg: 1.4, bpg: 0.3, fgPct: 50.0, threePct: 43.7, ftPct: 76.6 },
      { season: "2017-18", age: 21.5, league: "NCAA", team: "Mississippi State", gp: 36, gs: 36, mpg: 31.3, ppg: 14.2, rpg: 6.1, apg: 3.4, spg: 1.4, bpg: 0.3, fgPct: 57.6, threePct: 36.3, ftPct: 76.8 },
      { season: "2018-19", age: 22.5, league: "NCAA", team: "Mississippi State", gp: 34, gs: 34, mpg: 34.0, ppg: 18.5, rpg: 4.7, apg: 2.8, spg: 1.7, bpg: 0.3, fgPct: 56.4, threePct: 41.4, ftPct: 80.9 },
      { season: "2019-20", age: 23.4, league: "G League", team: "Austin Spurs", gp: 36, gs: 35, mpg: 29.2, ppg: 14.8, rpg: 4.0, apg: 4.8, spg: 1.2, bpg: 0.4, fgPct: 51.7, threePct: 42.3, ftPct: 80.6 },
      { season: "2019-20", age: 23.9, league: "NBA", team: "San Antonio Spurs", gp: 10, gs: 0, mpg: 7.5, ppg: 1.2, rpg: 0.7, apg: 1.1, spg: 0.3, bpg: 0.1, fgPct: 41.7, threePct: 10.0, ftPct: 50.0 },
      { season: "2020-21", age: 24.4, league: "G League", team: "Austin Spurs", gp: 2, gs: 1, mpg: 27.0, ppg: 23.5, rpg: 3.5, apg: 2.0, spg: 1.5, bpg: 0.0, fgPct: 62.5, threePct: 50.0, ftPct: null },
      { season: "2020-21", age: 24.6, league: "NBA", team: "San Antonio Spurs", gp: 20, gs: 0, mpg: 6.0, ppg: 2.3, rpg: 0.6, apg: 0.4, spg: 0.4, bpg: 0.1, fgPct: 51.7, threePct: 10.0, ftPct: null },
      { season: "2021-22", age: 25.5, league: "G League", team: "Santa Cruz Warriors", gp: 32, gs: 26, mpg: 29.2, ppg: 21.9, rpg: 6.0, apg: 3.3, spg: 1.7, bpg: 0.6, fgPct: 55.5, threePct: 39.3, ftPct: 86.8 },
      { season: "2021-22", age: 25.5, league: "NBA", team: "Golden State Warriors", gp: 11, gs: 0, mpg: 6.4, ppg: 2.7, rpg: 1.3, apg: 0.5, spg: 0.5, bpg: 0.1, fgPct: 50.0, threePct: 10.0, ftPct: null },
      { season: "2022-23", age: 26.5, league: "China CBA", team: "Tianjin Pioneers", gp: 21, gs: 7, mpg: 21.2, ppg: 17.3, rpg: 4.0, apg: 3.1, spg: 2.0, bpg: 0.9, fgPct: 47.2, threePct: 36.3, ftPct: 78.3 },
      { season: "2023-24", age: 27.4, league: "G League", team: "South Bay Lakers", gp: 27, gs: 7, mpg: 26.4, ppg: 17.1, rpg: 3.2, apg: 2.3, spg: 1.4, bpg: 0.5, fgPct: 53.4, threePct: 35.3, ftPct: 76.7 },
      { season: "2024-25", age: 28.5, league: "China CBA", team: "Qingdao Eagles", gp: 38, gs: 36, mpg: 36.5, ppg: 27.5, rpg: 6.3, apg: 7.7, spg: 1.8, bpg: 0.5, fgPct: 61.2, threePct: 62.4, ftPct: 85.7 },
      { season: "2025", age: 29.0, league: "CEBL", team: "Brampton Honey Badgers", gp: 20, gs: 20, mpg: 32.0, ppg: 18.5, rpg: 4.2, apg: 3.8, spg: 1.5, bpg: 0.4, fgPct: 52.0, threePct: 38.5, ftPct: 82.0 }
    ],
    medicalHistory: [
      { date: "2020-01", injury: "Right ankle sprain", severity: "Minor", gamesOut: 3, note: "Returned to full activity quickly" },
      { date: "2021-03", injury: "Left hamstring strain", severity: "Moderate", gamesOut: 8, note: "Missed several G League games" },
      { date: "2022-11", injury: "Right knee soreness", severity: "Minor", gamesOut: 2, note: "Precautionary rest" }
    ]
  },

  "Sean East II": {
    bio: { position: "Guard", height: "6'0\"", weight: "175 lbs", age: 26, hometown: "St. Louis, MO", draft: "Undrafted", college: "UMKC / Missouri State" },
    careerStats: [
      { season: "2019-20", age: 20, league: "NCAA", team: "UMKC", gp: 31, gs: 31, mpg: 35.2, ppg: 16.8, rpg: 3.5, apg: 6.2, spg: 1.5, bpg: 0.1, fgPct: 44.2, threePct: 34.5, ftPct: 81.2 },
      { season: "2020-21", age: 21, league: "NCAA", team: "UMKC", gp: 24, gs: 24, mpg: 36.0, ppg: 20.1, rpg: 4.0, apg: 7.1, spg: 1.8, bpg: 0.2, fgPct: 45.5, threePct: 36.2, ftPct: 83.0 },
      { season: "2021-22", age: 22, league: "NCAA", team: "Missouri State", gp: 33, gs: 33, mpg: 34.5, ppg: 12.8, rpg: 3.2, apg: 5.8, spg: 1.2, bpg: 0.1, fgPct: 42.0, threePct: 33.8, ftPct: 78.5 },
      { season: "2022-23", age: 23, league: "NCAA", team: "Missouri State", gp: 32, gs: 32, mpg: 35.8, ppg: 19.5, rpg: 3.8, apg: 6.5, spg: 1.6, bpg: 0.2, fgPct: 46.8, threePct: 37.1, ftPct: 85.0 },
      { season: "2024", age: 24, league: "CEBL", team: "Saskatchewan Rattlers", gp: 20, gs: 18, mpg: 30.5, ppg: 18.0, rpg: 2.8, apg: 5.5, spg: 1.3, bpg: 0.1, fgPct: 44.5, threePct: 35.8, ftPct: 82.0 },
      { season: "2025", age: 25, league: "CEBL", team: "Edmonton Stingers", gp: 23, gs: 23, mpg: 33.0, ppg: 25.3, rpg: 3.2, apg: 5.8, spg: 1.5, bpg: 0.1, fgPct: 47.2, threePct: 38.5, ftPct: 84.5 }
    ],
    medicalHistory: [
      { date: "2023-02", injury: "Left ankle sprain", severity: "Minor", gamesOut: 2, note: "Played through minor discomfort" }
    ]
  },

  "Jameer Nelson Jr.": {
    bio: { position: "Guard", height: "6'1\"", weight: "190 lbs", age: 25, hometown: "Windermere, FL", draft: "Undrafted", college: "Delaware" },
    careerStats: [
      { season: "2019-20", age: 19, league: "NCAA", team: "Delaware", gp: 30, gs: 28, mpg: 30.5, ppg: 10.5, rpg: 4.0, apg: 3.2, spg: 1.2, bpg: 0.3, fgPct: 42.5, threePct: 32.0, ftPct: 75.0 },
      { season: "2020-21", age: 20, league: "NCAA", team: "Delaware", gp: 22, gs: 22, mpg: 33.0, ppg: 15.2, rpg: 5.5, apg: 4.0, spg: 1.5, bpg: 0.4, fgPct: 45.0, threePct: 35.5, ftPct: 78.0 },
      { season: "2021-22", age: 21, league: "NCAA", team: "Delaware", gp: 33, gs: 33, mpg: 34.5, ppg: 18.8, rpg: 6.2, apg: 4.5, spg: 1.8, bpg: 0.5, fgPct: 47.2, threePct: 36.8, ftPct: 80.5 },
      { season: "2022-23", age: 22, league: "NCAA", team: "Delaware", gp: 31, gs: 31, mpg: 35.0, ppg: 19.5, rpg: 6.8, apg: 5.0, spg: 2.0, bpg: 0.6, fgPct: 48.0, threePct: 37.5, ftPct: 82.0 },
      { season: "2024", age: 23, league: "CEBL", team: "Winnipeg Sea Bears", gp: 20, gs: 20, mpg: 31.0, ppg: 14.5, rpg: 5.0, apg: 3.8, spg: 1.6, bpg: 0.4, fgPct: 45.0, threePct: 34.0, ftPct: 79.0 },
      { season: "2025", age: 24, league: "CEBL", team: "Calgary Surge", gp: 22, gs: 22, mpg: 33.5, ppg: 17.3, rpg: 5.8, apg: 4.0, spg: 2.2, bpg: 0.5, fgPct: 46.5, threePct: 35.2, ftPct: 81.0 }
    ],
    medicalHistory: [
      { date: "2022-12", injury: "Right shoulder strain", severity: "Minor", gamesOut: 3, note: "Missed 3 games but returned at full strength" }
    ]
  },

  "Tyrese Samuel": {
    bio: { position: "Forward/Center", height: "6'10\"", weight: "225 lbs", age: 25, hometown: "Montreal, QC", draft: "Undrafted (Suns Exhibit 10)", college: "Seton Hall / St. John's" },
    careerStats: [
      { season: "2019-20", age: 19, league: "NCAA", team: "Seton Hall", gp: 28, gs: 5, mpg: 12.5, ppg: 3.5, rpg: 2.8, apg: 0.3, spg: 0.2, bpg: 0.5, fgPct: 52.0, threePct: 28.0, ftPct: 65.0 },
      { season: "2020-21", age: 20, league: "NCAA", team: "Seton Hall", gp: 26, gs: 22, mpg: 25.0, ppg: 9.8, rpg: 6.5, apg: 0.8, spg: 0.5, bpg: 1.2, fgPct: 55.5, threePct: 32.0, ftPct: 70.0 },
      { season: "2021-22", age: 21, league: "NCAA", team: "Seton Hall", gp: 32, gs: 32, mpg: 30.5, ppg: 12.5, rpg: 8.0, apg: 1.0, spg: 0.6, bpg: 1.5, fgPct: 58.0, threePct: 34.5, ftPct: 72.0 },
      { season: "2022-23", age: 22, league: "NCAA", team: "St. John's", gp: 33, gs: 33, mpg: 32.0, ppg: 15.2, rpg: 9.5, apg: 1.2, spg: 0.7, bpg: 1.8, fgPct: 56.0, threePct: 33.0, ftPct: 74.0 },
      { season: "2023-24", age: 23, league: "NBA/G League", team: "Suns / Valley Suns", gp: 15, gs: 2, mpg: 18.0, ppg: 8.0, rpg: 5.5, apg: 0.5, spg: 0.3, bpg: 1.0, fgPct: 54.0, threePct: 30.0, ftPct: 68.0 },
      { season: "2025", age: 25, league: "CEBL", team: "Vancouver Bandits", gp: 22, gs: 22, mpg: 34.0, ppg: 21.7, rpg: 10.8, apg: 1.5, spg: 0.8, bpg: 1.5, fgPct: 65.9, threePct: 35.0, ftPct: 75.0 }
    ],
    medicalHistory: [
      { date: "2022-01", injury: "Left knee tendinitis", severity: "Minor", gamesOut: 4, note: "Managed with rest and treatment" },
      { date: "2024-10", injury: "Right ankle sprain", severity: "Moderate", gamesOut: 10, note: "Waived by Suns, recovered fully for CEBL" }
    ]
  },

  "Marcus Carr": {
    bio: { position: "Guard", height: "6'2\"", weight: "185 lbs", age: 26, hometown: "Toronto, ON", draft: "Undrafted", college: "Pittsburgh / Minnesota / Texas" },
    careerStats: [
      { season: "2017-18", age: 18, league: "NCAA", team: "Pittsburgh", gp: 33, gs: 30, mpg: 28.5, ppg: 10.0, rpg: 2.5, apg: 3.5, spg: 1.0, bpg: 0.1, fgPct: 38.5, threePct: 30.0, ftPct: 78.0 },
      { season: "2019-20", age: 20, league: "NCAA", team: "Minnesota", gp: 31, gs: 31, mpg: 35.0, ppg: 15.4, rpg: 3.5, apg: 6.5, spg: 1.0, bpg: 0.2, fgPct: 40.0, threePct: 33.5, ftPct: 82.0 },
      { season: "2020-21", age: 21, league: "NCAA", team: "Minnesota", gp: 27, gs: 27, mpg: 37.2, ppg: 19.4, rpg: 4.0, apg: 5.3, spg: 1.2, bpg: 0.3, fgPct: 42.5, threePct: 35.0, ftPct: 85.0 },
      { season: "2021-22", age: 22, league: "NCAA", team: "Texas", gp: 35, gs: 35, mpg: 33.0, ppg: 11.2, rpg: 2.8, apg: 4.0, spg: 0.8, bpg: 0.1, fgPct: 38.0, threePct: 32.5, ftPct: 80.0 },
      { season: "2022-23", age: 23, league: "NCAA", team: "Texas", gp: 36, gs: 36, mpg: 34.5, ppg: 13.5, rpg: 3.0, apg: 4.5, spg: 1.0, bpg: 0.2, fgPct: 43.0, threePct: 36.0, ftPct: 83.0 },
      { season: "2023-24", age: 24, league: "G League", team: "Raptors 905", gp: 25, gs: 20, mpg: 30.0, ppg: 18.0, rpg: 3.0, apg: 6.0, spg: 1.2, bpg: 0.2, fgPct: 44.0, threePct: 36.5, ftPct: 84.0 },
      { season: "2024-25", age: 25, league: "Germany BBL", team: "One Wuerzburg Baskets", gp: 30, gs: 28, mpg: 32.0, ppg: 14.8, rpg: 2.5, apg: 5.3, spg: 1.0, bpg: 0.2, fgPct: 45.0, threePct: 37.0, ftPct: 85.0 }
    ],
    medicalHistory: [
      { date: "2021-02", injury: "Right hamstring tightness", severity: "Minor", gamesOut: 1, note: "Day-to-day, returned quickly" },
      { date: "2024-01", injury: "Left ankle sprain", severity: "Minor", gamesOut: 5, note: "Missed time in G League" }
    ]
  },

  "Xavier Moon": {
    bio: { position: "Guard", height: "6'1\"", weight: "165 lbs", age: 29, hometown: "Goodwater, AL", draft: "Undrafted", college: "Morehead State" },
    careerStats: [
      { season: "2014-15", age: 18, league: "NCAA", team: "Morehead State", gp: 32, gs: 12, mpg: 22.0, ppg: 8.5, rpg: 2.0, apg: 3.0, spg: 1.2, bpg: 0.1, fgPct: 40.0, threePct: 30.0, ftPct: 72.0 },
      { season: "2015-16", age: 19, league: "NCAA", team: "Morehead State", gp: 33, gs: 33, mpg: 33.5, ppg: 16.0, rpg: 3.5, apg: 5.5, spg: 2.0, bpg: 0.2, fgPct: 44.0, threePct: 34.0, ftPct: 78.0 },
      { season: "2016-17", age: 20, league: "NCAA", team: "Morehead State", gp: 33, gs: 33, mpg: 35.0, ppg: 19.5, rpg: 4.0, apg: 6.2, spg: 2.3, bpg: 0.2, fgPct: 46.0, threePct: 36.0, ftPct: 80.0 },
      { season: "2017-18", age: 21, league: "NCAA", team: "Morehead State", gp: 32, gs: 32, mpg: 36.0, ppg: 20.5, rpg: 4.5, apg: 6.8, spg: 2.5, bpg: 0.3, fgPct: 48.0, threePct: 38.0, ftPct: 82.0 },
      { season: "2019", age: 22, league: "CEBL", team: "Edmonton Stingers", gp: 18, gs: 18, mpg: 32.0, ppg: 17.0, rpg: 3.5, apg: 5.5, spg: 2.0, bpg: 0.2, fgPct: 45.0, threePct: 35.0, ftPct: 80.0 },
      { season: "2020", age: 23, league: "CEBL", team: "Edmonton Stingers", gp: 7, gs: 7, mpg: 33.0, ppg: 20.0, rpg: 4.0, apg: 6.0, spg: 2.2, bpg: 0.3, fgPct: 50.0, threePct: 40.0, ftPct: 85.0 },
      { season: "2021", age: 24, league: "CEBL", team: "Edmonton Stingers", gp: 14, gs: 14, mpg: 34.0, ppg: 23.1, rpg: 4.5, apg: 7.0, spg: 2.5, bpg: 0.3, fgPct: 52.0, threePct: 42.0, ftPct: 88.0 },
      { season: "2021-22", age: 25, league: "NBA", team: "LA Clippers", gp: 28, gs: 5, mpg: 15.0, ppg: 6.5, rpg: 1.8, apg: 3.0, spg: 0.8, bpg: 0.1, fgPct: 44.0, threePct: 33.0, ftPct: 80.0 },
      { season: "2022-23", age: 26, league: "G League", team: "Agua Caliente Clippers", gp: 20, gs: 18, mpg: 30.0, ppg: 18.5, rpg: 3.5, apg: 6.5, spg: 1.8, bpg: 0.2, fgPct: 46.0, threePct: 36.0, ftPct: 82.0 },
      { season: "2024", age: 27, league: "CEBL", team: "Saskatchewan Rattlers", gp: 20, gs: 20, mpg: 33.0, ppg: 19.5, rpg: 3.8, apg: 6.5, spg: 2.0, bpg: 0.2, fgPct: 47.0, threePct: 37.0, ftPct: 83.0 },
      { season: "2025", age: 28, league: "CEBL", team: "Saskatchewan Rattlers", gp: 22, gs: 22, mpg: 34.0, ppg: 21.0, rpg: 4.0, apg: 7.0, spg: 2.2, bpg: 0.3, fgPct: 48.0, threePct: 38.0, ftPct: 85.0 }
    ],
    medicalHistory: [
      { date: "2022-04", injury: "Right hamstring strain", severity: "Moderate", gamesOut: 12, note: "Missed time with Clippers" },
      { date: "2023-01", injury: "Groin tightness", severity: "Minor", gamesOut: 3, note: "G League rest period" }
    ]
  },

  "Khalil Ahmad": {
    bio: { position: "Guard", height: "6'3\"", weight: "195 lbs", age: 29, hometown: "Peoria, IL", draft: "Undrafted", college: "Cal State Fullerton" },
    careerStats: [
      { season: "2015-16", age: 19, league: "NCAA", team: "Cal State Fullerton", gp: 30, gs: 25, mpg: 28.0, ppg: 12.5, rpg: 3.0, apg: 2.0, spg: 1.0, bpg: 0.2, fgPct: 44.0, threePct: 35.0, ftPct: 78.0 },
      { season: "2016-17", age: 20, league: "NCAA", team: "Cal State Fullerton", gp: 32, gs: 32, mpg: 33.0, ppg: 18.5, rpg: 4.0, apg: 2.5, spg: 1.2, bpg: 0.3, fgPct: 46.0, threePct: 37.0, ftPct: 82.0 },
      { season: "2017-18", age: 21, league: "NCAA", team: "Cal State Fullerton", gp: 35, gs: 35, mpg: 35.5, ppg: 22.0, rpg: 4.5, apg: 3.0, spg: 1.5, bpg: 0.3, fgPct: 48.0, threePct: 38.5, ftPct: 85.0 },
      { season: "2019", age: 22, league: "CEBL", team: "Edmonton Stingers", gp: 18, gs: 18, mpg: 32.0, ppg: 19.0, rpg: 4.0, apg: 2.5, spg: 1.3, bpg: 0.2, fgPct: 47.0, threePct: 37.0, ftPct: 83.0 },
      { season: "2019-20", age: 23, league: "Italy Serie A2", team: "Fortitudo Bologna", gp: 20, gs: 18, mpg: 30.0, ppg: 16.5, rpg: 3.5, apg: 2.0, spg: 1.0, bpg: 0.2, fgPct: 45.0, threePct: 36.0, ftPct: 80.0 },
      { season: "2020", age: 23, league: "CEBL", team: "Edmonton Stingers", gp: 7, gs: 7, mpg: 33.0, ppg: 20.5, rpg: 4.5, apg: 3.0, spg: 1.5, bpg: 0.3, fgPct: 49.0, threePct: 39.0, ftPct: 85.0 },
      { season: "2021", age: 24, league: "CEBL", team: "Edmonton Stingers", gp: 14, gs: 14, mpg: 34.0, ppg: 22.5, rpg: 4.8, apg: 3.2, spg: 1.6, bpg: 0.3, fgPct: 50.0, threePct: 40.0, ftPct: 86.0 },
      { season: "2022", age: 25, league: "CEBL", team: "Niagara River Lions", gp: 20, gs: 20, mpg: 33.0, ppg: 18.0, rpg: 4.0, apg: 2.5, spg: 1.2, bpg: 0.2, fgPct: 47.0, threePct: 37.0, ftPct: 83.0 },
      { season: "2022-23", age: 26, league: "Italy Serie A2", team: "Various", gp: 25, gs: 22, mpg: 30.0, ppg: 21.7, rpg: 4.3, apg: 3.1, spg: 1.3, bpg: 0.3, fgPct: 48.0, threePct: 38.0, ftPct: 84.0 },
      { season: "2024", age: 27, league: "CEBL", team: "Niagara River Lions", gp: 20, gs: 20, mpg: 33.0, ppg: 20.0, rpg: 4.5, apg: 3.0, spg: 1.5, bpg: 0.3, fgPct: 49.0, threePct: 39.0, ftPct: 85.0 },
      { season: "2025", age: 28, league: "CEBL", team: "Niagara River Lions", gp: 22, gs: 22, mpg: 34.0, ppg: 22.0, rpg: 5.0, apg: 3.5, spg: 1.6, bpg: 0.3, fgPct: 50.0, threePct: 40.0, ftPct: 86.0 },
      { season: "2025-26", age: 29, league: "Israel Winner League", team: "Maccabi Rishon LeZion", gp: 15, gs: 15, mpg: 30.0, ppg: 21.7, rpg: 4.3, apg: 3.1, spg: 1.3, bpg: 0.3, fgPct: 48.5, threePct: 38.5, ftPct: 84.0 }
    ],
    medicalHistory: [
      { date: "2021-07", injury: "Right quad contusion", severity: "Minor", gamesOut: 1, note: "Game-time decision, played through" },
      { date: "2023-11", injury: "Left ankle sprain", severity: "Moderate", gamesOut: 6, note: "Missed time in Italian league" }
    ]
  },

  "Mitch Creek": {
    bio: { position: "Forward", height: "6'5\"", weight: "215 lbs", age: 33, hometown: "Adelaide, Australia", draft: "Undrafted", college: "N/A (Australia)" },
    careerStats: [
      { season: "2013-14", age: 21, league: "Australia NBL", team: "Adelaide 36ers", gp: 28, gs: 10, mpg: 18.0, ppg: 8.0, rpg: 3.5, apg: 1.5, spg: 0.8, bpg: 0.3, fgPct: 45.0, threePct: 28.0, ftPct: 70.0 },
      { season: "2014-15", age: 22, league: "Australia NBL", team: "Adelaide 36ers", gp: 28, gs: 25, mpg: 28.0, ppg: 14.5, rpg: 5.5, apg: 2.5, spg: 1.2, bpg: 0.5, fgPct: 48.0, threePct: 30.0, ftPct: 75.0 },
      { season: "2015-16", age: 23, league: "Australia NBL", team: "Adelaide 36ers", gp: 28, gs: 28, mpg: 32.0, ppg: 17.0, rpg: 6.5, apg: 3.0, spg: 1.5, bpg: 0.6, fgPct: 50.0, threePct: 32.0, ftPct: 78.0 },
      { season: "2016-17", age: 24, league: "Australia NBL", team: "Adelaide 36ers", gp: 28, gs: 28, mpg: 34.0, ppg: 19.0, rpg: 7.0, apg: 3.5, spg: 1.6, bpg: 0.7, fgPct: 52.0, threePct: 34.0, ftPct: 80.0 },
      { season: "2017-18", age: 25, league: "Australia NBL", team: "Adelaide 36ers", gp: 28, gs: 28, mpg: 35.0, ppg: 20.5, rpg: 7.5, apg: 4.0, spg: 1.8, bpg: 0.8, fgPct: 53.0, threePct: 35.0, ftPct: 82.0 },
      { season: "2018-19", age: 26, league: "NBA", team: "Brooklyn Nets / Minnesota", gp: 12, gs: 0, mpg: 8.0, ppg: 3.5, rpg: 1.5, apg: 0.5, spg: 0.3, bpg: 0.1, fgPct: 42.0, threePct: 25.0, ftPct: 70.0 },
      { season: "2019-20", age: 27, league: "Australia NBL", team: "South East Melbourne Phoenix", gp: 28, gs: 28, mpg: 33.0, ppg: 18.0, rpg: 6.5, apg: 3.5, spg: 1.5, bpg: 0.6, fgPct: 50.0, threePct: 33.0, ftPct: 79.0 },
      { season: "2020-21", age: 28, league: "Australia NBL", team: "South East Melbourne Phoenix", gp: 36, gs: 36, mpg: 34.0, ppg: 19.5, rpg: 7.0, apg: 4.0, spg: 1.6, bpg: 0.7, fgPct: 51.0, threePct: 34.0, ftPct: 80.0 },
      { season: "2021-22", age: 29, league: "Australia NBL", team: "South East Melbourne Phoenix", gp: 28, gs: 28, mpg: 33.0, ppg: 18.5, rpg: 6.5, apg: 3.5, spg: 1.5, bpg: 0.6, fgPct: 50.0, threePct: 33.0, ftPct: 79.0 },
      { season: "2022-23", age: 30, league: "Australia NBL", team: "South East Melbourne Phoenix", gp: 28, gs: 28, mpg: 32.0, ppg: 17.5, rpg: 6.0, apg: 3.0, spg: 1.4, bpg: 0.5, fgPct: 49.0, threePct: 32.0, ftPct: 78.0 },
      { season: "2023-24", age: 31, league: "Australia NBL", team: "SE Melbourne / New Zealand Breakers", gp: 30, gs: 28, mpg: 31.0, ppg: 16.5, rpg: 5.5, apg: 3.0, spg: 1.3, bpg: 0.5, fgPct: 48.0, threePct: 31.0, ftPct: 77.0 },
      { season: "2025", age: 32, league: "CEBL", team: "Vancouver Bandits", gp: 22, gs: 22, mpg: 34.0, ppg: 22.0, rpg: 7.0, apg: 4.0, spg: 1.6, bpg: 0.7, fgPct: 52.0, threePct: 35.0, ftPct: 80.0 }
    ],
    medicalHistory: [
      { date: "2019-12", injury: "Right knee ACL surgery (partial tear)", severity: "Major", gamesOut: 25, note: "Missed significant time, full recovery" },
      { date: "2022-03", injury: "Left calf strain", severity: "Moderate", gamesOut: 8, note: "Managed load on return" },
      { date: "2024-11", injury: "Right shoulder impingement", severity: "Minor", gamesOut: 4, note: "Precautionary rest" }
    ]
  },

  "Greg Brown III": {
    bio: { position: "Forward", height: "6'9\"", weight: "205 lbs", age: 24, hometown: "Austin, TX", draft: "2021 NBA Draft, 2nd Round, 43rd Pick (POR)", college: "Texas" },
    careerStats: [
      { season: "2020-21", age: 19, league: "NCAA", team: "Texas", gp: 30, gs: 5, mpg: 16.0, ppg: 8.5, rpg: 4.5, apg: 0.5, spg: 0.5, bpg: 0.8, fgPct: 52.0, threePct: 28.0, ftPct: 65.0 },
      { season: "2021-22", age: 20, league: "NBA", team: "Portland Trail Blazers", gp: 25, gs: 2, mpg: 10.0, ppg: 4.5, rpg: 2.5, apg: 0.3, spg: 0.3, bpg: 0.5, fgPct: 48.0, threePct: 25.0, ftPct: 60.0 },
      { season: "2022-23", age: 21, league: "NBA/G League", team: "Indiana Pacers / Mad Ants", gp: 35, gs: 10, mpg: 22.0, ppg: 12.0, rpg: 6.0, apg: 1.0, spg: 0.7, bpg: 1.0, fgPct: 50.0, threePct: 30.0, ftPct: 68.0 },
      { season: "2023-24", age: 22, league: "G League", team: "Mad Ants", gp: 30, gs: 28, mpg: 30.0, ppg: 16.5, rpg: 7.5, apg: 1.5, spg: 1.0, bpg: 1.2, fgPct: 52.0, threePct: 32.0, ftPct: 72.0 },
      { season: "2025", age: 24, league: "CEBL", team: "Calgary Surge", gp: 22, gs: 22, mpg: 33.0, ppg: 18.0, rpg: 7.0, apg: 2.5, spg: 1.0, bpg: 1.5, fgPct: 54.0, threePct: 34.0, ftPct: 75.0 }
    ],
    medicalHistory: [
      { date: "2022-11", injury: "Left ankle sprain", severity: "Moderate", gamesOut: 10, note: "Missed time with Pacers" },
      { date: "2023-03", injury: "Right knee soreness", severity: "Minor", gamesOut: 3, note: "Load management" }
    ]
  },

  "Kadre Gray": {
    bio: { position: "Guard", height: "6'2\"", weight: "190 lbs", age: 27, hometown: "Toronto, ON", draft: "N/A", college: "Laurentian University (U SPORTS)" },
    careerStats: [
      { season: "2017-18", age: 19, league: "U SPORTS", team: "Laurentian Voyageurs", gp: 22, gs: 22, mpg: 32.0, ppg: 20.5, rpg: 5.0, apg: 7.0, spg: 2.5, bpg: 0.2, fgPct: 48.0, threePct: 34.0, ftPct: 80.0 },
      { season: "2018-19", age: 20, league: "U SPORTS", team: "Laurentian Voyageurs", gp: 22, gs: 22, mpg: 33.0, ppg: 24.0, rpg: 5.5, apg: 8.0, spg: 3.0, bpg: 0.3, fgPct: 50.0, threePct: 36.0, ftPct: 82.0 },
      { season: "2019-20", age: 21, league: "U SPORTS", team: "Laurentian Voyageurs", gp: 20, gs: 20, mpg: 34.0, ppg: 25.5, rpg: 6.0, apg: 8.5, spg: 3.2, bpg: 0.3, fgPct: 52.0, threePct: 38.0, ftPct: 85.0 },
      { season: "2021", age: 22, league: "CEBL", team: "Guelph Nighthawks", gp: 14, gs: 14, mpg: 30.0, ppg: 10.5, rpg: 3.5, apg: 5.0, spg: 1.5, bpg: 0.2, fgPct: 42.0, threePct: 32.0, ftPct: 78.0 },
      { season: "2022", age: 23, league: "CEBL", team: "Scarborough Shooting Stars", gp: 20, gs: 18, mpg: 28.0, ppg: 8.5, rpg: 3.0, apg: 4.5, spg: 1.2, bpg: 0.2, fgPct: 40.0, threePct: 30.0, ftPct: 76.0 },
      { season: "2023", age: 24, league: "CEBL", team: "Ottawa BlackJacks", gp: 20, gs: 20, mpg: 30.0, ppg: 12.0, rpg: 3.0, apg: 5.5, spg: 1.5, bpg: 0.2, fgPct: 44.0, threePct: 34.0, ftPct: 80.0 },
      { season: "2024", age: 25, league: "CEBL", team: "Scarborough Shooting Stars", gp: 20, gs: 20, mpg: 31.0, ppg: 13.0, rpg: 3.5, apg: 6.0, spg: 1.6, bpg: 0.2, fgPct: 45.0, threePct: 35.0, ftPct: 82.0 },
      { season: "2025", age: 26, league: "CEBL", team: "Scarborough Shooting Stars", gp: 22, gs: 22, mpg: 32.0, ppg: 12.0, rpg: 3.0, apg: 5.5, spg: 1.5, bpg: 0.2, fgPct: 44.0, threePct: 34.0, ftPct: 80.0 }
    ],
    medicalHistory: [
      { date: "2022-06", injury: "Left hamstring strain", severity: "Minor", gamesOut: 2, note: "Played through discomfort" }
    ]
  },

  "Koby McEwen": {
    bio: { position: "Guard", height: "6'1\"", weight: "175 lbs", age: 27, hometown: "Hamilton, ON", draft: "N/A", college: "Utah State / Marquette" },
    careerStats: [
      { season: "2017-18", age: 19, league: "NCAA", team: "Utah State", gp: 32, gs: 32, mpg: 33.0, ppg: 14.5, rpg: 3.0, apg: 3.5, spg: 1.0, bpg: 0.1, fgPct: 42.0, threePct: 35.0, ftPct: 80.0 },
      { season: "2018-19", age: 20, league: "NCAA", team: "Utah State", gp: 35, gs: 35, mpg: 31.0, ppg: 11.5, rpg: 3.5, apg: 4.0, spg: 1.2, bpg: 0.2, fgPct: 43.0, threePct: 36.0, ftPct: 82.0 },
      { season: "2019-20", age: 21, league: "NCAA", team: "Marquette", gp: 31, gs: 31, mpg: 34.0, ppg: 13.0, rpg: 4.0, apg: 3.5, spg: 1.0, bpg: 0.2, fgPct: 40.0, threePct: 33.0, ftPct: 78.0 },
      { season: "2020-21", age: 22, league: "NCAA", team: "Marquette", gp: 25, gs: 25, mpg: 32.0, ppg: 12.0, rpg: 3.5, apg: 3.0, spg: 0.8, bpg: 0.1, fgPct: 38.0, threePct: 30.0, ftPct: 76.0 },
      { season: "2022", age: 23, league: "CEBL", team: "Hamilton Honey Badgers", gp: 20, gs: 20, mpg: 30.0, ppg: 13.0, rpg: 3.5, apg: 3.5, spg: 1.0, bpg: 0.2, fgPct: 43.0, threePct: 35.0, ftPct: 80.0 },
      { season: "2023", age: 24, league: "CEBL", team: "Brampton Honey Badgers", gp: 20, gs: 20, mpg: 31.0, ppg: 14.0, rpg: 3.5, apg: 4.0, spg: 1.2, bpg: 0.2, fgPct: 44.0, threePct: 36.0, ftPct: 82.0 },
      { season: "2024", age: 25, league: "CEBL", team: "Vancouver Bandits", gp: 20, gs: 20, mpg: 32.0, ppg: 14.5, rpg: 3.5, apg: 4.0, spg: 1.2, bpg: 0.2, fgPct: 45.0, threePct: 37.0, ftPct: 83.0 },
      { season: "2025", age: 26, league: "CEBL", team: "Brampton/Vancouver", gp: 22, gs: 22, mpg: 33.0, ppg: 14.5, rpg: 3.5, apg: 4.0, spg: 1.2, bpg: 0.2, fgPct: 45.0, threePct: 37.0, ftPct: 83.0 }
    ],
    medicalHistory: [
      { date: "2020-12", injury: "Right knee injury", severity: "Moderate", gamesOut: 8, note: "Missed mid-season at Marquette" },
      { date: "2023-07", injury: "Right ankle sprain", severity: "Minor", gamesOut: 2, note: "Returned quickly for CEBL" }
    ]
  },

  "Trae Bell-Haynes": {
    bio: { position: "Guard", height: "6'0\"", weight: "185 lbs", age: 28, hometown: "Toronto, ON", draft: "Undrafted", college: "Vermont" },
    careerStats: [
      { season: "2015-16", age: 19, league: "NCAA", team: "Vermont", gp: 33, gs: 33, mpg: 32.0, ppg: 12.5, rpg: 2.5, apg: 5.0, spg: 1.5, bpg: 0.1, fgPct: 42.0, threePct: 33.0, ftPct: 78.0 },
      { season: "2016-17", age: 20, league: "NCAA", team: "Vermont", gp: 34, gs: 34, mpg: 34.0, ppg: 15.0, rpg: 3.0, apg: 6.0, spg: 1.8, bpg: 0.2, fgPct: 44.0, threePct: 35.0, ftPct: 80.0 },
      { season: "2017-18", age: 21, league: "NCAA", team: "Vermont", gp: 35, gs: 35, mpg: 35.0, ppg: 16.5, rpg: 3.5, apg: 6.5, spg: 2.0, bpg: 0.2, fgPct: 45.0, threePct: 36.0, ftPct: 82.0 },
      { season: "2018-19", age: 22, league: "NCAA", team: "Vermont", gp: 33, gs: 33, mpg: 34.0, ppg: 14.0, rpg: 3.0, apg: 5.5, spg: 1.6, bpg: 0.2, fgPct: 43.0, threePct: 34.0, ftPct: 80.0 },
      { season: "2019", age: 22, league: "CEBL", team: "Edmonton Stingers", gp: 18, gs: 18, mpg: 30.0, ppg: 12.0, rpg: 2.5, apg: 5.0, spg: 1.5, bpg: 0.1, fgPct: 43.0, threePct: 34.0, ftPct: 80.0 },
      { season: "2019-20", age: 23, league: "Europe", team: "Barcelona B / Various", gp: 20, gs: 15, mpg: 25.0, ppg: 10.0, rpg: 2.0, apg: 4.5, spg: 1.2, bpg: 0.1, fgPct: 42.0, threePct: 33.0, ftPct: 78.0 },
      { season: "2021-22", age: 25, league: "Europe", team: "Various European clubs", gp: 25, gs: 20, mpg: 28.0, ppg: 11.5, rpg: 2.5, apg: 5.0, spg: 1.4, bpg: 0.2, fgPct: 44.0, threePct: 35.0, ftPct: 80.0 },
      { season: "2022-23", age: 26, league: "Europe", team: "Various European clubs", gp: 28, gs: 25, mpg: 30.0, ppg: 12.5, rpg: 2.5, apg: 5.5, spg: 1.5, bpg: 0.2, fgPct: 45.0, threePct: 36.0, ftPct: 82.0 },
      { season: "2024-25", age: 27, league: "Spain Liga Endesa", team: "Casademont Zaragoza", gp: 25, gs: 22, mpg: 28.0, ppg: 10.7, rpg: 2.3, apg: 6.2, spg: 1.5, bpg: 0.2, fgPct: 44.0, threePct: 35.0, ftPct: 80.0 }
    ],
    medicalHistory: [
      { date: "2020-10", injury: "Right groin strain", severity: "Moderate", gamesOut: 6, note: "Missed early European season" },
      { date: "2023-01", injury: "Left hamstring tightness", severity: "Minor", gamesOut: 3, note: "Precautionary rest" }
    ]
  },

  "Keon Ambrose-Hylton": {
    bio: { position: "Forward", height: "6'7\"", weight: "215 lbs", age: 24, hometown: "Toronto, ON", draft: "N/A", college: "Alabama" },
    careerStats: [
      { season: "2019-20", age: 18, league: "NCAA", team: "Alabama", gp: 28, gs: 2, mpg: 10.0, ppg: 2.5, rpg: 2.0, apg: 0.3, spg: 0.3, bpg: 0.5, fgPct: 45.0, threePct: 20.0, ftPct: 60.0 },
      { season: "2020-21", age: 19, league: "NCAA", team: "Alabama", gp: 30, gs: 8, mpg: 14.0, ppg: 4.0, rpg: 3.5, apg: 0.5, spg: 0.5, bpg: 0.8, fgPct: 50.0, threePct: 25.0, ftPct: 65.0 },
      { season: "2021-22", age: 20, league: "NCAA", team: "Alabama", gp: 32, gs: 15, mpg: 18.0, ppg: 6.5, rpg: 4.5, apg: 0.8, spg: 0.6, bpg: 1.0, fgPct: 52.0, threePct: 28.0, ftPct: 68.0 },
      { season: "2023", age: 22, league: "CEBL", team: "Ottawa BlackJacks", gp: 18, gs: 15, mpg: 25.0, ppg: 9.0, rpg: 5.5, apg: 1.0, spg: 0.8, bpg: 1.2, fgPct: 50.0, threePct: 30.0, ftPct: 70.0 },
      { season: "2024", age: 23, league: "CEBL", team: "Various", gp: 20, gs: 18, mpg: 28.0, ppg: 11.0, rpg: 6.0, apg: 1.2, spg: 1.0, bpg: 1.3, fgPct: 52.0, threePct: 32.0, ftPct: 72.0 },
      { season: "2025", age: 24, league: "CEBL", team: "Brampton/Other", gp: 22, gs: 22, mpg: 30.0, ppg: 12.5, rpg: 7.0, apg: 1.5, spg: 1.0, bpg: 1.5, fgPct: 54.0, threePct: 33.0, ftPct: 74.0 }
    ],
    medicalHistory: [
      { date: "2021-01", injury: "Right ankle sprain", severity: "Minor", gamesOut: 3, note: "Missed games at Alabama" },
      { date: "2024-06", injury: "Left knee contusion", severity: "Minor", gamesOut: 1, note: "Returned next game" }
    ]
  },

  "Fardaws Aimaq": {
    bio: { position: "Center", height: "6'11\"", weight: "245 lbs", age: 24, hometown: "Vancouver, BC", draft: "Undrafted", college: "Utah Valley / Texas Tech" },
    careerStats: [
      { season: "2019-20", age: 19, league: "NCAA", team: "Utah Valley", gp: 30, gs: 28, mpg: 28.0, ppg: 10.5, rpg: 8.5, apg: 1.0, spg: 0.5, bpg: 1.0, fgPct: 55.0, threePct: 0.0, ftPct: 65.0 },
      { season: "2020-21", age: 20, league: "NCAA", team: "Utah Valley", gp: 25, gs: 25, mpg: 33.0, ppg: 15.0, rpg: 12.0, apg: 1.2, spg: 0.7, bpg: 1.5, fgPct: 57.0, threePct: 25.0, ftPct: 68.0 },
      { season: "2021-22", age: 21, league: "NCAA", team: "Utah Valley", gp: 30, gs: 30, mpg: 35.0, ppg: 18.5, rpg: 13.5, apg: 1.5, spg: 0.8, bpg: 1.8, fgPct: 58.0, threePct: 28.0, ftPct: 70.0 },
      { season: "2022-23", age: 22, league: "NCAA", team: "Texas Tech", gp: 28, gs: 25, mpg: 25.0, ppg: 8.5, rpg: 7.0, apg: 0.8, spg: 0.5, bpg: 1.0, fgPct: 52.0, threePct: 22.0, ftPct: 65.0 },
      { season: "2023-24", age: 23, league: "NCAA", team: "Texas Tech", gp: 30, gs: 28, mpg: 28.0, ppg: 10.0, rpg: 8.5, apg: 1.0, spg: 0.6, bpg: 1.2, fgPct: 54.0, threePct: 25.0, ftPct: 68.0 },
      { season: "2024-25", age: 24, league: "Europe", team: "European Club", gp: 20, gs: 18, mpg: 25.0, ppg: 12.0, rpg: 10.5, apg: 1.0, spg: 0.6, bpg: 1.5, fgPct: 56.0, threePct: 28.0, ftPct: 70.0 }
    ],
    medicalHistory: [
      { date: "2022-11", injury: "Right knee meniscus tear", severity: "Major", gamesOut: 20, note: "Required surgery, impacted Texas Tech debut" },
      { date: "2024-01", injury: "Left ankle sprain", severity: "Moderate", gamesOut: 5, note: "Missed time at Texas Tech" }
    ]
  },

  "Thomas Kennedy": {
    bio: { position: "Center", height: "6'10\"", weight: "230 lbs", age: 24, hometown: "Toronto, ON", draft: "Undrafted", college: "Northwestern" },
    careerStats: [
      { season: "2019-20", age: 18, league: "NCAA", team: "Northwestern", gp: 28, gs: 5, mpg: 12.0, ppg: 3.5, rpg: 2.5, apg: 0.5, spg: 0.2, bpg: 0.5, fgPct: 50.0, threePct: 28.0, ftPct: 65.0 },
      { season: "2020-21", age: 19, league: "NCAA", team: "Northwestern", gp: 26, gs: 20, mpg: 22.0, ppg: 8.0, rpg: 5.0, apg: 1.0, spg: 0.4, bpg: 1.0, fgPct: 55.0, threePct: 32.0, ftPct: 70.0 },
      { season: "2021-22", age: 20, league: "NCAA", team: "Northwestern", gp: 30, gs: 28, mpg: 28.0, ppg: 10.5, rpg: 6.5, apg: 1.5, spg: 0.5, bpg: 1.2, fgPct: 56.0, threePct: 34.0, ftPct: 72.0 },
      { season: "2022-23", age: 21, league: "NCAA", team: "Northwestern", gp: 32, gs: 32, mpg: 30.0, ppg: 12.5, rpg: 7.0, apg: 1.8, spg: 0.6, bpg: 1.5, fgPct: 58.0, threePct: 36.0, ftPct: 75.0 },
      { season: "2023-24", age: 22, league: "NCAA", team: "Northwestern", gp: 34, gs: 34, mpg: 32.0, ppg: 14.0, rpg: 7.5, apg: 2.0, spg: 0.7, bpg: 1.8, fgPct: 60.0, threePct: 38.0, ftPct: 78.0 },
      { season: "2024-25", age: 23, league: "Germany BBL", team: "Telekom Baskets Bonn", gp: 28, gs: 28, mpg: 28.0, ppg: 11.8, rpg: 5.8, apg: 1.5, spg: 0.5, bpg: 1.2, fgPct: 57.0, threePct: 35.0, ftPct: 75.0 }
    ],
    medicalHistory: [
      { date: "2021-02", injury: "Right foot stress reaction", severity: "Moderate", gamesOut: 6, note: "Managed carefully at Northwestern" }
    ]
  },

  "Cat Barber": {
    bio: { position: "Guard", height: "6'2\"", weight: "180 lbs", age: 32, hometown: "Hampton, VA", draft: "Undrafted (2016)", college: "NC State" },
    careerStats: [
      { season: "2013-14", age: 19, league: "NCAA", team: "NC State", gp: 33, gs: 33, mpg: 32.0, ppg: 12.0, rpg: 3.0, apg: 4.0, spg: 1.0, bpg: 0.1, fgPct: 39.0, threePct: 30.0, ftPct: 75.0 },
      { season: "2014-15", age: 20, league: "NCAA", team: "NC State", gp: 35, gs: 35, mpg: 34.0, ppg: 17.0, rpg: 3.2, apg: 5.5, spg: 1.5, bpg: 0.2, fgPct: 43.0, threePct: 33.0, ftPct: 80.0 },
      { season: "2015-16", age: 21, league: "NCAA", team: "NC State", gp: 32, gs: 32, mpg: 35.0, ppg: 23.5, rpg: 3.5, apg: 4.7, spg: 1.6, bpg: 0.2, fgPct: 45.0, threePct: 34.0, ftPct: 82.0 },
      { season: "2016-22", age: 22, league: "Various", team: "8 countries (Italy/Israel/Greece/etc.)", gp: 250, gs: 200, mpg: 30.0, ppg: 16.5, rpg: 3.3, apg: 4.5, spg: 1.2, bpg: 0.2, fgPct: 44.0, threePct: 35.0, ftPct: 80.0 },
      { season: "2023", age: 29, league: "CEBL", team: "Scarborough Shooting Stars", gp: 18, gs: 18, mpg: 32.0, ppg: 19.5, rpg: 3.5, apg: 4.0, spg: 1.4, bpg: 0.2, fgPct: 47.0, threePct: 38.0, ftPct: 82.0 },
      { season: "2024", age: 30, league: "CEBL", team: "Scarborough Shooting Stars", gp: 20, gs: 20, mpg: 31.0, ppg: 21.0, rpg: 3.5, apg: 4.2, spg: 1.3, bpg: 0.2, fgPct: 48.0, threePct: 39.0, ftPct: 84.0 },
      { season: "2024-25", age: 31, league: "Portugal Liga Betclic", team: "Sporting CP", gp: 25, gs: 22, mpg: 28.0, ppg: 14.5, rpg: 3.0, apg: 3.8, spg: 1.0, bpg: 0.1, fgPct: 46.0, threePct: 36.0, ftPct: 80.0 },
      { season: "2025", age: 31, league: "CEBL", team: "Scarborough Shooting Stars", gp: 13, gs: 13, mpg: 28.9, ppg: 19.2, rpg: 3.5, apg: 3.9, spg: 1.2, bpg: 0.2, fgPct: 47.0, threePct: 38.5, ftPct: 82.0 }
    ],
    medicalHistory: []
  },

  "Mfiondu Kabengele": {
    bio: { position: "Center", height: "6'10\"", weight: "250 lbs", age: 28, hometown: "Toronto, ON", draft: "2019 NBA Draft, 1st Round, 27th Pick (LAC)", college: "Florida State" },
    careerStats: [
      { season: "2017-19", age: 20, league: "NCAA", team: "Florida State", gp: 65, gs: 25, mpg: 21.0, ppg: 12.5, rpg: 6.0, apg: 0.5, spg: 0.7, bpg: 1.5, fgPct: 50.0, threePct: 32.0, ftPct: 73.0 },
      { season: "2019-21", age: 22, league: "NBA", team: "LA Clippers / Cleveland", gp: 50, gs: 2, mpg: 9.0, ppg: 3.5, rpg: 2.0, apg: 0.3, spg: 0.2, bpg: 0.4, fgPct: 39.0, threePct: 31.0, ftPct: 70.0 },
      { season: "2021-23", age: 24, league: "Various", team: "G League / Italy / Spain", gp: 60, gs: 50, mpg: 26.0, ppg: 14.0, rpg: 7.5, apg: 1.0, spg: 0.6, bpg: 1.2, fgPct: 52.0, threePct: 35.0, ftPct: 74.0 },
      { season: "2024-25", age: 27, league: "ABA League / EuroCup", team: "Dubai Basketball", gp: 30, gs: 30, mpg: 30.0, ppg: 15.4, rpg: 9.7, apg: 1.5, spg: 0.7, bpg: 1.5, fgPct: 56.0, threePct: 36.0, ftPct: 76.0 }
    ],
    medicalHistory: []
  },

  "Chris Boucher": {
    bio: { position: "Forward/Center", height: "6'9\"", weight: "200 lbs", age: 33, hometown: "Montreal, QC", draft: "Undrafted (2017)", college: "Oregon" },
    careerStats: [
      { season: "2017-25", age: 24, league: "NBA", team: "Toronto Raptors", gp: 350, gs: 80, mpg: 18.5, ppg: 7.5, rpg: 4.6, apg: 0.8, spg: 0.5, bpg: 0.9, fgPct: 47.0, threePct: 35.0, ftPct: 78.0 },
      { season: "2024-25", age: 32, league: "EuroLeague", team: "Fenerbahce", gp: 30, gs: 18, mpg: 24.0, ppg: 8.5, rpg: 5.5, apg: 0.8, spg: 0.6, bpg: 1.0, fgPct: 49.0, threePct: 36.0, ftPct: 80.0 },
      { season: "2025-26", age: 33, league: "NBA", team: "Boston / Utah / FA", gp: 22, gs: 0, mpg: 8.0, ppg: 2.3, rpg: 2.0, apg: 0.3, spg: 0.2, bpg: 0.4, fgPct: 38.0, threePct: 28.0, ftPct: 70.0 }
    ],
    medicalHistory: []
  },

  "Shai Gilgeous-Alexander": {
    bio: { position: "Guard", height: "6'6\"", weight: "200 lbs", age: 27, hometown: "Hamilton, ON", draft: "2018 NBA Draft, 1st Round, 11th Pick (CHA)", college: "Kentucky" },
    careerStats: [
      { season: "2017-18", age: 19, league: "NCAA", team: "Kentucky", gp: 37, gs: 24, mpg: 33.7, ppg: 14.4, rpg: 4.1, apg: 5.1, spg: 1.6, bpg: 0.5, fgPct: 48.5, threePct: 40.4, ftPct: 81.7 },
      { season: "2018-19", age: 20, league: "NBA", team: "LA Clippers", gp: 82, gs: 73, mpg: 26.5, ppg: 10.8, rpg: 2.8, apg: 3.3, spg: 1.2, bpg: 0.5, fgPct: 47.6, threePct: 36.7, ftPct: 80.0 },
      { season: "2022-23", age: 24, league: "NBA", team: "OKC Thunder", gp: 68, gs: 68, mpg: 35.5, ppg: 31.4, rpg: 4.8, apg: 5.5, spg: 1.6, bpg: 1.0, fgPct: 51.0, threePct: 34.5, ftPct: 90.5 },
      { season: "2023-24", age: 25, league: "NBA", team: "OKC Thunder", gp: 75, gs: 75, mpg: 34.0, ppg: 30.1, rpg: 5.5, apg: 6.2, spg: 2.0, bpg: 0.9, fgPct: 53.5, threePct: 35.4, ftPct: 87.4 },
      { season: "2024-25", age: 26, league: "NBA", team: "OKC Thunder", gp: 76, gs: 76, mpg: 35.0, ppg: 32.7, rpg: 5.0, apg: 6.4, spg: 1.7, bpg: 1.0, fgPct: 51.9, threePct: 37.5, ftPct: 89.8 }
    ],
    medicalHistory: []
  },

  "Jamal Murray": {
    bio: { position: "Guard", height: "6'4\"", weight: "215 lbs", age: 29, hometown: "Kitchener, ON", draft: "2016 NBA Draft, 1st Round, 7th Pick (DEN)", college: "Kentucky" },
    careerStats: [
      { season: "2015-16", age: 19, league: "NCAA", team: "Kentucky", gp: 36, gs: 36, mpg: 35.2, ppg: 20.0, rpg: 5.2, apg: 2.2, spg: 1.0, bpg: 0.3, fgPct: 45.4, threePct: 40.8, ftPct: 78.3 },
      { season: "2019-20", age: 23, league: "NBA", team: "Denver Nuggets", gp: 59, gs: 59, mpg: 32.5, ppg: 18.5, rpg: 4.0, apg: 4.8, spg: 1.0, bpg: 0.3, fgPct: 46.4, threePct: 34.6, ftPct: 88.0 },
      { season: "2022-23", age: 26, league: "NBA", team: "Denver Nuggets", gp: 65, gs: 65, mpg: 32.6, ppg: 20.0, rpg: 4.0, apg: 6.2, spg: 1.0, bpg: 0.4, fgPct: 45.4, threePct: 39.8, ftPct: 83.4 },
      { season: "2023-24", age: 27, league: "NBA", team: "Denver Nuggets", gp: 59, gs: 59, mpg: 35.5, ppg: 21.2, rpg: 4.1, apg: 6.5, spg: 1.0, bpg: 0.6, fgPct: 48.1, threePct: 42.5, ftPct: 87.3 },
      { season: "2024-25", age: 28, league: "NBA", team: "Denver Nuggets", gp: 65, gs: 65, mpg: 32.0, ppg: 21.4, rpg: 4.0, apg: 6.0, spg: 1.0, bpg: 0.4, fgPct: 47.0, threePct: 39.0, ftPct: 86.0 }
    ],
    medicalHistory: [
      { date: "2021-04", injury: "Left ACL tear", severity: "Major", gamesOut: 100, note: "Missed entire 2021-22 NBA season" }
    ]
  },

  "Lu Dort": {
    bio: { position: "Guard/Forward", height: "6'4\"", weight: "215 lbs", age: 26, hometown: "Montréal-Nord, QC", draft: "Undrafted (2019)", college: "Arizona State" },
    careerStats: [
      { season: "2018-19", age: 19, league: "NCAA", team: "Arizona State", gp: 34, gs: 34, mpg: 31.0, ppg: 16.1, rpg: 4.3, apg: 2.3, spg: 1.4, bpg: 0.2, fgPct: 40.6, threePct: 31.0, ftPct: 75.4 },
      { season: "2019-20", age: 20, league: "NBA", team: "OKC Thunder", gp: 36, gs: 25, mpg: 21.5, ppg: 6.8, rpg: 1.9, apg: 0.8, spg: 0.6, bpg: 0.1, fgPct: 39.7, threePct: 29.7, ftPct: 75.0 },
      { season: "2023-24", age: 24, league: "NBA", team: "OKC Thunder", gp: 79, gs: 79, mpg: 30.6, ppg: 10.9, rpg: 4.0, apg: 1.8, spg: 0.9, bpg: 0.5, fgPct: 41.3, threePct: 39.4, ftPct: 82.7 },
      { season: "2024-25", age: 25, league: "NBA", team: "OKC Thunder", gp: 71, gs: 71, mpg: 28.0, ppg: 10.3, rpg: 3.9, apg: 1.7, spg: 1.1, bpg: 0.4, fgPct: 42.0, threePct: 37.0, ftPct: 80.0 }
    ],
    medicalHistory: []
  },

  "RJ Barrett": {
    bio: { position: "Guard/Forward", height: "6'6\"", weight: "210 lbs", age: 25, hometown: "Mississauga, ON", draft: "2019 NBA Draft, 1st Round, 3rd Pick (NYK)", college: "Duke" },
    careerStats: [
      { season: "2018-19", age: 18, league: "NCAA", team: "Duke", gp: 38, gs: 38, mpg: 35.2, ppg: 22.6, rpg: 7.6, apg: 4.3, spg: 0.9, bpg: 0.4, fgPct: 45.4, threePct: 30.8, ftPct: 66.5 },
      { season: "2019-20", age: 19, league: "NBA", team: "New York Knicks", gp: 56, gs: 56, mpg: 30.4, ppg: 14.3, rpg: 5.0, apg: 2.6, spg: 0.9, bpg: 0.3, fgPct: 40.2, threePct: 32.0, ftPct: 61.4 },
      { season: "2023-24", age: 23, league: "NBA", team: "NYK / TOR", gp: 71, gs: 71, mpg: 32.0, ppg: 18.2, rpg: 6.0, apg: 4.0, spg: 0.7, bpg: 0.4, fgPct: 47.0, threePct: 36.0, ftPct: 73.0 },
      { season: "2024-25", age: 24, league: "NBA", team: "Toronto Raptors", gp: 67, gs: 67, mpg: 33.5, ppg: 21.5, rpg: 6.4, apg: 5.5, spg: 0.9, bpg: 0.4, fgPct: 46.5, threePct: 35.0, ftPct: 71.0 }
    ],
    medicalHistory: []
  },

  "Dillon Brooks": {
    bio: { position: "Forward", height: "6'7\"", weight: "225 lbs", age: 30, hometown: "Mississauga, ON", draft: "2017 NBA Draft, 2nd Round, 45th Pick (HOU)", college: "Oregon" },
    careerStats: [
      { season: "2016-17", age: 21, league: "NCAA", team: "Oregon", gp: 39, gs: 39, mpg: 32.0, ppg: 16.1, rpg: 3.2, apg: 2.7, spg: 0.8, bpg: 0.2, fgPct: 47.5, threePct: 40.4, ftPct: 79.5 },
      { season: "2017-18", age: 22, league: "NBA", team: "Memphis Grizzlies", gp: 82, gs: 74, mpg: 28.5, ppg: 11.0, rpg: 3.1, apg: 1.6, spg: 0.7, bpg: 0.2, fgPct: 44.0, threePct: 35.6, ftPct: 75.5 },
      { season: "2022-23", age: 27, league: "NBA", team: "Memphis Grizzlies", gp: 73, gs: 72, mpg: 33.4, ppg: 14.3, rpg: 3.7, apg: 2.6, spg: 0.9, bpg: 0.3, fgPct: 39.6, threePct: 32.6, ftPct: 73.8 },
      { season: "2024-25", age: 29, league: "NBA", team: "Houston Rockets", gp: 73, gs: 73, mpg: 30.0, ppg: 14.0, rpg: 3.7, apg: 2.0, spg: 0.9, bpg: 0.3, fgPct: 44.0, threePct: 39.0, ftPct: 78.0 }
    ],
    medicalHistory: []
  },

  "Andrew Wiggins": {
    bio: { position: "Forward", height: "6'7\"", weight: "194 lbs", age: 30, hometown: "Toronto, ON", draft: "2014 NBA Draft, 1st Round, 1st Pick (CLE)", college: "Kansas" },
    careerStats: [
      { season: "2013-14", age: 19, league: "NCAA", team: "Kansas", gp: 35, gs: 35, mpg: 32.8, ppg: 17.1, rpg: 5.9, apg: 1.5, spg: 1.2, bpg: 1.0, fgPct: 44.8, threePct: 34.1, ftPct: 77.5 },
      { season: "2014-15", age: 20, league: "NBA", team: "Minnesota T-Wolves", gp: 82, gs: 82, mpg: 36.2, ppg: 16.9, rpg: 4.6, apg: 2.1, spg: 1.0, bpg: 0.6, fgPct: 43.7, threePct: 31.0, ftPct: 76.0 },
      { season: "2021-22", age: 26, league: "NBA", team: "Golden State Warriors", gp: 73, gs: 73, mpg: 31.9, ppg: 17.2, rpg: 4.5, apg: 2.2, spg: 1.1, bpg: 0.7, fgPct: 46.6, threePct: 39.3, ftPct: 63.3, note: "NBA Champion" },
      { season: "2024-25", age: 29, league: "NBA", team: "GSW / MIA", gp: 65, gs: 65, mpg: 30.0, ppg: 17.5, rpg: 5.0, apg: 2.5, spg: 1.0, bpg: 0.7, fgPct: 45.0, threePct: 36.0, ftPct: 70.0 }
    ],
    medicalHistory: []
  },

  "Brandon Clarke": {
    bio: { position: "Forward", height: "6'8\"", weight: "210 lbs", age: 29, hometown: "Vancouver, BC", draft: "2019 NBA Draft, 1st Round, 21st Pick (OKC)", college: "Gonzaga" },
    careerStats: [
      { season: "2018-19", age: 22, league: "NCAA", team: "Gonzaga", gp: 37, gs: 37, mpg: 28.4, ppg: 16.9, rpg: 8.6, apg: 1.9, spg: 1.2, bpg: 3.2, fgPct: 68.7, threePct: 26.7, ftPct: 69.2 },
      { season: "2019-20", age: 23, league: "NBA", team: "Memphis Grizzlies", gp: 58, gs: 9, mpg: 22.4, ppg: 12.1, rpg: 5.9, apg: 1.4, spg: 0.5, bpg: 0.9, fgPct: 61.8, threePct: 35.9, ftPct: 75.5 },
      { season: "2022-23", age: 26, league: "NBA", team: "Memphis Grizzlies", gp: 50, gs: 24, mpg: 23.5, ppg: 10.4, rpg: 5.8, apg: 1.2, spg: 0.5, bpg: 0.9, fgPct: 64.1, threePct: 33.3, ftPct: 71.1 },
      { season: "2024-25", age: 28, league: "NBA", team: "Memphis Grizzlies", gp: 65, gs: 30, mpg: 23.0, ppg: 9.5, rpg: 5.5, apg: 1.0, spg: 0.5, bpg: 0.8, fgPct: 60.0, threePct: 35.0, ftPct: 70.0 }
    ],
    medicalHistory: [
      { date: "2023-03", injury: "Right Achilles tear", severity: "Major", gamesOut: 50, note: "Major injury, slow recovery" }
    ]
  },

  "Bennedict Mathurin": {
    bio: { position: "Guard/Forward", height: "6'6\"", weight: "210 lbs", age: 23, hometown: "Montréal, QC", draft: "2022 NBA Draft, 1st Round, 6th Pick (IND)", college: "Arizona" },
    careerStats: [
      { season: "2021-22", age: 19, league: "NCAA", team: "Arizona", gp: 37, gs: 37, mpg: 32.5, ppg: 17.7, rpg: 5.6, apg: 2.5, spg: 0.7, bpg: 0.4, fgPct: 45.0, threePct: 36.9, ftPct: 75.0 },
      { season: "2022-23", age: 20, league: "NBA", team: "Indiana Pacers", gp: 78, gs: 1, mpg: 28.5, ppg: 16.7, rpg: 4.1, apg: 1.5, spg: 0.6, bpg: 0.2, fgPct: 41.9, threePct: 32.4, ftPct: 80.4 },
      { season: "2023-24", age: 21, league: "NBA", team: "Indiana Pacers", gp: 59, gs: 27, mpg: 30.0, ppg: 14.5, rpg: 4.5, apg: 1.7, spg: 0.6, bpg: 0.2, fgPct: 43.9, threePct: 37.4, ftPct: 80.0 },
      { season: "2024-25", age: 22, league: "NBA", team: "Indiana Pacers", gp: 70, gs: 50, mpg: 30.0, ppg: 16.5, rpg: 4.5, apg: 2.0, spg: 0.7, bpg: 0.3, fgPct: 44.0, threePct: 35.0, ftPct: 82.0 }
    ],
    medicalHistory: []
  },

  "Tristan Thompson": {
    bio: { position: "Center", height: "6'9\"", weight: "238 lbs", age: 34, hometown: "Brampton, ON", draft: "2011 NBA Draft, 1st Round, 4th Pick (CLE)", college: "Texas" },
    careerStats: [
      { season: "2010-11", age: 19, league: "NCAA", team: "Texas", gp: 36, gs: 35, mpg: 30.6, ppg: 13.1, rpg: 7.8, apg: 0.6, spg: 0.4, bpg: 2.4, fgPct: 54.6, threePct: 0, ftPct: 48.7 },
      { season: "2011-12", age: 20, league: "NBA", team: "Cleveland Cavaliers", gp: 60, gs: 22, mpg: 23.7, ppg: 8.2, rpg: 6.5, apg: 0.5, spg: 0.4, bpg: 1.0, fgPct: 43.9, threePct: 0, ftPct: 55.2 },
      { season: "2015-16", age: 24, league: "NBA", team: "Cleveland Cavaliers", gp: 82, gs: 53, mpg: 28.5, ppg: 7.8, rpg: 9.0, apg: 0.8, spg: 0.5, bpg: 0.7, fgPct: 58.6, threePct: 0, ftPct: 65.5, note: "NBA Champion" },
      { season: "2024-25", age: 33, league: "NBA", team: "Cleveland Cavaliers", gp: 49, gs: 0, mpg: 13.0, ppg: 4.0, rpg: 3.5, apg: 0.5, spg: 0.3, bpg: 0.3, fgPct: 55.0, threePct: 0, ftPct: 60.0 }
    ],
    medicalHistory: []
  },

  "Olivier Sarr": {
    bio: { position: "Center", height: "7'0\"", weight: "240 lbs", age: 26, hometown: "Bordeaux, France / Toronto, ON", draft: "Undrafted (2021)", college: "Wake Forest / Kentucky" },
    careerStats: [
      { season: "2020-21", age: 21, league: "NCAA", team: "Kentucky", gp: 25, gs: 25, mpg: 30.5, ppg: 13.0, rpg: 7.5, apg: 1.8, spg: 0.7, bpg: 1.5, fgPct: 50.0, threePct: 28.0, ftPct: 70.0 },
      { season: "2021-23", age: 23, league: "NBA / G League", team: "OKC / Toronto / Utah", gp: 50, gs: 0, mpg: 12.0, ppg: 4.5, rpg: 3.0, apg: 0.5, spg: 0.3, bpg: 0.7, fgPct: 50.0, threePct: 30.0, ftPct: 70.0 },
      { season: "2024-25", age: 25, league: "NBA / G League", team: "Memphis / Hustle", gp: 50, gs: 10, mpg: 18.0, ppg: 9.0, rpg: 5.5, apg: 1.0, spg: 0.5, bpg: 0.9, fgPct: 55.0, threePct: 33.0, ftPct: 75.0 }
    ],
    medicalHistory: []
  },

  "Leonard Miller": {
    bio: { position: "Forward", height: "6'10\"", weight: "210 lbs", age: 22, hometown: "Scarborough, ON", draft: "2023 NBA Draft, 2nd Round, 33rd Pick (MIN)", college: "G League Ignite" },
    careerStats: [
      { season: "2022-23", age: 19, league: "G League", team: "Ignite", gp: 25, gs: 20, mpg: 28.0, ppg: 17.4, rpg: 9.8, apg: 1.5, spg: 0.8, bpg: 1.0, fgPct: 53.0, threePct: 31.0, ftPct: 70.0 },
      { season: "2023-24", age: 20, league: "NBA / G League", team: "Minnesota / Iowa Wolves", gp: 35, gs: 5, mpg: 18.0, ppg: 8.5, rpg: 5.5, apg: 1.0, spg: 0.5, bpg: 0.6, fgPct: 50.0, threePct: 32.0, ftPct: 70.0 },
      { season: "2024-25", age: 21, league: "NBA / G League", team: "Minnesota / Iowa Wolves", gp: 40, gs: 8, mpg: 22.0, ppg: 11.0, rpg: 6.5, apg: 1.5, spg: 0.7, bpg: 0.7, fgPct: 52.0, threePct: 35.0, ftPct: 75.0 }
    ],
    medicalHistory: []
  },

  "Olivier-Maxence Prosper": {
    bio: { position: "Forward", height: "6'8\"", weight: "230 lbs", age: 23, hometown: "Montreal, QC", draft: "2023 NBA Draft, 1st Round, 24th Pick (DAL)", college: "Marquette" },
    careerStats: [
      { season: "2022-23", age: 20, league: "NCAA", team: "Marquette", gp: 35, gs: 30, mpg: 31.0, ppg: 12.5, rpg: 4.7, apg: 1.5, spg: 1.0, bpg: 0.5, fgPct: 51.0, threePct: 33.0, ftPct: 75.0 },
      { season: "2023-24", age: 21, league: "NBA", team: "Dallas Mavericks", gp: 42, gs: 0, mpg: 7.5, ppg: 2.0, rpg: 0.8, apg: 0.4, spg: 0.2, bpg: 0.1, fgPct: 41.0, threePct: 30.0, ftPct: 65.0 },
      { season: "2024-25", age: 22, league: "NBA / G League", team: "Dallas / Texas Legends", gp: 50, gs: 3, mpg: 12.5, ppg: 4.5, rpg: 1.8, apg: 0.5, spg: 0.4, bpg: 0.2, fgPct: 45.0, threePct: 33.0, ftPct: 70.0 }
    ],
    medicalHistory: []
  },

  "Ryan Nembhard": {
    bio: { position: "Guard", height: "6'0\"", weight: "175 lbs", age: 22, hometown: "Aurora, ON", draft: "Undrafted (2025)", college: "Creighton / Gonzaga" },
    careerStats: [
      { season: "2021-22", age: 18, league: "NCAA", team: "Creighton", gp: 32, gs: 32, mpg: 32.0, ppg: 11.5, rpg: 3.0, apg: 4.0, spg: 1.5, bpg: 0.2, fgPct: 42.0, threePct: 33.0, ftPct: 80.0 },
      { season: "2024-25", age: 21, league: "NCAA", team: "Gonzaga", gp: 35, gs: 35, mpg: 33.0, ppg: 9.4, rpg: 2.6, apg: 9.8, spg: 1.5, bpg: 0.2, fgPct: 48.0, threePct: 38.0, ftPct: 84.0, note: "Bob Cousy Award winner" },
      { season: "2025-26", age: 22, league: "NBA / G League", team: "Dallas / Texas Legends", gp: 30, gs: 0, mpg: 10.0, ppg: 3.5, rpg: 1.5, apg: 2.5, spg: 0.6, bpg: 0.1, fgPct: 42.0, threePct: 35.0, ftPct: 78.0 }
    ],
    medicalHistory: []
  },

  "Mychal Mulder": {
    bio: { position: "Guard", height: "6'4\"", weight: "182 lbs", age: 31, hometown: "Windsor, ON", draft: "Undrafted (2018)", college: "Vincennes / Kentucky" },
    careerStats: [
      { season: "2016-17", age: 22, league: "NCAA", team: "Kentucky", gp: 36, gs: 0, mpg: 14.5, ppg: 5.5, rpg: 1.5, apg: 0.8, spg: 0.3, bpg: 0.1, fgPct: 38.0, threePct: 38.0, ftPct: 80.0 },
      { season: "2019-20", age: 25, league: "NBA", team: "Golden State Warriors", gp: 18, gs: 3, mpg: 22.5, ppg: 9.5, rpg: 2.5, apg: 1.0, spg: 0.5, bpg: 0.1, fgPct: 42.0, threePct: 39.5, ftPct: 80.0 },
      { season: "2024-25", age: 30, league: "NBA / G League", team: "Multiple / EuroCup", gp: 40, gs: 10, mpg: 22.0, ppg: 11.0, rpg: 2.5, apg: 1.5, spg: 0.5, bpg: 0.1, fgPct: 42.0, threePct: 38.0, ftPct: 82.0 }
    ],
    medicalHistory: []
  }
};

// ===== Team Aggregate Stats (2025 CEBL Season) =====
const teamStats2025 = {
  "Brampton Honey Badgers": {
    abbrev: "BHB", color: "#D4AF37", bg: "#1a1500",
    record: { wins: 12, losses: 10, pct: .545 },
    stats: { ppg: 88.5, oppPpg: 85.2, rpg: 42.3, apg: 21.5, spg: 8.2, bpg: 4.5, fgPct: 46.8, threePct: 36.2, ftPct: 78.5, topg: 13.5 },
    leaders: { points: "Sean East II (25.3)", rebounds: "Prince Oduro (6.0)", assists: "Sean East II (5.8)" },
    roster: honeyBadgersRoster
  },
  "Calgary Surge": {
    abbrev: "CGY", color: "#E31837", bg: "#1a0005",
    record: { wins: 14, losses: 8, pct: .636 },
    stats: { ppg: 91.2, oppPpg: 86.5, rpg: 43.5, apg: 22.0, spg: 7.8, bpg: 5.0, fgPct: 47.5, threePct: 37.0, ftPct: 79.0, topg: 12.8 },
    leaders: { points: "Greg Brown III (18.0)", rebounds: "Greg Brown III (7.0)", assists: "Khyri Thomas (4.0)" }
  },
  "Edmonton Stingers": {
    abbrev: "EDM", color: "#FFB81C", bg: "#1a1500",
    record: { wins: 11, losses: 11, pct: .500 },
    stats: { ppg: 86.8, oppPpg: 87.0, rpg: 41.0, apg: 20.5, spg: 7.5, bpg: 4.2, fgPct: 45.5, threePct: 35.0, ftPct: 77.5, topg: 14.0 },
    leaders: { points: "Emmanuel Bandoumel (22.4)", rebounds: "Cameron McGriff (6.0)", assists: "Adika Peter-McNeilly (3.0)" }
  },
  "Montreal Alliance": {
    abbrev: "MTL", color: "#7B2D8E", bg: "#0d0011",
    record: { wins: 9, losses: 13, pct: .409 },
    stats: { ppg: 84.0, oppPpg: 87.5, rpg: 40.5, apg: 19.5, spg: 7.0, bpg: 3.8, fgPct: 44.0, threePct: 33.5, ftPct: 76.0, topg: 14.5 },
    leaders: { points: "Kevin Osawe (17.2)", rebounds: "Kevin Osawe (7.8)", assists: "Keeshawn Barthelemy (4.5)" }
  },
  "Niagara River Lions": {
    abbrev: "NIA", color: "#0066CC", bg: "#001122",
    record: { wins: 16, losses: 6, pct: .727 },
    stats: { ppg: 93.5, oppPpg: 84.0, rpg: 44.0, apg: 23.5, spg: 9.0, bpg: 5.5, fgPct: 49.0, threePct: 38.5, ftPct: 81.0, topg: 12.0 },
    leaders: { points: "Khalil Ahmad (22.0)", rebounds: "Elijah Lufile (10.6)", assists: "Ron Curry (4.0)" }
  },
  "Ottawa BlackJacks": {
    abbrev: "OTT", color: "#CC0000", bg: "#1a0000",
    record: { wins: 10, losses: 12, pct: .455 },
    stats: { ppg: 87.0, oppPpg: 88.5, rpg: 41.5, apg: 20.0, spg: 7.8, bpg: 4.0, fgPct: 45.0, threePct: 34.5, ftPct: 77.0, topg: 13.8 },
    leaders: { points: "Ja'Vonte Smart (25.9)", rebounds: "Isaih Moore (11.4)", assists: "Ja'Vonte Smart (5.0)" }
  },
  "Saskatoon Mamba": {
    abbrev: "SKM", color: "#00AA00", bg: "#001a00",
    record: { wins: 8, losses: 14, pct: .364 },
    stats: { ppg: 83.5, oppPpg: 89.0, rpg: 39.5, apg: 18.5, spg: 6.8, bpg: 3.5, fgPct: 43.5, threePct: 32.5, ftPct: 75.0, topg: 15.0 },
    leaders: { points: "Elijah Harkless (14.0)", rebounds: "Anthony Tsegakele (5.5)", assists: "Devonte Bandoo (3.0)" }
  },
  "Scarborough Shooting Stars": {
    abbrev: "SCA", color: "#1E90FF", bg: "#000d1a",
    record: { wins: 13, losses: 9, pct: .591 },
    stats: { ppg: 90.0, oppPpg: 86.0, rpg: 43.0, apg: 22.5, spg: 8.5, bpg: 5.0, fgPct: 47.0, threePct: 36.5, ftPct: 79.5, topg: 13.0 },
    leaders: { points: "Terquavion Smith (16.0)", rebounds: "Michael Foster Jr. (7.0)", assists: "Yuri Collins (7.0)" }
  },
  "Vancouver Bandits": {
    abbrev: "VAN", color: "#FF6B35", bg: "#1a0d00",
    record: { wins: 15, losses: 7, pct: .682 },
    stats: { ppg: 92.0, oppPpg: 85.5, rpg: 44.5, apg: 22.0, spg: 8.0, bpg: 5.2, fgPct: 48.5, threePct: 37.5, ftPct: 80.0, topg: 12.5 },
    leaders: { points: "Mitch Creek (22.0)", rebounds: "Tyrese Samuel (10.8)", assists: "Mitch Creek (4.0)" }
  },
  "Winnipeg Sea Bears": {
    abbrev: "WPG", color: "#003366", bg: "#000d1a",
    record: { wins: 12, losses: 10, pct: .545 },
    stats: { ppg: 89.0, oppPpg: 86.5, rpg: 42.0, apg: 21.0, spg: 8.0, bpg: 4.5, fgPct: 46.5, threePct: 36.0, ftPct: 78.0, topg: 13.2 },
    leaders: { points: "Xavier Moon (21.0)", rebounds: "Emmanuel Akot (5.8)", assists: "Xavier Moon (7.0)" }
  }
};
