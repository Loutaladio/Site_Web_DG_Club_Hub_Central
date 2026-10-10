(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Les preuves sont conservées en PNG et chargées près du viewport ; les autres images utilisent leur src WebP natif.
  const lazyImages = [...document.querySelectorAll('img[data-src]')];
  const loadImage = image => {
    if (!image.dataset.src) return;
    image.src = image.dataset.src;
    image.removeAttribute('data-src');
  };
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '450px 0px' });
    lazyImages.forEach(image => imageObserver.observe(image));
  } else {
    lazyImages.forEach(loadImage);
  }

  if (!reduceMotion && window.gsap && 'IntersectionObserver' in window) {
    const revealItems = [...document.querySelectorAll('[data-reveal]')].filter(item => !item.closest('#hero'));
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        window.gsap.fromTo(entry.target,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: .4, ease: 'power2.out', clearProps: 'transform,opacity,visibility' }
        );
        observer.unobserve(entry.target);
      });
    }, { threshold: .06, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  const navLinks = [...document.querySelectorAll('.site-links a[href^="#"]')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const navById = new Map(navLinks.map(link => [link.getAttribute('href').slice(1), link]));
  if ('IntersectionObserver' in window && sections.length) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.removeAttribute('aria-current'));
        navById.get(entry.target.id)?.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-32% 0px -58% 0px', threshold: 0 });
    sections.forEach(section => activeObserver.observe(section));
  }
})();
