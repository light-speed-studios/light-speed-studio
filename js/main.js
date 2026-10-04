/* =======================================================
   GOATCOUNTER
======================================================= */
(function () {
  const goatScript = document.createElement("script");
  goatScript.async = true;
  goatScript.dataset.goatcounter = "https://lsstudios.goatcounter.com/count";
  goatScript.src = "https://gc.zgo.at/count.js";
  document.head.appendChild(goatScript);
})();

// Shared navigation toggle
/* =======================================================
   LSS STATIC SPLASH SCREEN
======================================================= */
(function () {
    window.lssSplashFinished = false;

    function announceSplashFinished() {
        if (window.lssSplashFinished) return;

        window.lssSplashFinished = true;
        window.dispatchEvent(new Event("lssSplashFinished"));
    }

    function initSplash() {
        const splash =
            document.getElementById("lss-page-splash") ||
            document.getElementById("lss-splash");

        /* Pages without a splash can begin their content immediately. */
        if (!splash) {
            announceSplashFinished();
            return;
        }

        if (splash.dataset.splashReady === "true") return;

        splash.dataset.splashReady = "true";
        document.documentElement.classList.add("lss-splash-active");

        const splashDuration = Number(splash.dataset.duration) || 2000;
        let exitTimer = null;
        let hasClosed = false;

        function closeSplash() {
            if (hasClosed) return;
            hasClosed = true;

            window.clearTimeout(exitTimer);

            /* Unlock page scrolling as soon as the splash begins to exit. */
            document.documentElement.classList.remove("lss-splash-active");

            splash.setAttribute("aria-hidden", "true");
            splash.classList.add("is-exiting");

            window.setTimeout(() => {
                splash.remove();

                /* The hero welcome timer begins only after the splash is fully gone. */
                announceSplashFinished();
            }, 2000);
        }

        document.addEventListener("pointerdown", closeSplash, { once: true });
        exitTimer = window.setTimeout(closeSplash, splashDuration);
    }

    if (document.getElementById("lss-splash") ||
        document.getElementById("lss-page-splash")) {
        initSplash();
    } else if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSplash, { once: true });
    } else {
        initSplash();
    }
})();



(function () {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  const welcomeSlide = carousel.querySelector('.hero-welcome-slide');
  const slides = Array.from(carousel.querySelectorAll('.slide:not(.hero-welcome-slide)'));
  const indicators = Array.from(carousel.querySelectorAll('.indicator'));
  const prevBtn = carousel.querySelector('.nav-arrow.left');
  const nextBtn = carousel.querySelector('.nav-arrow.right');

  let current = 0;
  let autoPlay = null;
  let welcomeTimer = null;
  let welcomeTimerStarted = false;
  let welcomeActive = Boolean(welcomeSlide);

  const autoDelay = 6000;
  const welcomeDuration = 3200;
  const welcomeFadeTime = 950;

  function showSlide(index) {
    if (!slides.length) return;

    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });

    indicators.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function nextSlide() {
    if (welcomeActive) return;
    showSlide(current + 1);
  }

  function prevSlide() {
    if (welcomeActive) return;
    showSlide(current - 1);
  }

  function startAutoPlay() {
    if (welcomeActive || !slides.length) return;

    stopAutoPlay();
    autoPlay = window.setInterval(nextSlide, autoDelay);
  }

  function stopAutoPlay() {
    if (autoPlay) {
      window.clearInterval(autoPlay);
      autoPlay = null;
    }
  }

  function finishWelcome() {
    if (!welcomeSlide || !welcomeActive) return;

    welcomeActive = false;
    window.clearTimeout(welcomeTimer);
    welcomeTimer = null;

    /* Superman is always the first real featured slide. */
    showSlide(0);

    welcomeSlide.classList.remove('active');
    carousel.classList.remove('welcome-active');
    setWelcomeControls(false);

    /* The welcome is removed after the crossfade, so it cannot return. */
    window.setTimeout(() => {
      welcomeSlide.remove();
    }, welcomeFadeTime);

    startAutoPlay();
  }

  function setWelcomeControls(isWelcome) {
    const vaultButton = carousel.querySelector('.hero-vault-button');
    const indicatorGroup = carousel.querySelector('.indicators');

    if (vaultButton) {
      vaultButton.style.setProperty('display', isWelcome ? 'none' : '', 'important');
    }

    if (indicatorGroup) {
      indicatorGroup.style.setProperty('display', isWelcome ? 'none' : '', 'important');
    }
  }

  function startWelcomeTimer() {
    if (!welcomeSlide || !welcomeActive || welcomeTimerStarted) return;

    welcomeTimerStarted = true;
    welcomeTimer = window.setTimeout(finishWelcome, welcomeDuration);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      /* During the welcome, either arrow skips directly to Superman. */
      if (welcomeActive) {
        finishWelcome();
        return;
      }

      prevSlide();
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      /* During the welcome, either arrow skips directly to Superman. */
      if (welcomeActive) {
        finishWelcome();
        return;
      }

      nextSlide();
      startAutoPlay();
    });
  }

  indicators.forEach((dot, index) => {
    dot.addEventListener('click', function () {
      if (welcomeActive) return;

      showSlide(index);
      startAutoPlay();
    });
  });

  document.querySelectorAll('.home-hero-section .hero-content-wrapper').forEach(wrapper => {
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
  });

  if (welcomeSlide) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(dot => dot.classList.remove('active'));

    welcomeSlide.classList.add('active');
    carousel.classList.add('welcome-active');
    setWelcomeControls(true);

    /*
      IMPORTANT:
      The welcome is already sitting behind the splash, but its countdown
      does NOT begin until the splash has completely finished.
    */
    if (window.lssSplashFinished) {
      startWelcomeTimer();
    } else {
      window.addEventListener("lssSplashFinished", startWelcomeTimer, { once: true });
    }
  } else {
    showSlide(0);

    if (window.lssSplashFinished) {
      window.setTimeout(startAutoPlay, 2400);
    } else {
      window.addEventListener("lssSplashFinished", function () {
        window.setTimeout(startAutoPlay, 2400);
      }, { once: true });
    }
  }
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
  return track.clientWidth / getPostersPerJump();
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
/* SCROLL PROGRESS */
document.addEventListener("DOMContentLoaded", () => {

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

// Automatically update image cache for all users across images, sources, and backgrounds
document.addEventListener("DOMContentLoaded", () => {
    // 1. UPDATE THIS NUMBER whenever you change your image files
    const currentVersion = "3"; 
    
    // 2. Target standard <img> tags
    document.querySelectorAll("img").forEach(img => {
        let src = img.getAttribute("src");
        if (src && src.includes("b-cdn.net")) {
            let cleanSrc = src.split('?')[0];
            img.src = `${cleanSrc}?v=${currentVersion}`;
        }
    });

    // 3. Target <source> tags inside <picture> elements
    document.querySelectorAll("source").forEach(source => {
        let srcset = source.getAttribute("srcset");
        if (srcset && srcset.includes("b-cdn.net")) {
            let cleanSrc = srcset.split('?')[0];
            source.srcset = `${cleanSrc}?v=${currentVersion}`;
        }
    });

    // 4. Target inline CSS background images (Hero wallpapers, etc.)
    document.querySelectorAll("[style*='background-image']").forEach(el => {
        let style = el.getAttribute("style");
        if (style && style.includes("b-cdn.net")) {
            let updatedStyle = style.replace(/url\(['"]?(https:\/\/[^'"]+b-cdn\.net[^'"]*)['"]?\)/g, (match, url) => {
                let cleanUrl = url.split('?')[0];
                return `url('${cleanUrl}?v=${currentVersion}')`;
            });
            el.setAttribute("style", updatedStyle);
        }
    });
});

/* =======================================================
   LSS CLOSED PROJECT SEARCH
   Only the project title/subtitle text below is searchable.
   Filenames, page copy, characters, actors, genres, and other
   hidden keywords are intentionally excluded.
======================================================= */
(function () {
  const projects = [
    { title: "BATMAN: GOTHAM'S RIDDLE", url: "/vault/batman.html", image: "https://light-speed-studios.b-cdn.net/batman-main.jpg" },
    { title: "CRISIS EARTH-X: RED SKIES", url: "/vault/crisis.html", image: "https://light-speed-studios.b-cdn.net/crisismain1.jpg" },
    { title: "PROJECT HAIL MARY: FAR FROM SOL", url: "/vault/far-from-sol.html", image: "https://light-speed-studios.b-cdn.net/Solvaulmob.jpg" },
    { title: "EX MACHINA: GLASS ROOMS", url: "/vault/glass-rooms.html", image: "https://light-speed-studios.b-cdn.net/glassrooms11111.jpg" },
    { title: "THE FLASH: OVERTIME", url: "/vault/overtime.html", image: "https://light-speed-studios.b-cdn.net/overtimevaultmob.jpg" },
    { title: "REAL STEEL: LAST ROUND", url: "/vault/real-steel.html", image: "https://light-speed-studios.b-cdn.net/RS-rail-text.jpg" },
    { title: "STAR WARS: ROGUE ONE", url: "/vault/rogue-one.html", image: "https://light-speed-studios.b-cdn.net/rogueonemain.jpg" },
    { title: "SPEED RACER: MACH 6", url: "/vault/speed-racer.html", image: "https://light-speed-studios.b-cdn.net/SRACTION.jpg" },
    { title: "STAR TREK: GENESIS", url: "/vault/star-trek.html", image: "https://light-speed-studios.b-cdn.net/star-trek-logo.jpg" },
    { title: "SUPERMAN: SON OF TOMORROW", url: "/vault/superman.html", image: "https://light-speed-studios.b-cdn.net/sotmain1.jpg" },
    { title: "THE FLASH: CROSSROADS", url: "/vault/the-flash.html", image: "https://light-speed-studios.b-cdn.net/flashmain1.jpg" },
    { title: "TOP GUN: ASCENSION", url: "/vault/top-gun.html", image: "https://light-speed-studios.b-cdn.net/TOPGUN-text.jpg" }
  ];

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  projects.forEach(project => {
    project.searchText = normalize(project.title);
  });

  function initProjectSearch() {
    const navBar = document.querySelector(".lss-nav-bar");
    const shell = document.getElementById("lssProjectSearchShell");
    const input = document.getElementById("lssProjectSearchInput");
    const results = document.getElementById("lssProjectSearchResults");
    const closeButton = document.getElementById("lssProjectSearchClose");
    const triggers = Array.from(document.querySelectorAll(".lss-project-search-trigger"));

    if (!navBar || !shell || !input || !results || !closeButton || !triggers.length) return;

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".lss-nav-links");

    function setTriggersExpanded(expanded) {
      triggers.forEach(trigger => {
        trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    }

    function closeMobileMenu() {
      if (navLinks) navLinks.classList.remove("active");
      if (hamburger) {
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
      }
    }

    function clearResults() {
      results.innerHTML = "";
      results.classList.remove("has-content");
    }

    function openSearch() {
      closeMobileMenu();
      navBar.classList.add("lss-search-active");
      shell.classList.add("is-open");
      shell.setAttribute("aria-hidden", "false");
      setTriggersExpanded(true);

      window.requestAnimationFrame(() => {
        input.focus({ preventScroll: true });
      });
    }

    function closeSearch(options = {}) {
      const restoreFocus = options.restoreFocus === true;
      navBar.classList.remove("lss-search-active");
      shell.classList.remove("is-open");
      shell.setAttribute("aria-hidden", "true");
      setTriggersExpanded(false);
      input.value = "";
      clearResults();

      if (restoreFocus) {
        const visibleTrigger = triggers.find(trigger => {
          const style = window.getComputedStyle(trigger);
          return style.display !== "none" && style.visibility !== "hidden";
        });
        if (visibleTrigger) visibleTrigger.focus({ preventScroll: true });
      }
    }

    function getMatches(query) {
      const normalizedQuery = normalize(query);
      if (!normalizedQuery) return [];

      const terms = normalizedQuery.split(" ").filter(Boolean);

      return projects.filter(project =>
        terms.every(term => project.searchText.includes(term))
      );
    }

    function renderResults() {
      const query = input.value;
      const normalizedQuery = normalize(query);

      if (!normalizedQuery || normalizedQuery.replace(/\s/g, "").length < 2) {
        clearResults();
        return;
      }

      const matches = getMatches(query);
      results.innerHTML = "";
      results.classList.add("has-content");

      if (!matches.length) {
        const empty = document.createElement("div");
        empty.className = "lss-project-search-empty";
        empty.textContent = "NO PROJECTS FOUND";
        results.appendChild(empty);
        return;
      }

      matches.forEach(project => {
        const link = document.createElement("a");
        link.className = "lss-project-search-result";
        link.href = project.url;
        link.setAttribute("role", "option");
        link.setAttribute("aria-label", `Open ${project.title}`);

        const imageWrap = document.createElement("span");
        imageWrap.className = "lss-project-search-result-image-wrap";

        const image = document.createElement("img");
        image.className = "lss-project-search-result-image";
        image.src = project.image;
        image.alt = "";
        image.loading = "lazy";
        image.decoding = "async";
        imageWrap.appendChild(image);

        const copy = document.createElement("span");
        copy.className = "lss-project-search-result-copy";

        const title = document.createElement("span");
        title.className = "lss-project-search-result-title";
        title.textContent = project.title;

        const arrow = document.createElement("span");
        arrow.className = "lss-project-search-result-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "›";

        copy.appendChild(title);
        link.appendChild(imageWrap);
        link.appendChild(copy);
        link.appendChild(arrow);
        results.appendChild(link);
      });
    }

    triggers.forEach(trigger => {
      trigger.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        openSearch();
      });
    });

    closeButton.addEventListener("click", () => {
      closeSearch({ restoreFocus: true });
    });

    input.addEventListener("input", renderResults);

    input.addEventListener("keydown", event => {
      /* Search has no submit behavior. Visitors must choose a valid dropdown result. */
      if (event.key === "Enter") {
        event.preventDefault();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch({ restoreFocus: true });
      }

      if (event.key === "ArrowDown") {
        const firstResult = results.querySelector(".lss-project-search-result");
        if (firstResult) {
          event.preventDefault();
          firstResult.focus();
        }
      }
    });

    results.addEventListener("keydown", event => {
      const links = Array.from(results.querySelectorAll(".lss-project-search-result"));
      if (!links.length) return;

      const currentIndex = links.indexOf(document.activeElement);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        links[(currentIndex + 1 + links.length) % links.length].focus();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (currentIndex <= 0) input.focus();
        else links[currentIndex - 1].focus();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch({ restoreFocus: true });
      }
    });

    document.addEventListener("pointerdown", event => {
      if (!navBar.classList.contains("lss-search-active")) return;
      if (shell.contains(event.target) || triggers.some(trigger => trigger.contains(event.target))) return;
      closeSearch();
    });

    window.addEventListener("resize", () => {
      if (!navBar.classList.contains("lss-search-active")) return;
      closeMobileMenu();
    });

    /* Expose a tiny hook so the existing nav can close search if needed later. */
    window.closeLssProjectSearch = closeSearch;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectSearch, { once: true });
  } else {
    initProjectSearch();
  }
})();
