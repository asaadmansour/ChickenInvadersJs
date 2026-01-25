import { getScores } from "../services/scoreService.js";
import {
  playBackgroundMusic,
  addButtonHoverSound,
} from "../utils/AudioHelper.js";

const scoreList = document.getElementById("scoreList");
const scoreTable = document.getElementById("scoreTable");
const emptyState = document.getElementById("emptyState");
const noSearchResults = document.getElementById("noSearchResults");
const loader = document.getElementById("loader");
const backBtn = document.getElementById("backBtn");
const newGameBtn = document.getElementById("newGameBtn");
const submitBtn = document.getElementById("submitBtn");
const playerNameInput = document.getElementById("playerNameInput");

let allScores = [];
let isSearching = false;

// Show/Hide loader
function showLoader() {
  loader.classList.remove("hidden");
  scoreTable.classList.add("hidden");
  scoreList.classList.add("hidden");
  emptyState.classList.add("hidden");
  noSearchResults.classList.add("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
  scoreTable.classList.remove("hidden");
  scoreList.classList.remove("hidden");
}

// Fetch and display scores
async function renderScoreboard(scoresToDisplay = null) {
  try {
    if (!scoresToDisplay && allScores.length === 0) {
      showLoader();
      allScores = await getScores();
      scoresToDisplay = allScores;
      hideLoader();
    } else if (!scoresToDisplay) {
      scoresToDisplay = allScores;
    }

    scoreList.innerHTML = "";

    if (!scoresToDisplay || scoresToDisplay.length === 0) {
      scoreTable.classList.add("hidden");
      scoreList.classList.add("hidden");

      // Show different message based on whether it's a search or initial load
      if (isSearching && allScores.length > 0) {
        emptyState.classList.add("hidden");
        noSearchResults.classList.remove("hidden");
      } else {
        noSearchResults.classList.add("hidden");
        emptyState.classList.remove("hidden");
      }
      return;
    }

    scoreTable.classList.remove("hidden");
    scoreList.classList.remove("hidden");
    emptyState.classList.add("hidden");
    noSearchResults.classList.add("hidden");

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
    hideLoader();
    scoreTable.classList.add("hidden");
    scoreList.classList.add("hidden");
    noSearchResults.classList.add("hidden");
    emptyState.textContent = "Failed to load scores. Please try again later.";
    emptyState.classList.remove("hidden");
  }
}

// Search function called by button or Enter key
function handleSearch() {
  const searchTerm = playerNameInput.value.trim().toLowerCase();

  if (!searchTerm) {
    // If search is empty, show all scores
    isSearching = false;
    renderScoreboard();
    return;
  }

  isSearching = true;
  const filtered = allScores.filter((player) =>
    player.name.toLowerCase().includes(searchTerm),
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
if (backBtn)
  backBtn.addEventListener(
    "click",
    () => (window.location.href = "../../index.html"),
  );
if (newGameBtn)
  newGameBtn.addEventListener(
    "click",
    () => (window.location.href = "./game.html"),
  );

// Audio
playBackgroundMusic("../assets/audio/Victory.mp3", 0.7, false);
addButtonHoverSound();

// Initialize
renderScoreboard();
