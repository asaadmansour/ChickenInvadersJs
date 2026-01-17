import { GameConfig } from "../config/Config.js";
// import {}
export class Player {
  constructor() {
    this.x = this.canvasWidth / 2 - this.width / 2;
    this.y = this.canvasHeight - (this.height + 5);

    this.moveSpeed = 5;

    this.lives = 3;
    this.score = 0;

    this.fireRate = 200; // ms between shots
    this.lastShotTime = 0;

    this.invulnerableUntil = 0;
    this.blinkInterval = 100;
  }
  get width() {
    return GameConfig.getPlayerWidth();
  }
  get height() {
    return GameConfig.getPlayerHeight();
  }
  get canvasWidth() {
    return GameConfig.canvasWidth;
  }
  get canvasHeight() {
    return GameConfig.canvasHeight;
  }
  /**
   * Update player position based on direction
   * @param {Object} direction - Movement direction flags
   * @param {boolean} direction.left
   * @param {boolean} direction.right
   * @param {boolean} direction.up
   * @param {boolean} direction.down
   */
  move(direction) {
    if (direction.left) this.x -= this.moveSpeed;
    if (direction.right) this.x += this.moveSpeed;
    if (direction.up) this.y -= this.moveSpeed;
    if (direction.down) this.y += this.moveSpeed;

    this.clampToBounds();
  }

  /**
   * Keep player within canvas boundaries
   */
  clampToBounds() {
    this.x = Math.max(0, Math.min(this.x, this.canvasWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, this.canvasHeight - this.height));
  }

  /**
   * Check if player can shoot based on fire rate
   * @returns {boolean} True if enough time has passed to shoot
   */
  canShoot() {
    const now = Date.now();
    return now - this.lastShotTime >= this.fireRate;
  }

  /**
   * Fire a projectile - returns spawn position and updates cooldown
   * @returns {Object} Spawn position {x, y}
   */
  shoot() {
    this.lastShotTime = Date.now();
    const laserAudio = new Audio("assets/audio/Laser.mp3");
    laserAudio.currentTime = 0;
    laserAudio.play();
    return {
      x: this.x + this.width / 2,
      y: this.y,
    };
  }

  /**
   * Handle player being hit by enemy/projectile
   * @returns {boolean} True if player died (no lives left)
   */
  hit() {
    if (this.isInvulnerable()) return false;

    const hitAudio = new Audio("assets/audio/Hit.wav");
    hitAudio.play();

    this.lives--;
    this.startInvulnerability();

    return !this.isAlive();
  }

  startInvulnerability(durationMs = 2000) {
    this.invulnerableUntil = Date.now() + durationMs;
  }

  isInvulnerable() {
    return Date.now() < this.invulnerableUntil;
  }

  shouldRender() {
    if (!this.isInvulnerable()) return true;
    return Math.floor(Date.now() / this.blinkInterval) % 2 === 0; // haya3mel render mara ahh mara laa kol 100ms
  }

  /**
   * Check if player is alive
   * @returns {boolean} True if player is alive (has lives left)
   */

  isAlive() {
    return this.lives > 0;
  }

  /**
   * Add points to player score
   * @param {number} points - Points to add
   */
  addScore(points) {
    this.score += points;
  }

  /**
   * Get bounding box for player
   * @returns {Object} {x, y, width, height}
   */
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Reset player to starting state
   */
  reset() {
    this.x = this.canvasWidth / 2 - this.width / 2;
    this.y = this.canvasHeight - this.height - 20;
    this.lives = 3;
    this.score = 0;
    this.lastShotTime = 0;
  }
}
