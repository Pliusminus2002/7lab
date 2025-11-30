// ===========================
// 12 LAB – MANO ŽAIDIMAS + PAPILDOMA
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const movesEl = document.getElementById("game-moves");
  const pairsEl = document.getElementById("game-pairs");
  const timeEl = document.getElementById("game-time");
  const msgEl = document.getElementById("game-message");
  const startBtn = document.getElementById("game-start");
  const resetBtn = document.getElementById("game-reset");
  const diffButtons = document.querySelectorAll(".game-diff-btn");
  const bestEasyEl = document.getElementById("best-easy");
  const bestHardEl = document.getElementById("best-hard");

  // jei šiame puslapyje nėra žaidimo – išeinam
  if (!board || !startBtn || !timeEl) return;

  // 2.a – duomenų rinkinys kortelėms
  const icons = ["💻", "🤖", "⚙️", "🚀", "📚", "🎧", "🧠", "💡", "🔋", "🌌", "🎮", "📷"];

  let difficulty = "easy";      // "easy" – 4x3, "hard" – 6x4
  let cards = [];               // sugeneruotos kortelės
  let opened = [];              // šiuo metu atverstos kortelės (indeksai)
  let lockBoard = false;        // ar laikinai užrakinta (laukia timeout)
  let moves = 0;
  let matchedPairs = 0;
  let totalPairs = 0;

  // Papildoma: laikmatis
  let timerId = null;
  let elapsedSec = 0;

  const LS_KEY_EASY = "memoryGameBest_easy";
  const LS_KEY_HARD = "memoryGameBest_hard";

  // ================= TIMERIS =================

  function updateTimeUI() {
    const m = Math.floor(elapsedSec / 60);
    const s = elapsedSec % 60;
    timeEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function startTimer() {
    stopTimer();
    timerId = setInterval(() => {
      elapsedSec++;
      updateTimeUI();
    }, 1000);
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // ================= localStorage GERIAUSIAS =================

  function loadBest(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveBest(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function formatBest(best) {
    if (!best) return "–";
    const m = Math.floor(best.time / 60);
    const s = best.time % 60;
    const timeStr = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${best.moves} ėj., ${timeStr}`;
  }

  function refreshBestUI() {
    if (bestEasyEl) bestEasyEl.textContent = formatBest(loadBest(LS_KEY_EASY));
    if (bestHardEl) bestHardEl.textContent = formatBest(loadBest(LS_KEY_HARD));
  }

  refreshBestUI();

  // ================= KORTELĖS / LENTA =================

  function generateCards() {
    const pairCount = difficulty === "easy" ? 6 : 12; // 4x3=12 => 6 porų; 6x4=24 => 12 porų
    const baseIcons = icons.slice(0, pairCount);

    const temp = [];
    baseIcons.forEach((sym) => {
      temp.push({ symbol: sym });
      temp.push({ symbol: sym });
    });

    for (let i = temp.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }

    cards = temp;
    totalPairs = pairCount;
  }

  function renderBoard() {
    board.innerHTML = "";
    board.classList.toggle("easy", difficulty === "easy");
    board.classList.toggle("hard", difficulty === "hard");

    cards.forEach((card, index) => {
      const btn = document.createElement("button");
      btn.className = "game-card hidden";
      btn.dataset.index = index;
      const span = document.createElement("span");
      span.textContent = card.symbol;
      btn.appendChild(span);
      board.appendChild(btn);
    });
  }

  function resetStats() {
    moves = 0;
    matchedPairs = 0;
    opened = [];
    lockBoard = false;
    elapsedSec = 0;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    updateTimeUI();
  }

  function startGame() {
    resetStats();
    generateCards();
    renderBoard();
    msgEl.textContent = "Žaidimas pradėtas! Surask visas poras.";
    startTimer();            // <- ČIA LAIKMATIS STARTUOJA
  }

  // ================= ŽAIDIMO LOGIKA =================

  function onCardClick(e) {
    const btn = e.target.closest(".game-card");
    if (!btn || lockBoard) return;

    const index = Number(btn.dataset.index);
    if (btn.classList.contains("matched") || opened.includes(index)) return;

    btn.classList.remove("hidden");
    btn.classList.add("flipped");
    opened.push(index);

    if (opened.length === 2) {
      checkMatch();
    }
  }

  function checkMatch() {
    lockBoard = true;
    const [i1, i2] = opened;
    const c1 = cards[i1];
    const c2 = cards[i2];
    moves++;
    movesEl.textContent = moves.toString();

    const btn1 = board.querySelector(`.game-card[data-index="${i1}"]`);
    const btn2 = board.querySelector(`.game-card[data-index="${i2}"]`);

    if (c1.symbol === c2.symbol) {
      matchedPairs++;
      pairsEl.textContent = matchedPairs.toString();
      if (btn1 && btn2) {
        btn1.classList.add("matched");
        btn1.classList.remove("flipped");
        btn2.classList.add("matched");
        btn2.classList.remove("flipped");
      }
      opened = [];
      lockBoard = false;

      if (matchedPairs === totalPairs) {
        // laimėjimas
        stopTimer();
        msgEl.textContent = `Laimėjote! Viską radote per ${moves} ėjimų per ${timeEl.textContent}.`;

        const current = { moves, time: elapsedSec };
        const key = difficulty === "easy" ? LS_KEY_EASY : LS_KEY_HARD;
        const best = loadBest(key);

        let isBetter = false;
        if (!best) isBetter = true;
        else if (current.moves < best.moves) isBetter = true;
        else if (current.moves === best.moves && current.time < best.time) isBetter = true;

        if (isBetter) {
          saveBest(key, current);
          refreshBestUI();
        }
      }
    } else {
      msgEl.textContent = "Nesutapo, bandyk dar kartą.";
      setTimeout(() => {
        if (btn1 && btn2) {
          btn1.classList.add("hidden");
          btn1.classList.remove("flipped");
          btn2.classList.add("hidden");
          btn2.classList.remove("flipped");
        }
        opened = [];
        lockBoard = false;
      }, 800);
    }
  }

  // ================= EVENT HANDLERIAI =================

  diffButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      diffButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      difficulty = btn.dataset.level === "hard" ? "hard" : "easy";
      board.innerHTML = "";
      msgEl.textContent = `Pasirinktas lygis: ${
        difficulty === "easy" ? "Lengvas (4×3)" : "Sunkus (6×4)"
      }. Paspausk „Start“.`;
    });
  });

  startBtn.addEventListener("click", () => {
    startGame();
  });

  resetBtn.addEventListener("click", () => {
    startGame();
  });

  board.addEventListener("click", onCardClick);
});
