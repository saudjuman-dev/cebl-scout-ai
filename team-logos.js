// ===== Team Logo Mapping =====
// CEBL logos from official CEBL CDN, NBA logos from ESPN CDN

const TEAM_LOGOS = {
  // ===== CEBL Teams =====
  "Brampton Honey Badgers": "https://irp.cdn-website.com/d8d53c44/dms3rep/multi/brampton-honey-badgers-logo.png",
  "Calgary Surge": "https://irp.cdn-website.com/d8d53c44/dms3rep/multi/calgary-surge-logo.png",
  "Edmonton Stingers": "https://irp-cdn.multiscreensite.com/d8d53c44/dms3rep/multi/EdmontonStingersLogo.png",
  "Montreal Alliance": "https://irp.cdn-website.com/d8d53c44/dms3rep/multi/MontrealAllianceLogo.png",
  "Niagara River Lions": "https://irp-cdn.multiscreensite.com/d8d53c44/dms3rep/multi/NiagaraRiverLionsLogo.png",
  "Ottawa BlackJacks": "https://irp-cdn.multiscreensite.com/d8d53c44/dms3rep/multi/OttawaBlackJacks-Logo-alt.png",
  // Saskatoon Mamba — rebranded Feb 2026, hosted on saskatoonmamba.ca's Duda CDN
  "Saskatoon Mamba": "https://lirp.cdn-website.com/6d469176/dms3rep/multi/opt/MambaMainWordmark_RapidPath_1200x630-1920w.png",
  "Saskatchewan Mamba": "https://lirp.cdn-website.com/6d469176/dms3rep/multi/opt/MambaMainWordmark_RapidPath_1200x630-1920w.png",
  "Saskatchewan Rattlers": "https://lirp.cdn-website.com/6d469176/dms3rep/multi/opt/MambaMainWordmark_RapidPath_1200x630-1920w.png",
  "Scarborough Shooting Stars": "https://irp.cdn-website.com/d8d53c44/dms3rep/multi/ScarboroughShootingStarsLogo.png",
  "Vancouver Bandits": "https://irp-cdn.multiscreensite.com/d8d53c44/dms3rep/multi/VancouverBanditsLogo.png",
  "Winnipeg Sea Bears": "https://irp.cdn-website.com/d8d53c44/dms3rep/multi/winnipeg-sea-bears-logos.png",

  // ===== NBA Teams =====
  "Oklahoma City Thunder": "https://a.espncdn.com/i/teamlogos/nba/500/okc.png",
  "Denver Nuggets": "https://a.espncdn.com/i/teamlogos/nba/500/den.png",
  "Toronto Raptors": "https://a.espncdn.com/i/teamlogos/nba/500/tor.png",
  "Houston Rockets": "https://a.espncdn.com/i/teamlogos/nba/500/hou.png",
  "Indiana Pacers": "https://a.espncdn.com/i/teamlogos/nba/500/ind.png",
  "Memphis Grizzlies": "https://a.espncdn.com/i/teamlogos/nba/500/mem.png",
  "Minnesota Timberwolves": "https://a.espncdn.com/i/teamlogos/nba/500/min.png",
  "Cleveland Cavaliers": "https://a.espncdn.com/i/teamlogos/nba/500/cle.png",
  "Sacramento Kings": "https://a.espncdn.com/i/teamlogos/nba/500/sac.png",
  "Dallas Mavericks": "https://a.espncdn.com/i/teamlogos/nba/500/dal.png",
  "Atlanta Hawks": "https://a.espncdn.com/i/teamlogos/nba/500/atl.png",

  // ===== European / International Teams =====
  "Fenerbahce": "https://a.espncdn.com/i/teamlogos/soccer/500/88.png",
  "FC Bayern Munich": "https://a.espncdn.com/i/teamlogos/soccer/500/132.png",
  "Olympiacos": "https://a.espncdn.com/i/teamlogos/soccer/500/400.png",
  "Real Madrid": "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
  "Zalgiris Kaunas": "https://upload.wikimedia.org/wikipedia/en/thumb/0/06/BC_Zalgiris_logo.svg/120px-BC_Zalgiris_logo.svg.png",
  "Reyer Venezia": "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Reyer_Venezia_logo.svg/120px-Reyer_Venezia_logo.svg.png"
};

// Helper: get team logo URL or return null
function getTeamLogo(teamName) {
  if (!teamName) return null;
  // Exact match
  if (TEAM_LOGOS[teamName]) return TEAM_LOGOS[teamName];
  // Partial match (for abbreviated names like "Edmonton" → "Edmonton Stingers")
  const keys = Object.keys(TEAM_LOGOS);
  const match = keys.find(k => k.toLowerCase().includes(teamName.toLowerCase()) || teamName.toLowerCase().includes(k.toLowerCase()));
  return match ? TEAM_LOGOS[match] : null;
}

// Helper: render team logo as img tag with fallback to colored dot
function teamLogoHTML(teamName, size, fallbackColor) {
  size = size || 24;
  const url = getTeamLogo(teamName);
  if (url) {
    return `<img src="${url}" alt="${teamName}" class="team-logo-img" style="width:${size}px;height:${size}px" onerror="this.style.display='none';this.nextElementSibling.style.display='inline-block'" loading="lazy"><span class="team-dot-lg" style="background:${fallbackColor || '#555'};display:none"></span>`;
  }
  return fallbackColor ? `<span class="team-dot-lg" style="background:${fallbackColor}"></span>` : '';
}

// Helper: render team logo for signing sections (larger, with background)
function teamLogoBadge(teamName, emoji, color, bg) {
  const url = getTeamLogo(teamName);
  if (url) {
    return `<div class="signing-team-logo" style="background:${bg};border:1px solid ${color};padding:2px"><img src="${url}" alt="${teamName}" style="width:28px;height:28px;object-fit:contain" onerror="this.parentElement.textContent='${emoji}'" loading="lazy"></div>`;
  }
  return `<div class="signing-team-logo" style="background:${bg};border:1px solid ${color}">${emoji}</div>`;
}
