import {
  addButtonHoverSound,
  isMusicMuted,
  isSoundEffectsMuted,
  setMusicMuted,
  setSoundEffectsMuted,
} from "../utils/AudioHelper.js";

const backBtn = document.getElementById("backToMenuBtn");
const startBtn = document.getElementById("startNowBtn");
const muteMusicCheckbox = document.getElementById("muteMusicCheckbox");
const muteSoundEffectsCheckbox = document.getElementById(
  "muteSoundEffectsCheckbox",
);

if (muteMusicCheckbox) {
  muteMusicCheckbox.checked = isMusicMuted();
}
if (muteSoundEffectsCheckbox) {
  muteSoundEffectsCheckbox.checked = isSoundEffectsMuted();
}

if (muteMusicCheckbox) {
  muteMusicCheckbox.addEventListener("change", () => {
    setMusicMuted(muteMusicCheckbox.checked);
  });
}

if (muteSoundEffectsCheckbox) {
  muteSoundEffectsCheckbox.addEventListener("change", () => {
    setSoundEffectsMuted(muteSoundEffectsCheckbox.checked);
  });
}

if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}

if (startBtn) {
  startBtn.addEventListener("click", () => {
    window.location.href = "./game.html";
  });
}

addButtonHoverSound();
