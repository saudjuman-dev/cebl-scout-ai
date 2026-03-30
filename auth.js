// ===== Hoops Intelligence - Auth, Session Enforcement & Admin Console =====

// --- Device Fingerprint (simple but effective) ---
function getDeviceFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('HI-fp', 2, 2);
  const canvasHash = canvas.toDataURL().slice(-32);
  const nav = navigator.userAgent + navigator.language + screen.width + 'x' + screen.height + screen.colorDepth + new Date().getTimezoneOffset();
  let hash = 0;
  const str = canvasHash + nav;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'fp_' + Math.abs(hash).toString(36);
}

// --- Password obfuscation (not encryption, but prevents casual reading) ---
function _enc(s) { return btoa(unescape(encodeURIComponent(s))).split('').reverse().join(''); }
function _dec(s) { try { return decodeURIComponent(escape(atob(s.split('').reverse().join('')))); } catch { return s; } }

const AUTH = {
  // Obfuscated admin credentials (not in plaintext)
  _ak: _enc('ceblgm'),
  _ap: _enc('Sc0ut!2026$BHB'),
  get ADMIN_USER() { return _dec(this._ak); },
  get ADMIN_PASS() { return _dec(this._ap); },
  PREMIUM_FEATURES: ['cap-tools', 'player-profile', 'medical-history'],
  PRICE_MONTHLY: 14.99,
  PRICE_ANNUAL: 149,
  MAX_DEVICES: 2, // max devices per account
  STRIPE_LINK: 'https://buy.stripe.com/14AcN5cOT2Z96lE0FQdIA01',

  // --- Storage helpers ---
  getSession() {
    try { return JSON.parse(localStorage.getItem('hi_session') || 'null'); }
    catch { return null; }
  },

  saveSession(data) {
    localStorage.setItem('hi_session', JSON.stringify(data));
  },

  getAllUsers() {
    try { return JSON.parse(localStorage.getItem('hi_users') || '[]'); }
    catch { return []; }
  },

  saveAllUsers(users) {
    localStorage.setItem('hi_users', JSON.stringify(users));
  },

  findUser(email) {
    return this.getAllUsers().find(u => u.email === email);
  },

  updateUser(email, updates) {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) return false;
    users[idx] = { ...users[idx], ...updates };
    this.saveAllUsers(users);
    return true;
  },

  // --- Registration ---
  register(name, email, password) {
    const users = this.getAllUsers();
    if (users.find(u => u.email === email.toLowerCase())) return null;
    const fp = getDeviceFingerprint();
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: _enc(password),
      created: new Date().toISOString(),
      isPaid: false,
      isBlocked: false,
      views: 0,
      devices: [fp],
      lastLogin: new Date().toISOString(),
      lastDevice: fp,
      loginCount: 1,
      notes: ''
    };
    users.push(newUser);
    this.saveAllUsers(users);
    return this.login(email, password);
  },

  // --- Login ---
  login(emailOrUser, password) {
    const fp = getDeviceFingerprint();

    // Admin check
    if (emailOrUser === this.ADMIN_USER && password === this.ADMIN_PASS) {
      const session = {
        name: 'Admin',
        email: 'admin@hoopsintelligence.com',
        isAdmin: true,
        isPaid: true,
        views: 0,
        device: fp,
        loginTime: new Date().toISOString()
      };
      this.saveSession(session);
      return session;
    }

    // Regular user check
    const user = this.findUser(emailOrUser.toLowerCase());
    if (!user) return null;
    // Support both legacy plaintext and obfuscated passwords
    const passMatch = user.password === _enc(password) || user.password === password;
    if (!passMatch) return null;

    // Blocked check
    if (user.isBlocked) {
      return { blocked: true };
    }

    // Device enforcement
    const knownDevices = user.devices || [];
    const isKnownDevice = knownDevices.includes(fp);

    if (!isKnownDevice) {
      if (knownDevices.length >= this.MAX_DEVICES) {
        // Too many devices — flag as potential sharing
        this.updateUser(user.email, {
          flagged: true,
          flagReason: 'Exceeded device limit (' + (knownDevices.length + 1) + ' devices)',
          flagDate: new Date().toISOString()
        });
        return { deviceLimit: true, maxDevices: this.MAX_DEVICES };
      }
      // Add new device
      knownDevices.push(fp);
    }

    // Update user record
    this.updateUser(user.email, {
      devices: knownDevices,
      lastLogin: new Date().toISOString(),
      lastDevice: fp,
      loginCount: (user.loginCount || 0) + 1
    });

    // Create session
    const existing = this.getSession();
    const session = {
      name: user.name,
      email: user.email,
      isAdmin: false,
      isPaid: user.isPaid || false,
      views: existing?.email === user.email ? (existing.views || user.views || 0) : (user.views || 0),
      device: fp,
      loginTime: new Date().toISOString()
    };
    this.saveSession(session);
    return session;
  },

  logout() {
    // Save view count back to user record before logout
    const session = this.getSession();
    if (session && !session.isAdmin) {
      this.updateUser(session.email, { views: session.views || 0 });
    }
    localStorage.removeItem('hi_session');
  },

  isPremium() {
    const session = this.getSession();
    if (!session) return false;
    return session.isAdmin || session.isPaid;
  },

  canAccessFeature(feature) {
    if (this.isPremium()) return true;
    return !this.PREMIUM_FEATURES.includes(feature);
  },

  markPaid(email) {
    const target = email || this.getSession()?.email;
    if (target) {
      this.updateUser(target, { isPaid: true, paidDate: new Date().toISOString() });
      const session = this.getSession();
      if (session && session.email === target) {
        session.isPaid = true;
        this.saveSession(session);
      }
    }
  },

  // --- Admin functions ---
  admin: {
    getStats() {
      const users = AUTH.getAllUsers();
      return {
        totalUsers: users.length,
        paidUsers: users.filter(u => u.isPaid).length,
        freeUsers: users.filter(u => !u.isPaid && !u.isBlocked).length,
        blockedUsers: users.filter(u => u.isBlocked).length,
        flaggedUsers: users.filter(u => u.flagged).length,
        recentSignups: users.filter(u => {
          const d = new Date(u.created);
          const now = new Date();
          return (now - d) < 7 * 24 * 60 * 60 * 1000; // last 7 days
        }).length,
        totalViews: users.reduce((s, u) => s + (u.views || 0), 0),
        monthlyRevenue: users.filter(u => u.isPaid).length * AUTH.PRICE_MONTHLY
      };
    },

    getAllUsersForDisplay() {
      return AUTH.getAllUsers().map(u => ({
        name: u.name,
        email: u.email,
        created: u.created,
        isPaid: u.isPaid,
        isBlocked: u.isBlocked,
        flagged: u.flagged,
        flagReason: u.flagReason || '',
        views: u.views || 0,
        devices: (u.devices || []).length,
        lastLogin: u.lastLogin,
        loginCount: u.loginCount || 0,
        notes: u.notes || ''
      }));
    },

    togglePaid(email) {
      const user = AUTH.findUser(email);
      if (user) {
        AUTH.updateUser(email, {
          isPaid: !user.isPaid,
          paidDate: !user.isPaid ? new Date().toISOString() : null
        });
      }
    },

    toggleBlocked(email) {
      const user = AUTH.findUser(email);
      if (user) {
        AUTH.updateUser(email, { isBlocked: !user.isBlocked });
      }
    },

    clearFlag(email) {
      AUTH.updateUser(email, { flagged: false, flagReason: '' });
    },

    resetDevices(email) {
      AUTH.updateUser(email, { devices: [], flagged: false, flagReason: '' });
    },

    setNote(email, note) {
      AUTH.updateUser(email, { notes: note });
    },

    deleteUser(email) {
      const users = AUTH.getAllUsers().filter(u => u.email !== email);
      AUTH.saveAllUsers(users);
    },

    exportCSV() {
      const users = AUTH.getAllUsers();
      const headers = 'Name,Email,Created,Paid,Blocked,Flagged,Views,Devices,Last Login,Logins,Notes';
      const rows = users.map(u =>
        [u.name, u.email, u.created, u.isPaid, u.isBlocked, u.flagged || false,
         u.views || 0, (u.devices || []).length, u.lastLogin, u.loginCount || 0,
         '"' + (u.notes || '').replace(/"/g, '""') + '"'].join(',')
      );
      return headers + '\n' + rows.join('\n');
    }
  }
};

// ===== Per-User Data Storage =====
// Each user gets their own namespaced localStorage for saved data (roster builds, notes, etc.)
const USER_DATA = {
  _key(suffix) {
    const session = AUTH.getSession();
    if (!session || !session.email) return null;
    // Namespace by user email hash to prevent cross-user data access
    let hash = 0;
    for (let i = 0; i < session.email.length; i++) {
      hash = ((hash << 5) - hash) + session.email.charCodeAt(i);
      hash |= 0;
    }
    return 'hi_u_' + Math.abs(hash).toString(36) + '_' + suffix;
  },

  save(key, data) {
    const storageKey = this._key(key);
    if (!storageKey) return false;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      return true;
    } catch { return false; }
  },

  load(key, fallback) {
    const storageKey = this._key(key);
    if (!storageKey) return fallback || null;
    try {
      const val = localStorage.getItem(storageKey);
      return val ? JSON.parse(val) : (fallback || null);
    } catch { return fallback || null; }
  },

  remove(key) {
    const storageKey = this._key(key);
    if (storageKey) localStorage.removeItem(storageKey);
  },

  // Roster builds - save/load multiple named builds
  saveRosterBuild(name, slots) {
    const builds = this.load('roster_builds', {});
    builds[name] = { slots, savedAt: new Date().toISOString() };
    this.save('roster_builds', builds);
  },

  loadRosterBuild(name) {
    const builds = this.load('roster_builds', {});
    return builds[name] || null;
  },

  deleteRosterBuild(name) {
    const builds = this.load('roster_builds', {});
    delete builds[name];
    this.save('roster_builds', builds);
  },

  getAllRosterBuilds() {
    return this.load('roster_builds', {});
  }
};

// ===== UI Functions =====

function showLoginScreen() {
  document.getElementById('auth-gate').style.display = 'flex';
  document.getElementById('auth-gate').classList.remove('hidden');
  showLoginForm();
}

function showLoginForm() {
  document.getElementById('auth-login').style.display = 'block';
  document.getElementById('auth-register').style.display = 'none';
  document.getElementById('auth-error').textContent = '';
}

function showRegisterForm() {
  document.getElementById('auth-login').style.display = 'none';
  document.getElementById('auth-register').style.display = 'block';
  document.getElementById('auth-error').textContent = '';
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  if (!email || !pass) {
    document.getElementById('auth-error').textContent = 'Please fill in all fields.';
    return;
  }
  const result = AUTH.login(email, pass);
  if (!result) {
    document.getElementById('auth-error').textContent = 'Invalid credentials. Please try again.';
  } else if (result.blocked) {
    document.getElementById('auth-error').textContent = 'This account has been suspended. Contact support.';
  } else if (result.deviceLimit) {
    document.getElementById('auth-error').textContent = 'This account is already active on ' + result.maxDevices + ' devices. Each subscription is for individual use only. Please upgrade or contact support.';
  } else {
    enterApp(result);
  }
}

function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value;
  if (!name || !email || !pass) {
    document.getElementById('auth-error').textContent = 'Please fill in all fields.';
    return;
  }
  if (pass.length < 6) {
    document.getElementById('auth-error').textContent = 'Password must be at least 6 characters.';
    return;
  }
  if (!email.includes('@') || !email.includes('.')) {
    document.getElementById('auth-error').textContent = 'Please enter a valid email address.';
    return;
  }
  const session = AUTH.register(name, email, pass);
  if (session) {
    enterApp(session, true);
  } else {
    document.getElementById('auth-error').textContent = 'An account with this email already exists. Please log in.';
  }
}

function handleLogout() {
  AUTH.logout();
  location.reload();
}

function enterApp(session, isNew) {
  document.getElementById('auth-gate').classList.add('hidden');
  document.getElementById('loading-screen').style.display = 'flex';

  const userEl = document.getElementById('user-display');
  if (userEl) userEl.textContent = session.name;

  const adminBadge = document.getElementById('admin-badge');
  if (adminBadge) adminBadge.style.display = session.isAdmin ? 'inline-block' : 'none';

  // Show admin nav tab for admin users
  const adminTab = document.getElementById('admin-tab');
  if (adminTab) adminTab.style.display = session.isAdmin ? 'inline-flex' : 'none';

  updateViewCounter();

  // Show/hide PRO badges on premium tabs
  const proBadge = document.getElementById('cap-pro-badge');
  if (proBadge) proBadge.style.display = (session.isAdmin || session.isPaid) ? 'none' : 'inline-block';

  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    animateCounters();
    animateCapBar();

    if (isNew || !ONBOARDING.hasCompleted()) {
      ONBOARDING.start();
    }
  }, 2200);
}

function updateViewCounter() {
  const session = AUTH.getSession();
  const el = document.getElementById('views-remaining');
  if (!el || !session) return;
  if (session.isAdmin || session.isPaid) {
    el.textContent = 'PRO — Unlimited Access';
    el.style.color = '#81C784';
  } else {
    el.textContent = 'Free Plan — Upgrade for Pro Tools';
    el.style.color = '#FFD700';
  }
}

function showFeatureGate(featureName) {
  const overlay = document.getElementById('feature-gate-overlay');
  if (!overlay) return;
  const nameEl = document.getElementById('gated-feature-name');
  if (nameEl) {
    const labels = {
      'cap-tools': 'Salary Cap Calculator',
      'player-profile': 'Player Career Profiles',
      'medical-history': 'Injury & Medical History'
    };
    nameEl.textContent = labels[featureName] || featureName;
  }
  overlay.classList.add('show');
}

function closeFeatureGate() {
  const overlay = document.getElementById('feature-gate-overlay');
  if (overlay) overlay.classList.remove('show');
}

function showWelcomeOverlay(session) {
  document.getElementById('welcome-overlay').classList.add('show');
  const nameEl = document.getElementById('welcome-name');
  if (nameEl) nameEl.textContent = session.name;
}

function closeWelcome() {
  document.getElementById('welcome-overlay').classList.remove('show');
}

function showPaywall() {
  document.getElementById('paywall-overlay').classList.add('show');
}

function closePaywall() {
  document.getElementById('paywall-overlay').classList.remove('show');
}

function openStripeCheckout() {
  window.open(AUTH.STRIPE_LINK, '_blank');
  // Update whichever overlay is visible
  const pwMsg = document.getElementById('paywall-message');
  const pwBtn = document.getElementById('paywall-paid-btn');
  const fgMsg = document.getElementById('feature-gate-message');
  const fgBtn = document.getElementById('feature-gate-paid-btn');
  const msg = 'Complete your payment in the new tab. Once confirmed, click "I\'ve Paid" below.';
  if (pwMsg) pwMsg.textContent = msg;
  if (pwBtn) pwBtn.style.display = 'inline-block';
  if (fgMsg) fgMsg.textContent = msg;
  if (fgBtn) fgBtn.style.display = 'inline-block';
}

function confirmPaid() {
  AUTH.markPaid();
  closePaywall();
  closeFeatureGate();
  updateViewCounter();
  location.reload();
}

// ===== Admin Console =====

function renderAdminConsole() {
  const stats = AUTH.admin.getStats();
  const users = AUTH.admin.getAllUsersForDisplay();

  const container = document.getElementById('admin-content');
  if (!container) return;

  container.innerHTML = `
    <div class="admin-stats-row">
      <div class="admin-stat"><div class="admin-stat-num">${stats.totalUsers}</div><div class="admin-stat-lbl">Total Users</div></div>
      <div class="admin-stat paid"><div class="admin-stat-num">${stats.paidUsers}</div><div class="admin-stat-lbl">Paid</div></div>
      <div class="admin-stat"><div class="admin-stat-num">${stats.freeUsers}</div><div class="admin-stat-lbl">Free</div></div>
      <div class="admin-stat warn"><div class="admin-stat-num">${stats.flaggedUsers}</div><div class="admin-stat-lbl">Flagged</div></div>
      <div class="admin-stat danger"><div class="admin-stat-num">${stats.blockedUsers}</div><div class="admin-stat-lbl">Blocked</div></div>
      <div class="admin-stat"><div class="admin-stat-num">${stats.recentSignups}</div><div class="admin-stat-lbl">This Week</div></div>
      <div class="admin-stat"><div class="admin-stat-num">${stats.totalViews}</div><div class="admin-stat-lbl">Total Views</div></div>
      <div class="admin-stat paid"><div class="admin-stat-num">$${stats.monthlyRevenue.toFixed(0)}</div><div class="admin-stat-lbl">Est. MRR</div></div>
    </div>

    <div class="admin-toolbar">
      <input type="text" id="admin-search" placeholder="Search users..." oninput="filterAdminUsers()" class="search-input">
      <button class="gate-btn secondary" onclick="downloadUserCSV()" style="width:auto;padding:0.5rem 1rem;font-size:0.7rem">Export CSV</button>
    </div>

    <div class="admin-table-wrap">
      <table class="data-table admin-table" id="admin-users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Status</th>
            <th>Views</th>
            <th>Devices</th>
            <th>Logins</th>
            <th>Last Login</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr class="${u.flagged ? 'flagged-row' : ''} ${u.isBlocked ? 'blocked-row' : ''}" data-search="${(u.name + ' ' + u.email).toLowerCase()}">
              <td>
                <div class="player-cell">
                  <div class="player-avatar" style="${u.isPaid ? 'background:linear-gradient(135deg,#2E7D32,#4CAF50)' : u.isBlocked ? 'background:#555' : ''}">${u.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}</div>
                  <div>
                    <div class="player-name">${u.name}</div>
                    <div style="font-size:0.6rem;color:var(--gray)">${u.email}</div>
                  </div>
                </div>
              </td>
              <td>
                ${u.isPaid ? '<span class="admin-badge-paid">PAID</span>' : '<span class="admin-badge-free">FREE</span>'}
                ${u.isBlocked ? '<span class="admin-badge-blocked">BLOCKED</span>' : ''}
                ${u.flagged ? '<span class="admin-badge-flagged" title="' + u.flagReason + '">⚠ FLAGGED</span>' : ''}
              </td>
              <td>${u.views}</td>
              <td><span style="color:${u.devices > 1 ? '#FF9800' : 'var(--gray)'}">${u.devices}</span></td>
              <td>${u.loginCount}</td>
              <td style="font-size:0.65rem;color:var(--gray)">${u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : '-'}</td>
              <td style="font-size:0.65rem;color:var(--gray)">${new Date(u.created).toLocaleDateString()}</td>
              <td>
                <div class="admin-actions">
                  <button class="admin-act-btn ${u.isPaid ? 'revoke' : 'grant'}" onclick="adminTogglePaid('${u.email}')" title="${u.isPaid ? 'Revoke paid' : 'Grant paid'}">
                    ${u.isPaid ? '$ ✕' : '$ ✓'}
                  </button>
                  <button class="admin-act-btn ${u.isBlocked ? 'unblock' : 'block'}" onclick="adminToggleBlock('${u.email}')" title="${u.isBlocked ? 'Unblock' : 'Block'}">
                    ${u.isBlocked ? '🔓' : '🔒'}
                  </button>
                  ${u.flagged ? `<button class="admin-act-btn clear" onclick="adminClearFlag('${u.email}')" title="Clear flag">✓</button>` : ''}
                  <button class="admin-act-btn reset" onclick="adminResetDevices('${u.email}')" title="Reset devices">📱</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function adminTogglePaid(email) {
  AUTH.admin.togglePaid(email);
  renderAdminConsole();
}

function adminToggleBlock(email) {
  AUTH.admin.toggleBlocked(email);
  renderAdminConsole();
}

function adminClearFlag(email) {
  AUTH.admin.clearFlag(email);
  renderAdminConsole();
}

function adminResetDevices(email) {
  AUTH.admin.resetDevices(email);
  renderAdminConsole();
}

function filterAdminUsers() {
  const q = document.getElementById('admin-search').value.toLowerCase();
  document.querySelectorAll('#admin-users-table tbody tr').forEach(tr => {
    tr.style.display = (tr.getAttribute('data-search') || '').includes(q) ? '' : 'none';
  });
}

function downloadUserCSV() {
  const csv = AUTH.admin.exportCSV();
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hoops-intelligence-users-' + new Date().toISOString().slice(0,10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ===== Auto-Init =====
document.addEventListener('DOMContentLoaded', () => {
  const session = AUTH.getSession();
  if (session) {
    enterApp(session);
  } else {
    showLoginScreen();
  }
});
