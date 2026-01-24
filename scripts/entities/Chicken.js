import { CanvasManager } from "../core/CanvasManager.js";
import { GameObject } from "./GameObject.js";
import { ENTITY_RATIOS } from "../config/Constants.js";
import { CHICKEN } from "../config/Constants.js";
export class Chicken extends GameObject {
  constructor(x, y, lives = 1) {
    super(x, y, CHICKEN.MOVE_SPEED);
    const canvas = CanvasManager.getInstance();
    this.lives = lives;
    this.startXRatio  = x / canvas.width;
    this.startYRatio = y / canvas.height;
    this.score = CHICKEN.SCORE; //chicken points

    // Animation properties
    this.currentFrame = 0;
    this.frameCount = CHICKEN.FRAME_COUNT;
    this.cols = CHICKEN.COLS;
    this.rows = CHICKEN.ROWS;
    this.frameTimer = 0;
    this.frameDelay = CHICKEN.FRAME_DELAY; // Change frame every 15 game ticks
  }

  // Responsive oscillation ranges
  get horizontalRange() {
    return CanvasManager.getInstance().width * ENTITY_RATIOS.CHICKEN_HORIZONTAL_RANGE;
  }

  get verticalRange() {
    return CanvasManager.getInstance().height * ENTITY_RATIOS.CHICKEN_VERTICAL_RANGE;
  }
  // Getters calculate actual position based on current canvas size
  get startX() {
    return this.startXRatio * CanvasManager.getInstance().width;
  }
  get startY() {
    return this.startYRatio * CanvasManager.getInstance().height;
  }
  /**
   * Update animation frame based on timer
   */
  updateAnimation() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameDelay) {
      this.frameTimer = 0;
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
    }
  }

  /**
   * Get chicken width dynamically based on current canvas size
   */
  get width() {
    return CanvasManager.getInstance().width * ENTITY_RATIOS.CHICKEN_WIDTH;
  }

  /**
   * Get chicken height dynamically based on current canvas size
   */
  get height() {
    return CanvasManager.getInstance().height * ENTITY_RATIOS.CHICKEN_HEIGHT;
  }

  /**
   * Get current lives of the chicken
   */
  getLives() {
    return this.lives;
  }

  /**
   * Decrease chicken lives by 1
   */
  decreaseLives() {
    this.lives--;
  }

  /**
   *  Drop Egg - returns the spawn position for the egg
   * @returns {Object} - Spawn position {x, y}
   */
  drop() {
    return { x: this.x + this.width / 2, y: this.y + this.height };
  }

  /**
   * Move chicken in a sinusoidal pattern
   */
  move(time) {
    this.x = this.startX + Math.sin(time) * this.horizontalRange;
    this.y = this.startY + Math.sin(time * 2) * this.verticalRange;
    this.clampToBounds();
  }
}
