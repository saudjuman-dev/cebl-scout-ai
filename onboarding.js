// ===== Hoops Intelligence - Onboarding Tutorial =====

const ONBOARDING = {
  STORAGE_KEY: 'hi_onboarded',
  currentStep: 0,
  active: false,

  CEBL_TEAMS: [
    { name: 'Brampton Honey Badgers', color: '#D4AF37', emoji: '🦡' },
    { name: 'Calgary Surge', color: '#E31837', emoji: '⚡' },
    { name: 'Edmonton Stingers', color: '#FFB81C', emoji: '🐝' },
    { name: 'Montreal Alliance', color: '#7B2D8E', emoji: '⚜️' },
    { name: 'Niagara River Lions', color: '#0066CC', emoji: '🦁' },
    { name: 'Ottawa BlackJacks', color: '#CC0000', emoji: '🃏' },
    { name: 'Saskatoon Mamba', color: '#00AA00', emoji: '🐍' },
    { name: 'Scarborough Shooting Stars', color: '#1E90FF', emoji: '⭐' },
    { name: 'Vancouver Bandits', color: '#FF6B35', emoji: '🏴‍☠️' },
    { name: 'Winnipeg Sea Bears', color: '#003366', emoji: '🐻' }
  ],

  steps: [
    { target: '#main-nav', title: 'Navigation', text: 'Switch between Dashboard, Canadians Pro, NCAA, Imports, Signings, and Cap Calculator to explore all scouting data.', pos: 'below' },
    { target: '#team-bar', title: 'Team Filter', text: 'Click any team to instantly filter signings and see that team\'s roster moves.', pos: 'below' },
    { target: '.stat-card.gold-accent', title: 'Live Stats', text: 'Real-time counts of the entire CEBL talent pool — Canadians in NCAA D1, pros overseas, and more.', pos: 'below' },
    { target: '#hb-roster', title: 'Your Roster', text: 'The Honey Badgers\' confirmed 2026 roster with per-game salaries and cap impact.', pos: 'above' },
    { target: '#scout-targets', title: 'Scouting Targets', text: 'Our top recommended targets based on cap fit, position need, and talent level.', pos: 'above' }
  ],

  hasCompleted() {
    return localStorage.getItem(this.STORAGE_KEY) === '1';
  },

  start() {
    if (this.hasCompleted()) return;
    this.active = true;
    this.currentStep = 0;
    this.render();
  },

  render() {
    // Remove old
    const old = document.getElementById('onboard-root');
    if (old) old.remove();

    const root = document.createElement('div');
    root.id = 'onboard-root';
    root.innerHTML = `
      <div class="ob-backdrop" onclick="ONBOARDING.skip()"></div>
      <div class="ob-card" id="ob-card"></div>
    `;
    document.body.appendChild(root);

    // Small delay to let DOM settle
    setTimeout(() => this.showStep(0), 100);
  },

  showStep(idx) {
    if (idx < 0) idx = 0;
    if (idx >= this.steps.length) { this.showTeamPicker(); return; }
    this.currentStep = idx;
    const step = this.steps[idx];
    const el = document.querySelector(step.target);

    // Scroll to element if found
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Brief highlight
      el.style.outline = '2px solid #D4AF37';
      el.style.outlineOffset = '4px';
      el.style.transition = 'outline 0.3s';
      setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 2500);
    }

    const card = document.getElementById('ob-card');
    if (!card) return;

    const isFirst = idx === 0;
    const isLast = idx === this.steps.length - 1;

    card.innerHTML = `
      <div class="ob-step-label">Step ${idx + 1} of ${this.steps.length}</div>
      <h3 class="ob-title">${step.title}</h3>
      <p class="ob-text">${step.text}</p>
      <div class="ob-dots">${this.steps.map((_, i) => `<span class="ob-dot${i === idx ? ' on' : ''}"></span>`).join('')}</div>
      <div class="ob-btns">
        <button class="ob-btn ob-skip" onclick="ONBOARDING.skip()">Skip</button>
        <div class="ob-nav">
          ${!isFirst ? '<button class="ob-btn ob-prev" onclick="ONBOARDING.showStep(' + (idx - 1) + ')">← Back</button>' : ''}
          <button class="ob-btn ob-next" onclick="ONBOARDING.showStep(${idx + 1})">${isLast ? 'Choose Team →' : 'Next →'}</button>
        </div>
      </div>
    `;
    card.className = 'ob-card visible';
  },

  showTeamPicker() {
    const card = document.getElementById('ob-card');
    if (!card) return;

    card.innerHTML = `
      <div class="ob-step-label">Final Step</div>
      <h3 class="ob-title">Choose Your Team</h3>
      <p class="ob-text">Select your CEBL team to personalize your scouting experience.</p>
      <div class="ob-teams">
        ${this.CEBL_TEAMS.map(t => `
          <button class="ob-team" style="border-color:${t.color}" onclick="ONBOARDING.pickTeam('${t.name.replace(/'/g, "\\'")}')">
            <span>${t.emoji}</span>
            <span>${t.name}</span>
          </button>
        `).join('')}
      </div>
      <div class="ob-btns">
        <button class="ob-btn ob-skip" onclick="ONBOARDING.skip()">Skip</button>
        <button class="ob-btn ob-prev" onclick="ONBOARDING.showStep(${this.steps.length - 1})">← Back</button>
      </div>
    `;
    card.className = 'ob-card visible wide';
  },

  pickTeam(name) {
    localStorage.setItem('hi_favorite_team', name);
    const card = document.getElementById('ob-card');
    if (card) {
      card.innerHTML = `
        <div style="text-align:center;padding:1.5rem 0">
          <svg viewBox="0 0 60 60" fill="none" width="48" height="48" style="margin-bottom:0.75rem"><circle cx="30" cy="30" r="26" stroke="#D4AF37" stroke-width="2.5"/><path d="M12 30h36M30 6c-6 6-6 18-6 24s0 18 6 24M30 6c6 6 6 18 6 24s0 18-6 24" stroke="#D4AF37" stroke-width="1.8"/></svg>
          <h3 style="color:#D4AF37;margin-bottom:0.5rem">You're all set!</h3>
          <p style="color:#aaa;font-size:0.85rem">Welcome to Hoops Intelligence.</p>
        </div>
      `;
    }
    this.finish();
  },

  skip() {
    this.finish();
  },

  finish() {
    localStorage.setItem(this.STORAGE_KEY, '1');
    this.active = false;
    setTimeout(() => {
      const root = document.getElementById('onboard-root');
      if (root) {
        root.style.opacity = '0';
        root.style.transition = 'opacity 0.4s';
        setTimeout(() => root.remove(), 400);
      }
    }, 1200);
  }
};
