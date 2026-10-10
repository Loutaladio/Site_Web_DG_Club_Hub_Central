(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const paintThemeControl = theme => {
    const nextLabel = theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre';
    if (themeButton) {
      themeButton.setAttribute('aria-label', nextLabel);
      themeButton.setAttribute('title', nextLabel);
    }
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#01035D' : '#FFFFFF');
  };

  paintThemeControl(root.dataset.theme || 'dark');
  themeButton?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    paintThemeControl(nextTheme);
    try { localStorage.setItem('dgclub-theme', nextTheme); } catch (_) { /* Stockage privé indisponible : la bascule reste active. */ }
  });

  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#site-menu');
  const closeMenu = () => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Ouvrir le menu');
    menu.classList.remove('is-open');
  };

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.classList.toggle('is-open', open);
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
    document.addEventListener('click', event => {
      if (menuButton.getAttribute('aria-expanded') === 'true' && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const hero = document.querySelector('#hero');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hero || reduceMotion || !window.gsap) return;

  // Le H1, le CTA et le titre des preuves restent visibles dès le premier paint ; seules les cartes preuve entrent en mouvement au défilement.
  const cards = hero.querySelectorAll('.proof-card[data-reveal]');
  if (!('IntersectionObserver' in window) || !cards.length) return;
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      window.gsap.fromTo(entry.target,
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: .44, delay: index * .045, ease: 'power2.out', clearProps: 'all' }
      );
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  cards.forEach(card => revealObserver.observe(card));
})();
