/* Assemble the contact address in the browser so the HTML source has no
   harvestable mailto. Visible text stays hello@…; the mailto uses +webYYYY. */
(() => {
  const local = ['hel', 'lo'].join('');
  const host = ['smallwise', 'one', '.', 'com'].join('');
  const year = String(new Date().getFullYear());
  const display = `${local}@${host}`;
  const mailbox = `${local}+web${year}@${host}`;
  const link = document.getElementById('contact-email');
  const label = document.getElementById('contact-email-label');
  if (!link) return;
  link.setAttribute('href', `mailto:${mailbox}`);
  if (label) label.textContent = display;
})();
