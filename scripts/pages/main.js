import {
  playBackgroundMusic,
  addButtonHoverSound,
} from "../utils/AudioHelper.js";

const playBtn = document.querySelector(".play");
playBtn.addEventListener("click", () => {
  window.location.href = "pages/game.html";
});
const instructionsBtn = document.querySelector(".instructions");
instructionsBtn.addEventListener("click", () => {
  // window.location.href = "pages/game.html"
});

// Intro sound
playBackgroundMusic("../assets/audio/Intro.mp3");

// Button hover sound
addButtonHoverSound();
