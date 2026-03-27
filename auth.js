// ===== CEBL Scout - Auth & Usage Tracking =====
// Uses localStorage for client-side session management

const AUTH = {
  ADMIN_USER: 'ceblgm',
  ADMIN_PASS: 'Sc0ut!2026$BHB',
  FREE_VIEWS: 15,
  PRICE_MONTHLY: 14.99,
  PRICE_ANNUAL: 149,
  // Replace with your Stripe Payment Link after creating it at dashboard.stripe.com
  STRIPE_LINK: 'https://buy.stripe.com/test_YOUR_LINK_HERE',

  getSession() {
    try {
      return JSON.parse(localStorage.getItem('cebl_session') || 'null');
    } catch { return null; }
  },

  saveSession(data) {
    localStorage.setItem('cebl_session', JSON.stringify(data));
  },

  getRegistrations() {
    try {
      return JSON.parse(localStorage.getItem('cebl_registrations') || '[]');
    } catch { return []; }
  },

  addRegistration(name, email, password) {
    const regs = this.getRegistrations();
    if (regs.find(r => r.email === email)) return false;
    regs.push({ name, email, password, created: new Date().toISOString() });
    localStorage.setItem('cebl_registrations', JSON.stringify(regs));
    return true;
  },

  login(emailOrUser, password) {
    // Admin check
    if (emailOrUser === this.ADMIN_USER && password === this.ADMIN_PASS) {
      const session = {
        name: 'Admin',
        email: 'admin@ceblscout.com',
        isAdmin: true,
        isPaid: true,
        views: 0,
        loginTime: new Date().toISOString()
      };
      this.saveSession(session);
      return session;
    }
    // Regular user check
    const regs = this.getRegistrations();
    const user = regs.find(r => r.email === emailOrUser && r.password === password);
    if (user) {
      const existing = this.getSession();
      const session = {
        name: user.name,
        email: user.email,
        isAdmin: false,
        isPaid: existing?.email === user.email ? (existing.isPaid || false) : false,
        views: existing?.email === user.email ? (existing.views || 0) : 0,
        loginTime: new Date().toISOString()
      };
      this.saveSession(session);
      return session;
    }
    return null;
  },

  register(name, email, password) {
    if (this.addRegistration(name, email, password)) {
      return this.login(email, password);
    }
    return null; // email already exists
  },

  logout() {
    localStorage.removeItem('cebl_session');
  },

  trackView() {
    const session = this.getSession();
    if (!session || session.isAdmin || session.isPaid) return true; // unlimited
    session.views = (session.views || 0) + 1;
    this.saveSession(session);
    if (session.views > this.FREE_VIEWS) {
      showPaywall();
      return false;
    }
    updateViewCounter();
    return true;
  },

  canAccess() {
    const session = this.getSession();
    if (!session) return false;
    if (session.isAdmin || session.isPaid) return true;
    return (session.views || 0) <= this.FREE_VIEWS;
  },

  markPaid() {
    const session = this.getSession();
    if (session) {
      session.isPaid = true;
      this.saveSession(session);
    }
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
  const session = AUTH.login(email, pass);
  if (session) {
    enterApp(session);
  } else {
    document.getElementById('auth-error').textContent = 'Invalid credentials. Please try again.';
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

  // Set user name in header
  const userEl = document.getElementById('user-display');
  if (userEl) userEl.textContent = session.name;

  // Show admin badge if admin
  const adminBadge = document.getElementById('admin-badge');
  if (adminBadge) adminBadge.style.display = session.isAdmin ? 'inline-block' : 'none';

  updateViewCounter();

  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    animateCounters();
    animateCapBar();

    // Show welcome overlay for new signups or first login
    if (isNew || !localStorage.getItem('cebl_welcomed_' + session.email)) {
      showWelcomeOverlay(session);
      localStorage.setItem('cebl_welcomed_' + session.email, '1');
    }
  }, 2200);
}

function updateViewCounter() {
  const session = AUTH.getSession();
  const el = document.getElementById('views-remaining');
  if (!el || !session) return;
  if (session.isAdmin || session.isPaid) {
    el.textContent = '∞ Unlimited Access';
    el.style.color = '#81C784';
  } else {
    const remaining = Math.max(0, AUTH.FREE_VIEWS - (session.views || 0));
    el.textContent = remaining + ' / ' + AUTH.FREE_VIEWS + ' free views remaining';
    el.style.color = remaining <= 3 ? '#EF9A9A' : '#FFD700';
  }
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
  // Opens Stripe Payment Link in new tab
  window.open(AUTH.STRIPE_LINK, '_blank');
  // Show a message
  document.getElementById('paywall-message').textContent =
    'Complete your payment in the new tab. Once confirmed, click "I\'ve Paid" below.';
  document.getElementById('paywall-paid-btn').style.display = 'inline-block';
}

function confirmPaid() {
  AUTH.markPaid();
  closePaywall();
  updateViewCounter();
  location.reload();
}

// ===== Auto-Init =====
document.addEventListener('DOMContentLoaded', () => {
  const session = AUTH.getSession();
  if (session) {
    // Already logged in
    enterApp(session);
  } else {
    showLoginScreen();
  }
});
