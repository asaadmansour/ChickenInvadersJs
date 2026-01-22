import { saveScore } from "../services/scoreService.js";

const retryBtn = document.querySelector(".retry-button");
const mainMenuBtn = document.querySelector(".back-to-menu-button");
const submitBtn = document.querySelector(".submit-score");
const nameInput = document.querySelector("#playerName");
const scoreDisplay = document.querySelector("#final-score");

// Retrieve score
const finalScore = Number(localStorage.getItem("finalScore")) || 0;

// Update the UI with the final score
if (scoreDisplay) {
    scoreDisplay.textContent = finalScore;
}

// Submit Logic
if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
        const name = nameInput.value.trim();
        if (!name) return alert("Please enter your pilot name!");

        await saveScore(name, finalScore);
        // Move to scoreboard after saving
        window.location.href = "./scoreboard.html";
    });
}

// Navigation Logic
retryBtn.addEventListener("click", () => {
    window.location.href = "./game.html";
});

mainMenuBtn.addEventListener("click", () => {
    window.location.href = "../index.html";
});