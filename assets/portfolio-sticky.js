/* Portfolio (issue #10 follow-up): keep submenu top in sync with the live header height. */
(() => {
  if (!document.body.classList.contains('portfolio')) return;
  const header = document.querySelector('.site-header');
  const submenu = document.querySelector('.category-nav');
  if (!header) return;

  const root = document.documentElement;
  const mobileQuery = window.matchMedia('(max-width: 700px)');
  let lastY = window.scrollY;
  let applying = false;
  let following = false;
  let suppressDirectionUntil = 0;

  function visualBottom(el) {
    const rect = el.getBoundingClientRect();
    let bottom = rect.bottom;
    const before = getComputedStyle(el, '::before');
    if (before && before.content !== 'none' && before.position === 'absolute') {
      const top = parseFloat(before.top);
      const height = parseFloat(before.height);
      const border = parseFloat(before.borderBottomWidth) || 0;
      const extra = before.boxSizing === 'border-box' ? 0 : border;
      if (!Number.isNaN(top) && !Number.isNaN(height)) {
        bottom = Math.max(bottom, rect.top + top + height + extra);
      }
    }
    return bottom;
  }

  function headerOffset() {
    const rect = header.getBoundingClientRect();
    const bottom = visualBottom(header);
    // When the header is stuck at the top, follow its live visual bottom
    // (including the full-bleed ::before border) so a compact/expand height
    // change cannot leave the submenu tucked under it.
    if (rect.top <= 1) return bottom;
    return Math.max(rect.height, bottom - rect.top);
  }

  function setStickyOffsets() {
    root.style.setProperty('--portfolio-sticky-header', `${Math.ceil(headerOffset())}px`);
    const submenuHeight = (mobileQuery.matches && submenu)
      ? Math.ceil(submenu.getBoundingClientRect().height)
      : 0;
    root.style.setProperty('--portfolio-sticky-submenu', `${submenuHeight}px`);
  }

  function followHeader() {
    setStickyOffsets();
    if (following) return;
    following = true;
    let last = headerOffset();
    let stable = 0;
    const step = () => {
      setStickyOffsets();
      const current = headerOffset();
      if (Math.abs(current - last) < 0.5) stable += 1;
      else {
        stable = 0;
        last = current;
      }
      if (stable < 3) requestAnimationFrame(step);
      else following = false;
    };
    requestAnimationFrame(step);
  }

  function setCompact(compact) {
    const isCompact = document.body.classList.contains('is-compact-nav');
    if (compact === isCompact) {
      followHeader();
      return;
    }

    const before = header.getBoundingClientRect().height;
    const stuck = header.getBoundingClientRect().top <= 1;
    const y = window.scrollY;
    document.body.classList.toggle('is-compact-nav', compact);
    // Read the new height and update the submenu offset before any scroll
    // compensation, so the nav is never a frame behind the expanded header.
    const after = header.getBoundingClientRect().height;
    setStickyOffsets();
    const delta = after - before;
    if (delta && stuck && y > 16) {
      window.scrollTo(0, y + delta);
      // The compensated scroll would otherwise look like a direction
      // change and immediately undo the expand or compact we just applied.
      lastY = window.scrollY;
      suppressDirectionUntil = performance.now() + 100;
    }
    followHeader();
  }

  function apply() {
    const y = window.scrollY;
    if (applying) {
      lastY = y;
      followHeader();
      return;
    }
    applying = true;

    // Infer direction from scroll position so inertial and direction-reversal
    // scrolls (especially touch) still update compact state when wheel/touch
    // direction was already consumed by an earlier scroll event.
    let inferred = y > lastY + 1 ? 1 : y < lastY - 1 ? -1 : 0;
    if (performance.now() < suppressDirectionUntil) inferred = 0;
    lastY = y;

    document.body.classList.toggle('is-scrolled', y > 8);

    if (y < 16) {
      setCompact(false);
    } else if (inferred > 0) {
      setCompact(true);
    } else {
      // Stay compact mid-gallery on scroll-up. Re-expanding the logo
      // there grows the sticky header over the submenu. The y < 16
      // branch above restores the full header at the top of the page.
      followHeader();
    }

    applying = false;
  }

  window.addEventListener('scroll', apply, {passive: true});
  window.addEventListener('resize', followHeader);
  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', followHeader);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(followHeader);
  }

  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(followHeader);
    observer.observe(header);
    if (submenu) observer.observe(submenu);
  }

  setStickyOffsets();
  document.fonts && document.fonts.ready.then(followHeader);
})();
