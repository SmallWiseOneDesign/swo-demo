/* Portfolio (issue #10 follow-up): compact header, sticky offsets, no expand overlap. */
(() => {
  if (!document.body.classList.contains('portfolio')) return;
  const header = document.querySelector('.site-header');
  const submenu = document.querySelector('.category-nav');
  if (!header) return;

  const root = document.documentElement;
  const mobileQuery = window.matchMedia('(max-width: 700px)');
  let direction = 0;
  let applying = false;

  function setStickyOffsets() {
    const headerHeight = Math.round(header.getBoundingClientRect().height);
    root.style.setProperty('--portfolio-sticky-header', `${headerHeight}px`);
    const submenuHeight = (mobileQuery.matches && submenu)
      ? Math.round(submenu.getBoundingClientRect().height)
      : 0;
    root.style.setProperty('--portfolio-sticky-submenu', `${submenuHeight}px`);
  }

  function setCompact(compact) {
    const isCompact = document.body.classList.contains('is-compact-nav');
    if (compact === isCompact) {
      setStickyOffsets();
      return;
    }

    const before = header.getBoundingClientRect().height;
    const stuck = header.getBoundingClientRect().top <= 1;
    const y = window.scrollY;
    document.body.classList.toggle('is-compact-nav', compact);
    const after = header.getBoundingClientRect().height;
    const delta = after - before;
    // When the sticky header changes height, compensate scroll so the content
    // that was just below it is not covered by the expanded bar.
    if (delta && stuck && y > 0) {
      window.scrollTo(0, y + delta);
    }
    setStickyOffsets();
  }

  function apply() {
    if (applying) {
      setStickyOffsets();
      return;
    }
    applying = true;

    const y = window.scrollY;
    document.body.classList.toggle('is-scrolled', y > 8);

    if (y < 16) {
      setCompact(false);
    } else if (direction > 0) {
      setCompact(true);
    } else if (direction < 0) {
      setCompact(false);
    } else {
      setStickyOffsets();
    }

    direction = 0;
    applying = false;
  }

  window.addEventListener('wheel', event => {
    if (event.deltaY === 0) return;
    direction = event.deltaY > 0 ? 1 : -1;
  }, {passive: true});

  window.addEventListener('keydown', event => {
    const down = event.key === 'PageDown' || event.key === 'ArrowDown' || event.key === ' ' || event.key === 'End';
    const up = event.key === 'PageUp' || event.key === 'ArrowUp' || event.key === 'Home';
    if (down) direction = 1;
    if (up) direction = -1;
  });

  let touchY = null;
  window.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    touchY = event.touches[0].clientY;
  }, {passive: true});

  window.addEventListener('touchmove', event => {
    if (touchY == null || event.touches.length !== 1) return;
    const y = event.touches[0].clientY;
    if (Math.abs(y - touchY) < 8) return;
    direction = y < touchY ? 1 : -1;
    touchY = y;
  }, {passive: true});

  window.addEventListener('scroll', apply, {passive: true});
  window.addEventListener('resize', setStickyOffsets);
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', setStickyOffsets);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(setStickyOffsets);
  }

  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(setStickyOffsets);
    observer.observe(header);
    if (submenu) observer.observe(submenu);
  }

  setStickyOffsets();
  document.fonts && document.fonts.ready.then(setStickyOffsets);
})();
