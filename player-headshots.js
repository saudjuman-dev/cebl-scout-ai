// ===== Player Headshot Mapping =====
// NBA headshots from ESPN CDN, CEBL/Euro from various sources

const PLAYER_HEADSHOTS = {
  // ===== NBA Players (ESPN CDN) =====
  "Shai Gilgeous-Alexander": "https://a.espncdn.com/i/headshots/nba/players/full/4278073.png",
  "Jamal Murray": "https://a.espncdn.com/i/headshots/nba/players/full/3936299.png",
  "RJ Barrett": "https://a.espncdn.com/i/headshots/nba/players/full/4395625.png",
  "Dillon Brooks": "https://a.espncdn.com/i/headshots/nba/players/full/3155526.png",
  "Luguentz Dort": "https://a.espncdn.com/i/headshots/nba/players/full/4397020.png",
  "Andrew Nembhard": "https://a.espncdn.com/i/headshots/nba/players/full/4395712.png",
  "Bennedict Mathurin": "https://a.espncdn.com/i/headshots/nba/players/full/4683634.png",
  "Zach Edey": "https://a.espncdn.com/i/headshots/nba/players/full/4600663.png",
  "Nickeil Alexander-Walker": "https://a.espncdn.com/i/headshots/nba/players/full/4278039.png",
  "Kelly Olynyk": "https://a.espncdn.com/i/headshots/nba/players/full/2489663.png",
  "Brandon Clarke": "https://a.espncdn.com/i/headshots/nba/players/full/3906665.png",
  "Trey Lyles": "https://a.espncdn.com/i/headshots/nba/players/full/3136196.png",
  "Dalano Banton": "https://a.espncdn.com/i/headshots/nba/players/full/4397885.png",
  "Dwight Powell": "https://a.espncdn.com/i/headshots/nba/players/full/2531367.png",
  "Oshae Brissett": "https://a.espncdn.com/i/headshots/nba/players/full/4278031.png",
  "Dyson Daniels": "https://a.espncdn.com/i/headshots/nba/players/full/4869342.png",
  "Caleb Houstan": "https://a.espncdn.com/i/headshots/nba/players/full/4433623.png",
  "Eugene Omoruyi": "https://a.espncdn.com/i/headshots/nba/players/full/4066410.png",

  // ===== G League Players (ESPN CDN - same IDs) =====
  "Olivier-Maxence Prosper": "https://a.espncdn.com/i/headshots/nba/players/full/4595400.png",
  "Leonard Miller": "https://a.espncdn.com/i/headshots/nba/players/full/5044385.png",
  "Josh Primo": "https://a.espncdn.com/i/headshots/nba/players/full/4576085.png",

  // ===== European Players (ESPN CDN - former NBA) =====
  "Chris Boucher": "https://a.espncdn.com/i/headshots/nba/players/full/3078576.png",
  "Khem Birch": "https://a.espncdn.com/i/headshots/nba/players/full/2580782.png",
  "Cory Joseph": "https://a.espncdn.com/i/headshots/nba/players/full/6446.png",
  "Ignas Brazdeikis": "https://a.espncdn.com/i/headshots/nba/players/full/4397205.png",
  "Mfiondu Kabengele": "https://a.espncdn.com/i/headshots/nba/players/full/4277956.png",
  "Kyle Wiltjer": "https://a.espncdn.com/i/headshots/nba/players/full/2581029.png",
  "Kevin Pangos": "https://a.espncdn.com/i/headshots/nba/players/full/3948153.png",
  "Mychal Mulder": "https://a.espncdn.com/i/headshots/nba/players/full/3936298.png",
  "Nate Darling": "https://a.espncdn.com/i/headshots/nba/players/full/4397002.png",
  "Xavier Rathan-Mayes": "https://a.espncdn.com/i/headshots/nba/players/full/3134881.png",
  "Simi Shittu": "https://a.espncdn.com/i/headshots/nba/players/full/4395651.png",
  "AJ Lawson": "https://a.espncdn.com/i/headshots/nba/players/full/4432809.png",

  // ===== CEBL Players =====
  "Karim Mane": "https://a.espncdn.com/i/headshots/nba/players/full/4432528.png",
  "Ryan Nembhard": "https://a.espncdn.com/i/headshots/nba/players/full/4433629.png",

  // ===== CEBL / Elam Ending Players (non-pipeline, from game data) =====
  "Cat Barber": "https://a.espncdn.com/i/headshots/nba/players/full/3138154.png"
};

// Helper: get player headshot URL or null
function getPlayerHeadshot(name) {
  if (!name) return null;
  if (PLAYER_HEADSHOTS[name]) return PLAYER_HEADSHOTS[name];
  // Partial match fallback
  const keys = Object.keys(PLAYER_HEADSHOTS);
  const match = keys.find(k => k.toLowerCase() === name.toLowerCase());
  return match ? PLAYER_HEADSHOTS[match] : null;
}

// Helper: render player avatar with headshot or fallback to initials
function playerAvatar(name, cssClass, size) {
  cssClass = cssClass || 'player-avatar';
  size = size || null;
  const url = getPlayerHeadshot(name);
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??';
  const sizeStyle = size ? `width:${size}px;height:${size}px;` : '';

  if (url) {
    return `<div class="${cssClass} has-headshot" ${sizeStyle ? `style="${sizeStyle}"` : ''}>` +
      `<img src="${url}" alt="${name}" class="headshot-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy">` +
      `<span class="headshot-fallback" style="display:none">${initials}</span>` +
    `</div>`;
  }
  return `<div class="${cssClass}" ${sizeStyle ? `style="${sizeStyle}"` : ''}>${initials}</div>`;
}
