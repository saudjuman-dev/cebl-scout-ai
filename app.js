// ===== CEBL Scout - Application Logic =====

// Password gate
function checkPassword() {
  const input = document.getElementById('gate-password').value;
  if (input === 'ceblscout2026') {
    document.getElementById('password-gate').classList.add('hidden');
    document.getElementById('loading-screen').style.display = 'flex';
    setTimeout(() => {
      document.getElementById('loading-screen').classList.add('hidden');
      animateCounters();
      animateCapBar();
    }, 2200);
  } else {
    document.getElementById('gate-error').textContent = 'Invalid access code. Try again.';
    document.getElementById('gate-password').value = '';
  }
}

// Loading screen (only fires if gate is bypassed via session)
window.addEventListener('load', () => {
  // Gate handles the loading flow now
});

// Tab switching
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tabId).classList.add('active');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}

// Animate stat counters
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    let current = 0;
    const increment = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 30);
  });
}

// Get initials from name
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// ===== Render Honey Badgers Roster =====
function renderHBRoster() {
  const container = document.getElementById('hb-roster');
  container.innerHTML = honeyBadgersRoster.map(p => `
    <div class="roster-card">
      <div class="roster-avatar">${getInitials(p.name)}</div>
      <div class="roster-card-info">
        <h4>${p.name}</h4>
        <div class="roster-meta">${p.pos} | ${p.nationality === 'CAN' ? '🇨🇦 Canadian' : p.nationality === 'USA' ? '🇺🇸 Import' : '🌍 Import (' + p.nationality + ')'} | $${p.salary}/game</div>
        <div class="roster-stat">${p.stats.split('(')[0].trim()}</div>
      </div>
    </div>
  `).join('');
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
        <div class="scout-avatar">${getInitials(t.name)}</div>
        <div>
          <div class="scout-name">${t.name}</div>
          <div class="scout-detail">${t.pos} | ${t.from}</div>
        </div>
      </div>
      <div class="scout-stats">
        <div class="scout-stat-item">
          <div class="scout-stat-val">${t.ppg}</div>
          <div class="scout-stat-lbl">PPG</div>
        </div>
        <div class="scout-stat-item">
          <div class="scout-stat-val">${t.rpg}</div>
          <div class="scout-stat-lbl">RPG</div>
        </div>
        <div class="scout-stat-item">
          <div class="scout-stat-val">${t.apg}</div>
          <div class="scout-stat-lbl">APG</div>
        </div>
      </div>
      <div class="scout-tags">
        <span class="scout-tag fit-${t.fit.toLowerCase()}">${t.fit} Fit</span>
        <span class="scout-tag ${t.type === 'Canadian' ? 'canadian' : ''}">${t.type === 'Canadian' ? '🇨🇦 Canadian' : '🌍 Import'}</span>
        ${t.tags.map(tag => `<span class="scout-tag">${tag}</span>`).join('')}
      </div>
      <div class="scout-salary">
        <span>Est. Salary</span>
        <span class="scout-salary-val">${t.salary}</span>
      </div>
      <p style="font-size:0.6875rem; color: var(--gray); margin-top: 0.5rem;">${t.reason}</p>
    </div>
  `).join('');
}

// ===== Mobile Card Helper =====
function mobileCard(avatar, name, sub, stats, tags, note, searchStr, dataAttrs) {
  const attrs = dataAttrs ? Object.entries(dataAttrs).map(([k,v]) => `data-${k}="${v}"`).join(' ') : '';
  return `<div class="mobile-card" data-search="${(searchStr||name+' '+sub+' '+(note||'')).toLowerCase()}" ${attrs}>
    <div class="mobile-card-header">
      <div class="player-avatar">${avatar}</div>
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
      <td>
        <div class="player-cell">
          <div class="player-avatar">${getInitials(p.name)}</div>
          <div>
            <div class="player-name">${p.name}</div>
            <div style="font-size:0.625rem; color: var(--gray)">${p.hometown}</div>
          </div>
        </div>
      </td>
      <td>${p.pos}</td>
      <td>${p.age}</td>
      <td>${p.ht}</td>
      <td>${p.team}</td>
      <td>${p.league}</td>
      <td><strong>${p.ppg}</strong></td>
      <td>${p.rpg}</td>
      <td>${p.apg}</td>
      <td><span class="fit-badge fit-${p.fit.toLowerCase()}">${p.fit}</span></td>
      <td style="color: var(--gold); font-weight: 600">${p.salary}</td>
      <td><span class="character-badge char-${p.character.toLowerCase() === 'good' ? 'good' : 'neutral'}">${p.character === 'Good' ? '✓ ' : ''}${p.character}</span></td>
    </tr>
  `).join('');

  // Mobile cards
  const mc = document.getElementById('pro-mobile-cards');
  if (mc) mc.innerHTML = canadiansPro.map(p => mobileCard(
    getInitials(p.name), p.name,
    `${p.pos} | ${p.ht} | ${p.hometown}`,
    [{v:p.ppg,l:'PPG'},{v:p.rpg,l:'RPG'},{v:p.apg,l:'APG'}],
    [
      {text: p.fit + ' Fit', cls: 'fit-' + p.fit.toLowerCase()},
      {text: p.salary, cls: 'gold'},
      {text: p.team},
      {text: '🇨🇦 ' + p.league}
    ],
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
      <td>
        <div class="player-cell">
          <div class="player-avatar">${getInitials(p.name)}</div>
          <div>
            <div class="player-name">${p.name}</div>
            <div style="font-size:0.625rem; color: var(--gray)">${p.hometown}</div>
          </div>
        </div>
      </td>
      <td>${p.pos}</td>
      <td>${p.ht}</td>
      <td><strong>${p.school}</strong></td>
      <td>${p.conf}</td>
      <td>${p.classYear}</td>
      <td>${p.hometown}</td>
      <td><strong>${p.ppg}</strong></td>
      <td>${p.rpg}</td>
      <td>${p.apg}</td>
      <td><span class="fit-badge fit-${p.fit.toLowerCase()}">${p.fit}</span></td>
      <td style="font-size:0.6875rem">${p.draftEligible}</td>
    </tr>
  `).join('');

  // Mobile cards
  const mc = document.getElementById('ncaa-mobile-cards');
  if (mc) mc.innerHTML = ncaaCanadians.map(p => mobileCard(
    getInitials(p.name), p.name,
    `${p.pos} | ${p.ht} | ${p.classYear}`,
    [{v:p.ppg,l:'PPG'},{v:p.rpg,l:'RPG'},{v:p.apg,l:'APG'}],
    [
      {text: p.fit + ' Fit', cls: 'fit-' + p.fit.toLowerCase()},
      {text: p.school},
      {text: p.conf},
      {text: '🇨🇦 ' + p.hometown}
    ],
    p.note + ' | Draft: ' + p.draftEligible
  )).join('');
}

// ===== Render Import Table =====
function renderImports() {
  const tbody = document.getElementById('import-tbody');
  tbody.innerHTML = importTargets.map(p => `
    <tr data-search="${(p.name + ' ' + (p.nationality||'') + ' ' + p.team + ' ' + p.league + ' ' + p.note).toLowerCase()}" data-nat="${p.nationality}" data-pos="${p.pos.charAt(0)}" data-fit="${p.fit}">
      <td>
        <div class="player-cell">
          <div class="player-avatar">${getInitials(p.name)}</div>
          <div class="player-name">${p.name}</div>
        </div>
      </td>
      <td>${p.nationality === 'USA' ? '🇺🇸 USA' : p.nationality === 'CAN/FRA' ? '🇨🇦🇫🇷 CAN/FRA' : p.nationality === 'NZL' ? '🇳🇿 NZL' : p.nationality === 'BRB' ? '🇧🇧 BRB' : p.nationality === 'International' ? '🌍 Intl' : '🌍 ' + p.nationality}</td>
      <td>${p.pos}</td>
      <td>${p.age || '-'}</td>
      <td>${p.ht || '-'}</td>
      <td>${p.team}</td>
      <td>${p.league}</td>
      <td><strong>${p.ppg}</strong></td>
      <td>${p.rpg}</td>
      <td>${p.apg}</td>
      <td><span class="fit-badge fit-${p.fit.toLowerCase()}">${p.fit}</span></td>
      <td style="color: var(--gold); font-weight: 600">${p.salary}</td>
      <td style="font-size:0.6875rem; max-width: 200px; white-space: normal;">${p.note}</td>
    </tr>
  `).join('');

  // Mobile cards
  const mc = document.getElementById('import-mobile-cards');
  if (mc) mc.innerHTML = importTargets.map(p => {
    const flag = p.nationality === 'USA' ? '🇺🇸' : p.nationality === 'NZL' ? '🇳🇿' : p.nationality === 'AUS' ? '🇦🇺' : p.nationality === 'BRB' ? '🇧🇧' : '🌍';
    return mobileCard(
      getInitials(p.name), p.name,
      `${flag} ${p.nationality} | ${p.pos} | ${p.ht || ''}`,
      [{v:p.ppg,l:'PPG'},{v:p.rpg,l:'RPG'},{v:p.apg,l:'APG'}],
      [
        {text: p.fit + ' Fit', cls: 'fit-' + p.fit.toLowerCase()},
        {text: p.salary, cls: 'gold'},
        {text: p.team},
        {text: p.league}
      ],
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
        <div class="signing-team-logo" style="background: ${data.bg}; border: 1px solid ${data.color}">${data.emoji}</div>
        <span class="signing-team-name ${team === 'Brampton Honey Badgers' ? 'hb' : ''}">${team}</span>
        <span class="signing-team-count">${data.players.length} player${data.players.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="signing-players">
        ${data.players.map(p => `
          <div class="signing-player">
            <div class="sp-avatar">${getInitials(p.name)}</div>
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
// Helper: filter both table rows AND mobile cards
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
      const textMatch = !searchVal || teamName.toLowerCase().includes(searchVal) ||
        section.textContent.toLowerCase().includes(searchVal);
      section.style.display = (teamMatch && textMatch) ? '' : 'none';
    });
  }
}

// ===== Cap Calculator =====
function renderCapCalculator() {
  const container = document.getElementById('calc-slots');
  const slots = [];

  // Pre-fill with current HB roster
  honeyBadgersRoster.forEach((p, i) => {
    slots.push({ num: i + 1, name: p.name, type: p.type, salary: p.salary });
  });

  // Add empty slots up to 12
  for (let i = honeyBadgersRoster.length; i < 12; i++) {
    slots.push({ num: i + 1, name: '', type: 'TBD', salary: 400 });
  }

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

  updateCalc();
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
}

// ===== Team Filter (Team Bar) =====
function filterByTeam(team) {
  // Update active chip
  document.querySelectorAll('.team-chip').forEach(c => c.classList.remove('active'));
  document.querySelector(`.team-chip[data-team="${team}"]`).classList.add('active');

  if (team === 'all') {
    // Show everything, switch to dashboard
    switchTab('dashboard');
    return;
  }

  // Switch to signings tab and filter to that team
  switchTab('signings');
  document.getElementById('sign-team-filter').value = team;
  filterTable('sign');
}

// ===== Auto-Refresh / Cache Bust =====
function refreshAllData() {
  renderHBRoster();
  renderScoutTargets();
  renderProTable();
  renderNCAA();
  renderImports();
  renderSignings();
  renderCapCalculator();
  // Update the last-updated timestamp
  const ts = document.getElementById('last-updated');
  if (ts) ts.textContent = 'Last refreshed: ' + new Date().toLocaleString();
}

// Check for data.js updates every 5 minutes
function checkForUpdates() {
  const script = document.createElement('script');
  script.src = 'data.js?v=' + Date.now();
  script.onload = () => {
    refreshAllData();
    console.log('[CEBL Scout] Data refreshed at ' + new Date().toLocaleTimeString());
  };
  document.head.appendChild(script);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  refreshAllData();
  // Auto-refresh data every 5 minutes
  setInterval(checkForUpdates, 5 * 60 * 1000);
});
