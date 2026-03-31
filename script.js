const TEST_MODE = true;
const FORCED_EGG = "gold"; // red, green, blue, gold, ou null pour random

const params = new URLSearchParams(window.location.search);
const qr = params.get("qr");

const qrStatus = document.getElementById("qr-status");
const emailInput = document.getElementById("email");
const newsletterInput = document.getElementById("newsletter");
const playBtn = document.getElementById("play-btn");
const formStatus = document.getElementById("form-status");
const nest = document.getElementById("nest");
const eggs = document.querySelectorAll(".egg");

const flashLayer = document.getElementById("flash-layer");
const winOverlay = document.getElementById("win-overlay");
const flyingEgg = document.getElementById("flying-egg");
const winCard = document.getElementById("win-card");
const closeWinBtn = document.getElementById("close-win-btn");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const fxLayer = document.getElementById("fx-layer");

const prizeMap = {
  red: "Tu remportes 1 pass 1 jour",
  green: "Tu remportes 1 pass 3 jours",
  blue: "Tu remportes 2 pass 1 jour",
  gold: "Tu remportes 2 pass 3 jours"
};

let isPlaying = false;

if (!qr && !TEST_MODE) {
  qrStatus.textContent = "❌ QR code invalide ou manquant";
  qrStatus.classList.add("error");
} else if (TEST_MODE) {
  qrStatus.textContent = "🧪 Mode test activé : aucun vrai token consommé";
  qrStatus.classList.add("ok");
} else {
  qrStatus.textContent = `✅ QR détecté : ${qr}`;
  qrStatus.classList.add("ok");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function resetEggs() {
  eggs.forEach((egg) => {
    egg.classList.remove("revealed", "faded");
    egg.style.animationDelay = "0s";
  });
}

function clearParticles() {
  const particles = fxLayer.querySelectorAll(".particle");
  particles.forEach((particle) => particle.remove());
}

function resetOverlay() {
  winOverlay.classList.add("hidden");
  winOverlay.classList.remove("show");

  flyingEgg.classList.add("hidden");
  flyingEgg.classList.remove("fly");
  flyingEgg.src = "";

  winCard.classList.add("hidden");
  winCard.classList.remove("show");

  flashLayer.classList.remove("flash");
  nest.classList.remove("shaking", "flash-win");
  fxLayer.classList.remove("active");

  clearParticles();
}

function getSelectedEgg() {
  if (TEST_MODE && FORCED_EGG) {
    return [...eggs].find((egg) => egg.dataset.color === FORCED_EGG) || eggs[0];
  }

  const randomIndex = Math.floor(Math.random() * eggs.length);
  return eggs[randomIndex];
}

function getEggSrc(egg) {
  return egg.getAttribute("src");
}

function createBurst(xPercent, yPercent, count = 18) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 70 + Math.random() * 90;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    particle.style.left = `${xPercent}%`;
    particle.style.top = `${yPercent}%`;
    particle.style.setProperty("--dx", `${dx}px`);
    particle.style.setProperty("--dy", `${dy}px`);
    particle.style.setProperty("--delay", `${Math.random() * 0.12}s`);
    particle.style.setProperty("--dur", `${0.9 + Math.random() * 0.5}s`);
    particle.style.setProperty("--rot", `${Math.random() * 240 - 120}deg`);

    fxLayer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1800);
  }
}

playBtn.addEventListener("click", () => {
  if (isPlaying) return;

  const email = emailInput.value.trim();
  const newsletterAccepted = newsletterInput.checked;

  formStatus.textContent = "";
  formStatus.className = "form-status";

  if (!TEST_MODE && !qr) {
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

  resetEggs();
  resetOverlay();

  nest.classList.add("shaking");
  formStatus.textContent = "Le nid s'agite...";
  formStatus.classList.add("ok");

  setTimeout(() => {
    nest.classList.remove("shaking");

    const selectedEgg = getSelectedEgg();
    const color = selectedEgg.dataset.color;
    const prize = prizeMap[color];

    eggs.forEach((egg) => {
      if (egg === selectedEgg) {
        egg.classList.add("revealed");
      } else {
        egg.classList.add("faded");
      }
    });

    flyingEgg.src = getEggSrc(selectedEgg);
    flyingEgg.alt = selectedEgg.alt;

    resultTitle.textContent = "Bravo !";
    resultText.textContent = prize;

    winOverlay.classList.remove("hidden");

    requestAnimationFrame(() => {
      winOverlay.classList.add("show");
      flyingEgg.classList.remove("hidden");
      flyingEgg.classList.add("fly");
    });

    setTimeout(() => {
      flashLayer.classList.add("flash");
      nest.classList.add("flash-win");
      fxLayer.classList.add("active");

      createBurst(22, 28, 16);
      createBurst(78, 24, 18);
      createBurst(50, 18, 20);
    }, 980);

    setTimeout(() => {
      winCard.classList.remove("hidden");
      winCard.classList.add("show");
    }, 1120);

    setTimeout(() => {
      formStatus.textContent = TEST_MODE ? "Tirage test terminé." : "Tirage terminé.";
      formStatus.classList.add("ok");
      playBtn.disabled = false;
      isPlaying = false;
    }, 1450);
  }, 1500);
});

closeWinBtn.addEventListener("click", () => {
  winOverlay.classList.remove("show");

  setTimeout(() => {
    resetOverlay();
    resetEggs();
  }, 300);
});
