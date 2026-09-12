/* =======================================================
   GLOBAL MOBILE NAV
   Works across every page using .lss-nav-bar
======================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const navBars = document.querySelectorAll(".lss-nav-bar");

  navBars.forEach(function (navBar) {
    const navLinks = navBar.querySelector(".lss-nav-links");
    let hamburger = navBar.querySelector(".hamburger");

    if (!navLinks) return;

    /* Create hamburger if page somehow does not have one */
    if (!hamburger) {
      hamburger = document.createElement("button");
      hamburger.className = "hamburger";
      navLinks.before(hamburger);
    }

    /* Convert old ☰ hamburger into animated 3-line button */
    hamburger.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;

    hamburger.setAttribute("type", "button");
    hamburger.setAttribute("aria-label", "Open navigation menu");
    hamburger.setAttribute("aria-expanded", "false");

    /* Remove old inline click behavior if present */
    hamburger.removeAttribute("onclick");

    hamburger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const isOpen = navLinks.classList.toggle("active");

      hamburger.classList.toggle("active", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    /* Close menu after selecting a page */
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {

    const splash = document.getElementById("lss-splash");

    function closeSplash() {
        if (!splash || splash.classList.contains("hide")) return;

        splash.classList.add("hide");

        setTimeout(() => {
            splash.remove();
        }, 800);
    }

    document.addEventListener("pointerdown", closeSplash, { once: true });

    setTimeout(closeSplash, 5200);

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

      function nextSlide() {
        showSlide(current + 1);
      }

      function prevSlide() {
        showSlide(current - 1);
      }

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

      if (prevBtn) {
        prevBtn.addEventListener('click', function () {
          prevSlide();
          startAutoPlay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function () {
          nextSlide();
          startAutoPlay();
        });
      }

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

setTimeout(() => {
    startAutoPlay();
}, 5000);
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

      function nextMobileSlide() {
        showMobileSlide(mobileCurrent + 1);
      }

      function prevMobileSlide() {
        showMobileSlide(mobileCurrent - 1);
      }

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

      if (mobilePrevBtn) {
        mobilePrevBtn.addEventListener('click', function () {
          prevMobileSlide();
          startMobileAutoPlay();
        });
      }

      if (mobileNextBtn) {
        mobileNextBtn.addEventListener('click', function () {
          nextMobileSlide();
          startMobileAutoPlay();
        });
      }

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
const postersPerJump = 4;
let currentVaultPage = 0;
function setupVaultDashes() {
const totalPosterCount = track.querySelectorAll(".vault-item").length;
const realPosterCount = track.dataset.realPosterCount
  ? Number(track.dataset.realPosterCount)
  : totalPosterCount;
const pageCount = Math.ceil(realPosterCount / postersPerJump);
  dashes.innerHTML = "";

  for (let i = 0; i < pageCount; i++) {
    const dash = document.createElement("button");
    dash.className = "vault-rail-dash";
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
  const item = track.querySelector(".vault-item");
  if (!item) return 0;

  const gap = parseFloat(getComputedStyle(item).marginRight) || 0;
  return item.getBoundingClientRect().width + gap;
}

function scrollToVaultPage(page) {
 const realPosterCount = track.querySelectorAll(".vault-item").length / 2;
const pageCount = Math.ceil(realPosterCount / postersPerJump);

currentVaultPage = ((page % pageCount) + pageCount) % pageCount;

  const maxScroll = track.scrollWidth - track.clientWidth;
  const target = Math.min(currentVaultPage * postersPerJump * getVaultStep(), maxScroll);

  track.scrollTo({
    left: target,
    behavior: "smooth"
  });

  updateVaultDashes();
}
if (!track || !prev || !next || !dashes) return;
setupVaultDashes();
const railWrapper = track.closest('.vault-rail-wrapper');

let fadesActivated = false;

function updateVaultFades() {
  if (!fadesActivated) return;

  const maxScroll = track.scrollWidth - track.clientWidth;
  const currentScroll = track.scrollLeft;

  railWrapper.classList.toggle('show-left-fade', currentScroll > 5);
  railWrapper.classList.toggle('show-right-fade', currentScroll < maxScroll - 5);
}

function activateFades() {
  if (fadesActivated) return;
  fadesActivated = true;
  updateVaultFades();
}

next.addEventListener('click', activateFades);
prev.addEventListener('click', activateFades);
track.addEventListener('scroll', activateFades);

track.addEventListener('scroll', updateVaultFades);
window.addEventListener('resize', updateVaultFades);
const originals = Array.from(track.children);
track.dataset.realPosterCount = originals.length;
originals.forEach(el => track.appendChild(el.cloneNode(true)));
      track.scrollLeft = 1;

      function halfWidth() {
        return track.scrollWidth / 2;
      }

      function normalizeScroll() {
        const half = halfWidth();
        if (half <= 0) return;

        if (track.scrollLeft >= half) track.scrollLeft -= half;
        if (track.scrollLeft < 0) track.scrollLeft += half;
      }

      function getPosterStep() {
        const item = track.querySelector(".vault-item");
        if (!item) return 0;

        const styles = getComputedStyle(item);
        const gap = parseFloat(styles.marginRight) || 0;
        return item.getBoundingClientRect().width + gap;
      }

      function smoothJump(dir) {
        const step = getPosterStep();
        if (!step) return;

        const start = track.scrollLeft;
        const target = start + dir * step * 4;
        const duration = 320;
        const startTime = performance.now();

        function animate(now) {
          const t = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - t, 3);

          track.scrollLeft = start + (target - start) * eased;
          normalizeScroll();

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            track.scrollLeft = target;
            normalizeScroll();
          }
        }

        requestAnimationFrame(animate);
      }
next.addEventListener("click", () => {
  currentVaultPage++;
  scrollToVaultPage(currentVaultPage);
});

prev.addEventListener("click", () => {
  currentVaultPage--;
  scrollToVaultPage(currentVaultPage);
});
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

      function updateDots(i) {
        dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
      }

      function setActiveByLayout() {
        const boxes = mobileList.querySelectorAll(".box");
        boxes.forEach(b => b.classList.remove("active"));

        if (vaultSection.classList.contains("mobile-mode")) {
          if (boxes[0]) boxes[0].classList.add("active");
        } else {
          if (boxes[3]) boxes[3].classList.add("active");
        }
      }

      function shiftLeft() {
        if (vaultSection.classList.contains("mobile-mode")) {
          nextMobile();
          return;
        }

        const boxes = mobileList.querySelectorAll(".box");
        const first = boxes[0];

        setTimeout(() => {
          first.remove();
          mobileList.appendChild(first);
          setActiveByLayout();
        }, 400);

        currentIndex = (currentIndex + 1) % dots.length;
        updateDots(currentIndex);
      }

      function shiftRight() {
        if (vaultSection.classList.contains("mobile-mode")) {
          prevMobile();
          return;
        }

        const boxes = mobileList.querySelectorAll(".box");
        const last = boxes[boxes.length - 1];

        setTimeout(() => {
          last.remove();
          mobileList.insertBefore(last, mobileList.firstChild);
          setActiveByLayout();
        }, 400);

        currentIndex = (currentIndex - 1 + dots.length) % dots.length;
        updateDots(currentIndex);
      }

      function nextMobile() {
        const first = mobileList.querySelector(".box:first-child");
        if (!first) return;

        mobileList.appendChild(first);
        setActiveByLayout();
      }

      function prevMobile() {
        const last = mobileList.querySelector(".box:last-child");
        if (!last) return;

        mobileList.insertBefore(last, mobileList.firstChild);
        setActiveByLayout();
      }

      navPrev.onclick = () => vaultSection.classList.contains("mobile-mode") ? prevMobile() : shiftRight();
      navNext.onclick = () => vaultSection.classList.contains("mobile-mode") ? nextMobile() : shiftLeft();

      swipeLeft.onclick = () => prevMobile();
      swipeRight.onclick = () => nextMobile();

      stage.addEventListener("touchstart", e => {
        startX = e.changedTouches[0].clientX;
      }, { passive: true });

      stage.addEventListener("touchend", e => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;

        if (Math.abs(dx) > 30) {
          if (vaultSection.classList.contains("mobile-mode")) {
            dx < 0 ? nextMobile() : prevMobile();
          } else {
            dx < 0 ? shiftLeft() : shiftRight();
          }
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
