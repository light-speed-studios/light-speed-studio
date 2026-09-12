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
