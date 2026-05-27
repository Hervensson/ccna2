(function () {
  const allQuestions = (window.CCNA_QUESTIONS || []).filter((question) => {
    return ["single", "multi"].includes(question.type) && question.correct?.length && question.options?.length;
  });
  const SESSION_SIZE = 20;

  const state = {
    items: [],
    current: 0,
    answers: new Map(),
  };

  const els = {
    themeSelect: document.querySelector("#themeSelect"),
    bankInfo: document.querySelector("#bankInfo"),
    start: document.querySelector("#startClassQuiz"),
    quiz: document.querySelector("#quizView"),
    results: document.querySelector("#resultView"),
    counter: document.querySelector("#questionCounter"),
    answered: document.querySelector("#answeredCounter"),
    fill: document.querySelector("#progressFill"),
    theme: document.querySelector("#questionTheme"),
    text: document.querySelector("#questionText"),
    images: document.querySelector("#questionImages"),
    answers: document.querySelector("#answerList"),
    prev: document.querySelector("#prevQuestion"),
    next: document.querySelector("#nextQuestion"),
    submit: document.querySelector("#submitQuiz"),
    finalScore: document.querySelector("#finalScore"),
    finalPercent: document.querySelector("#finalPercent"),
    correction: document.querySelector("#correctionList"),
    retry: document.querySelector("#retryQuiz"),
  };

  function shuffle(values) {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  function themes() {
    return [...new Set(allQuestions.map((question) => question.theme || "Autres"))].sort();
  }

  function setup() {
    themes().forEach((theme) => {
      const option = document.createElement("option");
      option.value = theme;
      option.textContent = theme;
      els.themeSelect.append(option);
    });
    els.bankInfo.textContent = `${allQuestions.length} questions simples disponibles.`;
    els.start.addEventListener("click", startQuiz);
    els.prev.addEventListener("click", () => goTo(state.current - 1));
    els.next.addEventListener("click", () => goTo(state.current + 1));
    els.submit.addEventListener("click", showResults);
    els.retry.addEventListener("click", startQuiz);
  }

  function startQuiz() {
    const theme = els.themeSelect.value;
    const pool = theme ? allQuestions.filter((question) => question.theme === theme) : allQuestions;
    state.items = shuffle(pool).slice(0, Math.min(SESSION_SIZE, pool.length)).map((question) => ({
      question,
      order: shuffle(question.options.map((_, index) => index)),
    }));
    state.current = 0;
    state.answers = new Map();
    els.quiz.classList.remove("hidden");
    els.results.classList.add("hidden");
    renderQuestion();
    window.scrollTo({ top: els.quiz.offsetTop - 8, behavior: "smooth" });
  }

  function current() {
    return state.items[state.current];
  }

  function selectedFor(questionId) {
    return state.answers.get(questionId) || [];
  }

  function renderQuestion() {
    const item = current();
    if (!item) return;
    const question = item.question;
    const selected = selectedFor(question.id);
    const answeredCount = state.items.filter((entry) => selectedFor(entry.question.id).length).length;

    els.counter.textContent = `${state.current + 1} / ${state.items.length}`;
    els.answered.textContent = `${answeredCount} reponse${answeredCount > 1 ? "s" : ""}`;
    els.fill.style.width = `${state.items.length ? (answeredCount / state.items.length) * 100 : 0}%`;
    els.theme.textContent = question.theme || "CCNA";
    els.text.textContent = question.question;
    els.prev.disabled = state.current === 0;
    els.next.disabled = state.current === state.items.length - 1;

    els.images.innerHTML = "";
    (question.images || []).forEach((src, index) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = `Illustration ${index + 1}`;
      els.images.append(image);
    });

    els.answers.innerHTML = "";
    item.order.forEach((originalIndex, displayIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `answer ${selected.includes(originalIndex) ? "selected" : ""}`;
      button.innerHTML = `<span class="letter">${String.fromCharCode(65 + displayIndex)}</span><span>${escapeHtml(question.options[originalIndex])}</span>`;
      button.addEventListener("click", () => toggleAnswer(question, originalIndex));
      els.answers.append(button);
    });
  }

  function toggleAnswer(question, originalIndex) {
    const selected = selectedFor(question.id);
    if (question.type === "single") {
      state.answers.set(question.id, [originalIndex]);
    } else if (selected.includes(originalIndex)) {
      state.answers.set(question.id, selected.filter((value) => value !== originalIndex));
    } else {
      state.answers.set(question.id, [...selected, originalIndex].slice(-question.correct.length));
    }
    renderQuestion();
  }

  function goTo(index) {
    if (index < 0 || index >= state.items.length) return;
    state.current = index;
    renderQuestion();
  }

  function isCorrect(question) {
    const selected = [...selectedFor(question.id)].sort((a, b) => a - b);
    const correct = [...question.correct].sort((a, b) => a - b);
    return selected.length === correct.length && selected.every((value, index) => value === correct[index]);
  }

  function showResults() {
    const correctCount = state.items.filter((item) => isCorrect(item.question)).length;
    const percent = state.items.length ? Math.round((correctCount / state.items.length) * 100) : 0;
    els.quiz.classList.add("hidden");
    els.results.classList.remove("hidden");
    els.finalScore.textContent = `${correctCount} / ${state.items.length}`;
    els.finalPercent.textContent = `${percent}% de reussite`;
    els.correction.innerHTML = "";

    state.items.forEach((item, index) => {
      const question = item.question;
      const selected = selectedFor(question.id);
      const correct = isCorrect(question);
      const card = document.createElement("article");
      card.className = `correction-card ${correct ? "good" : "bad"}`;
      card.innerHTML = `
        <p class="theme-pill">${escapeHtml(question.theme || "CCNA")}</p>
        <h3>${index + 1}. ${escapeHtml(question.question)}</h3>
        <div class="line ${correct ? "correct" : "wrong"}">Ta reponse : ${answerText(question, selected) || "aucune"}</div>
        <div class="line correct">Bonne reponse : ${answerText(question, question.correct)}</div>
        ${question.explanation ? `<p>${escapeHtml(question.explanation)}</p>` : ""}
      `;
      els.correction.append(card);
    });
    window.scrollTo({ top: els.results.offsetTop - 8, behavior: "smooth" });
  }

  function answerText(question, indexes) {
    return (indexes || []).map((index) => question.options[index]).filter(Boolean).join(" ; ");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));
  }

  setup();
})();
