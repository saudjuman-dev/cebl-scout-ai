// ===== Subtle 3D-Tilt Micro-Interaction =====
// Mouse-driven perspective tilt on hover. Apple Studio Display vibe.
// Respects prefers-reduced-motion. Targets cards that opt in via class.

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const TILT_SELECTOR = '.stat-card, .role-card, .team-scout-card, .ft-card, .legend-card, .tr-team-card';
  const MAX_TILT = 6;       // degrees
  const PERSPECTIVE = 1000; // px

  function applyTilt(el, e) {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    const rotY = px * MAX_TILT;
    const rotX = -py * MAX_TILT;
    el.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
  }
  function resetTilt(el) {
    el.style.transform = '';
  }

  function bind(el) {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    el.addEventListener('mousemove', (e) => applyTilt(el, e));
    el.addEventListener('mouseleave', () => resetTilt(el));
  }

  function bindAll() {
    document.querySelectorAll(TILT_SELECTOR).forEach(bind);
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindAll();
    // Re-bind whenever the DOM updates significantly
    const obs = new MutationObserver(() => bindAll());
    obs.observe(document.body, { childList: true, subtree: true });
  });
})();
