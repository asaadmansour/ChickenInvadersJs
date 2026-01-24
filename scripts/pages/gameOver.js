import { saveScore } from "../services/scoreService.js";
import { playBackgroundMusic, addButtonHoverSound } from "../utils/AudioHelper.js";

const retryBtn = document.querySelector(".retry-button");
const mainMenuBtn = document.querySelector(".back-to-menu-button");
const submitBtn = document.querySelector(".submit-score");
const nameInput = document.querySelector("#playerName");
const scoreDisplay = document.querySelector("#final-score");
const statusTitle = document.querySelector("#statusTitle");

const finalScore = Number(localStorage.getItem("finalScore")) || 0;
const gameStatus = localStorage.getItem("gameStatus");


const clearGameSession = () => {
    const sessionKeys = [
        "savedScore", "savedLives", "savedWave", 
        "savedChickens", "savedRocks", 
        "playerX", "playerY", "gameStatus", "finalScore"
    ];
    sessionKeys.forEach(key => localStorage.removeItem(key));
};


if (scoreDisplay) scoreDisplay.textContent = finalScore;

if (gameStatus === "win") {
    statusTitle.textContent = "MISSION ACCOMPLISHED";
    statusTitle.classList.add("victory-text");
    playBackgroundMusic("../assets/audio/Victory.mp3", 0.7, false);
    if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
} else {
    statusTitle.textContent = "GAME OVER";
    playBackgroundMusic("../assets/audio/Game Over.mp3", 0.7, false);
}


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
            clearGameSession(); 
            window.location.href = "scoreboard.html";
        } catch (error) {
            console.error("Firebase Error:", error);
            submitBtn.disabled = false;
            submitBtn.textContent = "SUBMIT SCORE";
        }
    });
}

retryBtn?.addEventListener("click", () => {
    clearGameSession();
    window.location.href = "game.html"; 
});

mainMenuBtn?.addEventListener("click", () => {
    clearGameSession();
    window.location.href = "../index.html";
});

addButtonHoverSound();