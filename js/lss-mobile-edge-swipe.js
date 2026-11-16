/* LSS mobile Pull Up for Next Movie, v1.
   Uses each movie page's existing data-project-nav-key="next-mobile" link.
   The gesture starts only on the dedicated handle below the mobile Prev/Next nav.
*/
(() => {
  'use strict';
  const mobile = window.matchMedia('(max-width: 900px)');
  const COMMIT_FRACTION = 0.50; // 50% of the visible viewport HEIGHT.
  const MAX_DIM = 0.24;        // Subtle darkening before commitment.

  function init() {
    if (document.querySelector('.lss-pull-next')) return;
    const nav = document.querySelector('.ffs-mobile-project-nav');
    if (!nav) return;
    const next = nav.querySelector('[data-project-nav-key="next-mobile"]');
    if (!next || !next.getAttribute('href') || next.getAttribute('aria-disabled') === 'true') return;

    const handle = document.createElement('div');
    handle.className = 'lss-pull-next';
    handle.innerHTML = '<span class="lss-pull-next-icon" aria-hidden="true">⌄</span>' +
      '<span class="lss-pull-next-copy">PULL UP FOR NEXT MOVIE</span>' +
      '<span class="lss-pull-next-percent" aria-hidden="true">0%</span>';
    handle.setAttribute('role', 'button');
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('aria-label', 'Pull up to open next movie, or press Enter');
    nav.insertAdjacentElement('afterend', handle);

    const shade = document.createElement('div');
    shade.className = 'lss-pull-next-shade';
    shade.setAttribute('aria-hidden', 'true');
    const progress = document.createElement('div');
    progress.className = 'lss-pull-next-progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<div class="lss-pull-next-progress-head"><span>↑</span> <b>NEXT MOVIE</b></div>';
    document.body.append(shade, progress);

    const label = handle.querySelector('.lss-pull-next-copy');
    const percent = handle.querySelector('.lss-pull-next-percent');
    const icon = handle.querySelector('.lss-pull-next-icon');
    let gesture = null;
    let navigating = false;

    function viewportHeight() {
      return window.visualViewport?.height || window.innerHeight;
    }
    function modalVisible() {
      return !!document.querySelector('body:has(#ffsLandingSoundtrack:checked), body:has(#ffsLandingChangelog:checked)');
    }
    function render(px) {
      const threshold = Math.max(1, viewportHeight() * COMMIT_FRACTION);
      const fraction = Math.min(1, px / threshold);
      const ready = px >= threshold;
      progress.style.height = `${Math.round(px)}px`;
      shade.style.opacity = String(MAX_DIM * fraction);
      percent.textContent = `${Math.round(fraction * 100)}%`;
      label.textContent = ready ? 'RELEASE FOR NEXT MOVIE' : 'PULL UP FOR NEXT MOVIE';
      icon.textContent = ready ? '↑' : '⌃';
      handle.classList.toggle('is-ready', ready);
      progress.classList.toggle('is-ready', ready);
    }
    function reset() {
      gesture = null;
      handle.classList.remove('is-dragging', 'is-ready');
      progress.classList.remove('is-dragging', 'is-ready');
      shade.classList.remove('is-dragging');
      progress.style.height = '0px';
      shade.style.opacity = '0';
      percent.textContent = '0%';
      label.textContent = 'PULL UP FOR NEXT MOVIE';
      icon.textContent = '⌄';
    }
    function navigate() {
      if (navigating) return;
      navigating = true;
      const url = next.href;
      if (!url) { navigating = false; reset(); return; }
      label.textContent = 'OPENING NEXT MOVIE';
      shade.classList.remove('is-dragging');
      progress.classList.remove('is-dragging');
      shade.style.opacity = '0.45';
      progress.style.height = `${Math.round(viewportHeight() * 0.5)}px`;
      // Short settle lets the user see the completed gesture, then navigates.
      window.setTimeout(() => window.location.assign(url), 140);
    }
    handle.addEventListener('pointerdown', event => {
      if (!mobile.matches || navigating || modalVisible() || !event.isPrimary) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      gesture = { id: event.pointerId, startY: event.clientY, distance: 0 };
      handle.classList.add('is-dragging');
      progress.classList.add('is-dragging');
      shade.classList.add('is-dragging');
      handle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    handle.addEventListener('pointermove', event => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const distance = Math.max(0, gesture.startY - event.clientY);
      gesture.distance = distance;
      render(distance);
    });
    handle.addEventListener('pointerup', event => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const committed = gesture.distance >= viewportHeight() * COMMIT_FRACTION;
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
      gesture = null;
      if (committed) navigate();
      else reset();
    });
    handle.addEventListener('pointercancel', reset);
    handle.addEventListener('lostpointercapture', () => { if (gesture && !navigating) reset(); });
    handle.addEventListener('keydown', event => {
      if (!mobile.matches || navigating) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        navigate();
      }
    });
    window.addEventListener('pageshow', () => { navigating = false; reset(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
