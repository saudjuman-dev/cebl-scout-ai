// ===== Hoops Intelligence — Onboarding & User Preferences =====
// First-time flow: pick role (Fan / GM-Coach), then team if applicable.
// Settings can be opened anytime from the header to change either choice.

const ONBOARDING = {
  STORAGE_KEY: 'hi_onboarded',
  ROLE_KEY: 'hi_user_role',          // 'fan' | 'gm'
  TEAM_KEY: 'hi_home_team',           // 'brampton' | 'calgary' | etc. (matches CEBL_THEMES ids)
  active: false,

  CEBL_TEAMS: [
    { id: 'brampton',     name: 'Brampton Honey Badgers',      color: '#D4AF37', emoji: '🦡', city: 'Brampton, ON',          rec2025: '7-15',  identity: 'Rebuilding around hometown talent. New HC Alex Cerda (10 yrs NBA).' },
    { id: 'calgary',      name: 'Calgary Surge',                color: '#E31837', emoji: '⚡',  city: 'Calgary, AB',           rec2025: '17-7',  identity: '2025 Western Conf. Champs · DPOY (Nelson Jr.) · 3rd straight Championship Wknd.' },
    { id: 'edmonton',     name: 'Edmonton Stingers',            color: '#FFB81C', emoji: '🐝',  city: 'Edmonton, AB',          rec2025: '13-11', identity: '3x champion (2019-21). Re-tooling after Sean East II departure.' },
    { id: 'montreal',     name: 'Montreal Alliance',            color: '#7B2D8E', emoji: '⚜️', city: 'Montréal, QC',         rec2025: '7-13',  identity: 'Quebec\'s team. Strong local Canadian content. Looking for an offensive identity.' },
    { id: 'niagara',      name: 'Niagara River Lions',          color: '#0066CC', emoji: '🦁',  city: 'St. Catharines, ON',    rec2025: '15-9',  identity: 'Back-to-back champions (2024, 2025). Defensive identity. Khalil Ahmad finals MVP.' },
    { id: 'ottawa',       name: 'Ottawa BlackJacks',            color: '#CC0000', emoji: '🃏',  city: 'Ottawa, ON',            rec2025: '12-10', identity: 'Aggressive perimeter defense. Returning Rohlehr, Harmon, Daniel for 2026.' },
    { id: 'saskatoon',    name: 'Saskatoon Mamba',              color: '#00AA00', emoji: '🐍',  city: 'Saskatoon, SK',         rec2025: '10-12', identity: 'Rebranded Feb 2026 (was Saskatchewan Rattlers). New HC Isaiah Fox (G League).' },
    { id: 'scarborough',  name: 'Scarborough Shooting Stars',   color: '#1E90FF', emoji: '⭐',  city: 'Scarborough, ON',       rec2025: '11-13', identity: '2023 champions. Cat Barber-led offense. Returning core for 2026.' },
    { id: 'vancouver',    name: 'Vancouver Bandits',            color: '#FF6B35', emoji: '🏴‍☠️', city: 'Langley, BC',           rec2025: '19-5',  identity: 'League-best record. MVP Mitch Creek + CanPOY Tyrese Samuel returning.' },
    { id: 'winnipeg',     name: 'Winnipeg Sea Bears',           color: '#003366', emoji: '🐻',  city: 'Winnipeg, MB',          rec2025: '13-11', identity: 'Loaded for 2026: Xavier Moon + Akot + Osborne + Walker. Title window.' }
  ],

  // ---------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------
  hasCompleted() { return localStorage.getItem(this.STORAGE_KEY) === '1'; },
  getRole()      { return localStorage.getItem(this.ROLE_KEY) || null; },
  getHomeTeam()  { return localStorage.getItem(this.TEAM_KEY) || null; },

  setRole(role) {
    localStorage.setItem(this.ROLE_KEY, role);
    if (typeof setAudienceMode === 'function') setAudienceMode(role === 'gm' ? 'gm' : 'fan');
  },
  setHomeTeam(teamId) {
    localStorage.setItem(this.TEAM_KEY, teamId);
    if (typeof applyTheme === 'function') applyTheme(teamId);
    if (typeof refreshAllData === 'function') refreshAllData();
  },

  // ---------------------------------------------------------------
  // First-time onboarding flow
  // ---------------------------------------------------------------
  start() {
    if (this.hasCompleted()) return;
    this.active = true;
    this._renderRoleStep();
  },

  // Open from settings button — bypasses the "completed" check
  openSettings() {
    this._renderSettings();
  },

  _root() {
    let root = document.getElementById('onboard-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'onboard-root';
      document.body.appendChild(root);
    }
    return root;
  },

  _close() {
    const root = document.getElementById('onboard-root');
    if (root) {
      root.style.opacity = '0';
      setTimeout(() => root.remove(), 300);
    }
    this.active = false;
  },

  _shell(content) {
    const root = this._root();
    root.style.opacity = '1';
    root.innerHTML = `
      <div class="ob-backdrop"></div>
      <div class="ob-card visible wide">${content}</div>
    `;
  },

  _renderRoleStep() {
    this._shell(`
      <div class="ob-step-label">Step 1 of 2 · Welcome to Hoops Intelligence</div>
      <h3 class="ob-title">How will you use this?</h3>
      <p class="ob-text">Pick the experience that matches you. You can change this anytime in Settings.</p>
      <div class="role-picker">
        <button class="role-card" onclick="ONBOARDING._chooseRole('gm')">
          <div class="role-icon">📋</div>
          <div class="role-name">GM / Head Coach</div>
          <div class="role-sub">Build rosters, run cap math, scout prospects</div>
          <ul class="role-feats">
            <li>Salary cap calculator</li>
            <li>Canadian pros, NCAA, Imports</li>
            <li>Advanced metrics &amp; watchlists</li>
            <li>Team-by-team rosters</li>
          </ul>
        </button>
        <button class="role-card" onclick="ONBOARDING._chooseRole('fan')">
          <div class="role-icon">🏀</div>
          <div class="role-name">Fan</div>
          <div class="role-sub">Records, stats, the Canadian basketball story</div>
          <ul class="role-feats">
            <li>Stat leaders &amp; CEBL records book</li>
            <li>Canadian Pipeline (worldwide)</li>
            <li>Elam Ending &amp; Target deep-dives</li>
            <li>Side-by-side player compare</li>
          </ul>
        </button>
      </div>
      <div class="ob-btns">
        <button class="ob-btn ob-skip" onclick="ONBOARDING._skip()">Skip — show all tools</button>
      </div>
    `);
  },

  _chooseRole(role) {
    this.setRole(role);
    if (role === 'gm') {
      this._renderTeamStep();
    } else {
      this._renderDoneStep();
    }
  },

  _renderTeamStep() {
    const currentTeam = this.getHomeTeam();
    this._shell(`
      <div class="ob-step-label">Step 2 of 4 · Your team</div>
      <h3 class="ob-title">Which CEBL team are you with?</h3>
      <p class="ob-text">Pick your franchise. We'll personalize your dashboard, signings tracker, and apply your team's colors site-wide.</p>
      <div class="team-scout-grid">
        ${this.CEBL_TEAMS.map(t => `
          <button class="team-scout-card ${t.id === currentTeam ? 'selected' : ''}" data-team-id="${t.id}" style="--team-color:${t.color}; --team-glow:${t.color}33" onclick="ONBOARDING._chooseTeam('${t.id}')">
            <div class="tsc-emoji">${t.emoji}</div>
            <div class="tsc-content">
              <div class="tsc-name">${t.name}</div>
              <div class="tsc-city">${t.city}</div>
              <div class="tsc-row">
                <span class="tsc-record">2025: <strong>${t.rec2025}</strong></span>
              </div>
              <div class="tsc-identity">${t.identity}</div>
            </div>
            <span class="tsc-strip" style="background:${t.color}"></span>
          </button>
        `).join('')}
      </div>
      <div class="ob-btns">
        <button class="ob-btn ob-prev" onclick="ONBOARDING._renderRoleStep()">← Back</button>
        <button class="ob-btn ob-skip" onclick="ONBOARDING._renderTourStep()">Skip — pick later</button>
      </div>
    `);
  },

  _chooseTeam(teamId) {
    this.setHomeTeam(teamId);
    document.querySelectorAll('.team-scout-card').forEach(b => b.classList.toggle('selected', b.dataset.teamId === teamId));
    setTimeout(() => this._renderTourStep(), 450);
  },

  // Step 3: GM-only feature tour (Fan users skip this)
  _renderTourStep() {
    if (this.getRole() !== 'gm') { this._renderDoneStep(); return; }
    this._shell(`
      <div class="ob-step-label">Step 3 of 4 · Your toolkit</div>
      <h3 class="ob-title">Built for the work</h3>
      <p class="ob-text">Five pillars you'll use most. All available in your GM view from day one.</p>
      <div class="feature-tour-grid">
        <div class="ft-card">
          <div class="ft-icon">💰</div>
          <h4>Cap Calculator</h4>
          <p>Build your 12-man active roster against the $8K/game cap. Designated player off-cap. Up to 3 dev players off-cap. Real-time math.</p>
        </div>
        <div class="ft-card">
          <div class="ft-icon">🇨🇦</div>
          <h4>Canadian Pipeline</h4>
          <p>Every Canadian playing pro worldwide — NBA, G League, Europe, Australia, Asia. Filterable by tier, position, hometown.</p>
        </div>
        <div class="ft-card">
          <div class="ft-icon">🌎</div>
          <h4>Import Targets</h4>
          <p>Pre-vetted free agents from CEBL-realistic leagues (BBL, LNB, Israel, NBL, NZ). Fit grades, salary tiers, agent contacts as available.</p>
        </div>
        <div class="ft-card">
          <div class="ft-icon">⚖️</div>
          <h4>Player Compare</h4>
          <p>Side-by-side stat overlays. Percentile bars. Career arcs. Make the call between two import options or two Canadians.</p>
        </div>
        <div class="ft-card">
          <div class="ft-icon">📈</div>
          <h4>Advanced Metrics</h4>
          <p>TS%, Usage Rate, Net Rating, PER, OffRtg / DefRtg. Beyond box-score scouting for matchups and rotations.</p>
        </div>
        <div class="ft-card">
          <div class="ft-icon">🔔</div>
          <h4>Watchlist</h4>
          <p>Pin players you're tracking. Quick-glance dashboard of your scouting shortlist.</p>
        </div>
      </div>
      <div class="ob-btns">
        <button class="ob-btn ob-prev" onclick="ONBOARDING._renderTeamStep()">← Back</button>
        <button class="ob-btn ob-next" onclick="ONBOARDING._renderRulesStep()">CEBL roster rules →</button>
      </div>
    `);
  },

  // Step 4: GM-only — quick reference card for CEBL roster rules
  _renderRulesStep() {
    if (this.getRole() !== 'gm') { this._renderDoneStep(); return; }
    this._shell(`
      <div class="ob-step-label">Step 4 of 4 · Roster rules</div>
      <h3 class="ob-title">CEBL rules at a glance</h3>
      <p class="ob-text">The cap rules every CEBL GM lives by. We've baked them into every tool — but it pays to know the boundaries.</p>
      <div class="rules-card-grid">
        <div class="rule-card hot">
          <div class="rc-num">$8,000</div>
          <div class="rc-label">Per-Game Cap</div>
          <div class="rc-desc">Active 12-man roster, total per game</div>
        </div>
        <div class="rule-card">
          <div class="rc-num">14 / 12 / 10</div>
          <div class="rc-label">Total / Active / Min</div>
          <div class="rc-desc">Roster size limits</div>
        </div>
        <div class="rule-card">
          <div class="rc-num">5 / 6</div>
          <div class="rc-label">Max Imports — Active / Total</div>
          <div class="rc-desc">Non-Canadian player cap</div>
        </div>
        <div class="rule-card hot">
          <div class="rc-num">6+</div>
          <div class="rc-label">Min Canadians</div>
          <div class="rc-desc">Always 2 on the floor</div>
        </div>
        <div class="rule-card">
          <div class="rc-num">1</div>
          <div class="rc-label">Designated Player</div>
          <div class="rc-desc">Off-cap. Use it on a star.</div>
        </div>
        <div class="rule-card">
          <div class="rc-num">3</div>
          <div class="rc-label">Dev Players</div>
          <div class="rc-desc">Up to 3 off-cap (rookies / U-Sports)</div>
        </div>
      </div>
      <div class="ob-tip">💡 <strong>Pro tip:</strong> Designated Player + 3 Dev = up to 4 off-cap roster spots. Stretch your $8K cap further by stacking quality on the in-cap 8.</div>
      <div class="ob-btns">
        <button class="ob-btn ob-prev" onclick="ONBOARDING._renderTourStep()">← Back</button>
        <button class="ob-btn ob-next" onclick="ONBOARDING._renderDoneStep()">Finish →</button>
      </div>
    `);
  },

  _renderDoneStep() {
    const role = this.getRole();
    const teamId = this.getHomeTeam();
    const team = this.CEBL_TEAMS.find(t => t.id === teamId);
    this._shell(`
      <div class="ob-done">
        <svg viewBox="0 0 60 60" fill="none" width="56" height="56" style="margin-bottom:0.75rem">
          <circle cx="30" cy="30" r="26" stroke="currentColor" stroke-width="2.5"/>
          <path d="M12 30h36M30 6c-6 6-6 18-6 24s0 18 6 24M30 6c6 6 6 18 6 24s0 18-6 24" stroke="currentColor" stroke-width="1.8"/>
        </svg>
        <h3 class="ob-title">You're all set!</h3>
        <p class="ob-text">
          ${role === 'gm'
            ? `Your view: <strong>GM / Coach</strong>${team ? ` · <strong>${team.emoji} ${team.name}</strong>` : ''}.<br>Open <em>Settings</em> in the header anytime to change.`
            : `Your view: <strong>Fan</strong>.<br>Browse Records, Leaders, and the Canadian Pipeline.`}
        </p>
        <div class="ob-btns" style="justify-content:center">
          <button class="ob-btn ob-next" onclick="ONBOARDING._finish()">Let's go →</button>
        </div>
      </div>
    `);
  },

  _skip() {
    // Mark onboarded but with no role/team — defaults to All Tools view
    if (typeof setAudienceMode === 'function') setAudienceMode('all');
    this._finish();
  },

  _finish() {
    localStorage.setItem(this.STORAGE_KEY, '1');
    this._close();
  },

  // ---------------------------------------------------------------
  // Settings (re-entry from header button)
  // ---------------------------------------------------------------
  _renderSettings() {
    const currentRole = this.getRole();
    const currentTeam = this.getHomeTeam();
    this._shell(`
      <div class="ob-step-label">Settings</div>
      <h3 class="ob-title">⚙️  Your preferences</h3>
      <p class="ob-text">Update your role or favorite team — saved instantly.</p>

      <div class="settings-section">
        <h4 class="settings-h">Your role</h4>
        <div class="settings-roles">
          <button class="settings-role ${currentRole === 'gm' ? 'selected' : ''}" onclick="ONBOARDING.setRole('gm');ONBOARDING._renderSettings()">
            <span class="role-icon">📋</span>
            <span>GM / Head Coach</span>
          </button>
          <button class="settings-role ${currentRole === 'fan' ? 'selected' : ''}" onclick="ONBOARDING.setRole('fan');ONBOARDING._renderSettings()">
            <span class="role-icon">🏀</span>
            <span>Fan</span>
          </button>
          <button class="settings-role ${!currentRole ? 'selected' : ''}" onclick="ONBOARDING.setRole('');if(typeof setAudienceMode==='function')setAudienceMode('all');ONBOARDING._renderSettings()">
            <span class="role-icon">⚡</span>
            <span>Show All Tools</span>
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h4 class="settings-h">Your home team ${currentRole !== 'gm' ? '<small style="color:#888">(applies in any role)</small>' : ''}</h4>
        <div class="ob-teams team-grid">
          ${this.CEBL_TEAMS.map(t => `
            <button class="ob-team team-pick ${t.id === currentTeam ? 'selected' : ''}" data-team-id="${t.id}" style="--team-color:${t.color}" onclick="ONBOARDING.setHomeTeam('${t.id}');ONBOARDING._renderSettings()">
              <span class="ob-team-emoji">${t.emoji}</span>
              <span class="ob-team-name">${t.name.replace(/^[A-Z][a-z]+ /, '')}</span>
              <span class="ob-team-strip" style="background:${t.color}"></span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="ob-btns" style="justify-content:flex-end">
        <button class="ob-btn ob-next" onclick="ONBOARDING._close()">Done</button>
      </div>
    `);
  }
};

// Auto-apply saved prefs on load (before refreshAllData runs in app.js)
(function applySavedPrefsEarly() {
  try {
    const role = localStorage.getItem('hi_user_role');
    const team = localStorage.getItem('hi_home_team');
    if (team && typeof applyTheme === 'function') applyTheme(team, { skipTransition: true });
    document.addEventListener('DOMContentLoaded', () => {
      if (role && typeof setAudienceMode === 'function') setAudienceMode(role === 'gm' ? 'gm' : 'fan');
      // Trigger first-time onboarding if not yet done
      if (!ONBOARDING.hasCompleted()) {
        // Small delay so app initializes first
        setTimeout(() => ONBOARDING.start(), 600);
      }
    });
  } catch (e) {}
})();
