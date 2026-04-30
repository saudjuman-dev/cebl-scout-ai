// ===== CEBL Team Theme System =====
// One-click theme switcher. Animates the entire site to a chosen team's colors.
// Saved per-user in localStorage so it persists across sessions.

const CEBL_THEMES = {
  brampton: {
    id: 'brampton',
    name: 'Brampton Honey Badgers',
    short: 'Brampton',
    emoji: '🦡',
    colors: {
      gold: '#D4AF37',          // Primary accent (replaces gold)
      goldLight: '#FFD700',     // Lighter
      goldDark: '#B8860B',      // Darker
      goldMuted: 'rgba(212, 175, 55, 0.15)',
      goldGlow: 'rgba(212, 175, 55, 0.3)'
    }
  },
  calgary: {
    id: 'calgary',
    name: 'Calgary Surge',
    short: 'Calgary',
    emoji: '⚡',
    colors: {
      gold: '#E31837',
      goldLight: '#FF4757',
      goldDark: '#A51227',
      goldMuted: 'rgba(227, 24, 55, 0.15)',
      goldGlow: 'rgba(227, 24, 55, 0.35)'
    }
  },
  edmonton: {
    id: 'edmonton',
    name: 'Edmonton Stingers',
    short: 'Edmonton',
    emoji: '🐝',
    colors: {
      gold: '#FFB81C',
      goldLight: '#FFD658',
      goldDark: '#CC8A00',
      goldMuted: 'rgba(255, 184, 28, 0.15)',
      goldGlow: 'rgba(255, 184, 28, 0.35)'
    }
  },
  montreal: {
    id: 'montreal',
    name: 'Montreal Alliance',
    short: 'Montreal',
    emoji: '⚜️',
    colors: {
      gold: '#9B4DCA',
      goldLight: '#C175E8',
      goldDark: '#6B2D8E',
      goldMuted: 'rgba(155, 77, 202, 0.15)',
      goldGlow: 'rgba(155, 77, 202, 0.4)'
    }
  },
  niagara: {
    id: 'niagara',
    name: 'Niagara River Lions',
    short: 'Niagara',
    emoji: '🦁',
    colors: {
      gold: '#0080FF',
      goldLight: '#4DA8FF',
      goldDark: '#0055AA',
      goldMuted: 'rgba(0, 128, 255, 0.15)',
      goldGlow: 'rgba(0, 128, 255, 0.4)'
    }
  },
  ottawa: {
    id: 'ottawa',
    name: 'Ottawa BlackJacks',
    short: 'Ottawa',
    emoji: '🃏',
    colors: {
      gold: '#FF1F1F',
      goldLight: '#FF5757',
      goldDark: '#B30000',
      goldMuted: 'rgba(255, 31, 31, 0.15)',
      goldGlow: 'rgba(255, 31, 31, 0.4)'
    }
  },
  saskatoon: {
    id: 'saskatoon',
    name: 'Saskatoon Mamba',
    short: 'Saskatoon',
    emoji: '🐍',
    colors: {
      // "Mamba Purple" — official primary color from Feb 2026 rebrand (REAL Studios)
      gold: '#7B3FBF',
      goldLight: '#A572E5',
      goldDark: '#5A2A95',
      goldMuted: 'rgba(123, 63, 191, 0.18)',
      goldGlow: 'rgba(123, 63, 191, 0.4)'
    }
  },
  scarborough: {
    id: 'scarborough',
    name: 'Scarborough Shooting Stars',
    short: 'Scarborough',
    emoji: '⭐',
    colors: {
      gold: '#1E90FF',
      goldLight: '#5FB1FF',
      goldDark: '#0066CC',
      goldMuted: 'rgba(30, 144, 255, 0.15)',
      goldGlow: 'rgba(30, 144, 255, 0.4)'
    }
  },
  vancouver: {
    id: 'vancouver',
    name: 'Vancouver Bandits',
    short: 'Vancouver',
    emoji: '🏴‍☠️',
    colors: {
      gold: '#FF7B33',
      goldLight: '#FFA366',
      goldDark: '#CC4F00',
      goldMuted: 'rgba(255, 123, 51, 0.15)',
      goldGlow: 'rgba(255, 123, 51, 0.4)'
    }
  },
  winnipeg: {
    id: 'winnipeg',
    name: 'Winnipeg Sea Bears',
    short: 'Winnipeg',
    emoji: '🐻',
    colors: {
      gold: '#4A90E2',
      goldLight: '#7DB1ED',
      goldDark: '#1E5BA8',
      goldMuted: 'rgba(74, 144, 226, 0.15)',
      goldGlow: 'rgba(74, 144, 226, 0.4)'
    }
  }
};

// ===== Theme Application =====
function applyTheme(themeId, options = {}) {
  const theme = CEBL_THEMES[themeId] || CEBL_THEMES.brampton;
  const root = document.documentElement;
  const c = theme.colors;

  // Add transition class for smooth color animation
  if (!options.skipTransition) {
    document.body.classList.add('theme-transitioning');
    setTimeout(() => document.body.classList.remove('theme-transitioning'), 800);
  }

  // Apply CSS variables
  root.style.setProperty('--gold', c.gold);
  root.style.setProperty('--gold-light', c.goldLight);
  root.style.setProperty('--gold-dark', c.goldDark);
  root.style.setProperty('--gold-muted', c.goldMuted);
  root.style.setProperty('--gold-glow', c.goldGlow);
  root.dataset.theme = theme.id;

  // Save preference
  try { localStorage.setItem('hi_theme', theme.id); } catch (e) {}

  // Update theme button label if present
  const btn = document.getElementById('theme-current-team');
  if (btn) btn.textContent = theme.short;
  const emojiEl = document.getElementById('theme-current-emoji');
  if (emojiEl) emojiEl.textContent = theme.emoji;

  // Trigger ripple/pulse animation on header
  if (!options.skipTransition) {
    const brand = document.querySelector('.header-brand') || document.querySelector('.brand');
    if (brand) {
      brand.classList.remove('theme-pulse');
      void brand.offsetWidth; // force reflow
      brand.classList.add('theme-pulse');
    }
  }

  // Highlight active in picker if open
  document.querySelectorAll('.theme-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.themeId === theme.id);
  });

  return theme;
}

function getCurrentTheme() {
  try {
    const saved = localStorage.getItem('hi_theme');
    if (saved && CEBL_THEMES[saved]) return CEBL_THEMES[saved];
  } catch (e) {}
  return CEBL_THEMES.brampton;
}

function resetTheme() {
  applyTheme('brampton');
}

// ===== Theme Picker UI =====
function openThemePicker() {
  const modal = document.getElementById('theme-picker-modal');
  if (!modal) return;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeThemePicker() {
  const modal = document.getElementById('theme-picker-modal');
  if (!modal) return;
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

function pickTheme(themeId) {
  applyTheme(themeId);
  // Close after a short delay so user sees the highlight
  setTimeout(closeThemePicker, 350);
}

function buildThemePickerContent() {
  const current = getCurrentTheme();
  return Object.values(CEBL_THEMES).map(t => `
    <button class="theme-chip ${t.id === current.id ? 'active' : ''}" data-theme-id="${t.id}" onclick="pickTheme('${t.id}')" style="--chip-color:${t.colors.gold}; --chip-glow:${t.colors.goldGlow}">
      <div class="theme-chip-emoji">${t.emoji}</div>
      <div class="theme-chip-name">${t.short}</div>
      <div class="theme-chip-color" style="background:${t.colors.gold}; box-shadow: 0 0 12px ${t.colors.goldGlow}"></div>
    </button>
  `).join('');
}

// ===== Initialize =====
(function initTheme() {
  // Apply saved theme immediately on script load (before paint where possible)
  try {
    const saved = localStorage.getItem('hi_theme');
    if (saved && CEBL_THEMES[saved]) {
      applyTheme(saved, { skipTransition: true });
    }
  } catch (e) {}
})();

// Set up picker once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('theme-picker-grid');
  if (grid) grid.innerHTML = buildThemePickerContent();
  const current = getCurrentTheme();
  const lbl = document.getElementById('theme-current-team');
  if (lbl) lbl.textContent = current.short;
  const emojiEl = document.getElementById('theme-current-emoji');
  if (emojiEl) emojiEl.textContent = current.emoji;
});
