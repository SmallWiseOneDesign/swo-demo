/* Progressive enhancement: without JS, thumbnails link to their full image. */
(() => {
  const links = [...document.querySelectorAll('[data-lightbox]')];
  const dialog = document.querySelector('.lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = dialog.querySelector('.lightbox-image');
  const caption = dialog.querySelector('figcaption');
  let current = 0;
  let opener;
  let swipeX = 0;
  let swipeY = 0;
  let swiping = false;

  function show(index) {
    current = (index + links.length) % links.length;
    image.src = links[current].href;
    image.alt = links[current].querySelector('img').alt;
    caption.textContent = `${image.alt} (${current + 1} of ${links.length})`;
  }

  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener = link;
    show(index);
    dialog.showModal();
    document.documentElement.classList.add('lightbox-open');
    dialog.querySelector('.lightbox-close').focus();
  }));

  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));

  dialog.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const buttons = [...dialog.querySelectorAll('button')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });

  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  dialog.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    swipeX = event.touches[0].clientX;
    swipeY = event.touches[0].clientY;
    swiping = true;
  }, {passive: true});

  dialog.addEventListener('touchend', event => {
    if (!swiping) return;
    swiping = false;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - swipeX;
    const dy = touch.clientY - swipeY;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
    show(current + (dx < 0 ? 1 : -1));
  }, {passive: true});

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    swiping = false;
    if (opener) opener.focus({preventScroll: true});
  });
})();
