import {
  playBackgroundMusic,
  addButtonHoverSound,
} from "../utils/AudioHelper.js";

const playBtn = document.querySelector(".play");
const instructionsBtn = document.querySelector(".instructions");

if (playBtn) {
  playBtn.addEventListener("click", () => {
    startTransition();
  });
}

function startTransition() {
  // 1. Create the Ship
  const ship = document.createElement("img");
  ship.src = "/assets/images/player.png";
  ship.classList.add("transition-ship");
  document.body.appendChild(ship);

  // 2. Create the Screen Wipe (hidden initially)
  const wipe = document.createElement("div");
  wipe.classList.add("screen-wipe");
  document.body.appendChild(wipe);

  // 3. Start the flight animation
  ship.style.animation = "flyPath 2s forwards ease-in";

  // 4. Leave a trail "cloud" as it moves
  const trailInterval = setInterval(() => {
    const rect = ship.getBoundingClientRect();
    if (rect.left < -100) {
      clearInterval(trailInterval);
      return;
    }

    const trail = document.createElement("div");
    trail.classList.add("ship-trail");
    trail.style.left = `${rect.left + rect.width / 2}px`;
    trail.style.top = `${rect.top + rect.height / 2}px`;
    
    // As the ship gets further, make the trail pieces bigger to cover the screen
    const progress = 1 - (rect.left / window.innerWidth);
    trail.style.transform = `translate(-50%, -50%) scale(${1 + progress * 20})`;
    
    document.body.appendChild(trail);
  }, 50);

  // 5. Fade to black and navigate
  setTimeout(() => {
    wipe.classList.add("active");
  }, 1500); // Start fade before ship fully exits

  setTimeout(() => {
    window.location.href = "pages/game.html";
  }, 2200); // Navigate once animation is done
}

// Navigation to instructions
if (instructionsBtn) {
  instructionsBtn.addEventListener("click", () => {
    window.location.href = "pages/instructions.html";
  });
}

// Intro sound
playBackgroundMusic("../assets/audio/Intro.mp3");

// Button hover sound
addButtonHoverSound();
