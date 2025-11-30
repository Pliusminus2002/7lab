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
