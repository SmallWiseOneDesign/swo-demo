/* After the home page finishes loading, cache Portfolio gallery images
   so they are ready if the visitor opens Portfolio next. */
(() => {
  const portfolioPage = new URL('portfolio/', document.baseURI);

  function uniqueImageUrls(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const urls = new Set();
    doc.querySelectorAll('a.gallery-item').forEach(item => {
      const href = item.getAttribute('href');
      const src = item.querySelector('img') && item.querySelector('img').getAttribute('src');
      [href, src].forEach(raw => {
        if (!raw) return;
        const absolute = new URL(raw, portfolioPage).href;
        if (/\.(jpe?g|png|webp|gif)$/i.test(absolute)) urls.add(absolute);
      });
    });
    return [...urls];
  }

  function prefetch(urls) {
    const queue = urls.slice();
    const workers = Math.min(6, queue.length);
    function next() {
      const src = queue.shift();
      if (!src) return;
      const image = new Image();
      image.decoding = 'async';
      image.onload = image.onerror = next;
      image.src = src;
    }
    for (let i = 0; i < workers; i += 1) next();
  }

  function start() {
    fetch(portfolioPage.href, { credentials: 'same-origin' })
      .then(response => {
        if (!response.ok) throw new Error('portfolio fetch failed');
        return response.text();
      })
      .then(html => prefetch(uniqueImageUrls(html)))
      .catch(() => {});
  }

  function whenIdle(fn) {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(fn, { timeout: 2000 });
    else setTimeout(fn, 0);
  }

  if (document.readyState === 'complete') whenIdle(start);
  else window.addEventListener('load', () => whenIdle(start));
})();
