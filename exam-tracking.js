(function () {
  const keys = {
    session: "ccnaSrweExamSession",
    history: "ccnaSrweScoreHistory",
    attempts: "ccnaSrweAttemptStats",
    bankCoverage: "ccnaSrweBankCoverage",
  };

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The app remains usable if local storage is unavailable.
    }
  };

  function answered(item, question) {
    if (!item || !question) return false;
    if (question.type === "matching") {
      const prompts = question.matching?.prompts || [];
      return prompts.length > 0 && prompts.every((_, index) => Boolean(item.matchingAnswer?.[index]));
    }
    if (question.type === "study") return Boolean((item.note || "").trim());
    return Array.isArray(item.answer) && item.answer.length > 0;
  }

  function sessionProgress() {
    const session = read(keys.session, null);
    const bank = window.CCNA_QUESTIONS || [];
    const byId = new Map(bank.map((question) => [question.id, question]));
    const items = Array.isArray(session?.items) ? session.items : [];
    const done = items.filter((item) => answered(item, byId.get(item.id))).length;
    return {
      session,
      total: items.length,
      done,
      remaining: Math.max(0, items.length - done),
    };
  }

  function attemptStats() {
    const history = read(keys.history, []);
    const progress = sessionProgress();
    const stored = read(keys.attempts, { total: 0, seen: {} });
    stored.seen ||= {};
    stored.total = Math.max(Number(stored.total) || 0, history.length);

    const createdAt = progress.session?.createdAt;
    if (createdAt && !progress.session.submitted && !stored.seen[createdAt]) {
      stored.seen[createdAt] = true;
      stored.total += 1;
    }

    write(keys.attempts, stored);
    return { total: stored.total, progress };
  }

  function coverageStats() {
    const bank = window.CCNA_QUESTIONS || [];
    const validIds = new Set(bank.map((question) => question.id));
    const history = read(keys.history, []);
    const progress = sessionProgress();
    const stored = read(keys.bankCoverage, { seenIds: [] });
    const seen = new Set((stored.seenIds || []).filter((id) => validIds.has(id)));

    // Older versions did not save every question ID. Recover the IDs that are
    // still available, then keep an exact record for every session from now on.
    history.forEach((entry) => (entry.wrongIds || []).forEach((id) => seen.add(id)));
    (progress.session?.items || []).forEach((item) => seen.add(item.id));

    const seenIds = [...seen].filter((id) => validIds.has(id));
    write(keys.bankCoverage, { seenIds });
    return {
      total: bank.length,
      seen: seenIds.length,
      unseen: Math.max(0, bank.length - seenIds.length),
    };
  }

  function card(label, value, tone = "") {
    const node = document.createElement("div");
    node.className = `tracking-card ${tone}`.trim();
    node.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    return node;
  }

  function renderHome() {
    const summary = document.querySelector("#bankSummary");
    if (!summary) return;
    let panel = document.querySelector("#attemptOverview");
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "attemptOverview";
      panel.className = "attempt-overview";
      summary.after(panel);
    }

    const { total, progress } = attemptStats();
    const coverage = coverageStats();
    panel.innerHTML = "";
    panel.append(card("Tentatives", total));
    panel.append(card("Banque exploree", `${coverage.seen}/${coverage.total}`, coverage.unseen ? "" : "complete"));
    panel.append(card("Questions inedites", coverage.unseen, coverage.unseen ? "warning" : "complete"));
    if (progress.total) {
      panel.append(card("Session en cours", `${progress.done}/${progress.total} repondues`, progress.remaining ? "" : "complete"));
    } else {
      panel.append(card("Session en cours", "Aucune"));
    }
  }

  function renderExam() {
    const stats = document.querySelector("#examShell .exam-stats");
    if (!stats) return;
    const { progress } = attemptStats();
    const coverage = coverageStats();
    let panel = document.querySelector("#trackingExamStats");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "trackingExamStats";
      panel.className = "tracking-exam-stats";
      stats.prepend(panel);
    }

    const complete = progress.total > 0 && progress.remaining === 0;
    panel.innerHTML = `
      <div class="tracking-mini ${complete ? "complete" : ""}">
        <span>Repondues</span>
        <strong>${progress.done}/${progress.total}</strong>
      </div>
      <div class="tracking-mini ${complete ? "complete" : "warning"}">
        <span>Restantes</span>
        <strong>${progress.remaining}</strong>
      </div>
      <div class="tracking-mini">
        <span>Banque vue</span>
        <strong>${coverage.seen}/${coverage.total}</strong>
      </div>
    `;
  }

  function refresh() {
    renderHome();
    renderExam();
  }

  function protectIncompleteSubmit() {
    const button = document.querySelector("#submitBtn");
    if (!button || button.dataset.trackingProtected) return;
    button.dataset.trackingProtected = "true";
    button.addEventListener("click", (event) => {
      if (button.dataset.trackingSkip === "true") {
        button.dataset.trackingSkip = "false";
        return;
      }
      const { remaining } = sessionProgress();
      if (!remaining) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (confirm(`Il reste ${remaining} question${remaining > 1 ? "s" : ""} sans reponse. Soumettre quand meme ?`)) {
        button.dataset.trackingSkip = "true";
        button.click();
      }
    }, true);
  }

  function run() {
    protectIncompleteSubmit();
    refresh();
  }

  document.addEventListener("DOMContentLoaded", run);
  document.addEventListener("click", () => setTimeout(refresh, 80));
  document.addEventListener("change", () => setTimeout(refresh, 80));
  document.addEventListener("input", () => setTimeout(refresh, 120));
  run();
  setInterval(refresh, 1500);
})();
