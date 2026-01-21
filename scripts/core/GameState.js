import { Player } from "../entities/Player.js";

export class GameState {
  static #instance = null;

  constructor() {
    if (GameState.#instance) {
      throw new Error("Use GameState.getInstance() instead of new");
    }

    // Game progress
    this.score = 0;
    this.lives = 3;
    this.currentWave = 1;
    this.status = "playing";
    this.gameTime = 0;

    // Entity collections
    this.player = new Player();
    this.bullets = [];
    this.eggs = [];
    this.chickens = [];
    this.rocks = [];
  }

  // Singleton access method
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
    this.gameTime += 0.02;
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

  incrementWaveNumber() {
    this.currentWave++;
  }

  isAlive() {
    return this.lives > 0;
  }
  // Reset the game state to initial values
  reset() {
    this.score = 0;
    this.lives = 3;
    this.currentLevel = 1;
    this.status = "playing";
    this.gameTime = 0;
    this.player.reset();
    this.bullets = [];
    this.eggs = [];
    this.chickens = [];
  }
}
