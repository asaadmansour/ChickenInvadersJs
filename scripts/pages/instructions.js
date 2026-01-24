import {
  addButtonHoverSound,
} from "../utils/AudioHelper.js";

// Functional logic for the buttons
const backBtn = document.getElementById("backToMenuBtn");
const startBtn = document.getElementById("startNowBtn");

if (backBtn) {
    backBtn.addEventListener("click", () => {
        // Exit pages folder to root index
        window.location.href = "../index.html";
    });
}

if (startBtn) {
    startBtn.addEventListener("click", () => {
        // Stay in pages folder to open game
        window.location.href = "./game.html";
    });
}

addButtonHoverSound();