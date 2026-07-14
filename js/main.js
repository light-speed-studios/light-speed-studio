// Shared navigation toggle
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".lss-nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("active");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
    const splash =
        document.getElementById("lss-page-splash") ||
        document.getElementById("lss-splash");

    if (!splash) return;

    const isProjectSplash = splash.id === "lss-page-splash";
    const splashDuration = Number(splash.dataset.duration) || (isProjectSplash ? 3000 : 5200);

    function closeSplash() {
        if (!splash || splash.classList.contains("hide")) return;

        splash.classList.add("hide");

        setTimeout(() => {
            splash.remove();
        }, 800);
    }

    document.addEventListener("pointerdown", closeSplash, { once: true });
    setTimeout(closeSplash, splashDuration);
});

(function () {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.slide');
  const indicators = carousel.querySelectorAll('.indicator');
  const prevBtn = carousel.querySelector('.nav-arrow.left');
  const nextBtn = carousel.querySelector('.nav-arrow.right');

  let current = 0;
  let autoPlay = null;
  const autoDelay = 6900;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });
    indicators.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }
  function startAutoPlay() {
    stopAutoPlay();
    autoPlay = setInterval(nextSlide, autoDelay);
  }
  function stopAutoPlay() {
    if (autoPlay) {
      clearInterval(autoPlay);
      autoPlay = null;
    }
  }

  if (prevBtn) { prevBtn.addEventListener('click', function () { prevSlide(); startAutoPlay(); }); }
  if (nextBtn) { nextBtn.addEventListener('click', function () { nextSlide(); startAutoPlay(); }); }

  indicators.forEach((dot, index) => {
    dot.addEventListener('click', function () {
      showSlide(index);
      startAutoPlay();
    });
  });

  document.querySelectorAll('.home-hero-section .hero-content-wrapper').forEach(wrapper => {
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
  });

  showSlide(0);
  setTimeout(() => { startAutoPlay(); }, 5000);
})();

(function () {
  const mobileCarousel = document.getElementById('mobileHeroCarousel');
  if (!mobileCarousel) return;

  const mobileSlides = mobileCarousel.querySelectorAll('.mobile-slide');
  const mobilePrevBtn = mobileCarousel.querySelector('.mobile-nav-arrow.left');
  const mobileNextBtn = mobileCarousel.querySelector('.mobile-nav-arrow.right');

  let mobileCurrent = 0;
  let mobileAutoPlay = null;
  const mobileAutoDelay = 6000;

  function showMobileSlide(index) {
    mobileCurrent = (index + mobileSlides.length) % mobileSlides.length;
    mobileSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === mobileCurrent);
    });
  }

  function nextMobileSlide() { showMobileSlide(mobileCurrent + 1); }
  function prevMobileSlide() { showMobileSlide(mobileCurrent - 1); }
  function startMobileAutoPlay() {
    stopMobileAutoPlay();
    mobileAutoPlay = setInterval(nextMobileSlide, mobileAutoDelay);
  }
  function stopMobileAutoPlay() {
    if (mobileAutoPlay) {
      clearInterval(mobileAutoPlay);
      mobileAutoPlay = null;
    }
  }

  if (mobilePrevBtn) { mobilePrevBtn.addEventListener('click', function () { prevMobileSlide(); startMobileAutoPlay(); }); }
  if (mobileNextBtn) { mobileNextBtn.addEventListener('click', function () { nextMobileSlide(); startMobileAutoPlay(); }); }

  mobileCarousel.addEventListener('mouseenter', stopMobileAutoPlay);
  mobileCarousel.addEventListener('mouseleave', startMobileAutoPlay);

  showMobileSlide(0);
  startMobileAutoPlay();
})();

window.addEventListener("load", function () {
  const track = document.getElementById("vaultTrack");
  const prev = document.getElementById("vaultPrev");
  const next = document.getElementById("vaultNext");
  const dashes = document.getElementById("vaultRailDashes");

  if (!track || !prev || !next || !dashes) return;

  const cardSelector = ".index-vault-card, .vault-item";
  let currentVaultPage = 0;

  function getPostersPerJump() {
    return window.innerWidth <= 900 ? 1 : 4;
  }

  function getVaultCards() {
    return Array.from(track.querySelectorAll(cardSelector));
  }

  const originals = Array.from(track.children);
  track.dataset.realPosterCount = originals.length;
  originals.forEach(el => track.appendChild(el.cloneNode(true)));
  track.scrollLeft = 1;

  function getRealPosterCount() {
    return track.dataset.realPosterCount ? Number(track.dataset.realPosterCount) : getVaultCards().length;
  }

  function getVaultPageCount() {
    return Math.max(1, Math.ceil(getRealPosterCount() / getPostersPerJump()));
  }

  function setupVaultDashes() {
    const pageCount = getVaultPageCount();
    dashes.innerHTML = "";

    for (let i = 0; i < pageCount; i++) {
      const dash = document.createElement("button");
      dash.className = "vault-rail-dash";
      dash.type = "button";
      dash.setAttribute("aria-label", `Go to vault page ${i + 1}`);
      dash.addEventListener("click", () => {
        currentVaultPage = i;
        scrollToVaultPage(currentVaultPage);
      });
      dashes.appendChild(dash);
    }

    updateVaultDashes();
  }

  function updateVaultDashes() {
    const allDashes = dashes.querySelectorAll(".vault-rail-dash");
    allDashes.forEach((dash, index) => {
      dash.classList.toggle("active", index === currentVaultPage);
    });
  }

  function getVaultStep() {
    const item = track.querySelector(cardSelector);
    if (!item) return 0;

    const trackStyles = getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;

    return item.getBoundingClientRect().width + gap;
  }

  function scrollToVaultPage(page) {
    const pageCount = getVaultPageCount();
    currentVaultPage = ((page % pageCount) + pageCount) % pageCount;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = Math.min(
      currentVaultPage * getPostersPerJump() * getVaultStep(),
      maxScroll
    );

    track.scrollTo({ left: target, behavior: "smooth" });
    updateVaultDashes();
  }

  const railShell =
    track.closest(".vault-rail-shell") ||
    track.closest(".vault-rail-wrapper");

  let fadesActivated = false;

  function updateVaultFades() {
    if (!railShell || !fadesActivated) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;

    railShell.classList.toggle("show-left-fade", currentScroll > 5);
    railShell.classList.toggle("show-right-fade", currentScroll < maxScroll - 5);
  }

  function activateFades() {
    if (fadesActivated) return;
    fadesActivated = true;
    updateVaultFades();
  }

  next.addEventListener("click", () => {
    activateFades();
    currentVaultPage++;
    scrollToVaultPage(currentVaultPage);
  });

  prev.addEventListener("click", () => {
    activateFades();
    currentVaultPage--;
    scrollToVaultPage(currentVaultPage);
  });

  track.addEventListener("scroll", activateFades, { passive: true });
  track.addEventListener("scroll", updateVaultFades, { passive: true });

  window.addEventListener("resize", () => {
    setupVaultDashes();
    scrollToVaultPage(currentVaultPage);
    updateVaultFades();
  });

  setupVaultDashes();
});

window.addEventListener("DOMContentLoaded", () => {
  const vaultSection = document.getElementById("vaultSection");
  if (!vaultSection) return;
  const stage = document.getElementById("vaultStage");
  const dots = vaultSection.querySelectorAll(".dot");
  const navPrev = document.getElementById("navPrev");
  const navNext = document.getElementById("navNext");
  const swipeLeft = vaultSection.querySelector(".swipe-hint.left");
  const swipeRight = vaultSection.querySelector(".swipe-hint.right");
  const mobileList = vaultSection.querySelector("#mobile-list");

  if (!stage || !mobileList || !navPrev || !navNext || !swipeLeft || !swipeRight) return;

  let currentIndex = 3;
  let startX = null;

  function applyMode() {
    const mobile = window.innerWidth <= 900 || window.matchMedia("(pointer:coarse)").matches;
    vaultSection.classList.toggle("mobile-mode", mobile);
  }

  function updateDots(i) { dots.forEach((d, idx) => d.classList.toggle("active", idx === i)); }

  function setActiveByLayout() {
    const boxes = mobileList.querySelectorAll(".box");
    boxes.forEach(b => b.classList.remove("active"));
    if (vaultSection.classList.contains("mobile-mode")) { if (boxes[0]) boxes[0].classList.add("active"); } 
    else { if (boxes[3]) boxes[3].classList.add("active"); }
  }

  function shiftLeft() {
    if (vaultSection.classList.contains("mobile-mode")) { nextMobile(); return; }
    const boxes = mobileList.querySelectorAll(".box");
    const first = boxes[0];
    setTimeout(() => { first.remove(); mobileList.appendChild(first); setActiveByLayout(); }, 400);
    currentIndex = (currentIndex + 1) % dots.length;
    updateDots(currentIndex);
  }

  function shiftRight() {
    if (vaultSection.classList.contains("mobile-mode")) { prevMobile(); return; }
    const boxes = mobileList.querySelectorAll(".box");
    const last = boxes[boxes.length - 1];
    setTimeout(() => { last.remove(); mobileList.insertBefore(last, mobileList.firstChild); setActiveByLayout(); }, 400);
    currentIndex = (currentIndex - 1 + dots.length) % dots.length;
    updateDots(currentIndex);
  }

  function nextMobile() { const first = mobileList.querySelector(".box:first-child"); if (first) { mobileList.appendChild(first); setActiveByLayout(); } }
  function prevMobile() { const last = mobileList.querySelector(".box:last-child"); if (last) { mobileList.insertBefore(last, mobileList.firstChild); setActiveByLayout(); } }

  navPrev.onclick = () => vaultSection.classList.contains("mobile-mode") ? prevMobile() : shiftRight();
  navNext.onclick = () => vaultSection.classList.contains("mobile-mode") ? nextMobile() : shiftLeft();
  swipeLeft.onclick = () => prevMobile();
  swipeRight.onclick = () => nextMobile();

  stage.addEventListener("touchstart", e => { startX = e.changedTouches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 30) {
      if (vaultSection.classList.contains("mobile-mode")) { dx < 0 ? nextMobile() : prevMobile(); } 
      else { dx < 0 ? shiftLeft() : shiftRight(); }
    }
    startX = null;
  }, { passive: true });

  dots.forEach((dot, targetIndex) => {
    dot.addEventListener("click", () => {
      const total = dots.length;
      if (targetIndex === currentIndex) return;
      let diff = (targetIndex - currentIndex + total) % total;
      const goLeft = diff <= total / 2;
      const steps = goLeft ? diff : total - diff;
      let k = 0;
      const go = () => {
        if (k >= steps) return;
        goLeft ? shiftLeft() : shiftRight();
        k++;
        setTimeout(go, 420);
      };
      go();
    });
  });

  window.addEventListener("resize", applyMode);
  applyMode();
  setActiveByLayout();
  updateDots(currentIndex);
});

let scrollTimer;
window.addEventListener('scroll', () => {
  document.documentElement.classList.add('is-scrolling');
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    document.documentElement.classList.remove('is-scrolling');
  }, 500);
}, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
  const jumpButton = document.getElementById("lssPageJump");
  if (!jumpButton) return;

  const topButton = document.createElement("button");
  topButton.type = "button";
  topButton.className = "lss-page-top";
  topButton.setAttribute("aria-label", "Jump to top");
  document.body.appendChild(topButton);

  let jumpButtonHasBeenUsed = false;

  function getPageTargets() {
    const disclaimerBlocks = document.querySelectorAll(".bridge-body");

    return [
      {
        name: "hero",
        element: document.getElementById("heroCarousel"),
        offset: 95
      },
      {
        name: "bridge-module",
        element: document.querySelector(".section-heading"),
        offset: 70
      },
      {
        name: "lab",
        element: document.querySelector(".lab-hero-section"),
        offset: 151
      },
      {
        name: "orbit",
        element: document.querySelector(".orbit-image-frame"),
        offset: 155
      },
      {
        name: "disclaimer",
        element: disclaimerBlocks[disclaimerBlocks.length - 1],
        offset: 130
      },
      {
        name: "footer",
        element: document.querySelector(".footer-logo-block"),
        offset: 95
      }
    ].filter(target => target.element);
  }

  function getTargetTop(target) {
    return target.element.getBoundingClientRect().top + window.scrollY - target.offset;
  }

  function getNextTarget() {
    const targets = getPageTargets();
    const currentY = window.scrollY;

    const nextTarget = targets.find(target => {
      return getTargetTop(target) > currentY + 30;
    });

    return nextTarget || {
      name: "top",
      element: document.body,
      offset: 0
    };
  }

  function updateJumpButtons() {
    const shouldShowTopButton = window.scrollY > 120;

    topButton.classList.toggle("is-visible", shouldShowTopButton);

    jumpButton.classList.remove("is-up");
    jumpButton.setAttribute("aria-label", "Jump to next section");
  }

  jumpButton.addEventListener("click", () => {
    const target = getNextTarget();

    jumpButtonHasBeenUsed = true;

    window.scrollTo({
      top: target.name === "top" ? 0 : getTargetTop(target),
      behavior: "smooth"
    });

    updateJumpButtons();
    setTimeout(updateJumpButtons, 450);
  });

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    setTimeout(updateJumpButtons, 450);
  });

  window.addEventListener("scroll", updateJumpButtons, { passive: true });
  window.addEventListener("resize", updateJumpButtons);

  updateJumpButtons();
});


/* =======================================================
   VAULT ARCHIVE RAILS
======================================================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".vault-rail-shell").forEach(shell => {
    const track = shell.querySelector(".lss-vault-rail");
    const prev = shell.querySelector(".vault-rail-prev");
    const next = shell.querySelector(".vault-rail-next");

    if (!track || !prev || !next) return;

    if (track.id === "vaultTrack") return;

    function getScrollAmount() {
      const firstCard = track.querySelector(".vault-archive-card");
      if (!firstCard) return track.clientWidth * 0.85;

      const gap = parseFloat(getComputedStyle(track).gap) || 12;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const cardsPerMove = window.innerWidth <= 900 ? 1 : 2;

      return (cardWidth + gap) * cardsPerMove;
    }

    prev.addEventListener("click", () => {
      track.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth"
      });
    });

    next.addEventListener("click", () => {
      track.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth"
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const email = "lightspeedcuts@gmail.com";

  const modal = document.getElementById("emailChoiceModal");
  const trigger = document.getElementById("footerEmailTrigger");
  const close = document.getElementById("emailChoiceClose");
  const backdrop = document.getElementById("emailChoiceBackdrop");
  const copyButton = document.getElementById("emailCopyButton");
  const copyStatus = document.getElementById("emailCopyStatus");

  if (!modal || !trigger) return;

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    if (copyStatus) {
      copyStatus.textContent = "";
    }
  }

  trigger.addEventListener("click", openModal);

  if (close) {
    close.addEventListener("click", closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(email);

        if (copyStatus) {
          copyStatus.textContent = "Email copied.";
        }
      } catch {
        if (copyStatus) {
          copyStatus.textContent = email;
        }
      }
    });
  }
});


/* =======================================================
   PROJECT DETAIL SIDE NAV KEYBOARD SUPPORT
   Alt + Left/Right moves between project pages.
======================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const projectNav = document.querySelector(".ffs-project-side-nav-right");
  if (!projectNav) return;

  const prevLink = projectNav.querySelector('[data-project-nav-key="prev"]');
  const nextLink = projectNav.querySelector('[data-project-nav-key="next"]');

  document.addEventListener("keydown", event => {
    const active = document.activeElement;
    const isTyping =
      active &&
      (active.tagName === "INPUT" ||
       active.tagName === "TEXTAREA" ||
       active.isContentEditable);

    if (isTyping || !event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    if (event.key === "ArrowLeft" && prevLink) {
      event.preventDefault();
      window.location.href = prevLink.href;
    }

    if (event.key === "ArrowRight" && nextLink) {
      event.preventDefault();
      window.location.href = nextLink.href;
    }
  });
});



/* =======================================================
   HOME PAGE SCROLL PROGRESS
   Runs only on index/home and leaves all other pages alone.
======================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const normalizedPath = window.location.pathname
    .toLowerCase()
    .replace(/\/+$/, "");

  const lastSegment = normalizedPath.split("/").pop();
  const isHomePage =
    normalizedPath === "" ||
    lastSegment === "index.html";

  if (!isHomePage) return;

  document.documentElement.classList.add("lss-home-progress");
  document.body.classList.add("lss-home-progress");

  const progressBar = document.createElement("div");
  progressBar.className = "lss-home-scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");

  const progressFill = document.createElement("div");
  progressFill.className = "lss-home-scroll-progress-fill";

  progressBar.appendChild(progressFill);
  document.body.appendChild(progressBar);

  const navBar = document.querySelector(".lss-nav-bar");
  let ticking = false;

  function syncProgressPosition() {
    const navBottom = navBar
      ? Math.max(0, Math.round(navBar.getBoundingClientRect().bottom))
      : 61;

    progressBar.style.setProperty("--lss-progress-top", `${navBottom}px`);
  }

  function updateProgress() {
    const root = document.documentElement;
    const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
    const currentScroll = Math.max(0, window.scrollY || root.scrollTop);
    const ratio = maxScroll > 0 ? currentScroll / maxScroll : 0;
    const clamped = Math.min(1, Math.max(0, ratio));

    progressFill.style.transform = `scaleX(${clamped})`;
    ticking = false;
  }

  function requestProgressUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }

  window.addEventListener("scroll", requestProgressUpdate, { passive: true });

  window.addEventListener("resize", () => {
    syncProgressPosition();
    requestProgressUpdate();
  });

  window.addEventListener("load", () => {
    syncProgressPosition();
    requestProgressUpdate();
  });

  syncProgressPosition();
  updateProgress();
});