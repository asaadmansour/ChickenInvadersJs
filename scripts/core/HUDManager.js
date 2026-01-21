import { LIVE } from "../config/Constants.js";
export class HUDManager {
  constructor() {
    this.heartsDiv = document.querySelector(".hearts");
    this.scoreSpan = document.getElementById("score")
  }

  printLives(gameState) {
    this.heartsDiv.innerHTML = "";
    for (let i = 0; i < gameState.lives; i++) {
      this.heartsDiv.innerHTML += `<img class="heart" src="${LIVE.IMAGE}" alt="life">`;
    }
  }

  updateScore(gameState) {
    this.scoreSpan.innerHTML = gameState.score;
  }
}