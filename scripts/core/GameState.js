import { Player } from "../entities/Player.js";

export class GameState {
  static #instance = null;

  constructor() {
   if (GameState.#instance) {
      throw new Error("Use GameState.getInstance() instead of new");
    }

    // 1. Restore Basic Values or set defaults
    this.score = parseInt(localStorage.getItem("savedScore")) || 0;
    this.lives = parseInt(localStorage.getItem("savedLives")) || 3;
    this.currentWave = parseInt(localStorage.getItem("savedWave")) || 1;

    // 2. Initialize Player
    this.player = new Player();

    // 3. Restore Player Position (Prevents resetting to center)
    const savedX = localStorage.getItem("playerX");
    const savedY = localStorage.getItem("playerY");
    if (savedX !== null && savedY !== null) {
      this.player.x = parseFloat(savedX);
      this.player.y = parseFloat(savedY);
    }

    this.status = "playing";
    this.gameTime = 0;
    this.isPaused = false;
    this.hasPendingSpawns = false;

    this.bullets = [];
    this.eggs = [];
    this.chickens = [];
    this.rocks = [];
    this.friedChickens = [];
    this.deathEffects = [];
  }


  static getInstance() {
    if (!GameState.#instance) {
      GameState.#instance = new GameState();
    }
    return GameState.#instance;
  }


  addScore(points) {
    this.score += points;
  }

  loseLife() {
    this.lives--;
    return this.lives <= 0;
  }

  updateTime() {
    if (!this.isPaused) {
      this.gameTime += 0.02;
    }
  }

  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  addEgg(egg) {
    this.eggs.push(egg);
  }

  addChicken(chicken) {
    this.chickens.push(chicken);
  }

  addRock(rock) {
    this.rocks.push(rock);
  }

  addFriedChicken(friedChicken) {
    this.friedChickens.push(friedChicken);
  }

  addDeathEffect(effect) {
    this.deathEffects.push(effect);
  }

  incrementWaveNumber() {
    this.currentWave++;
  }

  isAlive() {
    return this.lives > 0;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  reset() {

    // Clear storage
    localStorage.removeItem("savedScore");
    localStorage.removeItem("savedLives");
    localStorage.removeItem("savedWave");
    localStorage.removeItem("savedChickens");
    localStorage.removeItem("savedRocks");

    // Reset local variables
    this.score = 0;
    this.lives = 3;
    this.currentWave = 1;
    this.status = "playing";
    this.gameTime = 0;
    this.isPaused = false;
    this.bullets = [];
    this.eggs = [];
    this.chickens = [];
    this.rocks = [];
    if (this.player) this.player.reset();
  }
}
