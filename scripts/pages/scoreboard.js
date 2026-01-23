import { getScores, saveScore } from "../services/scoreService.js";

import {
  playBackgroundMusic,
  addButtonHoverSound,
} from "../utils/AudioHelper.js";

const scoreList = document.getElementById("scoreList");
const emptyState = document.getElementById("emptyState");
const backBtn = document.getElementById("backBtn");
const newGameBtn = document.getElementById("newGameBtn");
const submitBtn = document.getElementById("submitBtn");
const playerNameInput = document.getElementById("playerNameInput");

let allScores = [];

async function renderScoreboard(scoresToDisplay = null) {
  try {
    if (!scoresToDisplay) {
      allScores = await getScores();
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

// Live filter as the user types in the input field
playerNameInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();

  const filtered = allScores.filter((player) =>
    player.name.toLowerCase().includes(searchTerm),
  );

  renderScoreboard(filtered);
});

// // Logic for submitting a new score with name duplication check
// if (submitBtn) {
//   submitBtn.addEventListener("click", async () => {
//     const name = playerNameInput.value.trim();
//     const finalScore = parseInt(localStorage.getItem("finalScore")) || 0;

//     if (!name) {
//       alert("Please enter a Pilot name!");
//       return;
//     }

//     // Check if the name already exists in the fetched scores list
//     const nameExists = allScores.some(
//       (player) => player.name.toLowerCase() === name.toLowerCase(),
//     );

//     if (nameExists) {
//       alert("This Pilot name is already taken! Please choose another.");
//       return;
//     }

//     submitBtn.disabled = true;
//     submitBtn.textContent = "SAVING...";

//     // await saveScore(name, finalScore);

//     playerNameInput.value = "";
//     submitBtn.disabled = false;
//     submitBtn.textContent = "SUBMIT";

//     await renderScoreboard();
//   });
// }

// Navigation event listeners
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
}

if (newGameBtn) {
  newGameBtn.addEventListener("click", () => {
    window.location.href = "./game.html";
  });
}

// Victory sound
playBackgroundMusic("../assets/audio/Victory.mp3", 0.7, false);

// Button hover sound
addButtonHoverSound();

// Initial data fetch and render
renderScoreboard();
