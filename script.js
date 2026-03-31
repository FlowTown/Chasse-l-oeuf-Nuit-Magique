const params = new URLSearchParams(window.location.search);
const qr = params.get("qr");

const qrStatus = document.getElementById("qr-status");
const emailInput = document.getElementById("email");
const newsletterInput = document.getElementById("newsletter");
const playBtn = document.getElementById("play-btn");
const formStatus = document.getElementById("form-status");
const nest = document.getElementById("nest");
const eggs = document.querySelectorAll(".egg");
const resultBox = document.getElementById("result");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");

const prizeMap = {
  red: "1 pass 1 jour",
  green: "1 pass 3 jours",
  blue: "2 pass 1 jour",
  gold: "2 pass 3 jours"
};

let isPlaying = false;

if (!qr) {
  qrStatus.textContent = "❌ QR code invalide ou manquant";
  qrStatus.classList.add("error");
} else {
  qrStatus.textContent = `✅ QR détecté : ${qr}`;
  qrStatus.classList.add("ok");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function resetEggs() {
  eggs.forEach((egg) => {
    egg.classList.remove("revealed", "faded", "winner");
    egg.style.animationDelay = "0s";
  });
}

playBtn.addEventListener("click", () => {
  if (isPlaying) return;

  const email = emailInput.value.trim();
  const newsletterAccepted = newsletterInput.checked;

  formStatus.textContent = "";
  formStatus.className = "form-status";

  if (!qr) {
    formStatus.textContent = "QR invalide, impossible de participer.";
    formStatus.classList.add("error");
    return;
  }

  if (!isValidEmail(email)) {
    formStatus.textContent = "Entre une adresse email valide.";
    formStatus.classList.add("error");
    return;
  }

  if (!newsletterAccepted) {
    formStatus.textContent = "Tu dois accepter la newsletter pour jouer.";
    formStatus.classList.add("error");
    return;
  }

  isPlaying = true;
  playBtn.disabled = true;
  resultBox.classList.add("hidden");
  resetEggs();

  nest.classList.add("shaking");
  formStatus.textContent = "Le nid s'agite...";
  formStatus.classList.add("ok");

  eggs.forEach((egg, index) => {
    egg.style.animationDelay = `${index * 0.08}s`;
  });

  setTimeout(() => {
    nest.classList.remove("shaking");

    const randomIndex = Math.floor(Math.random() * eggs.length);
    const selectedEgg = eggs[randomIndex];
    const color = selectedEgg.dataset.color;
    const prize = prizeMap[color];

    eggs.forEach((egg) => {
      if (egg === selectedEgg) {
        egg.classList.add("revealed", "winner");
      } else {
        egg.classList.add("faded");
      }
    });

    resultTitle.textContent = "Bravo !";
    resultText.textContent = `L'œuf sélectionné révèle : ${prize}.`;
    resultBox.classList.remove("hidden");

    formStatus.textContent = "Tirage terminé.";
    formStatus.classList.add("ok");

    isPlaying = false;
    playBtn.disabled = false;
  }, 2000);
});
