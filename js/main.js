// AC-Eduworks — Main JS
(function () {
  // Theme toggle
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  updateToggleIcon();

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > 50) header.classList.add('header--scrolled');
      else header.classList.remove('header--scrolled');
      last = y;
    }, { passive: true });
  }

  // Mobile nav
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  const navOverlay = document.querySelector('.nav__overlay');
  const navClose = document.querySelector('.nav__close');
  const hamburgerIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>';

  function closeNav() {
    navLinks.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    navToggle.innerHTML = hamburgerIcon;
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('open', isOpen);
      navToggle.innerHTML = isOpen
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : hamburgerIcon;
    });
    if (navOverlay) navOverlay.addEventListener('click', closeNav);
    if (navClose) navClose.addEventListener('click', closeNav);
    // Close menu when a link is tapped
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // Scroll-triggered animations
  const animateEls = document.querySelectorAll('[data-animate]');
  if (animateEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.animate || 0;
          setTimeout(() => e.target.classList.add('visible'), Number(delay));
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    animateEls.forEach(el => observer.observe(el));
  }

  // Stat counter animation
  const statEls = document.querySelectorAll('[data-count]');
  if (statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          statObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    statEls.forEach(el => statObserver.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * ease) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
})();
