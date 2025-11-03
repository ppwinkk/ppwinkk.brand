// Ppwink – site scripts: year, fade-in, mobile nav, active link, smooth scroll
(function () {
  // Helper: smooth scroll (respects reduced motion)
  function smoothScrollTo(target) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = document.querySelector(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - 72; // offset for sticky header
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // 1) Current year in footer
    const y = document.getElementById('y');
    if (y) y.textContent = new Date().getFullYear();

    // 2) Fade-in on scroll (IntersectionObserver)
    const fadeEls = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              obs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      fadeEls.forEach((el) => io.observe(el));
    } else {
      // Fallback: show immediately
      fadeEls.forEach((el) => el.classList.add('visible'));
    }

    // 3) Mobile nav toggle
    const btn = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (btn && links) {
      btn.addEventListener('click', () => links.classList.toggle('open'));

      // Close menu when clicking a link (useful on mobile)
      links.addEventListener('click', (e) => {
        const a = e.target.closest('a');
        if (!a) return;
        links.classList.remove('open');
      });

      // Close menu on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') links.classList.remove('open');
      });
    }

    // 4) Active nav highlighting by pathname
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      // handle hash-only or same-page anchors too
      if (href === current || (current === 'index.html' && href === './') || href === location.pathname) {
        a.classList.add('active');
      }
    });

    // 5) Smooth scroll for in-page anchors (e.g., #projects)
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const hash = a.getAttribute('href');
        if (!hash || hash.length === 1) return;
        const target = document.querySelector(hash);
        if (!target) return;
        e.preventDefault();
        smoothScrollTo(hash);
        history.pushState(null, '', hash);
      });
    });
  });
})();
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  
  });
});
