(function () {
  const BANK = window.CCNA_QUESTIONS || [];
  const KEY = "ccnaSrweQuestionFrequency";
  const SESSION_KEY = "ccnaSrweExamSession";
  const HISTORY_KEY = "ccnaSrweScoreHistory";
  const COVERAGE_KEY = "ccnaSrweBankCoverage";

  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };
  const escapeHtml = (value) => String(value || "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[character]));

  function stats() {
    const validIds = new Set(BANK.map((question) => question.id));
    const stored = read(KEY, { counts: {}, sessions: {} });
    stored.counts ||= {};
    stored.sessions ||= {};

    read(HISTORY_KEY, []).forEach((entry) => (entry.wrongIds || []).forEach((id) => {
      if (validIds.has(id)) stored.counts[id] ||= 1;
    }));

    const session = read(SESSION_KEY, null);
    const createdAt = session?.createdAt;
    if (createdAt && !stored.sessions[createdAt]) {
      const ids = [...new Set((session.items || []).map((item) => item.id).filter((id) => validIds.has(id)))];
      ids.forEach((id) => { stored.counts[id] = (Number(stored.counts[id]) || 0) + 1; });
      stored.sessions[createdAt] = ids;
    }

    write(KEY, stored);
    const seenIds = Object.keys(stored.counts).map(Number).filter((id) => validIds.has(id) && stored.counts[id]);
    write(COVERAGE_KEY, { ...read(COVERAGE_KEY, {}), seenIds });
    return { counts: stored.counts, seen: seenIds.length, unseen: Math.max(0, BANK.length - seenIds.length) };
  }

  function renderHistory() {
    const page = document.querySelector("#homeStudyShell-history");
    if (!page) return;
    let panel = document.querySelector("#questionFrequencyPanel");
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "questionFrequencyPanel";
      panel.className = "question-frequency-panel";
      page.prepend(panel);
    }
    const data = stats();
    const rows = BANK
      .map((question) => ({ question, count: Number(data.counts[question.id]) || 0 }))
      .filter((row) => row.count)
      .sort((a, b) => b.count - a.count || a.question.id - b.question.id)
      .slice(0, 12);
    panel.innerHTML = `
      <div class="frequency-head">
        <div><span>Suivi des questions</span><strong>${data.seen}/${BANK.length} questions differentes vues</strong></div>
        <b>${data.unseen} encore inedites</b>
      </div>
      <p>Voici les questions les plus souvent apparues. Le detail complet est disponible dans l'onglet Banque.</p>
      <div class="frequency-list">
        ${rows.length ? rows.map(({ question, count }) => `
          <div class="frequency-row">
            <span>#${question.sourceNumber || question.id}</span>
            <strong>${escapeHtml(question.question)}</strong>
            <b>Vue ${count} fois</b>
          </div>`).join("") : "<p>Lance une session pour commencer le suivi.</p>"}
      </div>`;
  }

  function renderBank() {
    const data = stats();
    document.querySelectorAll("[data-bank-id]").forEach((button) => {
      const label = button.closest(".bank-question")?.querySelector("span");
      if (!label) return;
      const count = Number(data.counts[button.dataset.bankId]) || 0;
      let badge = label.querySelector(".bank-view-count");
      if (!badge) {
        badge = document.createElement("b");
        badge.className = "bank-view-count";
        label.append(" · ", badge);
      }
      badge.textContent = `Vue ${count} fois`;
    });
  }

  function run() {
    stats();
    renderHistory();
    renderBank();
  }

  document.addEventListener("DOMContentLoaded", run);
  document.addEventListener("click", () => setTimeout(run, 100));
  run();
  setInterval(run, 1500);
})();
