const retryBtn = document.querySelector(".retry-button");

retryBtn.addEventListener("click", () => {
  window.location.href = "game.html";
});

const mainMenuBtn = document.querySelector(".back-to-menu-button");

mainMenuBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// Game Over sound
window.addEventListener("DOMContentLoaded", function () {
  const gameOverAudio = new Audio("../assets/audio/Game Over.mp3");
  gameOverAudio.preload = "auto";
  gameOverAudio.volume = 0.7;
  gameOverAudio.play();
});
