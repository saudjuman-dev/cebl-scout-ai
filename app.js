// ===== CEBL Scout - Application Logic =====

// Tab switching with feature gating
function switchTab(tabId) {
  // Check if this is a premium feature
  if (!AUTH.canAccessFeature(tabId)) {
    showFeatureGate(tabId);
    return;
  }

  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Animate stat counters with ease-out + thousand-separators (cinematic)
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count')) || 0;
    if (!target) return;
    const fmt = (n) => Math.round(n).toLocaleString();
    const duration = 1100;        // ms
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic — fast start, gentle finish
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(tick);
  });
}

// Get initials from name
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// Get headshot inner content (img with fallback to initials) for use inside existing avatar divs
function avatarContent(name) {
  if (typeof getPlayerHeadshot === 'function') {
    const url = getPlayerHeadshot(name);
    if (url) {
      const initials = getInitials(name);
      return `<img src="${url}" alt="${name}" class="headshot-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy"><span class="headshot-fallback" style="display:none">${initials}</span>`;
    }
  }
  return getInitials(name);
}

// ===== Get the user's home-team roster (team-aware) =====
function getHomeTeamRoster() {
  const homeTeamId = (typeof ONBOARDING !== 'undefined') ? ONBOARDING.getHomeTeam() : null;
  const teamMeta = homeTeamId && typeof ONBOARDING !== 'undefined'
    ? ONBOARDING.CEBL_TEAMS.find(t => t.id === homeTeamId) : null;

  // Brampton: rich data from honeyBadgersRoster (per-game salary, character notes)
  if (!teamMeta || teamMeta.id === 'brampton') {
    return {
      teamName: 'Brampton Honey Badgers',
      emoji: '🦡',
      isFullData: true,
      players: typeof honeyBadgersRoster !== 'undefined' ? honeyBadgersRoster : []
    };
  }

  // Other teams: pull from leagueSignings (announcement-style data)
  const signings = typeof leagueSignings !== 'undefined' ? leagueSignings[teamMeta.name] : null;
  if (!signings) {
    return { teamName: teamMeta.name, emoji: teamMeta.emoji, isFullData: false, players: [] };
  }

  return {
    teamName: teamMeta.name,
    emoji: teamMeta.emoji,
    isFullData: false,
    players: signings.players.map(p => ({
      name: p.name,
      pos: p.pos,
      nationality: '',
      type: p.type,
      stats: p.detail,
      note: p.detail,
      salary: null
    }))
  };
}

// ===== Render Home Team Roster (was "renderHBRoster") =====
function renderHBRoster() {
  const container = document.getElementById('hb-roster');
  if (!container) return;
  const roster = getHomeTeamRoster();

  // Update the panel header to show the user's team name
  const headerH2 = container.parentElement?.querySelector('.panel-header h2');
  if (headerH2) headerH2.innerHTML = `${roster.emoji} ${roster.teamName} — 2026 Confirmed Roster`;
  const yourTeamBadge = container.parentElement?.querySelector('.badge.gold');
  if (yourTeamBadge) yourTeamBadge.textContent = 'Your Team';

  if (!roster.players || roster.players.length === 0) {
    container.innerHTML = `<div class="empty-roster">No 2026 signings on file for ${roster.teamName} yet.<br><span style="opacity:0.7">Check the League Signings tab for the latest league-wide moves.</span></div>`;
    return;
  }

  container.innerHTML = roster.players.map(p => {
    const natLabel = p.nationality === 'CAN' ? '🇨🇦 Canadian'
                  : p.nationality === 'USA' ? '🇺🇸 Import'
                  : p.nationality ? '🌍 Import (' + p.nationality + ')'
                  : (p.type || 'Signing');
    const salaryStr = p.salary ? ' | $' + p.salary + '/game' : '';
    const statsStr = p.stats ? (p.stats.split('(')[0].trim() || p.stats) : '';
    return `
      <div class="roster-card">
        <div class="roster-avatar has-headshot">${avatarContent(p.name)}</div>
        <div class="roster-card-info">
          <h4>${p.name}</h4>
          <div class="roster-meta">${p.pos || ''} | ${natLabel}${salaryStr}</div>
          <div class="roster-stat">${statsStr}</div>
        </div>
      </div>`;
  }).join('');
}

// ===== Animate Cap Bar =====
function animateCapBar() {
  const totalUsed = honeyBadgersRoster.reduce((sum, p) => sum + p.salary, 0);
  const pct = Math.min(100, (totalUsed / CEBL_CONFIG.perGameCap) * 100);

  setTimeout(() => {
    document.getElementById('cap-fill').style.width = pct + '%';
    document.getElementById('cap-used-label').textContent = '$' + totalUsed.toLocaleString() + ' used';
  }, 500);

  const details = document.getElementById('cap-details');
  const canadians = honeyBadgersRoster.filter(p => p.nationality === 'CAN');
  const imports = honeyBadgersRoster.filter(p => p.nationality !== 'CAN');
  const remaining = CEBL_CONFIG.perGameCap - totalUsed;

  details.innerHTML = `
    <div class="cap-detail-item"><span class="cdl">Roster Size</span><span class="cdv">${honeyBadgersRoster.length} / 14</span></div>
    <div class="cap-detail-item"><span class="cdl">Canadians</span><span class="cdv">${canadians.length} / 6+ min</span></div>
    <div class="cap-detail-item"><span class="cdl">Imports</span><span class="cdv">${imports.length} / 5 max</span></div>
    <div class="cap-detail-item"><span class="cdl">Cap Used</span><span class="cdv">$${totalUsed.toLocaleString()}</span></div>
    <div class="cap-detail-item"><span class="cdl">Cap Remaining</span><span class="cdv" style="color: ${remaining > 0 ? '#81C784' : '#EF9A9A'}">$${remaining.toLocaleString()}</span></div>
    <div class="cap-detail-item"><span class="cdl">Spots Open</span><span class="cdv">${14 - honeyBadgersRoster.length}</span></div>
  `;
}

// ===== Render Scout Targets =====
function renderScoutTargets() {
  const container = document.getElementById('scout-targets');
  container.innerHTML = scoutTargets.map(t => `
    <div class="scout-card">
      <div class="scout-card-top">
        <div class="scout-avatar has-headshot">${avatarContent(t.name)}</div>
        <div>
          <div class="scout-name">${t.name}</div>
          <div class="scout-detail">${t.pos} | ${t.from}</div>
        </div>
      </div>
      <div class="scout-stats">
        <div class="scout-stat-item"><div class="scout-stat-val">${t.ppg}</div><div class="scout-stat-lbl">PPG</div></div>
        <div class="scout-stat-item"><div class="scout-stat-val">${t.rpg}</div><div class="scout-stat-lbl">RPG</div></div>
        <div class="scout-stat-item"><div class="scout-stat-val">${t.apg}</div><div class="scout-stat-lbl">APG</div></div>
      </div>
      <div class="scout-tags">
        <span class="scout-tag fit-${t.fit.toLowerCase()}">${t.fit} Fit</span>
        <span class="scout-tag ${t.type === 'Canadian' ? 'canadian' : ''}">${t.type === 'Canadian' ? '🇨🇦 Canadian' : '🌍 Import'}</span>
        ${t.tags.map(tag => `<span class="scout-tag">${tag}</span>`).join('')}
      </div>
      <div class="scout-salary"><span>Est. Salary</span><span class="scout-salary-val">${t.salary}</span></div>
      <p style="font-size:0.6875rem; color: var(--gray); margin-top: 0.5rem;">${t.reason}</p>
    </div>
  `).join('');
}

// ===== Mobile Card Helper =====
function mobileCard(avatar, name, sub, stats, tags, note, searchStr, dataAttrs) {
  const attrs = dataAttrs ? Object.entries(dataAttrs).map(([k,v]) => `data-${k}="${v}"`).join(' ') : '';
  return `<div class="mobile-card" data-search="${(searchStr||name+' '+sub+' '+(note||'')).toLowerCase()}" ${attrs}>
    <div class="mobile-card-header">
      <div class="player-avatar has-headshot">${avatar}</div>
      <div class="mc-info">
        <div class="mc-name">${name}</div>
        <div class="mc-meta">${sub}</div>
      </div>
    </div>
    <div class="mc-stats">${stats.map(s => `<div><div class="mc-stat-val">${s.v}</div><div class="mc-stat-lbl">${s.l}</div></div>`).join('')}</div>
    <div class="mc-details">${tags.map(t => `<span class="mc-tag ${t.cls||''}">${t.text}</span>`).join('')}</div>
    ${note ? `<div class="mc-note">${note}</div>` : ''}
  </div>`;
}

// ===== Render Pro Canadians Table =====
function renderProTable() {
  const tbody = document.getElementById('pro-tbody');
  tbody.innerHTML = canadiansPro.map(p => `
    <tr data-search="${(p.name + ' ' + p.team + ' ' + p.league + ' ' + p.hometown + ' ' + p.note).toLowerCase()}" data-league="${p.league}" data-pos="${p.pos.charAt(0)}" data-fit="${p.fit}">
      <td><div class="player-cell"><div class="player-avatar has-headshot">${avatarContent(p.name)}</div><div><div class="player-name">${p.name}</div><div style="font-size:0.625rem; color: var(--gray)">${p.hometown}</div></div></div></td>
      <td>${p.pos}</td><td>${p.age}</td><td>${p.ht}</td><td>${p.team}</td><td>${p.league}</td>
      <td><strong>${p.ppg}</strong></td><td>${p.rpg}</td><td>${p.apg}</td>
      <td><span class="fit-badge fit-${p.fit.toLowerCase()}">${p.fit}</span></td>
      <td style="color: var(--gold); font-weight: 600">${p.salary}</td>
      <td><span class="character-badge char-${p.character.toLowerCase() === 'good' ? 'good' : 'neutral'}">${p.character === 'Good' ? '✓ ' : ''}${p.character}</span></td>
      <td style="font-size:0.6875rem">${p.agent || ''}</td>
    </tr>
  `).join('');

  const mc = document.getElementById('pro-mobile-cards');
  if (mc) mc.innerHTML = canadiansPro.map(p => mobileCard(
    avatarContent(p.name), p.name,
    `${p.pos} | ${p.ht} | ${p.hometown}`,
    [{v:p.ppg,l:'PPG'},{v:p.rpg,l:'RPG'},{v:p.apg,l:'APG'}],
    [{text: p.fit + ' Fit', cls: 'fit-' + p.fit.toLowerCase()},{text: p.salary, cls: 'gold'},{text: p.team},{text: '🇨🇦 ' + p.league}].concat(p.agent ? [{text: '🤝 ' + p.agent, cls: 'agent-tag'}] : []),
    p.note,
    p.name + ' ' + p.team + ' ' + p.league + ' ' + p.hometown + ' ' + p.note,
    {league: p.league, pos: p.pos.charAt(0), fit: p.fit}
  )).join('');
}

// ===== Render NCAA Table =====
function renderNCAA() {
  const tbody = document.getElementById('ncaa-tbody');
  tbody.innerHTML = ncaaCanadians.map(p => `
    <tr data-search="${(p.name + ' ' + p.school + ' ' + p.conf + ' ' + p.hometown + ' ' + p.note).toLowerCase()}" data-pos="${p.pos.charAt(0)}" data-class="${p.classYear}" data-fit="${p.fit}">
      <td><div class="player-cell"><div class="player-avatar has-headshot">${avatarContent(p.name)}</div><div><div class="player-name">${p.name}</div><div style="font-size:0.625rem; color: var(--gray)">${p.hometown}</div></div></div></td>
      <td>${p.pos}</td><td>${p.ht}</td><td><strong>${p.school}</strong></td><td>${p.conf}</td><td>${p.classYear}</td><td>${p.hometown}</td>
      <td><strong>${p.ppg}</strong></td><td>${p.rpg}</td><td>${p.apg}</td>
      <td><span class="fit-badge fit-${p.fit.toLowerCase()}">${p.fit}</span></td>
      <td style="font-size:0.6875rem">${p.draftEligible}</td>
    </tr>
  `).join('');

  const mc = document.getElementById('ncaa-mobile-cards');
  if (mc) mc.innerHTML = ncaaCanadians.map(p => mobileCard(
    avatarContent(p.name), p.name,
    `${p.pos} | ${p.ht} | ${p.classYear}`,
    [{v:p.ppg,l:'PPG'},{v:p.rpg,l:'RPG'},{v:p.apg,l:'APG'}],
    [{text: p.fit + ' Fit', cls: 'fit-' + p.fit.toLowerCase()},{text: p.school},{text: p.conf},{text: '🇨🇦 ' + p.hometown}],
    p.note + ' | Draft: ' + p.draftEligible
  )).join('');
}

// ===== Render Import Table =====
function renderImports() {
  const tbody = document.getElementById('import-tbody');
  tbody.innerHTML = importTargets.map(p => `
    <tr data-search="${(p.name + ' ' + (p.nationality||'') + ' ' + p.team + ' ' + p.league + ' ' + p.note).toLowerCase()}" data-nat="${p.nationality}" data-pos="${p.pos.charAt(0)}" data-fit="${p.fit}">
      <td><div class="player-cell"><div class="player-avatar has-headshot">${avatarContent(p.name)}</div><div class="player-name">${p.name}</div></div></td>
      <td>${p.nationality === 'USA' ? '🇺🇸 USA' : p.nationality === 'CAN/FRA' ? '🇨🇦🇫🇷 CAN/FRA' : p.nationality === 'NZL' ? '🇳🇿 NZL' : p.nationality === 'BRB' ? '🇧🇧 BRB' : '🌍 ' + p.nationality}</td>
      <td>${p.pos}</td><td>${p.age || '-'}</td><td>${p.ht || '-'}</td><td>${p.team}</td><td>${p.league}</td>
      <td><strong>${p.ppg}</strong></td><td>${p.rpg}</td><td>${p.apg}</td>
      <td><span class="fit-badge fit-${p.fit.toLowerCase()}">${p.fit}</span></td>
      <td style="color: var(--gold); font-weight: 600">${p.salary}</td>
      <td style="font-size:0.6875rem; max-width: 200px; white-space: normal;">${p.note}</td>
      <td style="font-size:0.6875rem">${p.agent || ''}</td>
    </tr>
  `).join('');

  const mc = document.getElementById('import-mobile-cards');
  if (mc) mc.innerHTML = importTargets.map(p => {
    const flag = p.nationality === 'USA' ? '🇺🇸' : p.nationality === 'NZL' ? '🇳🇿' : p.nationality === 'AUS' ? '🇦🇺' : p.nationality === 'BRB' ? '🇧🇧' : '🌍';
    return mobileCard(
      avatarContent(p.name), p.name,
      `${flag} ${p.nationality} | ${p.pos} | ${p.ht || ''}`,
      [{v:p.ppg,l:'PPG'},{v:p.rpg,l:'RPG'},{v:p.apg,l:'APG'}],
      [{text: p.fit + ' Fit', cls: 'fit-' + p.fit.toLowerCase()},{text: p.salary, cls: 'gold'},{text: p.team},{text: p.league}].concat(p.agent ? [{text: '🤝 ' + p.agent, cls: 'agent-tag'}] : []),
      p.note
    );
  }).join('');
}

// ===== Render Signings =====
function renderSignings() {
  const container = document.getElementById('signings-grid');
  container.innerHTML = Object.entries(leagueSignings).map(([team, data]) => `
    <div class="signing-team-section" data-team="${team}">
      <div class="signing-team-header" onclick="this.parentElement.classList.toggle('collapsed')" style="border-left: 4px solid ${data.color}">
        ${typeof teamLogoBadge === 'function' ? teamLogoBadge(team, data.emoji, data.color, data.bg) : `<div class="signing-team-logo" style="background: ${data.bg}; border: 1px solid ${data.color}">${data.emoji}</div>`}
        <span class="signing-team-name ${team === 'Brampton Honey Badgers' ? 'hb' : ''}">${team}</span>
        <span class="signing-team-count">${data.players.length} player${data.players.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="signing-players">
        ${data.players.map(p => `
          <div class="signing-player" data-player-name="${p.name}">
            <div class="sp-avatar has-headshot">${avatarContent(p.name)}</div>
            <div class="sp-info">
              <div class="sp-name">${p.name}</div>
              <div class="sp-meta">${p.pos} | ${p.detail}</div>
            </div>
            <span class="sp-type ${p.type.includes('New') ? 'type-new' : p.type.includes('Re') ? 'type-re' : 'type-draft'}">${p.type}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ===== Filter Tables =====
function filterElements(els, matchFn) {
  els.forEach(el => { el.style.display = matchFn(el) ? '' : 'none'; });
}

function filterTable(type) {
  if (type === 'pro') {
    const searchVal = document.getElementById('pro-search').value.toLowerCase();
    const league = document.getElementById('pro-league-filter').value;
    const pos = document.getElementById('pro-position-filter').value;
    const fit = document.getElementById('pro-fit-filter').value;
    const matchFn = el => {
      const elLeague = (el.getAttribute('data-league')||'').toLowerCase();
      return (el.getAttribute('data-search')||'').includes(searchVal)
        && (!league || elLeague.includes(league.toLowerCase()))
        && (!pos || el.getAttribute('data-pos') === pos)
        && (!fit || el.getAttribute('data-fit') === fit);
    };
    filterElements(document.querySelectorAll('#pro-tbody tr'), matchFn);
    filterElements(document.querySelectorAll('#pro-mobile-cards .mobile-card'), matchFn);
  } else if (type === 'ncaa') {
    const searchVal = document.getElementById('ncaa-search').value.toLowerCase();
    const pos = document.getElementById('ncaa-position-filter').value;
    const cls = document.getElementById('ncaa-class-filter').value;
    const fit = document.getElementById('ncaa-fit-filter').value;
    const matchFn = el => {
      return (el.getAttribute('data-search')||'').includes(searchVal)
        && (!pos || el.getAttribute('data-pos') === pos)
        && (!cls || el.getAttribute('data-class') === cls)
        && (!fit || el.getAttribute('data-fit') === fit);
    };
    filterElements(document.querySelectorAll('#ncaa-tbody tr'), matchFn);
    filterElements(document.querySelectorAll('#ncaa-mobile-cards .mobile-card'), matchFn);
  } else if (type === 'import') {
    const searchVal = document.getElementById('import-search').value.toLowerCase();
    const nat = document.getElementById('import-nat-filter').value;
    const pos = document.getElementById('import-position-filter').value;
    const matchFn = el => {
      return (el.getAttribute('data-search')||'').includes(searchVal)
        && (!nat || el.getAttribute('data-nat') === nat)
        && (!pos || el.getAttribute('data-pos') === pos);
    };
    filterElements(document.querySelectorAll('#import-tbody tr'), matchFn);
    filterElements(document.querySelectorAll('#import-mobile-cards .mobile-card'), matchFn);
  } else if (type === 'sign') {
    const sections = document.querySelectorAll('.signing-team-section');
    const searchVal = document.getElementById('sign-search').value.toLowerCase();
    const team = document.getElementById('sign-team-filter').value;
    sections.forEach(section => {
      const teamName = section.getAttribute('data-team');
      const teamMatch = !team || teamName === team;
      const textMatch = !searchVal || teamName.toLowerCase().includes(searchVal) || section.textContent.toLowerCase().includes(searchVal);
      section.style.display = (teamMatch && textMatch) ? '' : 'none';
    });
  }
}

// ===== Cap Calculator =====
function getDefaultSlots() {
  const slots = [];
  honeyBadgersRoster.forEach((p, i) => {
    slots.push({ num: i + 1, name: p.name, type: p.type, salary: p.salary });
  });
  for (let i = honeyBadgersRoster.length; i < 12; i++) {
    slots.push({ num: i + 1, name: '', type: 'TBD', salary: 400 });
  }
  return slots;
}

function renderCalcSlots(slots) {
  const container = document.getElementById('calc-slots');
  container.innerHTML = slots.map((s, i) => `
    <div class="calc-slot">
      <span class="calc-slot-num">${s.num}</span>
      <input type="text" value="${s.name}" placeholder="Player name..." onchange="updateCalc()" data-idx="${i}">
      <select onchange="updateCalc()" data-idx="${i}">
        <option ${s.type === 'Canadian' ? 'selected' : ''}>Canadian</option>
        <option ${s.type === 'Import' ? 'selected' : ''}>Import</option>
        <option ${s.type === 'Dev (Off-Cap)' ? 'selected' : ''}>Dev (Off-Cap)</option>
        <option ${s.type === 'Designated' ? 'selected' : ''}>Designated</option>
        <option ${s.type === 'TBD' ? 'selected' : ''}>TBD</option>
      </select>
      <input type="range" min="400" max="1500" step="50" value="${s.salary}" oninput="this.title='$'+this.value+'/game'; updateCalc()" title="$${s.salary}/game" data-idx="${i}">
    </div>
  `).join('');
}

function renderCapCalculator() {
  // Try loading user's last auto-saved build
  let slots = getDefaultSlots();
  if (typeof USER_DATA !== 'undefined') {
    const autosave = USER_DATA.loadRosterBuild('__autosave');
    if (autosave && autosave.slots && autosave.slots.length > 0) {
      slots = autosave.slots;
    }
  }
  renderCalcSlots(slots);
  renderSavedBuilds();
  updateCalc();
}

function getCurrentCalcSlots() {
  const names = document.querySelectorAll('.calc-slot input[type="text"]');
  const selects = document.querySelectorAll('.calc-slot select');
  const sliders = document.querySelectorAll('.calc-slot input[type="range"]');
  const slots = [];
  names.forEach((el, i) => {
    slots.push({
      num: i + 1,
      name: el.value,
      type: selects[i].value,
      salary: parseInt(sliders[i].value)
    });
  });
  return slots;
}

function updateCalc() {
  const sliders = document.querySelectorAll('.calc-slot input[type="range"]');
  const selects = document.querySelectorAll('.calc-slot select');
  let total = 0;
  sliders.forEach((slider, i) => {
    const type = selects[i].value;
    if (type !== 'Dev (Off-Cap)' && type !== 'Designated') {
      total += parseInt(slider.value);
    }
  });
  const remaining = CEBL_CONFIG.perGameCap - total;
  document.getElementById('calc-total-value').textContent = '$' + total.toLocaleString();
  document.getElementById('calc-remaining-value').textContent = '$' + remaining.toLocaleString();
  document.getElementById('calc-remaining-value').style.color = remaining >= 0 ? '#81C784' : '#EF9A9A';
  document.getElementById('calc-bar-fill').style.width = Math.min(100, (total / CEBL_CONFIG.perGameCap) * 100) + '%';

  // Auto-save current build for this user
  if (typeof USER_DATA !== 'undefined') {
    USER_DATA.saveRosterBuild('__autosave', getCurrentCalcSlots());
  }
}

// Save/Load Roster Builds
function saveCurrentBuild() {
  if (typeof USER_DATA === 'undefined') return;
  const name = prompt('Name this roster build:');
  if (!name || !name.trim()) return;
  USER_DATA.saveRosterBuild(name.trim(), getCurrentCalcSlots());
  renderSavedBuilds();
}

function loadBuild(name) {
  if (typeof USER_DATA === 'undefined') return;
  const build = USER_DATA.loadRosterBuild(name);
  if (!build || !build.slots) return;
  renderCalcSlots(build.slots);
  updateCalc();
}

function deleteBuild(name) {
  if (typeof USER_DATA === 'undefined') return;
  USER_DATA.deleteRosterBuild(name);
  renderSavedBuilds();
}

function resetToDefault() {
  renderCalcSlots(getDefaultSlots());
  updateCalc();
}

function renderSavedBuilds() {
  const container = document.getElementById('saved-builds');
  if (!container || typeof USER_DATA === 'undefined') return;

  const builds = USER_DATA.getAllRosterBuilds();
  const buildNames = Object.keys(builds).filter(n => n !== '__autosave');

  if (buildNames.length === 0) {
    container.innerHTML = '<p class="no-builds">No saved builds yet. Build a roster above and click "Save Build" to save it.</p>';
    return;
  }

  container.innerHTML = buildNames.map(name => {
    const b = builds[name];
    const filled = b.slots.filter(s => s.name).length;
    const total = b.slots.reduce((sum, s) => {
      return (s.type !== 'Dev (Off-Cap)' && s.type !== 'Designated') ? sum + s.salary : sum;
    }, 0);
    const savedDate = new Date(b.savedAt).toLocaleDateString();
    return `
      <div class="saved-build-card">
        <div class="sb-info">
          <div class="sb-name">${name}</div>
          <div class="sb-meta">${filled} players | $${total.toLocaleString()}/game | Saved ${savedDate}</div>
        </div>
        <div class="sb-actions">
          <button class="sb-btn load" onclick="loadBuild('${name.replace(/'/g, "\\'")}')">Load</button>
          <button class="sb-btn delete" onclick="deleteBuild('${name.replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

// ===== Team Filter =====
function filterByTeam(team) {
  document.querySelectorAll('.team-chip').forEach(c => c.classList.remove('active'));
  document.querySelector(`.team-chip[data-team="${team}"]`).classList.add('active');
  if (team === 'all') { switchTab('dashboard'); return; }
  switchTab('signings');
  document.getElementById('sign-team-filter').value = team;
  filterTable('sign');
}

// ===== Player Profile Modal =====
function openPlayerModal(playerName) {
  // Player profiles are now FREE for all users (basic bio + career stats).
  // Medical history & deep advanced metrics remain premium-gated within the modal.
  const data = playerCareerStats[playerName];
  const modal = document.getElementById('player-modal');
  const content = document.getElementById('player-modal-content');

  if (!data) {
    content.innerHTML = `
      <div class="no-profile">
        <h3>${playerName}</h3>
        <p class="np-status">Verified career profile coming soon.</p>
        <p class="np-detail">We only publish career stats once verified against official sources (CEBL.ca, EuroBasket, NCAA, team press releases). Below is what we have on file from EuroBasket if available.</p>
        <div id="eurobasket-injection"></div>
      </div>`;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    if (typeof injectEuroBasketDataIntoModal === 'function') {
      injectEuroBasketDataIntoModal(playerName);
    }
    return;
  }

  const bio = data.bio;
  const stats = data.careerStats;
  const medical = data.medicalHistory || [];

  // Calculate career averages
  const totalGP = stats.reduce((s, r) => s + r.gp, 0);
  const avgPPG = (stats.reduce((s, r) => s + r.ppg * r.gp, 0) / totalGP).toFixed(1);
  const avgRPG = (stats.reduce((s, r) => s + r.rpg * r.gp, 0) / totalGP).toFixed(1);
  const avgAPG = (stats.reduce((s, r) => s + r.apg * r.gp, 0) / totalGP).toFixed(1);
  const avgSPG = (stats.reduce((s, r) => s + r.spg * r.gp, 0) / totalGP).toFixed(1);

  const initials = playerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Sparkline — PPG trend across career
  const ppgSeries = stats.map(s => s.ppg).filter(v => typeof v === 'number');
  const sparkHtml = ppgSeries.length >= 2 ? `
    <div class="sparkline-row">
      <span style="color:var(--gold);font-weight:600">PPG trend:</span>
      ${renderSparkline(ppgSeries, { w: 90, h: 24 })}
      <span>${ppgSeries[0].toFixed(1)} → ${ppgSeries[ppgSeries.length-1].toFixed(1)}</span>
    </div>` : '';

  content.innerHTML = `
    <div class="pm-header">
      <div class="pm-avatar has-headshot">${avatarContent(playerName)}</div>
      <div class="pm-info">
        <h2>${playerName}</h2>
        <div class="pm-bio-row">
          <span class="pm-bio-item"><strong>Position:</strong> <span class="pm-val">${bio.position}</span></span>
          <span class="pm-bio-item"><strong>Height:</strong> <span class="pm-val">${bio.height}</span></span>
          ${bio.weight ? `<span class="pm-bio-item"><strong>Weight:</strong> <span class="pm-val">${bio.weight}</span></span>` : ''}
          <span class="pm-bio-item"><strong>Age:</strong> <span class="pm-val">${bio.age}</span></span>
          <span class="pm-bio-item"><strong>Hometown:</strong> <span class="pm-val">${bio.hometown}</span></span>
        </div>
        <div class="pm-bio-row" style="margin-top:0.5rem">
          ${bio.draft ? `<span class="pm-bio-item"><strong>Draft:</strong> <span class="pm-val">${bio.draft}</span></span>` : ''}
          ${bio.college ? `<span class="pm-bio-item"><strong>College:</strong> <span class="pm-val">${bio.college}</span></span>` : ''}
        </div>
        ${sparkHtml}
      </div>
    </div>

    <div id="eurobasket-injection"></div>

    <div class="pm-source-disclaimer">
      <strong>Sources:</strong> Career stats compiled from EuroBasket.com, CEBL.ca, Proballers, RealGM, NCAA.com, and team press releases. Profiles are continuously verified. Where data conflicts, official team release supersedes other sources. <em>Last cache refresh:</em> see the cache audit timestamp.
    </div>

    <div class="pm-tabs">
      <button class="pm-tab active" onclick="switchProfileTab(this, 'career')">Career Stats</button>
      <button class="pm-tab" onclick="switchProfileTab(this, 'shooting')">Shooting</button>
      <button class="pm-tab" onclick="switchProfileTab(this, 'medical')">Medical History</button>
    </div>

    <div id="pm-career" class="pm-tab-content active">
      <div class="career-table-wrap">
        <table class="career-table">
          <thead>
            <tr>
              <th>Season</th><th>Age</th><th>League</th><th>Team</th><th>GP</th><th>GS</th><th>MPG</th>
              <th>PPG</th><th>RPG</th><th>APG</th><th>SPG</th><th>BPG</th>
            </tr>
          </thead>
          <tbody>
            ${stats.map(r => {
              const rowClass = r.league === 'NBA' ? 'nba-row' : r.league === 'CEBL' ? 'cebl-row' : '';
              return `<tr class="${rowClass}">
                <td class="season-col">${r.season}</td>
                <td>${r.age}</td>
                <td class="league-col">${r.league}</td>
                <td class="team-col">${r.team}</td>
                <td>${r.gp}</td>
                <td>${r.gs}</td>
                <td>${r.mpg}</td>
                <td class="highlight-stat">${r.ppg}</td>
                <td>${r.rpg}</td>
                <td>${r.apg}</td>
                <td>${r.spg}</td>
                <td>${r.bpg}</td>
              </tr>`;
            }).join('')}
            <tr class="career-avg-row">
              <td class="season-col">Career</td>
              <td></td><td></td><td></td>
              <td>${totalGP}</td><td></td><td></td>
              <td>${avgPPG}</td><td>${avgRPG}</td><td>${avgAPG}</td><td>${avgSPG}</td><td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div id="pm-shooting" class="pm-tab-content">
      <div class="career-table-wrap">
        <table class="career-table">
          <thead>
            <tr>
              <th>Season</th><th>League</th><th>Team</th><th>GP</th>
              <th>FG%</th><th>3P%</th><th>FT%</th>
            </tr>
          </thead>
          <tbody>
            ${stats.map(r => {
              const rowClass = r.league === 'NBA' ? 'nba-row' : r.league === 'CEBL' ? 'cebl-row' : '';
              return `<tr class="${rowClass}">
                <td class="season-col">${r.season}</td>
                <td class="league-col">${r.league}</td>
                <td class="team-col">${r.team}</td>
                <td>${r.gp}</td>
                <td class="highlight-stat">${r.fgPct != null ? r.fgPct + '%' : '-'}</td>
                <td>${r.threePct != null ? r.threePct + '%' : '-'}</td>
                <td>${r.ftPct != null ? r.ftPct + '%' : '-'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div id="pm-medical" class="pm-tab-content">
      ${AUTH.canAccessFeature('medical-history') ? `
        <div class="medical-disclaimer">
          <strong>Source:</strong> Publicly-reported injuries only — team announcements, ESPN/TSN injury reports, league press releases. We do <em>not</em> publish unsourced injury claims.
        </div>
        ${medical.length > 0 ? `
          <div class="medical-timeline">
            ${medical.map(m => `
              <div class="medical-entry severity-${m.severity.toLowerCase()}">
                <div class="medical-date">${m.date}</div>
                <div class="medical-details">
                  <h4>${m.injury} <span class="medical-severity ${m.severity.toLowerCase()}">${m.severity}</span></h4>
                  <div class="medical-games-out">Games missed: <strong>${m.gamesOut}</strong></div>
                  <p>${m.note}</p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `<div class="no-medical">No publicly-reported injuries on file. If a recent injury has been reported, contact us to update.</div>`}
      ` : `
        <div class="premium-locked">
          <div class="lock-icon">🔒</div>
          <h3>Medical History is a Premium Feature</h3>
          <p>Unlock detailed injury timelines, severity grading, and games-missed tracking for every player.</p>
          <button class="upgrade-cta" onclick="closePlayerModal();showFeatureGate('medical-history')">View Premium Plans</button>
        </div>
      `}
    </div>
  `;

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';

  // Lazy-fetch EuroBasket cache to enrich the modal
  if (typeof injectEuroBasketDataIntoModal === 'function') {
    injectEuroBasketDataIntoModal(playerName);
  }
}

function closePlayerModal() {
  document.getElementById('player-modal').classList.remove('show');
  document.body.style.overflow = '';
}

function switchProfileTab(btn, tabId) {
  btn.closest('.pm-tabs').querySelectorAll('.pm-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  btn.closest('.player-modal').querySelectorAll('.pm-tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('pm-' + tabId).classList.add('active');
}

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closePlayerModal();
});

// ===== Render Team Stats =====
function renderTeamStats() {
  if (typeof teamStats2025 === 'undefined') return;

  const teams = Object.entries(teamStats2025).sort((a, b) => b[1].record.pct - a[1].record.pct);

  // Find league bests for highlighting
  const allStats = teams.map(([, t]) => t.stats);
  const bestPPG = Math.max(...allStats.map(s => s.ppg));
  const bestFG = Math.max(...allStats.map(s => s.fgPct));
  const best3P = Math.max(...allStats.map(s => s.threePct));
  const bestRPG = Math.max(...allStats.map(s => s.rpg));

  // Standings table
  const standingsEl = document.getElementById('team-standings');
  if (standingsEl) {
    standingsEl.innerHTML = `
      <table class="standings-table">
        <thead>
          <tr>
            <th style="min-width:200px">Team</th><th>W</th><th>L</th><th>PCT</th>
            <th>PPG</th><th>OPP PPG</th><th>DIFF</th><th>RPG</th><th>APG</th>
            <th>FG%</th><th>3P%</th><th>FT%</th>
            <th style="min-width:150px">Scoring Leader</th>
          </tr>
        </thead>
        <tbody>
          ${teams.map(([name, t], i) => {
            const diff = (t.stats.ppg - t.stats.oppPpg).toFixed(1);
            const diffColor = diff > 0 ? '#81C784' : '#E57373';
            const emoji = Object.values(leagueSignings).find((_, idx) => Object.keys(leagueSignings)[idx] === name)?.emoji || '';
            return `<tr>
              <td><div class="team-name-cell">${typeof teamLogoHTML === 'function' ? teamLogoHTML(name, 24, t.color) : `<span class="team-dot-lg" style="background:${t.color}"></span>`}<strong style="color:${t.color}">${i + 1}.</strong> <span class="team-name-text">${name}</span></div></td>
              <td class="win-col">${t.record.wins}</td>
              <td class="loss-col">${t.record.losses}</td>
              <td class="pct-col">${t.record.pct.toFixed(3)}</td>
              <td class="${t.stats.ppg === bestPPG ? 'best-stat' : ''}">${t.stats.ppg}</td>
              <td>${t.stats.oppPpg}</td>
              <td style="color:${diffColor};font-weight:600">${diff > 0 ? '+' : ''}${diff}</td>
              <td class="${t.stats.rpg === bestRPG ? 'best-stat' : ''}">${t.stats.rpg}</td>
              <td>${t.stats.apg}</td>
              <td class="${t.stats.fgPct === bestFG ? 'best-stat' : ''}">${t.stats.fgPct}%</td>
              <td class="${t.stats.threePct === best3P ? 'best-stat' : ''}">${t.stats.threePct}%</td>
              <td>${t.stats.ftPct}%</td>
              <td class="leader-cell">${t.leaders.points}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  // Team cards grid
  const gridEl = document.getElementById('team-stats-grid');
  if (gridEl) {
    gridEl.innerHTML = teams.map(([name, t]) => {
      const emoji = leagueSignings[name]?.emoji || '';
      return `
        <div class="team-stat-card" style="border-top-color:${t.color}">
          <div class="tsc-header">
            <span class="tsc-emoji">${emoji}</span>
            <span class="tsc-name" style="color:${t.color}">${name}</span>
            <span class="tsc-record">${t.record.wins}-${t.record.losses}</span>
          </div>
          <div class="tsc-stats">
            <div class="tsc-stat"><div class="tsc-stat-val">${t.stats.ppg}</div><div class="tsc-stat-lbl">PPG</div></div>
            <div class="tsc-stat"><div class="tsc-stat-val">${t.stats.rpg}</div><div class="tsc-stat-lbl">RPG</div></div>
            <div class="tsc-stat"><div class="tsc-stat-val">${t.stats.apg}</div><div class="tsc-stat-lbl">APG</div></div>
            <div class="tsc-stat"><div class="tsc-stat-val">${t.stats.fgPct}%</div><div class="tsc-stat-lbl">FG%</div></div>
            <div class="tsc-stat"><div class="tsc-stat-val">${t.stats.threePct}%</div><div class="tsc-stat-lbl">3PT%</div></div>
            <div class="tsc-stat"><div class="tsc-stat-val">${t.stats.spg}</div><div class="tsc-stat-lbl">SPG</div></div>
            <div class="tsc-stat"><div class="tsc-stat-val">${t.stats.bpg}</div><div class="tsc-stat-lbl">BPG</div></div>
            <div class="tsc-stat"><div class="tsc-stat-val">${t.stats.topg}</div><div class="tsc-stat-lbl">TOPG</div></div>
          </div>
          <div class="tsc-leaders">
            <div class="tsc-leader-row"><span class="tsc-leader-label">Points Leader</span><span class="tsc-leader-val">${t.leaders.points}</span></div>
            <div class="tsc-leader-row"><span class="tsc-leader-label">Rebounds Leader</span><span class="tsc-leader-val">${t.leaders.rebounds}</span></div>
            <div class="tsc-leader-row"><span class="tsc-leader-label">Assists Leader</span><span class="tsc-leader-val">${t.leaders.assists}</span></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// ===== Enhanced Live Update System =====
let lastUpdateTime = Date.now();
let updateCheckCount = 0;

function setLiveStatus(status) {
  const indicator = document.getElementById('live-indicator');
  if (!indicator) return;
  indicator.className = 'live-indicator' + (status !== 'live' ? ' ' + status : '');
  const text = indicator.querySelector('.live-text');
  if (status === 'checking') text.textContent = 'SYNCING...';
  else if (status === 'error') text.textContent = 'OFFLINE';
  else text.textContent = 'LIVE';
}

function checkForUpdates() {
  setLiveStatus('checking');
  updateCheckCount++;

  const script = document.createElement('script');
  script.src = 'data.js?v=' + Date.now();
  script.onload = () => {
    refreshAllData();
    lastUpdateTime = Date.now();
    setLiveStatus('live');
  };
  script.onerror = () => {
    setLiveStatus('error');
    setTimeout(() => setLiveStatus('live'), 5000);
  };
  document.head.appendChild(script);

  // Also reload career data
  const careerScript = document.createElement('script');
  careerScript.src = 'career-data.js?v=' + Date.now();
  document.head.appendChild(careerScript);
}

// ===== Make Player Names Clickable =====
function addPlayerClickHandlers() {
  // Check which players have career data
  const hasProfile = (name) => typeof playerCareerStats !== 'undefined' && playerCareerStats[name];

  // Pro table rows
  document.querySelectorAll('#pro-tbody tr').forEach(tr => {
    const nameEl = tr.querySelector('.player-name');
    if (nameEl) {
      const name = nameEl.textContent.trim();
      tr.setAttribute('data-clickable', 'true');
      tr.onclick = () => openPlayerModal(name);
      if (hasProfile(name)) nameEl.classList.add('has-profile');
    }
  });

  // NCAA table rows
  document.querySelectorAll('#ncaa-tbody tr').forEach(tr => {
    const nameEl = tr.querySelector('.player-name');
    if (nameEl) {
      const name = nameEl.textContent.trim();
      tr.setAttribute('data-clickable', 'true');
      tr.onclick = () => openPlayerModal(name);
      if (hasProfile(name)) nameEl.classList.add('has-profile');
    }
  });

  // Import table rows
  document.querySelectorAll('#import-tbody tr').forEach(tr => {
    const nameEl = tr.querySelector('.player-name');
    if (nameEl) {
      const name = nameEl.textContent.trim();
      tr.setAttribute('data-clickable', 'true');
      tr.onclick = () => openPlayerModal(name);
      if (hasProfile(name)) nameEl.classList.add('has-profile');
    }
  });

  // Mobile cards
  document.querySelectorAll('.mobile-card .mc-name').forEach(el => {
    const name = el.textContent.trim();
    const card = el.closest('.mobile-card');
    if (card) {
      card.setAttribute('data-clickable', 'true');
      card.onclick = () => openPlayerModal(name);
    }
  });

  // Roster cards
  document.querySelectorAll('.roster-card h4').forEach(el => {
    const name = el.textContent.trim();
    const card = el.closest('.roster-card');
    if (card) {
      card.setAttribute('data-clickable', 'true');
      card.onclick = () => openPlayerModal(name);
    }
  });

  // Scout target cards
  document.querySelectorAll('.scout-name').forEach(el => {
    const name = el.textContent.trim();
    const card = el.closest('.scout-card');
    if (card) {
      card.style.cursor = 'pointer';
      card.onclick = () => openPlayerModal(name);
    }
  });

  // Signing player rows (entire row clickable)
  document.querySelectorAll('.signing-player').forEach(row => {
    const nameEl = row.querySelector('.sp-name');
    if (!nameEl) return;
    const name = nameEl.textContent.trim();
    row.setAttribute('data-clickable', 'true');
    row.style.cursor = 'pointer';
    row.onclick = (e) => { e.stopPropagation(); openPlayerModal(name); };
  });

  // Universal: any element with data-player-name attribute opens that player
  document.querySelectorAll('[data-player-name]').forEach(el => {
    if (el.dataset.clickBound === '1') return;
    el.dataset.clickBound = '1';
    const name = el.dataset.playerName;
    el.style.cursor = 'pointer';
    el.onclick = (e) => { e.stopPropagation(); openPlayerModal(name); };
  });
}

// ===== CANADIAN PIPELINE =====
function renderPipeline() {
  if (typeof canadianPipeline === 'undefined') return;
  const summary = document.getElementById('pipeline-summary');
  const tiers = document.getElementById('pipeline-tiers');
  if (!summary || !tiers) return;

  const nba = canadianPipeline.filter(p => p.tier === 'NBA');
  const gleague = canadianPipeline.filter(p => p.tier === 'G League');
  const europeAll = canadianPipeline.filter(p => p.tier.startsWith('Europe'));
  const aus = canadianPipeline.filter(p => p.tier === 'Australia');
  const asia = canadianPipeline.filter(p => p.tier === 'Asia');
  const americas = canadianPipeline.filter(p => p.tier === 'Americas');
  const cebl = canadianPipeline.filter(p => p.tier === 'CEBL');

  summary.innerHTML = `
    <div class="pipeline-stat-row">
      <div class="pipeline-stat"><div class="ps-num">${canadianPipeline.length}</div><div class="ps-label">Total Canadians Tracked</div></div>
      <div class="pipeline-stat nba"><div class="ps-num">${nba.length}</div><div class="ps-label">NBA</div></div>
      <div class="pipeline-stat gleague"><div class="ps-num">${gleague.length}</div><div class="ps-label">G League</div></div>
      <div class="pipeline-stat europe"><div class="ps-num">${europeAll.length}</div><div class="ps-label">Europe</div></div>
      <div class="pipeline-stat aus"><div class="ps-num">${aus.length}</div><div class="ps-label">Australia</div></div>
      <div class="pipeline-stat asia-tier"><div class="ps-num">${asia.length}</div><div class="ps-label">Asia</div></div>
      <div class="pipeline-stat americas-tier"><div class="ps-num">${americas.length}</div><div class="ps-label">Americas</div></div>
      <div class="pipeline-stat cebl-tier"><div class="ps-num">${cebl.length}</div><div class="ps-label">CEBL</div></div>
    </div>
  `;

  const tierGroups = [
    { key: 'NBA', label: 'NBA', color: '#C9082A', players: nba },
    { key: 'G League', label: 'NBA G League', color: '#1D428A', players: gleague },
    { key: 'Europe', label: 'Europe (All Levels)', color: '#2E7D32', players: europeAll },
    { key: 'Australia', label: 'Australia NBL', color: '#FFB81C', players: aus },
    { key: 'Asia', label: 'Asia (Japan / Korea / Philippines)', color: '#E91E63', players: asia },
    { key: 'Americas', label: 'Americas (Latin America / Mexico)', color: '#FF6D00', players: americas },
    { key: 'CEBL', label: 'CEBL', color: '#D4AF37', players: cebl }
  ];

  tiers.innerHTML = tierGroups.filter(g => g.players.length > 0).map(g => `
    <div class="pipeline-tier-section" data-tier="${g.key}">
      <div class="pt-header" style="border-left:4px solid ${g.color}">
        <span class="pt-label" style="color:${g.color}">${g.label}</span>
        <span class="pt-count">${g.players.length} player${g.players.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="pt-players">
        ${g.players.map(p => `
          <div class="pt-player" data-search="${(p.name+' '+p.team+' '+p.league+' '+p.hometown+' '+p.note+' '+(p.college||'')).toLowerCase()}" data-tier="${p.tier}" data-pos="${p.pos.charAt(0)}" onclick="this.classList.toggle('expanded')">
            <div class="pt-avatar has-headshot">${avatarContent(p.name)}</div>
            <div class="pt-info">
              <div class="pt-name">${p.name}</div>
              <div class="pt-meta">${p.pos} | ${p.age} | ${p.ht} | ${p.hometown}</div>
            </div>
            <div class="pt-team-info">
              <div class="pt-team">${p.team}</div>
              <div class="pt-league">${p.league} | ${p.country}</div>
            </div>
            <div class="pt-stats-mini">
              <span>${p.ppg} PPG</span>
              <span>${p.rpg} RPG</span>
              <span>${p.apg} APG</span>
            </div>
            <div class="pt-status ${p.status === 'Active' ? 'active' : 'fa'}">${p.status}</div>
            <div class="pt-drilldown">
              ${p.college ? `<div class="pt-detail"><strong>College:</strong> ${p.college}</div>` : ''}
              <div class="pt-detail"><strong>Scouting Note:</strong> ${p.note}</div>
              <div class="pt-detail"><strong>League:</strong> ${p.league} (${p.country})</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function filterPipeline() {
  const search = document.getElementById('pipeline-search').value.toLowerCase();
  const tier = document.getElementById('pipeline-tier-filter').value;
  const pos = document.getElementById('pipeline-pos-filter').value;
  document.querySelectorAll('.pt-player').forEach(el => {
    const matchSearch = !search || (el.getAttribute('data-search') || '').includes(search);
    const matchTier = !tier || (el.getAttribute('data-tier') || '').includes(tier);
    const matchPos = !pos || el.getAttribute('data-pos') === pos;
    el.style.display = (matchSearch && matchTier && matchPos) ? '' : 'none';
  });
}

// ===== ELAM ENDING ANALYTICS =====
function renderElamAnalytics() {
  if (typeof elamEndingData === 'undefined') return;
  const container = document.getElementById('elam-content');
  if (!container) return;

  const ov = elamEndingData.overview;
  const teams = Object.entries(elamEndingData.teamPerformance).sort((a, b) => b[1].elamWinPct - a[1].elamWinPct);
  const clutch = elamEndingData.playerClutch;

  container.innerHTML = `
    <div class="elam-overview">
      <div class="elam-stat-row">
        <div class="elam-stat"><div class="es-num">${ov.totalGames2025}</div><div class="es-label">Games with Elam</div></div>
        <div class="elam-stat"><div class="es-num">${ov.avgElamDuration}</div><div class="es-label">Avg Elam Duration</div></div>
        <div class="elam-stat"><div class="es-num">${ov.avgElamPossessions}</div><div class="es-label">Avg Possessions</div></div>
        <div class="elam-stat"><div class="es-num">${ov.comebacksInElam}</div><div class="es-label">Comebacks</div></div>
        <div class="elam-stat"><div class="es-num">${ov.comebackPct}%</div><div class="es-label">Comeback Rate</div></div>
      </div>
      <p class="elam-explainer">${ov.description}</p>
    </div>

    <h3 class="section-title">Team Elam Performance</h3>
    <div class="table-container">
      <table class="data-table elam-table">
        <thead>
          <tr><th>Rank</th><th>Team</th><th>Elam W</th><th>Elam L</th><th>Win%</th><th>Avg Margin</th><th>Comebacks</th><th>Elam PPG</th></tr>
        </thead>
        <tbody>
          ${teams.map(([name, t], i) => `
            <tr>
              <td><strong>${i + 1}</strong></td>
              <td>${typeof teamLogoHTML === 'function' ? teamLogoHTML(name, 20, t.color) : `<span class="team-dot-lg" style="background:${t.color}"></span>`} ${name}</td>
              <td class="win-col">${t.elamWins}</td>
              <td class="loss-col">${t.elamLosses}</td>
              <td><strong>${(t.elamWinPct * 100).toFixed(1)}%</strong></td>
              <td style="color:${t.avgElamMargin > 0 ? '#81C784' : '#E57373'}">${t.avgElamMargin > 0 ? '+' : ''}${t.avgElamMargin}</td>
              <td>${t.comebacks}</td>
              <td>${t.elamPPG}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <h3 class="section-title">Elam Ending Clutch Leaders</h3>
    <div class="clutch-grid">
      ${clutch.map((p, i) => `
        <div class="clutch-card ${i < 3 ? 'top-3' : ''}" onclick="this.classList.toggle('expanded')">
          <div class="clutch-rank">${i + 1}</div>
          <div class="clutch-info">
            <div class="clutch-name">${p.name}</div>
            <div class="clutch-team">${p.team}</div>
          </div>
          <div class="clutch-stats">
            <div class="clutch-stat"><span class="cs-val">${p.elamPPG}</span><span class="cs-lbl">Elam PPG</span></div>
            <div class="clutch-stat"><span class="cs-val">${p.elamFGPct}%</span><span class="cs-lbl">Elam FG%</span></div>
            <div class="clutch-stat"><span class="cs-val">${p.elamGameWinners}</span><span class="cs-lbl">Game Winners</span></div>
          </div>
          <div class="clutch-rating">
            <div class="cr-bar" style="width:${p.clutchRating}%"></div>
            <span class="cr-val">${p.clutchRating}</span>
          </div>
          <div class="clutch-drilldown">
            <div class="dd-row">
              <div class="dd-stat"><span class="dd-val">${p.elamAssists}</span><span class="dd-lbl">Elam AST</span></div>
              <div class="dd-stat"><span class="dd-val">${p.elamFTA || '-'}</span><span class="dd-lbl">Elam FTA</span></div>
              <div class="dd-stat"><span class="dd-val">${p.elamFTPct ? p.elamFTPct + '%' : '-'}</span><span class="dd-lbl">Elam FT%</span></div>
              <div class="dd-stat"><span class="dd-val">${p.elamTov || '-'}</span><span class="dd-lbl">Elam TOV</span></div>
              <div class="dd-stat"><span class="dd-val">${p.elamPlusMinus || '-'}</span><span class="dd-lbl">+/-</span></div>
            </div>
            ${p.playTypes ? `
            <div class="dd-play-types">
              <div class="dd-pt-label">Elam Play Type %</div>
              <div class="dd-pt-bars">
                <div class="dd-pt-bar"><div class="dd-pt-fill" style="width:${p.playTypes.iso}%;background:#E57373"></div><span>ISO ${p.playTypes.iso}%</span></div>
                <div class="dd-pt-bar"><div class="dd-pt-fill" style="width:${p.playTypes.pnr}%;background:#64B5F6"></div><span>PnR ${p.playTypes.pnr}%</span></div>
                <div class="dd-pt-bar"><div class="dd-pt-fill" style="width:${p.playTypes.spot}%;background:#81C784"></div><span>Spot ${p.playTypes.spot}%</span></div>
                <div class="dd-pt-bar"><div class="dd-pt-fill" style="width:${p.playTypes.transition}%;background:#FFB74D"></div><span>Trans ${p.playTypes.transition}%</span></div>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== TARGET SHOT ANALYTICS =====
function renderTargetAnalytics() {
  if (typeof targetShotData === 'undefined') return;
  const container = document.getElementById('target-content');
  if (!container) return;

  const ov = targetShotData.overview;
  const teams = Object.entries(targetShotData.teamTargetStats).sort((a, b) => b[1].pct - a[1].pct);
  const players = targetShotData.playerTargetLeaders;
  const insights = targetShotData.strategicInsights;

  container.innerHTML = `
    <div class="target-overview">
      <div class="target-stat-row">
        <div class="target-stat"><div class="ts-num">${ov.totalTargetAttempts2025}</div><div class="ts-label">Total Attempts</div></div>
        <div class="target-stat"><div class="ts-num">${ov.totalTargetMade}</div><div class="ts-label">Total Made</div></div>
        <div class="target-stat"><div class="ts-num">${ov.leagueTargetPct}%</div><div class="ts-label">League Target %</div></div>
        <div class="target-stat highlight"><div class="ts-num">${ov.expectedValueTarget}</div><div class="ts-label">EV per Target Att.</div></div>
        <div class="target-stat"><div class="ts-num">${ov.expectedValue3pt}</div><div class="ts-label">EV per Std 3PT</div></div>
      </div>
      <p class="target-explainer">${ov.description}</p>
    </div>

    <div class="target-insights-grid">
      ${insights.map(ins => `
        <div class="target-insight-card">
          <h4>${ins.title}</h4>
          <p>${ins.insight}</p>
        </div>
      `).join('')}
    </div>

    <h3 class="section-title">Team Target Shooting Rankings</h3>
    <div class="table-container">
      <table class="data-table target-table">
        <thead>
          <tr><th>Rank</th><th>Team</th><th>Attempts</th><th>Made</th><th>Target %</th><th>Att/Game</th></tr>
        </thead>
        <tbody>
          ${teams.map(([name, t], i) => `
            <tr>
              <td><strong>${i + 1}</strong></td>
              <td>${typeof teamLogoHTML === 'function' ? teamLogoHTML(name, 20, t.color) : `<span class="team-dot-lg" style="background:${t.color}"></span>`} ${name}</td>
              <td>${t.attempts}</td>
              <td>${t.made}</td>
              <td><strong>${t.pct}%</strong></td>
              <td>${t.attPerGame}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <h3 class="section-title">Individual Target Shot Leaders</h3>
    <div class="target-leaders-grid">
      ${players.map((p, i) => `
        <div class="target-leader-card ${i < 3 ? 'top-3' : ''}" onclick="this.classList.toggle('expanded')">
          <div class="tl-rank">${i + 1}</div>
          <div class="tl-info">
            <div class="tl-name">${p.name}</div>
            <div class="tl-team">${p.team}</div>
          </div>
          <div class="tl-stats">
            <div class="tl-stat"><span class="tls-val">${p.made}/${p.attempts}</span><span class="tls-lbl">Made/Att</span></div>
            <div class="tl-stat"><span class="tls-val">${p.pct}%</span><span class="tls-lbl">Target %</span></div>
            <div class="tl-stat"><span class="tls-val">${p.expectedPts}</span><span class="tls-lbl">Exp. Pts</span></div>
          </div>
          <div class="tl-drilldown">
            <div class="dd-row">
              <div class="dd-stat"><span class="dd-val">${p.catchShoot || '-'}%</span><span class="dd-lbl">Catch & Shoot</span></div>
              <div class="dd-stat"><span class="dd-val">${p.offDribble || '-'}%</span><span class="dd-lbl">Off Dribble</span></div>
              <div class="dd-stat"><span class="dd-val">${p.contested || '-'}%</span><span class="dd-lbl">Contested</span></div>
              <div class="dd-stat"><span class="dd-val">${p.open || '-'}%</span><span class="dd-lbl">Open</span></div>
              <div class="dd-stat"><span class="dd-val">${p.elamTarget || '-'}</span><span class="dd-lbl">Elam Targets</span></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ===== ADVANCED STATS =====
function renderAdvancedStats() {
  if (typeof advancedMetrics === 'undefined') return;
  const container = document.getElementById('advanced-content');
  if (!container) return;

  const players = advancedMetrics.players;
  const glossary = advancedMetrics.glossary;

  // Sort by PER descending
  const sorted = [...players].sort((a, b) => b.per - a.per);

  function pctBar(val, min, max, good, elite) {
    const pct = Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));
    const color = val >= elite ? '#D4AF37' : val >= good ? '#81C784' : '#FFB74D';
    return `<div class="adv-bar"><div class="adv-bar-fill" style="width:${pct}%;background:${color}"></div></div>`;
  }

  container.innerHTML = `
    <div class="adv-glossary-toggle">
      <button class="build-btn reset-btn" onclick="document.getElementById('adv-glossary').classList.toggle('show')">Glossary</button>
    </div>
    <div id="adv-glossary" class="adv-glossary">
      ${Object.entries(glossary).map(([key, g]) => `
        <div class="adv-glossary-item"><strong>${g.name}</strong>: ${g.description}</div>
      `).join('')}
    </div>

    <div class="table-container">
      <table class="data-table adv-table">
        <thead>
          <tr>
            <th>Player</th><th>Team</th><th>Role</th>
            <th>TS%</th><th>USG%</th><th>AST/TO</th><th>Net Rtg</th><th>PER</th>
            <th>ORtg</th><th>DRtg</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(p => `
            <tr>
              <td><strong class="player-name has-profile" style="cursor:pointer" onclick="openPlayerModal('${p.name}')">${p.name}</strong></td>
              <td>${p.team}</td>
              <td><span class="role-badge">${p.role}</span></td>
              <td><div class="adv-cell">${p.tsPct}%${pctBar(p.tsPct, 48, 62, glossary.tsPct.good, glossary.tsPct.elite)}</div></td>
              <td><div class="adv-cell">${p.usgRate}%${pctBar(p.usgRate, 14, 35, glossary.usgRate.good, glossary.usgRate.elite)}</div></td>
              <td><div class="adv-cell">${p.astTov}${pctBar(p.astTov, 0.5, 4, glossary.astTov.good, glossary.astTov.elite)}</div></td>
              <td style="color:${p.netRtg > 0 ? '#81C784' : '#E57373'}"><strong>${p.netRtg > 0 ? '+' : ''}${p.netRtg}</strong></td>
              <td><div class="adv-cell"><strong>${p.per}</strong>${pctBar(p.per, 10, 28, glossary.per.good, glossary.per.elite)}</div></td>
              <td>${p.offRtg}</td>
              <td>${p.defRtg}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ===== PLAYER COMPARISON TOOL =====
function populateCompareDropdowns() {
  if (typeof advancedMetrics === 'undefined') return;
  const options = advancedMetrics.players.map(p => `<option value="${p.name}">${p.name} (${p.team})</option>`).join('');
  const base = '<option value="">Select a player...</option>' + options;
  const a = document.getElementById('compare-player-a');
  const b = document.getElementById('compare-player-b');
  if (a) a.innerHTML = base;
  if (b) b.innerHTML = base;
}

function renderComparison() {
  const nameA = document.getElementById('compare-player-a').value;
  const nameB = document.getElementById('compare-player-b').value;
  const container = document.getElementById('compare-content');
  if (!container) return;

  if (!nameA || !nameB) {
    container.innerHTML = '<p class="no-builds" style="margin-top:2rem">Select two players above to compare their stats side-by-side.</p>';
    return;
  }

  const pA = advancedMetrics.players.find(p => p.name === nameA);
  const pB = advancedMetrics.players.find(p => p.name === nameB);
  if (!pA || !pB) return;

  const metrics = [
    { label: 'True Shooting %', key: 'tsPct', suffix: '%', min: 48, max: 62 },
    { label: 'Usage Rate', key: 'usgRate', suffix: '%', min: 14, max: 35 },
    { label: 'Assist/Turnover', key: 'astTov', suffix: '', min: 0.5, max: 4 },
    { label: 'Net Rating', key: 'netRtg', suffix: '', min: -5, max: 12 },
    { label: 'PER', key: 'per', suffix: '', min: 10, max: 28 },
    { label: 'Off. Rating', key: 'offRtg', suffix: '', min: 100, max: 120 },
    { label: 'Def. Rating', key: 'defRtg', suffix: '', min: 100, max: 112, invert: true }
  ];

  container.innerHTML = `
    <div class="compare-header">
      <div class="compare-player-label">${pA.name}<br><span>${pA.team} | ${pA.role}</span></div>
      <div class="compare-player-label">${pB.name}<br><span>${pB.team} | ${pB.role}</span></div>
    </div>
    <div class="compare-bars">
      ${metrics.map(m => {
        const valA = pA[m.key];
        const valB = pB[m.key];
        const range = m.max - m.min;
        const pctA = Math.min(100, Math.max(0, ((valA - m.min) / range) * 100));
        const pctB = Math.min(100, Math.max(0, ((valB - m.min) / range) * 100));
        const aWins = m.invert ? valA < valB : valA > valB;
        const bWins = m.invert ? valB < valA : valB > valA;
        return `
          <div class="compare-row">
            <div class="compare-val ${aWins ? 'winner' : ''}">${valA}${m.suffix}</div>
            <div class="compare-bar-area">
              <div class="compare-bar-left"><div class="compare-fill-left ${aWins ? 'winner' : ''}" style="width:${pctA}%"></div></div>
              <div class="compare-label">${m.label}</div>
              <div class="compare-bar-right"><div class="compare-fill-right ${bWins ? 'winner' : ''}" style="width:${pctB}%"></div></div>
            </div>
            <div class="compare-val ${bWins ? 'winner' : ''}">${valB}${m.suffix}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ===== WATCHLIST =====
function getWatchlist() {
  if (typeof USER_DATA !== 'undefined') {
    return USER_DATA.load('watchlist', []);
  }
  try { return JSON.parse(localStorage.getItem('hi_watchlist') || '[]'); } catch { return []; }
}

function saveWatchlist(list) {
  if (typeof USER_DATA !== 'undefined') {
    USER_DATA.save('watchlist', list);
  } else {
    localStorage.setItem('hi_watchlist', JSON.stringify(list));
  }
}

function populateWatchlistDropdown() {
  const select = document.getElementById('watchlist-add-select');
  if (!select) return;
  // Combine all available players
  const allPlayers = [];
  if (typeof canadiansPro !== 'undefined') canadiansPro.forEach(p => allPlayers.push(p.name));
  if (typeof ncaaCanadians !== 'undefined') ncaaCanadians.forEach(p => allPlayers.push(p.name));
  if (typeof importTargets !== 'undefined') importTargets.forEach(p => allPlayers.push(p.name));
  if (typeof canadianPipeline !== 'undefined') canadianPipeline.forEach(p => { if (!allPlayers.includes(p.name)) allPlayers.push(p.name); });
  allPlayers.sort();
  select.innerHTML = '<option value="">Add a player to your watchlist...</option>' + allPlayers.map(n => `<option value="${n}">${n}</option>`).join('');
}

function addToWatchlist() {
  const select = document.getElementById('watchlist-add-select');
  const name = select.value;
  if (!name) return;
  const list = getWatchlist();
  if (!list.includes(name)) {
    list.push(name);
    saveWatchlist(list);
  }
  select.value = '';
  renderWatchlist();
}

function removeFromWatchlist(name) {
  const list = getWatchlist().filter(n => n !== name);
  saveWatchlist(list);
  renderWatchlist();
}

function renderWatchlist() {
  const container = document.getElementById('watchlist-content');
  if (!container) return;
  const list = getWatchlist();

  if (list.length === 0) {
    container.innerHTML = '<p class="no-builds" style="margin-top:1rem">Your watchlist is empty. Add players from the dropdown above to start tracking them.</p>';
    return;
  }

  // Look up player data from all sources
  function findPlayer(name) {
    if (typeof canadianPipeline !== 'undefined') {
      const p = canadianPipeline.find(x => x.name === name);
      if (p) return { name: p.name, pos: p.pos, team: p.team, league: p.league, ppg: p.ppg, rpg: p.rpg, apg: p.apg, note: p.note, hometown: p.hometown || '' };
    }
    if (typeof canadiansPro !== 'undefined') {
      const p = canadiansPro.find(x => x.name === name);
      if (p) return { name: p.name, pos: p.pos, team: p.team, league: p.league, ppg: p.ppg, rpg: p.rpg, apg: p.apg, note: p.note, hometown: p.hometown || '' };
    }
    if (typeof importTargets !== 'undefined') {
      const p = importTargets.find(x => x.name === name);
      if (p) return { name: p.name, pos: p.pos, team: p.team, league: p.league, ppg: p.ppg, rpg: p.rpg, apg: p.apg, note: p.note, hometown: '' };
    }
    if (typeof ncaaCanadians !== 'undefined') {
      const p = ncaaCanadians.find(x => x.name === name);
      if (p) return { name: p.name, pos: p.pos, team: p.school, league: 'NCAA', ppg: p.ppg, rpg: p.rpg, apg: p.apg, note: p.note, hometown: p.hometown || '' };
    }
    return { name, pos: '-', team: '-', league: '-', ppg: '-', rpg: '-', apg: '-', note: '', hometown: '' };
  }

  container.innerHTML = `
    <div class="watchlist-grid">
      ${list.map(name => {
        const p = findPlayer(name);
        return `
          <div class="watchlist-card">
            <div class="wl-header">
              <div class="wl-avatar has-headshot">${avatarContent(name)}</div>
              <div class="wl-info">
                <div class="wl-name" style="cursor:pointer" onclick="openPlayerModal('${name}')">${name}</div>
                <div class="wl-meta">${p.pos} | ${p.team} | ${p.league}</div>
              </div>
              <button class="wl-remove" onclick="removeFromWatchlist('${name.replace(/'/g, "\\'")}')" title="Remove">&times;</button>
            </div>
            <div class="wl-stats">
              <div><span class="wl-stat-val">${p.ppg}</span><span class="wl-stat-lbl">PPG</span></div>
              <div><span class="wl-stat-val">${p.rpg}</span><span class="wl-stat-lbl">RPG</span></div>
              <div><span class="wl-stat-val">${p.apg}</span><span class="wl-stat-lbl">APG</span></div>
            </div>
            ${p.note ? `<div class="wl-note">${p.note}</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ============================================================================
// ===== SORTABLE TABLES (universal column sort utility) =====
// ============================================================================
function makeTableSortable(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const headers = table.querySelectorAll('thead th');
  headers.forEach((th, idx) => {
    if (th.dataset.sortable === 'false') return;
    th.classList.add('sortable-th');
    th.addEventListener('click', () => sortTable(table, idx, th));
  });
}

function sortTable(table, colIdx, th) {
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const current = th.dataset.sortDir || 'none';
  const dir = current === 'asc' ? 'desc' : 'asc';

  // Clear all sort indicators
  table.querySelectorAll('thead th').forEach(h => {
    h.dataset.sortDir = 'none';
    h.classList.remove('sort-asc', 'sort-desc');
  });
  th.dataset.sortDir = dir;
  th.classList.add(dir === 'asc' ? 'sort-asc' : 'sort-desc');

  rows.sort((a, b) => {
    const aT = (a.children[colIdx]?.innerText || '').trim();
    const bT = (b.children[colIdx]?.innerText || '').trim();
    const aN = parseFloat(aT.replace(/[^0-9.\-]/g, ''));
    const bN = parseFloat(bT.replace(/[^0-9.\-]/g, ''));
    let cmp;
    if (!isNaN(aN) && !isNaN(bN) && aT.match(/[0-9]/) && bT.match(/[0-9]/)) {
      cmp = aN - bN;
    } else {
      cmp = aT.localeCompare(bT);
    }
    return dir === 'asc' ? cmp : -cmp;
  });
  rows.forEach(r => tbody.appendChild(r));
}

function activateAllSortableTables() {
  ['pro-table', 'ncaa-table', 'import-table'].forEach(makeTableSortable);
}

// ============================================================================
// ===== STAT LEADERBOARDS TAB =====
// ============================================================================
function renderLeaderboards() {
  const c = document.getElementById('leaderboards-content');
  if (!c || typeof statLeaders2025 === 'undefined') return;

  const cats = [
    { key: 'ppg', label: 'Points Per Game', icon: '🏀', suffix: '' },
    { key: 'rpg', label: 'Rebounds Per Game', icon: '💪', suffix: '' },
    { key: 'apg', label: 'Assists Per Game', icon: '🎯', suffix: '' },
    { key: 'spg', label: 'Steals Per Game', icon: '🥷', suffix: '' },
    { key: 'fg', label: 'Field Goal %', icon: '🎯', suffix: '%' },
    { key: 'fgm', label: 'Field Goals Made (Total)', icon: '🏆', suffix: '' },
    { key: 'ft', label: 'Free Throw %', icon: '🎯', suffix: '%' }
  ];

  c.innerHTML = `
    <div class="lb-disclaimer">
      <strong>Source:</strong> All figures verified against CEBL.ca, TSN, and official team releases (last verified Apr 2026). Categories with insufficient verified data are not shown — rather than publish unsourced numbers.
    </div>`;
  c.innerHTML += `
    <div class="lb-grid">
      ${cats.map(cat => {
        const list = statLeaders2025[cat.key] || [];
        if (!list.length) return '';
        return `
          <div class="lb-card">
            <div class="lb-card-header">
              <span class="lb-icon">${cat.icon}</span>
              <h3>${cat.label}</h3>
            </div>
            <div class="lb-list">
              ${list.slice(0, 10).map(p => `
                <div class="lb-row">
                  <span class="lb-rank">${p.rank}</span>
                  <div class="lb-avatar has-headshot">${avatarContent(p.player)}</div>
                  <div class="lb-info">
                    <div class="lb-name" data-player-name="${p.player}">${p.player}</div>
                    <div class="lb-team">${p.team}</div>
                  </div>
                  <div class="lb-value">${p.value}${cat.suffix}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  requestAnimationFrame(() => addPlayerClickHandlers());
}

// ============================================================================
// ===== RECORDS BOOK TAB =====
// ============================================================================
let currentRecordsTab = 'records';

function switchRecordsTab(btn, view) {
  currentRecordsTab = view;
  document.querySelectorAll('.rb-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderRecordsContent();
}

function renderRecordsContent() {
  const c = document.getElementById('records-content');
  if (!c) return;
  if (currentRecordsTab === 'records') c.innerHTML = renderRecordsView();
  else if (currentRecordsTab === 'awards') c.innerHTML = renderAwardsView();
  else if (currentRecordsTab === 'legends') c.innerHTML = renderLegendsView();
  else if (currentRecordsTab === 'timeline') c.innerHTML = renderTimelineView();
  else if (currentRecordsTab === 'trivia') c.innerHTML = renderTriviaView();
  requestAnimationFrame(() => addPlayerClickHandlers());
}

function renderRecordsView() {
  if (typeof ceblRecords === 'undefined') return '<p>Loading...</p>';
  const sections = [
    { key: 'singleGame', label: '⚡ Single-Game Records' },
    { key: 'singleSeason', label: '📅 Single-Season Records' },
    { key: 'careerLeaders', label: '👑 Career Leaders' }
  ];
  return sections.map(s => `
    <div class="records-section">
      <h3 class="records-section-h">${s.label}</h3>
      <div class="records-grid">
        ${(ceblRecords[s.key] || []).map(r => `
          <div class="record-card">
            <div class="record-value-row">
              <div class="record-label">${r.record || r.category}</div>
              <div class="record-value">${r.value}</div>
            </div>
            <div class="record-holder">
              <div class="record-player" data-player-name="${r.player}">${r.player}</div>
              <div class="record-team">${r.team}${r.date ? ' · ' + r.date : ''}</div>
            </div>
            ${r.note ? `<div class="record-note">${r.note}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderAwardsView() {
  if (typeof ceblAwards === 'undefined') return '<p>Loading...</p>';
  const years = Object.keys(ceblAwards).sort((a, b) => b - a);
  const labels = {
    mvp: '🏆 MVP', runnerUp: '🥈 MVP Runner-Up', dpoy: '🛡️ Defensive Player of Year',
    canPOTY: '🇨🇦 Canadian Player of Year', rookie: '✨ Rookie of Year',
    sixthMan: '🔥 6th Man of Year', clutchPOY: '⏱️ Clutch Player of Year',
    coachOfYear: '🎯 Coach of Year', franchiseOfYear: '🏢 Franchise of Year',
    champion: '👑 Champion', finalsMVP: '⭐ Finals MVP'
  };
  return years.map(yr => `
    <div class="awards-year">
      <h3 class="awards-year-h">${yr} Season Awards</h3>
      <div class="awards-grid">
        ${Object.entries(ceblAwards[yr]).map(([k, v]) => v && v.player !== '—' && v.player !== 'Various' ? `
          <div class="award-card">
            <div class="award-label">${labels[k] || k}</div>
            <div class="award-player" data-player-name="${v.player}">${v.player}</div>
            <div class="award-team">${v.team}</div>
            ${v.stats && v.stats !== '—' ? `<div class="award-stats">${v.stats}</div>` : ''}
          </div>
        ` : '').join('')}
      </div>
    </div>
  `).join('');
}

function renderLegendsView() {
  if (typeof ceblLegends === 'undefined') return '<p>Loading...</p>';
  return `
    <div class="legends-grid">
      ${ceblLegends.map(l => `
        <div class="legend-card">
          <div class="legend-avatar has-headshot">${avatarContent(l.player)}</div>
          <div class="legend-content">
            <h3 class="legend-name" data-player-name="${l.player}">${l.player}</h3>
            <div class="legend-team">${l.team} · ${l.years}</div>
            <div class="legend-achievements"><strong>Achievements:</strong> ${l.achievements}</div>
            <div class="legend-legacy">"${l.legacy}"</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTimelineView() {
  if (typeof ceblTimeline === 'undefined') return '<p>Loading...</p>';
  return `
    <div class="timeline-list">
      ${ceblTimeline.map(t => `
        <div class="timeline-item">
          <div class="timeline-year">${t.year}</div>
          <div class="timeline-content">
            <div class="timeline-headline">${t.headline}</div>
            <div class="timeline-note">${t.note}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTriviaView() {
  if (typeof ceblTrivia === 'undefined') return '<p>Loading...</p>';
  const cats = [...new Set(ceblTrivia.map(t => t.category))];
  return cats.map(cat => `
    <div class="trivia-section">
      <h3 class="trivia-cat">${cat}</h3>
      <div class="trivia-list">
        ${ceblTrivia.filter(t => t.category === cat).map(t => `
          <div class="trivia-item impact-${t.impact}">
            <span class="trivia-bullet">●</span>
            <span class="trivia-fact">${t.fact}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ============================================================================
// ===== GLOBAL SEARCH (Cmd+K) =====
// ============================================================================
function openGlobalSearch() {
  const m = document.getElementById('global-search-modal');
  m.classList.add('show');
  setTimeout(() => document.getElementById('global-search-input').focus(), 50);
  document.body.style.overflow = 'hidden';
}

function closeGlobalSearch() {
  document.getElementById('global-search-modal').classList.remove('show');
  document.body.style.overflow = '';
  document.getElementById('global-search-input').value = '';
  document.getElementById('global-search-results').innerHTML = '<div class="gs-hint">Try searching for "Cat Barber", "Brampton", "MVP", or "Elam"</div>';
}

function buildGlobalSearchIndex() {
  const idx = [];
  // Players from all sources
  if (typeof canadiansPro !== 'undefined') canadiansPro.forEach(p => idx.push({ type: 'player', name: p.name, sub: `${p.team} · ${p.league}`, action: () => openPlayerByName(p.name), tab: 'canadians-pro' }));
  if (typeof ncaaCanadians !== 'undefined') ncaaCanadians.forEach(p => idx.push({ type: 'NCAA prospect', name: p.name, sub: `${p.school} · ${p.classYear}`, action: () => switchTab('ncaa-canadians'), tab: 'ncaa-canadians' }));
  if (typeof importTargets !== 'undefined') importTargets.forEach(p => idx.push({ type: 'import', name: p.name, sub: `${p.team} · ${p.league}`, action: () => openPlayerByName(p.name), tab: 'imports' }));
  if (typeof canadianPipeline !== 'undefined') canadianPipeline.forEach(p => idx.push({ type: 'pipeline', name: p.name, sub: `${p.team} · ${p.league}`, action: () => switchTab('pipeline'), tab: 'pipeline' }));
  // Tabs
  const tabs = [
    { name: 'Dashboard', sub: 'Honey Badgers home', tab: 'dashboard' },
    { name: 'Stat Leaders', sub: 'CEBL leaderboards', tab: 'leaderboards' },
    { name: 'Records Book', sub: 'All-time CEBL records, awards, legends, trivia', tab: 'records' },
    { name: 'Pipeline', sub: 'Every Canadian pro worldwide', tab: 'pipeline' },
    { name: 'Elam Ending', sub: 'CEBL signature finish format', tab: 'elam' },
    { name: 'Target Analytics', sub: 'Bonus-point scoring zone', tab: 'target' },
    { name: 'Player Compare', sub: 'Side-by-side comparisons', tab: 'compare' },
    { name: 'Cap Tools', sub: 'Salary cap calculator (Premium)', tab: 'cap-tools' }
  ];
  tabs.forEach(t => idx.push({ type: 'page', name: t.name, sub: t.sub, action: () => switchTab(t.tab), tab: t.tab }));
  // Records & legends as searchable
  if (typeof ceblLegends !== 'undefined') ceblLegends.forEach(l => idx.push({ type: 'legend', name: l.player, sub: `Legend · ${l.years}`, action: () => { switchTab('records'); setTimeout(() => { const btn = document.querySelector('[data-rb="legends"]'); if (btn) switchRecordsTab(btn, 'legends'); }, 50); }, tab: 'records' }));
  // Teams
  const teams = ['Brampton Honey Badgers','Calgary Surge','Edmonton Stingers','Montreal Alliance','Niagara River Lions','Ottawa BlackJacks','Saskatoon Mamba','Scarborough Shooting Stars','Vancouver Bandits','Winnipeg Sea Bears'];
  teams.forEach(t => idx.push({ type: 'team', name: t, sub: 'CEBL Team · 2026', action: () => switchTab('signings'), tab: 'signings' }));
  return idx;
}

let _gsIndex = null;
function performGlobalSearch(q) {
  if (!_gsIndex) _gsIndex = buildGlobalSearchIndex();
  const r = document.getElementById('global-search-results');
  if (!q || q.length < 1) {
    r.innerHTML = '<div class="gs-hint">Try searching for "Cat Barber", "Brampton", "MVP", or "Elam"</div>';
    return;
  }
  const ql = q.toLowerCase();
  const matches = _gsIndex.filter(i => (i.name + ' ' + i.sub).toLowerCase().includes(ql)).slice(0, 25);
  if (!matches.length) {
    r.innerHTML = `<div class="gs-hint">No matches for "${q}"</div>`;
    return;
  }
  r.innerHTML = matches.map((m, i) => `
    <div class="gs-result" data-idx="${i}" onclick="window._gsActions[${i}]();closeGlobalSearch()">
      <span class="gs-type gs-type-${m.type.replace(/\s/g, '-')}">${m.type}</span>
      <div class="gs-result-text">
        <div class="gs-result-name">${m.name}</div>
        <div class="gs-result-sub">${m.sub}</div>
      </div>
    </div>
  `).join('');
  window._gsActions = matches.map(m => m.action);
}

function openPlayerByName(name) {
  if (typeof playerCareerStats !== 'undefined' && playerCareerStats[name]) {
    openPlayerModal(name);
  } else {
    // Fall back to switching to canadians-pro tab
    switchTab('canadians-pro');
  }
}

// ============================================================================
// ===== EXPANDED ELAM ENDING DEEP DIVE (richer fan content) =====
// ============================================================================
const _origRenderElam = typeof renderElamAnalytics === 'function' ? renderElamAnalytics : null;
function renderElamAnalyticsRich() {
  // Run the original first to populate the existing content
  if (_origRenderElam) _origRenderElam();
  const c = document.getElementById('elam-content');
  if (!c) return;
  // Prepend an explainer section for fans
  const explainer = `
    <div class="elam-explainer">
      <div class="elam-hero">
        <div class="elam-hero-badge">📚 The Basics</div>
        <h3>What is the Elam Ending?</h3>
        <p>Instead of running out the clock, CEBL games end when one team hits a <strong>Target Score</strong> — calculated as the leader's score + 9 points (with the Target Score worked into 4-quarter games at the end of regulation). No clock, no stalling, no intentional fouls. Just basketball.</p>
      </div>
      <div class="elam-pillars">
        <div class="elam-pillar"><div class="elam-pillar-icon">🎯</div><h4>How It Works</h4><p>At first stoppage under 3:00 left in Q4, the clock is turned off. The leading team's score plus 9 = Target Score. First to that number wins.</p></div>
        <div class="elam-pillar"><div class="elam-pillar-icon">🏀</div><h4>Why It's Awesome</h4><p>No more late-game free-throw parades. Every game ends with a made basket. Pure pressure. Pure execution. It's basketball at its rawest.</p></div>
        <div class="elam-pillar"><div class="elam-pillar-icon">📊</div><h4>The Strategy</h4><p>Coaches deploy clutch lineups. Defenses bear down. Stars take over. Comebacks become possible — but never automatic. Every possession matters.</p></div>
        <div class="elam-pillar"><div class="elam-pillar-icon">🌟</div><h4>The Origin</h4><p>Created by educator Nick Elam in 2007, popularized by The Basketball Tournament. The CEBL adopted it in 2020 as its signature ending — the league's defining innovation.</p></div>
      </div>
    </div>
  `;
  c.insertAdjacentHTML('afterbegin', explainer);
}

// ============================================================================
// ===== HOMETOWN MAP (Canadian Pipeline storytelling) =====
// ============================================================================
const _origRenderPipeline = typeof renderPipeline === 'function' ? renderPipeline : null;
function renderPipelineEnhanced() {
  if (_origRenderPipeline) _origRenderPipeline();
  // Add hometown summary card to top of pipeline
  if (typeof canadianPipeline === 'undefined') return;
  const pipeline = canadianPipeline;
  const summary = document.getElementById('pipeline-summary');
  if (!summary) return;

  // Aggregate by hometown province / city
  const byProvince = {};
  pipeline.forEach(p => {
    const town = (p.hometown || '').split(',').map(s => s.trim());
    const prov = town[1] || 'Unknown';
    byProvince[prov] = (byProvince[prov] || 0) + 1;
  });
  const provincesSorted = Object.entries(byProvince).sort((a,b) => b[1] - a[1]);

  const byTier = {};
  pipeline.forEach(p => byTier[p.tier] = (byTier[p.tier] || 0) + 1);

  const homeTownsSummary = `
    <div class="pipeline-stats-row">
      <div class="ps-card">
        <div class="ps-num">${pipeline.length}</div>
        <div class="ps-lbl">Canadians Tracked Worldwide</div>
      </div>
      <div class="ps-card">
        <div class="ps-num">${byTier['NBA'] || 0}</div>
        <div class="ps-lbl">In the NBA</div>
      </div>
      <div class="ps-card">
        <div class="ps-num">${(byTier['Europe-Elite']||0) + (byTier['Europe-Top']||0) + (byTier['Europe-Mid']||0)}</div>
        <div class="ps-lbl">In Europe</div>
      </div>
      <div class="ps-card">
        <div class="ps-num">${provincesSorted.length}</div>
        <div class="ps-lbl">Provinces / Regions</div>
      </div>
    </div>
    <div class="hometown-map-block">
      <h3>📍 By Hometown — Where Canadian Pros Are From</h3>
      <div class="hometown-list">
        ${provincesSorted.slice(0, 12).map(([prov, count]) => `
          <div class="hometown-chip">
            <span class="hometown-prov">${prov}</span>
            <span class="hometown-count">${count}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  summary.innerHTML = homeTownsSummary + summary.innerHTML;
}

// ============================================================================
// ===== LIGHT / DARK MODE TOGGLE =====
// ============================================================================
function toggleLightMode() {
  const isLight = document.body.classList.toggle('light-mode');
  try { localStorage.setItem('hi_light_mode', isLight ? '1' : '0'); } catch (e) {}
  const icon = document.getElementById('theme-mode-icon');
  if (icon) icon.textContent = isLight ? '☀️' : '🌙';
}
function _initLightMode() {
  try {
    if (localStorage.getItem('hi_light_mode') === '1') {
      document.body.classList.add('light-mode');
      const icon = document.getElementById('theme-mode-icon');
      if (icon) icon.textContent = '☀️';
    }
  } catch (e) {}
}

// ============================================================================
// ===== SPARKLINE renderer — PPG trend across seasons =====
// ============================================================================
function renderSparkline(values, opts) {
  if (!values || values.length < 2) return '';
  const w = (opts && opts.w) || 70;
  const h = (opts && opts.h) || 22;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = w / (values.length - 1);
  const pts = values.map((v, i) => `${(i * stepX).toFixed(1)},${(h - ((v - min) / range) * (h - 4) - 2).toFixed(1)}`);
  const linePath = `M${pts.join(' L')}`;
  const areaPath = `${linePath} L${w},${h} L0,${h} Z`;
  const lastPt = pts[pts.length - 1].split(',');
  return `<span class="sparkline" style="width:${w}px;height:${h}px;display:inline-block">
    <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
      <path class="area" d="${areaPath}"/>
      <path class="line" d="${linePath}"/>
      <circle class="last" cx="${lastPt[0]}" cy="${lastPt[1]}" r="2.5"/>
    </svg>
  </span>`;
}

// ============================================================================
// ===== GLOBAL PROS — FIBA-emphasis worldwide pro database =====
// ============================================================================
let _gpCountriesSeeded = false;

function _populateGpCountryFilter() {
  if (_gpCountriesSeeded) return;
  if (typeof GLOBAL_PROS === 'undefined') return;
  const sel = document.getElementById('gp-country-filter');
  if (!sel) return;
  const counts = {};
  GLOBAL_PROS.forEach(p => counts[p.country] = (counts[p.country] || 0) + 1);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  sorted.forEach(([country, n]) => {
    const opt = document.createElement('option');
    opt.value = country;
    opt.textContent = `${country} (${n})`;
    sel.appendChild(opt);
  });
  _gpCountriesSeeded = true;
}

function renderGlobalPros() {
  if (typeof GLOBAL_PROS === 'undefined') return;
  _populateGpCountryFilter();

  const search = (document.getElementById('global-pros-search')?.value || '').toLowerCase();
  const tier   = document.getElementById('gp-tier-filter')?.value || '';
  const ctry   = document.getElementById('gp-country-filter')?.value || '';
  const pos    = document.getElementById('gp-pos-filter')?.value || '';
  const fibaOnly = !!document.getElementById('gp-fiba-only')?.checked;

  const filtered = GLOBAL_PROS.filter(p => {
    if (tier && p.tier !== tier) return false;
    if (ctry && p.country !== ctry) return false;
    if (fibaOnly && !p.fibaEligible) return false;
    if (pos) {
      const pp = (p.pos || '').toLowerCase();
      if (pos === 'Guard'   && !pp.includes('guard'))   return false;
      if (pos === 'Forward' && !pp.includes('forward')) return false;
      if (pos === 'Center'  && !pp.includes('center'))  return false;
    }
    if (search) {
      const blob = (p.name + ' ' + p.currentTeam + ' ' + p.country + ' ' + (p.college||'') + ' ' + (p.birthCity||'') + ' ' + p.league).toLowerCase();
      if (!blob.includes(search)) return false;
    }
    return true;
  });

  // Summary
  const summary = document.getElementById('global-pros-summary');
  if (summary) {
    summary.innerHTML = `
      <div class="gp-summary">
        <div class="gp-stat"><div class="gp-stat-num">${filtered.length}</div><div class="gp-stat-lbl">Showing</div></div>
        <div class="gp-stat"><div class="gp-stat-num">${GLOBAL_PROS.length}</div><div class="gp-stat-lbl">Total in DB</div></div>
        <div class="gp-stat"><div class="gp-stat-num">${GLOBAL_PROS_STATS ? Object.keys(GLOBAL_PROS_STATS.byCountry || {}).length : '?'}</div><div class="gp-stat-lbl">Countries</div></div>
        <div class="gp-stat"><div class="gp-stat-num">${GLOBAL_PROS_STATS ? Object.keys(GLOBAL_PROS_STATS.byLeague || {}).length : '?'}</div><div class="gp-stat-lbl">Leagues</div></div>
      </div>
    `;
  }

  const content = document.getElementById('global-pros-content');
  if (!content) return;
  if (filtered.length === 0) {
    content.innerHTML = '<div class="empty-roster">No matching pros.<br><span style="opacity:0.7">Adjust filters or check spelling.</span></div>';
    return;
  }

  content.innerHTML = `
    <div class="gp-grid">
      ${filtered.map(p => `
        <div class="gp-card" data-player-name="${p.name}">
          <div class="gp-avatar has-headshot">${avatarContent(p.name)}</div>
          <div class="gp-info">
            <div class="gp-name">${p.name}</div>
            <div class="gp-meta">${p.pos || '—'}${p.height ? ' · ' + p.height : ''}${p.birthCity ? ' · ' + p.birthCity : ''}</div>
            <div class="gp-team-line">
              <span class="gp-team">${p.currentTeam}</span>
              <span class="gp-league">${p.league}</span>
            </div>
            <div class="gp-tags">
              <span class="gp-tag tier-${(p.tier || '').toLowerCase()}">${p.tier}</span>
              <span class="gp-tag country">${p.country}</span>
              ${p.fibaEligible ? '<span class="gp-tag fiba">FIBA</span>' : ''}
              ${p.college ? `<span class="gp-tag college">${p.college}</span>` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  requestAnimationFrame(() => addPlayerClickHandlers());
}

// ============================================================================
// ===== AUDIENCE MODE (GM / Fan / All) =====
// ============================================================================
function setAudienceMode(mode) {
  document.body.dataset.audienceMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  try { localStorage.setItem('hi_audience_mode', mode); } catch (e) {}

  // If the currently-active tab is hidden under this mode, switch to a sensible default
  const activeTab = document.querySelector('.nav-tab.active');
  if (activeTab && activeTab.style.display === 'none') {
    if (mode === 'gm') switchTab('dashboard');
    else if (mode === 'fan') switchTab('leaderboards');
    else switchTab('dashboard');
  }
}

function _initAudienceMode() {
  let saved = 'fan';
  try { saved = localStorage.getItem('hi_audience_mode') || 'fan'; } catch (e) {}
  setAudienceMode(saved);
}

// ============================================================================
// ===== TEAM ROSTER PAGES =====
// ============================================================================
const CEBL_TEAMS_2026 = [
  { id: 'brampton', name: 'Brampton Honey Badgers', emoji: '🦡', color: '#D4AF37' },
  { id: 'calgary', name: 'Calgary Surge', emoji: '⚡', color: '#E31837' },
  { id: 'edmonton', name: 'Edmonton Stingers', emoji: '🐝', color: '#FFB81C' },
  { id: 'montreal', name: 'Montreal Alliance', emoji: '⚜️', color: '#7B2D8E' },
  { id: 'niagara', name: 'Niagara River Lions', emoji: '🦁', color: '#0066CC' },
  { id: 'ottawa', name: 'Ottawa BlackJacks', emoji: '🃏', color: '#CC0000' },
  { id: 'saskatoon', name: 'Saskatoon Mamba', emoji: '🐍', color: '#00AA00' },
  { id: 'scarborough', name: 'Scarborough Shooting Stars', emoji: '⭐', color: '#1E90FF' },
  { id: 'vancouver', name: 'Vancouver Bandits', emoji: '🏴‍☠️', color: '#FF6B35' },
  { id: 'winnipeg', name: 'Winnipeg Sea Bears', emoji: '🐻', color: '#003366' }
];

function renderTeamRosters() {
  const grid = document.getElementById('team-rosters-grid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="tr-grid">
      ${CEBL_TEAMS_2026.map(t => {
        const signings = (typeof leagueSignings !== 'undefined' && leagueSignings[t.name]) ? leagueSignings[t.name].players.length : 0;
        return `
          <div class="tr-team-card" style="border-color: ${t.color}40" onclick="renderTeamDetail('${t.name.replace(/'/g, "\\'")}')">
            <div class="tr-team-emoji" style="background: ${t.color}20">${t.emoji}</div>
            <div class="tr-team-info">
              <div class="tr-team-name" style="color: ${t.color}">${t.name}</div>
              <div class="tr-team-meta">${signings} signed for 2026</div>
            </div>
            <div class="tr-arrow">→</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderTeamDetail(teamName) {
  const detail = document.getElementById('team-roster-detail');
  if (!detail) return;
  const team = CEBL_TEAMS_2026.find(t => t.name === teamName);
  if (!team) return;

  // Aggregate all known players for this team
  const signings = (typeof leagueSignings !== 'undefined' && leagueSignings[teamName]) ? leagueSignings[teamName].players : [];
  const proCanadians = (typeof canadiansPro !== 'undefined') ? canadiansPro.filter(p => (p.team || '').toLowerCase().includes(teamName.toLowerCase()) || (teamName.toLowerCase().includes((p.team || '').toLowerCase()) && p.team)) : [];
  const imports = (typeof importTargets !== 'undefined') ? importTargets.filter(p => (p.team || '').includes(teamName)) : [];

  detail.innerHTML = `
    <div class="tr-detail" style="border-top: 3px solid ${team.color}">
      <div class="tr-detail-header">
        <button class="tr-back-btn" onclick="document.getElementById('team-roster-detail').innerHTML=''">← Back to Teams</button>
        <h2 style="color: ${team.color}">${team.emoji} ${team.name}</h2>
      </div>

      <div class="tr-section">
        <h3 class="tr-h3">📋 2026 Confirmed Signings (${signings.length})</h3>
        ${signings.length > 0 ? `
          <div class="tr-roster-grid">
            ${signings.map(p => `
              <div class="tr-player-card">
                <div class="tr-player-avatar has-headshot">${avatarContent(p.name)}</div>
                <div class="tr-player-info">
                  <div class="tr-player-name" data-player-name="${p.name}">${p.name}</div>
                  <div class="tr-player-pos">${p.pos} · <span class="tr-tag">${p.type}</span></div>
                  <div class="tr-player-detail">${p.detail}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : '<p class="tr-empty">No 2026 signings tracked yet for this team. Check back soon.</p>'}
      </div>

      ${proCanadians.length > 0 ? `
        <div class="tr-section">
          <h3 class="tr-h3">🇨🇦 Canadians On Roster</h3>
          <div class="tr-roster-grid">
            ${proCanadians.map(p => `
              <div class="tr-player-card">
                <div class="tr-player-avatar has-headshot">${avatarContent(p.name)}</div>
                <div class="tr-player-info">
                  <div class="tr-player-name" data-player-name="${p.name}">${p.name}</div>
                  <div class="tr-player-pos">${p.pos} · ${p.ht} · ${p.hometown}</div>
                  <div class="tr-player-detail">${p.ppg} PPG · ${p.rpg} RPG · ${p.apg} APG</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      ${imports.length > 0 ? `
        <div class="tr-section">
          <h3 class="tr-h3">🌍 Import Players</h3>
          <div class="tr-roster-grid">
            ${imports.map(p => `
              <div class="tr-player-card">
                <div class="tr-player-avatar has-headshot">${avatarContent(p.name)}</div>
                <div class="tr-player-info">
                  <div class="tr-player-name" data-player-name="${p.name}">${p.name}</div>
                  <div class="tr-player-pos">${p.pos} · ${p.nationality}</div>
                  <div class="tr-player-detail">${p.ppg} PPG · ${p.rpg} RPG · ${p.apg} APG</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
  // Smooth scroll into view
  detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  requestAnimationFrame(() => addPlayerClickHandlers());
}

// ============================================================================
// ===== INIT EXTENSIONS =====
// ============================================================================
function _initEnhancements() {
  // Replace renderers with enhanced versions
  if (typeof renderElamAnalytics === 'function') {
    window.renderElamAnalytics = renderElamAnalyticsRich;
  }
  if (typeof renderPipeline === 'function') {
    window.renderPipeline = renderPipelineEnhanced;
  }
}
_initEnhancements();

// ===== Auto-Refresh =====
function refreshAllData() {
  renderHBRoster();
  renderScoutTargets();
  renderProTable();
  renderNCAA();
  renderImports();
  renderSignings();
  renderCapCalculator();
  renderTeamStats();
  renderPipeline();
  renderElamAnalytics();
  renderTargetAnalytics();
  renderAdvancedStats();
  renderLeaderboards();
  renderRecordsContent();
  renderTeamRosters();
  renderGlobalPros();
  populateCompareDropdowns();
  populateWatchlistDropdown();
  renderWatchlist();

  // Defer click handler attachment to after DOM updates
  requestAnimationFrame(() => {
    addPlayerClickHandlers();
    activateAllSortableTables();
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  _initAudienceMode();
  _initLightMode();
  refreshAllData();
  // Check for updates every 2 minutes (enhanced live checks)
  setInterval(checkForUpdates, 2 * 60 * 1000);
  // Initial status
  setLiveStatus('live');

  // Global search keyboard shortcut (Cmd+K / Ctrl+K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openGlobalSearch();
    } else if (e.key === 'Escape') {
      const gs = document.getElementById('global-search-modal');
      if (gs && gs.classList.contains('show')) closeGlobalSearch();
    }
  });

  // Wire up search input
  const gsInput = document.getElementById('global-search-input');
  if (gsInput) gsInput.addEventListener('input', (e) => performGlobalSearch(e.target.value));
});
