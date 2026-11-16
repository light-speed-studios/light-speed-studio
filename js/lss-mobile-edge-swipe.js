/* LSS mobile page navigation, edge-start only. Requires existing mobile Prev / Next anchor links. */
(() => {
  'use strict';
  const mobile = window.matchMedia('(max-width: 900px)');
  const EDGE_PX = 40;             // Touch must begin within 40px of either edge.
  const COMMIT_FRACTION = 0.5;    // Move half the screen width, then release to navigate.
  const SHADE_AT_COMMIT = 0.26;   // 26% fade of current page by the threshold.
  const INTENT_PX = 10;          // Wait for a deliberate horizontal movement.
  const HORIZONTAL_RATIO = 1.4;  // Reject diagonal/vertical scrolling.

  function init() {
    const nav = document.querySelector('.ffs-mobile-project-nav');
    if (!nav) return;
    const shade = document.createElement('div');
    shade.className = 'lss-swipe-shade';
    shade.setAttribute('aria-hidden', 'true');
    const track = document.createElement('div');
    track.className = 'lss-swipe-track';
    track.setAttribute('aria-hidden', 'true');
    const arrow = document.createElement('span');
    arrow.className = 'lss-swipe-arrow';
    track.append(arrow);
    document.body.append(shade, track);

    let gesture = null;
    function clear(withAnimation = true) {
      gesture = null;
      shade.classList.toggle('lss-swipe-active', !withAnimation);
      track.classList.toggle('lss-swipe-active', !withAnimation);
      shade.style.opacity = '0';
      track.style.opacity = '0';
      track.style.width = '0px';
      track.dataset.ready = 'false';
    }
    function isInteractive(target) {
      return !!target.closest('input, textarea, select, button, a, label, iframe, video, [contenteditable="true"], .ffs-rating-stars, .ffs-poster-panel');
    }
    function blocked() {
      return !!document.querySelector('.ffs-soundtrack-modal:not([hidden]):has(:checked), .ffs-changelog-modal:has(:checked)');
    }
    document.addEventListener('touchstart', event => {
      if (!mobile.matches || event.touches.length !== 1 || isInteractive(event.target) || blocked()) return;
      const touch = event.touches[0];
      const x = touch.clientX;
      const width = window.innerWidth;
      const left = x <= EDGE_PX;
      const right = x >= width - EDGE_PX;
      if (!left && !right) return;
      const key = left ? 'prev-mobile' : 'next-mobile';
      const link = nav.querySelector(`[data-project-nav-key="${key}"]`);
      if (!link?.href || link.getAttribute('aria-disabled') === 'true') return;
      // Left edge: drag right for Prev. Right edge: drag left for Next.
      gesture = {x, y: touch.clientY, side: left ? 'left' : 'right', dir: left ? 1 : -1,
                 url: link.href, axis: null, amount: 0};
    }, {passive: true});

    document.addEventListener('touchmove', event => {
      if (!gesture) return;
      if (event.touches.length !== 1) { clear(); return; }
      const touch = event.touches[0];
      const dx = touch.clientX - gesture.x;
      const dy = touch.clientY - gesture.y;
      if (gesture.axis === null) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) < INTENT_PX) return;
        gesture.axis = Math.abs(dx) > Math.abs(dy) * HORIZONTAL_RATIO && dx * gesture.dir > 0
          ? 'horizontal' : 'other';
        if (gesture.axis !== 'horizontal') { clear(); return; }
        track.dataset.side = gesture.side;
        arrow.textContent = gesture.side === 'left' ? '›' : '‹';
        shade.classList.add('lss-swipe-active');
        track.classList.add('lss-swipe-active');
      }
      if (gesture.axis !== 'horizontal') return;
      if (event.cancelable) event.preventDefault();
      const distance = Math.max(0, dx * gesture.dir);
      const fraction = Math.min(1, distance / window.innerWidth);
      gesture.amount = fraction;
      track.style.width = `${Math.min(distance, window.innerWidth)}px`;
      track.style.opacity = '1';
      shade.style.opacity = String(SHADE_AT_COMMIT * Math.min(1, fraction / COMMIT_FRACTION));
      track.dataset.ready = fraction >= COMMIT_FRACTION ? 'true' : 'false';
    }, {passive: false});

    document.addEventListener('touchend', () => {
      if (!gesture) return;
      const {axis, amount, url} = gesture;
      if (axis === 'horizontal' && amount >= COMMIT_FRACTION) {
        gesture = null;
        track.classList.remove('lss-swipe-active');
        shade.classList.remove('lss-swipe-active');
        track.style.width = `${window.innerWidth}px`;
        shade.style.opacity = '.75';
        // Navigation begins immediately. Cross-document View Transitions handle the fade.
        window.location.assign(url);
      } else {
        clear();
      }
    }, {passive: true});
    document.addEventListener('touchcancel', () => clear(), {passive: true});
    window.addEventListener('pageshow', () => clear(false));
    mobile.addEventListener('change', () => clear(false));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
