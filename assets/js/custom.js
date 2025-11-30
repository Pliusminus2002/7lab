// assets/js/custom.js
// 11 laboratorinis – formos apdorojimas

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return; // jei dėl kažkokių priežasčių formos nėra

  const resultBox = document.getElementById("form-result");
  const avgBox = document.getElementById("avg-result");
  const popup = document.getElementById("form-popup");
  const popupText = popup ? popup.querySelector(".popup-text") : null;
  const popupClose = document.getElementById("popup-close");

  // 5. Pagalbinė funkcija vidurkiui
  function calculateAverage(q1, q2, q3) {
    return (q1 + q2 + q3) / 3;
  }

  // 4. Formos submit handleris
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // sustabdom standartinį formos pateikimą

    // 4.a – paimam duomenis iš formos
    const data = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      address: form.address.value.trim(),
      q1: Number(form.q1.value),
      q2: Number(form.q2.value),
      q3: Number(form.q3.value),
    };

    // Paprasta validacija: vardas, pavardė ir el. paštas privalomi
    if (!data.firstName || !data.lastName || !data.email) {
      alert("Prašau užpildyti vardą, pavardę ir el. paštą.");
      return;
    }

    // 4.b – išvedam visą objektą į console
    console.log("Kontaktų formos duomenys:", data);

    // 4.c – atvaizduojam tekstą puslapyje
    if (resultBox) {
      resultBox.innerHTML = `
        <strong>Vardas:</strong> ${data.firstName}<br>
        <strong>Pavardė:</strong> ${data.lastName}<br>
        <strong>El. paštas:</strong> 
          <a href="mailto:${data.email}">${data.email}</a><br>
        <strong>Tel. numeris:</strong> ${data.phone || "–"}<br>
        <strong>Adresas:</strong> ${data.address || "–"}<br>
        <strong>Vertinimai (1–10):</strong> ${data.q1}, ${data.q2}, ${data.q3}
      `;
    }

    // 5. Vidurkis – parodomas po forma
    const avg = calculateAverage(data.q1, data.q2, data.q3);
    if (avgBox) {
      avgBox.textContent = `${data.firstName} ${data.lastName}: vidurkis ${avg.toFixed(1)}`;
    }

    // 6. Pop-up pranešimas
    if (popup && popupText) {
      popupText.textContent = "Duomenys pateikti sėkmingai!";
      popup.style.display = "flex";
    }
  });

  // Pop-up uždarymas
  if (popupClose && popup) {
    popupClose.addEventListener("click", () => {
      popup.style.display = "none";
    });
  }
});
// ===========================
// 12 LAB – MANO ŽAIDIMAS
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const movesEl = document.getElementById("game-moves");
  const pairsEl = document.getElementById("game-pairs");
  const msgEl = document.getElementById("game-message");
  const startBtn = document.getElementById("game-start");
  const resetBtn = document.getElementById("game-reset");
  const diffButtons = document.querySelectorAll(".game-diff-btn");

  // jei šiame puslapyje nėra žaidimo – išeinam
  if (!board || !startBtn) return;

  // 2.a – duomenų rinkinys kortelėms
  const icons = ["💻", "🤖", "⚙️", "🚀", "📚", "🎧", "🧠", "💡", "🔋", "🌌", "🎮", "📷"];

  let difficulty = "easy";      // "easy" – 4x3, "hard" – 6x4
  let cards = [];               // sugeneruotos kortelės
  let opened = [];              // šiuo metu atverstos kortelės (indeksai)
  let lockBoard = false;        // ar laikinai užrakinta (laukia timeout)
  let moves = 0;
  let matchedPairs = 0;
  let totalPairs = 0;

  // Pagal sugeneruotą masyvą atnaujina lentą
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

  // 2.b – sugeneruojam korteles pagal sunkumą
  function generateCards() {
    const pairCount = difficulty === "easy" ? 6 : 12; // 4x3=12 => 6 porų; 6x4=24 => 12 porų
    const baseIcons = icons.slice(0, pairCount);

    // sukurti po 2 korteles kiekvienam simboliui
    const temp = [];
    baseIcons.forEach((sym) => {
      temp.push({ symbol: sym });
      temp.push({ symbol: sym });
    });

    // išmaišom masyvą – Fisher–Yates
    for (let i = temp.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [temp[i], temp[j]] = [temp[j], temp[i]];
    }

    cards = temp;
    totalPairs = pairCount;
  }

  function resetStats() {
    moves = 0;
    matchedPairs = 0;
    opened = [];
    lockBoard = false;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
  }

  // Start / Restart žaidimą su dabartiniu sunkumu
  function startGame() {
    resetStats();
    generateCards();
    renderBoard();
    msgEl.textContent = "Žaidimas pradėtas! Surask visas poras.";
  }

  // Kortelės paspaudimas
  function onCardClick(e) {
    const btn = e.target.closest(".game-card");
    if (!btn || lockBoard) return;

    const index = Number(btn.dataset.index);
    const card = cards[index];

    // jei jau sutapusi arba jau atversta – nieko nedarom
    if (btn.classList.contains("matched") || opened.includes(index)) return;

    btn.classList.remove("hidden");
    btn.classList.add("flipped");
    opened.push(index);

    if (opened.length === 2) {
      checkMatch();
    }
  }

  // 5. sutapimo taisyklės
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
      // sutapo – paliekam atvertas ir padarom neaktyvias
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

      // 7. laimėjimo pranešimas
      if (matchedPairs === totalPairs) {
        msgEl.textContent = `Laimėjote! Viską radote per ${moves} ėjimų.`;
      }

    } else {
      // nesutapo – po ~1s užverčiam atgal
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

  // Sunkumo pasirinkimas
  diffButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      diffButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      difficulty = btn.dataset.level === "hard" ? "hard" : "easy";
      // 3.b – pakeitus sunkumą, lenta paruošiama iš naujo (kol nėra Start, tik kol kas tuščia)
      board.innerHTML = "";
      msgEl.textContent = `Pasirinktas lygis: ${
        difficulty === "easy" ? "Lengvas (4×3)" : "Sunkus (6×4)"
      }. Paspausk „Start“.`;
    });
  });

  // 8. Start mygtukas
  startBtn.addEventListener("click", () => {
    startGame();
  });

  // 9. Atnaujinti mygtukas
  resetBtn.addEventListener("click", () => {
    startGame();
  });

  // klausom paspaudimų ant lentos
  board.addEventListener("click", onCardClick);
});
