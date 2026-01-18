import { CanvasManager } from "../core/CanvasManager.js";
import { GameObject } from "./GameObject.js";
import { ENTITY_RATIOS } from "../config/Constants.js";
import { PLAYER } from "../config/Constants.js";
import { AudioManager } from "../core/AudioManager.js";
export class Player extends GameObject {
  constructor() {
    super(0, 0, PLAYER.MOVE_SPEED);
    this.audioManager = AudioManager.getInstance();

    this.x = CanvasManager.getInstance().width / 2 - this.width / 2;
    this.y = CanvasManager.getInstance().height - this.height - 5;

    this.lives = PLAYER.INITIAL_LIVES;
    this.score = 0;

    this.fireRate = PLAYER.FIRE_RATE; // ms between shots
    this.lastShotTime = 0;

    this.invulnerableUntil = 0;
    this.blinkInterval = PLAYER.BLINK_INTERVAL;
  }

  /**
   * Get player width dynamically based on current canvas size
   */
  get width() {
    return CanvasManager.getInstance().width * ENTITY_RATIOS.PLAYER_WIDTH;
  }

  /**
   * Get player height dynamically based on current canvas size
   */
  get height() {
    return CanvasManager.getInstance().height * ENTITY_RATIOS.PLAYER_HEIGHT;
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
    this.x = Math.max(
      0,
      Math.min(this.x, CanvasManager.getInstance().width - this.width),
    );

    this.y = Math.max(
      0,
      Math.min(this.y, CanvasManager.getInstance().height - this.height),
    );
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
    this.audioManager.play("bullet");

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

    this.audioManager.play("hit");

    this.lives--;
    this.startInvulnerability();

    return !this.isAlive();
  }

  /**
   * Start invulnerability period after being hit
   * @param {number} durationMs - Duration of invulnerability in milliseconds
   */
  startInvulnerability(durationMs = 2000) {
    this.invulnerableUntil = Date.now() + durationMs;
  }

  /**
   * Check if player is currently invulnerable
   * @returns {boolean} True if invulnerable
   */
  isInvulnerable() {
    return Date.now() < this.invulnerableUntil;
  }

  /**
   * Determine if player should be rendered (for blinking effect)
   * @returns {boolean} True if player should be rendered
   */
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
   * Reset player to starting state
   */
  reset() {
    this.x = CanvasManager.getInstance().width / 2 - this.width / 2;
    this.y = CanvasManager.getInstance().height - this.height - 20;
    this.lives = 3;
    this.score = 0;
    this.lastShotTime = 0;
    this.invulnerableUntil = 0;
  }
}
