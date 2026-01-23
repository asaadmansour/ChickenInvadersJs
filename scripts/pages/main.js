const playBtn = document.querySelector(".play");
playBtn.addEventListener("click", () => {
  window.location.href = "pages/game.html";
});
const instructionsBtn = document.querySelector(".instructions");
instructionsBtn.addEventListener("click", () => {
  // window.location.href = "pages/game.html"
});

// Intro sound
window.addEventListener("DOMContentLoaded", function () {
  const introAudio = new Audio("../assets/audio/Intro.mp3");
  introAudio.preload = "auto";
  introAudio.volume = 0.7;
  introAudio.loop = true;
  introAudio.play();
});
