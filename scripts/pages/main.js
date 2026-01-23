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

// Button hover sound
window.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      const hoverAudio = new Audio("../assets/audio/Click.wav");
      hoverAudio.play();
    });
  });
});
