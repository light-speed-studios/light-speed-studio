/* LSS Mobile Edge Swipe v2: 50% deliberate swipe, responsive arrow, fade. */
(() => {
  'use strict';
  const mobile = window.matchMedia('(max-width: 900px)');
  const EDGE_MIN = 18;          // Avoid the OS-reserved extreme edge on some phones.
  const EDGE_MAX = 90;          // Easy-to-reach inward activation band.
  const COMMIT = 0.50;          // Must drag across 50% of viewport width.
  const DIM_AT_COMMIT = 0.26;   // Gentle dimming while dragging.
  const INTENT = 10;
  const HORIZONTAL_BIAS = 1.35;

  function init() {
    const nav = document.querySelector('.ffs-mobile-project-nav');
    if (!nav) return;

    const shade = document.createElement('div');
    shade.className = 'lss-swipe-shade';
    shade.setAttribute('aria-hidden', 'true');
    const track = document.createElement('div');
    track.className = 'lss-swipe-track';
    track.setAttribute('aria-hidden', 'true');
    track.dataset.ready = 'false';
    const arrow = document.createElement('span');
    arrow.className = 'lss-swipe-arrow';
    track.append(arrow);
    document.body.append(shade, track);

    let gesture = null;
    let suppressClickUntil = 0;
    function reset() {
      gesture = null;
      shade.classList.remove('lss-swipe-active');
      track.classList.remove('lss-swipe-active');
      shade.style.opacity = '0';
      track.style.width = '0px';
      track.style.opacity = '0';
      track.dataset.ready = 'false';
    }
    function isInteractive(target) {
      // Poster is intentionally swipeable. Keep form controls, player and links safe.
      const excluded = target.closest('a, button, input, textarea, select, iframe, video, [contenteditable="true"], .ffs-rating-stars');
      if (excluded) return true;
      // Labels on the poster may be dragged; other interactive labels remain protected.
      const label = target.closest('label');
      return !!(label && !label.closest('.ffs-poster-panel'));
    }
    function blocked() {
      return !!document.querySelector('#ffsLandingSoundtrack:checked, .ffs-changelog-modal-toggle:checked, .ffs-poster-toggle:checked, dialog[open]');
    }

    document.addEventListener('touchstart', event => {
      if (!mobile.matches || event.touches.length !== 1 || isInteractive(event.target) || blocked()) return;
      const touch = event.touches[0];
      const x = touch.clientX;
      const width = document.documentElement.clientWidth || window.innerWidth;
      const left = x >= EDGE_MIN && x <= EDGE_MAX;
      const right = x >= width - EDGE_MAX && x <= width - EDGE_MIN;
      if (!left && !right) return;
      const side = left ? 'left' : 'right';
      const key = left ? 'prev-mobile' : 'next-mobile';
      const link = nav.querySelector(`[data-project-nav-key="${key}"]`);
      if (!link?.href || link.getAttribute('aria-disabled') === 'true') return;
      gesture = { x, y: touch.clientY, dir: left ? 1 : -1, side, href: link.href,
                  axis: null, fraction: 0, id: touch.identifier, moved: false };
    }, { passive: true });

    document.addEventListener('touchmove', event => {
      const g = gesture;
      if (!g || event.touches.length !== 1) return;
      const touch = [...event.touches].find(t => t.identifier === g.id);
      if (!touch) { reset(); return; }
      const dx = touch.clientX - g.x;
      const dy = touch.clientY - g.y;
      if (g.axis === null) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < INTENT) return;
        if (Math.abs(dx) <= Math.abs(dy) * HORIZONTAL_BIAS || dx * g.dir <= 0) {
          reset();
          return;
        }
        g.axis = 'horizontal';
        track.dataset.side = g.side;
        arrow.textContent = g.side === 'left' ? '›' : '‹';
        shade.classList.add('lss-swipe-active');
        track.classList.add('lss-swipe-active');
      }
      if (event.cancelable) event.preventDefault();
      g.moved = true;
      const width = document.documentElement.clientWidth || window.innerWidth;
      const distance = Math.min(width, Math.max(0, dx * g.dir));
      g.fraction = distance / width;
      track.style.width = `${distance}px`;
      track.style.opacity = '1';
      shade.style.opacity = String(DIM_AT_COMMIT * Math.min(1, g.fraction / COMMIT));
      track.dataset.ready = g.fraction >= COMMIT ? 'true' : 'false';
    }, { passive: false });

    document.addEventListener('touchend', event => {
      const g = gesture;
      if (!g || ![...event.changedTouches].some(t => t.identifier === g.id)) return;
      if (g.moved) suppressClickUntil = performance.now() + 450;
      if (g.axis === 'horizontal' && g.fraction >= COMMIT) {
        gesture = null;
        track.classList.remove('lss-swipe-active');
        shade.classList.remove('lss-swipe-active');
        track.style.width = '100vw';
        track.dataset.ready = 'true';
        shade.style.opacity = '.38';
        window.location.assign(g.href);
      } else {
        reset();
      }
    }, { passive: true });
    document.addEventListener('touchcancel', reset, { passive: true });
    // Avoid accidental poster-toggle clicks after a horizontal swipe gesture.
    document.addEventListener('click', event => {
      if (performance.now() < suppressClickUntil && event.target.closest('.ffs-poster-panel')) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
    window.addEventListener('pageshow', reset);
    mobile.addEventListener('change', reset);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
