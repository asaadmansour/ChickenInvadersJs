import { getScores } from "../services/scoreService.js";
import { playBackgroundMusic, addButtonHoverSound } from "../utils/AudioHelper.js";

const scoreList = document.getElementById("scoreList");
const emptyState = document.getElementById("emptyState");
const backBtn = document.getElementById("backBtn");
const newGameBtn = document.getElementById("newGameBtn");
const submitBtn = document.getElementById("submitBtn");
const playerNameInput = document.getElementById("playerNameInput");

let allScores = [];

// Fetch and display scores
async function renderScoreboard(scoresToDisplay = null) {
    try {
        if (!scoresToDisplay && allScores.length === 0) {
            allScores = await getScores();
            scoresToDisplay = allScores;
        } else if (!scoresToDisplay) {
            scoresToDisplay = allScores;
        }

        scoreList.innerHTML = "";

        if (!scoresToDisplay || scoresToDisplay.length === 0) {
            emptyState.classList.remove("hidden");
            return;
        }

        emptyState.classList.add("hidden");

        scoresToDisplay.forEach((player, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${index + 1}</span>
                <span>${player.name || "Unknown"}</span>
                <span>${(player.score || 0).toLocaleString()}</span>
            `;
            scoreList.appendChild(li);
        });
    } catch (error) {
        console.error("Error rendering scoreboard:", error);
    }
}

// Search function called by button or Enter key
function handleSearch() {
    const searchTerm = playerNameInput.value.trim().toLowerCase();
    const filtered = allScores.filter((player) =>
        player.name.toLowerCase().includes(searchTerm)
    );
    renderScoreboard(filtered);
}

// Search Button Trigger
if (submitBtn) {
    submitBtn.addEventListener("click", handleSearch);
}

// Enter Key Trigger
playerNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
});

// Navigation
if (backBtn) backBtn.addEventListener("click", () => window.location.href = "../../index.html");
if (newGameBtn) newGameBtn.addEventListener("click", () => window.location.href = "./game.html");

// Audio
playBackgroundMusic("../assets/audio/Victory.mp3", 0.7, false);
addButtonHoverSound();

// Initialize
renderScoreboard();