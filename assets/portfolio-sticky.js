/* Portfolio (issue #10): compact header while scrolling down, expand when scrolling up. */
(() => {
  if (!document.body.classList.contains('portfolio')) return;
  const header = document.querySelector('.site-header');
  if (!header) return;

  const root = document.documentElement;
  let direction = 0;

  function setHeaderHeight() {
    const height = Math.round(header.getBoundingClientRect().height);
    root.style.setProperty('--portfolio-sticky-header', `${height}px`);
  }

  function apply() {
    const y = window.scrollY;
    document.body.classList.toggle('is-scrolled', y > 8);

    if (y < 16) {
      document.body.classList.remove('is-compact-nav');
    } else if (direction > 0) {
      document.body.classList.add('is-compact-nav');
    } else if (direction < 0) {
      document.body.classList.remove('is-compact-nav');
    }

    direction = 0;
    setHeaderHeight();
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
  window.addEventListener('resize', setHeaderHeight);

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(setHeaderHeight).observe(header);
  }

  setHeaderHeight();
  document.fonts && document.fonts.ready.then(setHeaderHeight);
})();
