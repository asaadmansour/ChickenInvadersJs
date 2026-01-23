import {
  playBackgroundMusic,
  addButtonHoverSound,
} from "../utils/AudioHelper.js";

const retryBtn = document.querySelector(".retry-button");

retryBtn.addEventListener("click", () => {
  window.location.href = "game.html";
});

const mainMenuBtn = document.querySelector(".back-to-menu-button");

mainMenuBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// Game Over sound
playBackgroundMusic("../assets/audio/Game Over.mp3", 0.7, false);

// Button hover sound
addButtonHoverSound();
