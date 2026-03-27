// ===== CEBL Scout - Onboarding Tutorial =====

const ONBOARDING = {
  STORAGE_KEY: 'hi_onboarded',
  currentStep: 0,
  overlay: null,
  spotlight: null,
  tooltip: null,

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
    {
      target: '#main-nav',
      title: 'Navigation',
      text: 'Navigate between Dashboard, Canadians Pro, NCAA, Imports, Signings, and Cap Calculator',
      position: 'bottom'
    },
    {
      target: '#team-bar',
      title: 'Team Filter',
      text: 'Filter by any CEBL team to see their signings and relevant players',
      position: 'bottom'
    },
    {
      target: '.dashboard-grid',
      title: 'Dashboard Stats',
      text: 'At-a-glance stats on the entire CEBL talent pool',
      position: 'bottom'
    },
    {
      target: '#hb-roster',
      title: 'Roster Panel',
      text: 'Your team\'s confirmed 2026 roster with salary info',
      position: 'top'
    },
    {
      target: '#scout-targets',
      title: 'Scout Targets',
      text: 'Our recommended scouting targets based on fit and value',
      position: 'top'
    }
  ],

  hasCompleted() {
    return localStorage.getItem(this.STORAGE_KEY) === '1';
  },

  markCompleted() {
    localStorage.setItem(this.STORAGE_KEY, '1');
  },

  start() {
    if (this.hasCompleted()) return;
    this.currentStep = 0;
    this.createOverlay();
    this.showStep(0);
  },

  createOverlay() {
    // Remove existing if any
    const existing = document.getElementById('onboard-overlay');
    if (existing) existing.remove();

    this.overlay = document.createElement('div');
    this.overlay.id = 'onboard-overlay';
    this.overlay.className = 'onboard-overlay';

    this.spotlight = document.createElement('div');
    this.spotlight.className = 'onboard-spotlight';

    this.tooltip = document.createElement('div');
    this.tooltip.className = 'onboard-tooltip';

    this.overlay.appendChild(this.spotlight);
    this.overlay.appendChild(this.tooltip);
    document.body.appendChild(this.overlay);

    // Fade in
    requestAnimationFrame(() => {
      this.overlay.classList.add('visible');
    });
  },

  showStep(index) {
    if (index < 0 || index >= this.steps.length) {
      this.showTeamPicker();
      return;
    }

    this.currentStep = index;
    const step = this.steps[index];
    const targetEl = document.querySelector(step.target);

    if (!targetEl) {
      // Skip to next if element not found
      this.showStep(index + 1);
      return;
    }

    // Scroll element into view
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Wait for scroll to settle
    setTimeout(() => {
      const rect = targetEl.getBoundingClientRect();
      const padding = 12;

      // Position spotlight
      this.spotlight.style.display = 'block';
      this.spotlight.style.top = (rect.top - padding + window.scrollY) + 'px';
      this.spotlight.style.left = (rect.left - padding) + 'px';
      this.spotlight.style.width = (rect.width + padding * 2) + 'px';
      this.spotlight.style.height = (rect.height + padding * 2) + 'px';
      this.spotlight.style.borderRadius = '12px';

      // Build tooltip content
      const isFirst = index === 0;
      const isLast = index === this.steps.length - 1;
      const stepNum = index + 1;
      const totalSteps = this.steps.length;

      this.tooltip.innerHTML = `
        <div class="onboard-tooltip-header">
          <span class="onboard-step-count">Step ${stepNum} of ${totalSteps}</span>
          <h3>${step.title}</h3>
        </div>
        <p>${step.text}</p>
        <div class="onboard-controls">
          <button class="onboard-btn skip" onclick="ONBOARDING.skip()">Skip Tutorial</button>
          <div class="onboard-nav-btns">
            ${!isFirst ? '<button class="onboard-btn prev" onclick="ONBOARDING.prev()">Previous</button>' : ''}
            <button class="onboard-btn next" onclick="ONBOARDING.next()">${isLast ? 'Next' : 'Next'}</button>
          </div>
        </div>
        <div class="onboard-dots">
          ${this.steps.map((_, i) => `<span class="onboard-dot ${i === index ? 'active' : ''}"></span>`).join('')}
        </div>
      `;

      // Position tooltip
      this.positionTooltip(rect, step.position);
      this.tooltip.style.display = 'block';
    }, 350);
  },

  positionTooltip(rect, position) {
    const tooltipWidth = 340;
    const gap = 20;
    let top, left;

    if (position === 'bottom') {
      top = rect.bottom + gap + window.scrollY;
      left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
    } else {
      // top
      top = rect.top - gap + window.scrollY;
      left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
      // We'll adjust after rendering to go above
    }

    // Clamp left
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

    this.tooltip.style.left = left + 'px';
    this.tooltip.style.width = tooltipWidth + 'px';

    if (position === 'top') {
      // Place above - we need to measure tooltip height first
      this.tooltip.style.top = '0px';
      this.tooltip.style.visibility = 'hidden';
      this.tooltip.style.display = 'block';
      const tooltipHeight = this.tooltip.offsetHeight;
      this.tooltip.style.visibility = '';
      top = rect.top - tooltipHeight - gap + window.scrollY;
    }

    this.tooltip.style.top = top + 'px';
  },

  next() {
    if (this.currentStep >= this.steps.length - 1) {
      this.showTeamPicker();
    } else {
      this.showStep(this.currentStep + 1);
    }
  },

  prev() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  },

  skip() {
    this.markCompleted();
    this.destroy();
  },

  showTeamPicker() {
    // Hide spotlight
    this.spotlight.style.display = 'none';

    // Show team picker in tooltip area - center it
    this.tooltip.style.top = '50%';
    this.tooltip.style.left = '50%';
    this.tooltip.style.transform = 'translate(-50%, -50%)';
    this.tooltip.style.width = '480px';
    this.tooltip.style.maxWidth = '90vw';
    this.tooltip.style.position = 'fixed';

    this.tooltip.innerHTML = `
      <div class="onboard-tooltip-header" style="text-align:center">
        <h3>Choose Your Team</h3>
        <p style="color:#888; font-size:0.8rem; margin-top:0.25rem">Select your favorite CEBL team to personalize your experience</p>
      </div>
      <div class="team-picker">
        ${this.CEBL_TEAMS.map(t => `
          <button class="team-picker-btn" data-team="${t.name}" style="--team-color: ${t.color}" onclick="ONBOARDING.selectTeam('${t.name.replace(/'/g, "\\'")}')">
            <span class="team-picker-emoji">${t.emoji}</span>
            <span class="team-picker-name">${t.name.replace(/^(Brampton|Calgary|Edmonton|Montreal|Niagara|Ottawa|Saskatoon|Scarborough|Vancouver|Winnipeg)\s/, '')}</span>
          </button>
        `).join('')}
      </div>
      <div class="onboard-controls" style="margin-top:1rem">
        <button class="onboard-btn skip" onclick="ONBOARDING.skip()">Skip</button>
        <button class="onboard-btn prev" onclick="ONBOARDING.backToSteps()">Back</button>
      </div>
    `;
  },

  backToSteps() {
    this.tooltip.style.transform = '';
    this.tooltip.style.position = '';
    this.showStep(this.steps.length - 1);
  },

  selectTeam(teamName) {
    localStorage.setItem('hi_favorite_team', teamName);
    this.markCompleted();

    // Brief confirmation
    this.tooltip.innerHTML = `
      <div style="text-align:center; padding: 1.5rem 0">
        <div style="font-size:2.5rem; margin-bottom:0.75rem">🏀</div>
        <h3 style="color:#D4AF37; margin-bottom:0.5rem">Let's go!</h3>
        <p style="color:#aaa; font-size:0.85rem">You're all set. Welcome to CEBL Scout.</p>
      </div>
    `;

    setTimeout(() => {
      this.destroy();
    }, 1500);
  },

  destroy() {
    if (this.overlay) {
      this.overlay.classList.remove('visible');
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
        this.spotlight = null;
        this.tooltip = null;
      }, 400);
    }
  }
};
