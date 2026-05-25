(function () {
  function forceHomeWhenFinished() {
    try {
      const raw = localStorage.getItem("ccnaSrweExamSession");
      const saved = raw && JSON.parse(raw);
      if (!saved || !saved.submitted) return;
      localStorage.removeItem("ccnaSrweExamSession");
      const start = document.querySelector("#startScreen");
      const exam = document.querySelector("#examShell");
      const result = document.querySelector("#resultScreen");
      if (!start || !exam || !result) return;
      start.classList.remove("hidden");
      exam.classList.add("hidden");
      result.classList.add("hidden");
    } catch {
      // Keep normal launch behavior if storage is blocked.
    }
  }

  forceHomeWhenFinished();
  setTimeout(forceHomeWhenFinished, 250);
  setTimeout(forceHomeWhenFinished, 900);
})();
