import {
  playBackgroundMusic,
  addButtonHoverSound,
} from "../utils/AudioHelper.js";

const playBtn = document.querySelector(".play");
const instructionsBtn = document.querySelector(".instructions");

// Navigation to the game
if (playBtn) {
  playBtn.addEventListener("click", () => {
    window.location.href = "pages/game.html";
  });
}

// Navigation to instructions
if (instructionsBtn) {
  instructionsBtn.addEventListener("click", () => {
    // Path adjusted to enter the pages folder
    window.location.href = "pages/instructions.html";
  });
}

// Intro sound
playBackgroundMusic("../assets/audio/Intro.mp3");

// Button hover sound
addButtonHoverSound();
