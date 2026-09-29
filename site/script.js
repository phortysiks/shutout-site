// Shutout - the page's small bits of life: scores that roll over like the
// app's, a Live Activity card and a Dynamic Island replaying a real comeback,
// and sections that ease in as they arrive.

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Manchester Storm v Guildford Flames, Challenge Cup, Sunday 27 September
  // 2026: Guildford come back from 3-0 down. Every goal as it happened.
  const comeback = [
    { home: 3, away: 0, period: "2ND", clock: "36:40", scorer: "Lewis Hook (Cutler, Busby)" },
    { home: 3, away: 1, period: "3RD", clock: "43:02", scorer: "Cole Sanford (Waller, Power)" },
    { home: 3, away: 2, period: "3RD", clock: "44:33", scorer: "Mathieu Gosselin (Waller, Sanford)" },
    { home: 3, away: 3, period: "3RD", clock: "47:35", scorer: "Mathieu Gosselin (Power)" },
  ];

  // --- Rolling digits -------------------------------------------------------

  // Each score holds a column of digits 0-9 and slides to the one it shows,
  // the web's version of the app's numeric-text transition.
  function buildScores(root) {
    root.querySelectorAll(".score__roll").forEach((roll) => {
      roll.innerHTML = Array.from({ length: 10 }, (_, n) => `<span>${n}</span>`).join("");
    });
  }

  function setScore(root, side, value, { instant = false } = {}) {
    root.querySelectorAll(`.score[data-side="${side}"] .score__roll`).forEach((roll) => {
      if (instant) roll.style.transition = "none";
      roll.style.translate = `0 ${-value}em`;
      if (instant) {
        roll.getBoundingClientRect(); // commit before restoring the transition
        roll.style.transition = "";
      }
    });
  }

  function setText(root, selector, text) {
    root.querySelectorAll(selector).forEach((el) => { el.textContent = text; });
  }

  function show(root, state, options) {
    setScore(root, "home", state.home, options);
    setScore(root, "away", state.away, options);
    setText(root, "[data-clock]", state.clock);
    setText(root, "[data-scorer]", state.scorer);
    setText(root, "[data-status]", state.period);
  }

  // --- The hero's Lock Screen card -----------------------------------------

  async function runCard(card) {
    const scorer = card.querySelector(".la-card__scorer");
    buildScores(card);
    show(card, comeback[0], { instant: true });
    if (reduceMotion) {
      show(card, comeback[comeback.length - 1], { instant: true });
      return;
    }
    for (;;) {
      await wait(3000);
      for (const state of comeback.slice(1)) {
        // The goal's alert lights the card, the score rolls, then the scorer
        // follows - as it does in the app, where the name comes a moment later.
        card.classList.add("is-alert");
        setScore(card, "home", state.home);
        setScore(card, "away", state.away);
        setText(card, "[data-status]", state.period);
        scorer.classList.add("is-changing");
        await wait(450);
        setText(card, "[data-clock]", state.clock);
        setText(card, "[data-scorer]", state.scorer);
        scorer.classList.remove("is-changing");
        await wait(900);
        card.classList.remove("is-alert");
        await wait(2800);
      }
      await wait(2500);
      scorer.classList.add("is-changing");
      await wait(400);
      show(card, comeback[0], { instant: true });
      scorer.classList.remove("is-changing");
    }
  }

  // --- The Dynamic Island --------------------------------------------------

  async function runIsland(island) {
    buildScores(island);
    show(island, comeback[0], { instant: true });
    if (reduceMotion) {
      show(island, comeback[comeback.length - 1], { instant: true });
      island.classList.add("is-expanded");
      return;
    }
    for (;;) {
      for (const state of comeback.slice(1)) {
        await wait(1800);
        // Open on the old score, then roll to the new one - the goal arriving.
        island.classList.add("is-expanded");
        await wait(650);
        show(island, state);
        await wait(2600);
        island.classList.remove("is-expanded");
      }
      await wait(2400);
      show(island, comeback[0], { instant: true });
    }
  }

  // --- Start things when they're on screen ---------------------------------

  const card = document.querySelector("[data-comeback]");
  if (card) runCard(card);

  const island = document.querySelector("[data-island]");
  const reveal = document.querySelectorAll("[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    reveal.forEach((el) => el.classList.add("is-in"));
    if (island) runIsland(island);
    return;
  }

  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        revealer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveal.forEach((el) => revealer.observe(el));

  if (island) {
    const starter = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        starter.disconnect();
        runIsland(island);
      }
    }, { threshold: 0.4 });
    starter.observe(island);
  }
})();
