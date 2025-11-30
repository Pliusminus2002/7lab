// globalūs nustatymai
let is24hFormat = true;            // čia tau nereikalinga formoms, bet palik, jei naudoji kitur
let studyRemindersEnabled = true;  // tas pats

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return; // jei nėra formos šiame puslapyje

  const resultBox = document.querySelector("#form-result");
  const avgBox = document.querySelector("#avg-result");
  const popup = document.querySelector("#form-popup");
  const popupText = popup?.querySelector(".popup-text");
  const popupClose = document.querySelector("#popup-close");

  // Pagalbinė funkcija – vidurkis
  function calculateAverage(q1, q2, q3) {
    return ((q1 + q2 + q3) / 3).toFixed(1);
  }

  // Formos submit
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // NEpersikrauna puslapis

    // 1) Surenkam duomenis
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

    // 2) Išvedam į console (užduotis 4.b)
    console.log("Kontaktų formos duomenys:", data);

    // 3) Atvaizduojam formos apačioje (užduotis 4.c)
    if (resultBox) {
        resultBox.style.display = "block";
      resultBox.innerHTML = `
        <strong>Vardas:</strong> ${data.firstName}<br>
        <strong>Pavardė:</strong> ${data.lastName}<br>
        <strong>El. paštas:</strong> <a href="mailto:${data.email}">${data.email}</a><br>
        <strong>Tel. numeris:</strong> ${data.phone}<br>
        <strong>Adresas:</strong> ${data.address}<br>
        <strong>Vertinimai (1–10):</strong> ${data.q1}, ${data.q2}, ${data.q3}
      `;
    }

    // 4) Skaičiuojam klausimų vidurkį (užduotis 5)
    const avg = calculateAverage(data.q1, data.q2, data.q3);

    if (avgBox) {
      avgBox.textContent = `${data.firstName} ${data.lastName}: vidurkis ${avg}`;
    }

    // 5) Parodom „Duomenys pateikti sėkmingai“ pranešimą (užduotis 6)
    if (popup && popupText) {
      popupText.textContent = "Duomenys pateikti sėkmingai!";
      popup.classList.add("visible");
    }
  });

  // pop-up uždarymo mygtukas
  if (popupClose && popup) {
    popupClose.addEventListener("click", () => {
      popup.classList.remove("visible");
    });
  }
});
