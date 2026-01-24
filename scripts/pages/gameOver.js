import { saveScore } from "../services/scoreService.js";
import { playBackgroundMusic, addButtonHoverSound } from "../utils/AudioHelper.js";

// Select DOM elements
const retryBtn = document.querySelector(".retry-button");
const mainMenuBtn = document.querySelector(".back-to-menu-button");
const submitBtn = document.querySelector(".submit-score");
const nameInput = document.querySelector("#playerName");
const scoreDisplay = document.querySelector("#final-score");
const statusTitle = document.querySelector("#statusTitle");

// Retrieve game data from local storage
const finalScore = Number(localStorage.getItem("finalScore")) || 0;
const gameStatus = localStorage.getItem("gameStatus"); // Should be "win" or "lose"

// Initialize UI based on win/lose status
if (scoreDisplay) scoreDisplay.textContent = finalScore;

if (gameStatus === "win") {
    // Win State
    statusTitle.textContent = "MISSION ACCOMPLISHED";
    statusTitle.classList.add("victory-text");
    playBackgroundMusic("../assets/audio/Victory.mp3", 0.7, false);

    // Trigger Confetti Celebration
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffd700', '#cf12c5', '#aafbfc']
        });
    }
} else {
    // Lose State
    statusTitle.textContent = "GAME OVER";
    playBackgroundMusic("../assets/audio/Game Over.mp3", 0.7, false);
}

// Logic for submitting the score to Firebase
if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
        const name = nameInput.value.trim();

        if (!name) {
            nameInput.classList.add("input-error");
            setTimeout(() => nameInput.classList.remove("input-error"), 400);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "SAVING...";

        try {
            await saveScore(name, finalScore);
            window.location.href = "./scoreboard.html";
        } catch (error) {
            console.error("Firebase Error:", error);
            submitBtn.disabled = false;
            submitBtn.textContent = "SUBMIT SCORE";
        }
    });
}

// Navigation and audio
nameInput?.addEventListener("input", () => nameInput.classList.remove("input-error"));
retryBtn?.addEventListener("click", () => window.location.href = "./game.html");
mainMenuBtn?.addEventListener("click", () => window.location.href = "../index.html");
addButtonHoverSound();