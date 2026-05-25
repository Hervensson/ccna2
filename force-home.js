(function () {
  function showHomeOnLaunch() {
    const start = document.querySelector("#startScreen");
    const exam = document.querySelector("#examShell");
    const result = document.querySelector("#resultScreen");
    if (!start || !exam || !result) return;

    start.classList.remove("hidden");
    exam.classList.add("hidden");
    result.classList.add("hidden");
  }

  showHomeOnLaunch();
  document.addEventListener("DOMContentLoaded", showHomeOnLaunch);
  setTimeout(showHomeOnLaunch, 80);
  setTimeout(showHomeOnLaunch, 350);
})();
