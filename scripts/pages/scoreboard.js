import { getScores } from "../utils/Storage.js";
import { isValidScoreEntry } from "../utils/Validations.js";

const scoreList = document.getElementById("scoreList");
const emptyState = document.getElementById("emptyState");
const backBtn = document.getElementById("backBtn");
const newGameBtn = document.getElementById("newGameBtn");
const playerNameInput = document.getElementById("playerNameInput");

// Get all scores and store original list
let allScores = getScores();
allScores = allScores.filter(isValidScoreEntry);
allScores = allScores.sort((a, b) => b.score - a.score);

// Function to render scores
function renderScores(scoresToRender) {
  // Clear existing list
  scoreList.innerHTML = "";

  if (scoresToRender.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    scoresToRender.forEach((player, index) => {
      const li = document.createElement("li");

      const rankSpan = document.createElement("span");
      rankSpan.textContent = index + 1;

      const nameSpan = document.createElement("span");
      nameSpan.textContent = player.name;

      const scoreSpan = document.createElement("span");
      scoreSpan.textContent = player.score.toLocaleString();

      li.appendChild(rankSpan);
      li.appendChild(nameSpan);
      li.appendChild(scoreSpan);

      scoreList.appendChild(li);
    });
  }
}

// Initial render with top 10
renderScores(allScores.slice(0, 10));

// Filter functionality - filter as user types
playerNameInput.addEventListener("input", (e) => {
  const searchName = e.target.value.trim().toLowerCase();

  if (searchName === "") {
    // Show top 10 if input is empty
    renderScores(allScores.slice(0, 10));
  } else {
    // Filter scores by name (case-insensitive)
    const filteredScores = allScores.filter((player) =>
      player.name.toLowerCase().includes(searchName),
    );
    renderScores(filteredScores);
  }
});

// Victory sound
window.addEventListener("DOMContentLoaded", function () {
  const victoryAudio = new Audio("../assets/audio/Mission Complete.mp3");
  victoryAudio.preload = "auto";
  victoryAudio.volume = 0.7;
  victoryAudio.play();
});

// Navigation
backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

newGameBtn.addEventListener("click", () => {
  window.location.href = "game.html";
});
