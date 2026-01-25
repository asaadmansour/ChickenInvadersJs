import { Player } from "../entities/Player.js";

export class GameState {
  static #instance = null;

  constructor() {
    if (GameState.#instance) {
      throw new Error("Use GameState.getInstance() instead of new");
    }

    // Initialize game state
    this.score = 0;
    this.lives = 3;
    this.currentWave = 1;

    // Initialize Player
    this.player = new Player();

    this.status = "playing";
    this.gameTime = parseFloat(localStorage.getItem("savedGameTime")) || 0;
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
