(function () {
  function moveHomeNav() {
    const start = document.querySelector("#startScreen");
    const brand = start?.querySelector(":scope > .brand-row");
    const nav = document.querySelector("#homeStudyShell .study-nav");
    if (!start || !brand || !nav) return;

    let topbar = document.querySelector("#homeTopbar");
    if (!topbar) {
      topbar = document.createElement("div");
      topbar.id = "homeTopbar";
      topbar.className = "home-topbar";
      brand.before(topbar);
      topbar.append(brand);
    }

    if (nav.parentElement !== topbar) topbar.append(nav);
    document.querySelector("#homeStudyShell")?.classList.add("nav-relocated");
  }

  document.addEventListener("DOMContentLoaded", moveHomeNav);
  moveHomeNav();
  setTimeout(moveHomeNav, 150);
  setTimeout(moveHomeNav, 700);
  setTimeout(moveHomeNav, 1400);
})();
