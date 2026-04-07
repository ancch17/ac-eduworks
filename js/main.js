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

  // Mobile nav drawer with swipe
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');
  const navOverlay = document.querySelector('.nav__overlay');
  const navClose = document.querySelector('.nav__close');

  if (navToggle && navLinks) {
    const drawerWidth = () => navLinks.offsetWidth;
    let isOpen = false;

    function openNav() {
      isOpen = true;
      navLinks.classList.add('open');
      navLinks.classList.remove('dragging');
      navLinks.style.transform = '';
      if (navOverlay) {
        navOverlay.classList.add('open');
        navOverlay.classList.remove('dragging');
        navOverlay.style.opacity = '';
      }
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      isOpen = false;
      navLinks.classList.remove('open');
      navLinks.classList.remove('dragging');
      navLinks.style.transform = '';
      if (navOverlay) {
        navOverlay.classList.remove('open');
        navOverlay.classList.remove('dragging');
        navOverlay.style.opacity = '';
      }
      document.body.style.overflow = '';
    }

    // Button triggers
    navToggle.addEventListener('click', () => { if (!isOpen) openNav(); else closeNav(); });
    if (navClose) navClose.addEventListener('click', closeNav);
    if (navOverlay) navOverlay.addEventListener('click', closeNav);

    // Close on link tap
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

    // Touch swipe handling
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let isDragging = false;
    let edgeSwipe = false;
    const EDGE_ZONE = 30; // px from right edge to trigger open swipe
    const SWIPE_THRESHOLD = 60;

    document.addEventListener('touchstart', (e) => {
      if (window.innerWidth > 768) return;
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchCurrentX = touchStartX;
      isDragging = false;
      edgeSwipe = false;

      // Detect swipe from right edge to open
      if (!isOpen && touchStartX > window.innerWidth - EDGE_ZONE) {
        edgeSwipe = true;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (window.innerWidth > 768) return;
      const touch = e.touches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      // Only engage if horizontal movement dominates
      if (!isDragging && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        isDragging = true;
        navLinks.classList.add('dragging');
        if (navOverlay) navOverlay.classList.add('dragging');
      }

      if (!isDragging) return;
      touchCurrentX = touch.clientX;

      if (isOpen) {
        // Dragging to close (swipe right)
        const offset = Math.max(0, touchCurrentX - touchStartX);
        navLinks.style.transform = 'translateX(' + offset + 'px)';
        if (navOverlay) {
          const progress = 1 - (offset / drawerWidth());
          navOverlay.style.opacity = Math.max(0, progress);
        }
      } else if (edgeSwipe) {
        // Dragging to open (swipe left from right edge)
        const offset = Math.max(0, drawerWidth() + (touchCurrentX - touchStartX));
        const clampedOffset = Math.min(drawerWidth(), offset);
        navLinks.style.transform = 'translateX(' + (drawerWidth() - clampedOffset) + 'px)';
        if (navOverlay) {
          navOverlay.classList.add('open');
          navOverlay.style.opacity = clampedOffset / drawerWidth();
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      navLinks.classList.remove('dragging');
      if (navOverlay) navOverlay.classList.remove('dragging');

      const dx = touchCurrentX - touchStartX;

      if (isOpen) {
        // If swiped right past threshold, close
        if (dx > SWIPE_THRESHOLD) closeNav();
        else openNav(); // snap back open
      } else if (edgeSwipe) {
        // If swiped left past threshold, open
        if (dx < -SWIPE_THRESHOLD) openNav();
        else closeNav(); // snap back closed
      }
    }, { passive: true });
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
