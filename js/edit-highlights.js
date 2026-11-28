(() => {
  const galleries = document.querySelectorAll('.lss-edit-highlights-grid');
  if (!galleries.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'lss-edit-lightbox';
  dialog.setAttribute('aria-label', 'Enlarged edit highlight');
  const image = document.createElement('img');
  dialog.append(image);
  document.body.append(dialog);
  let trigger, previousOverflow;
  galleries.forEach(gallery => gallery.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt || 'Edit highlight';
    previousOverflow = document.documentElement.style.overflow;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  }));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow || '';
    image.removeAttribute('src');
    trigger?.focus({preventScroll: true});
  });
})();
