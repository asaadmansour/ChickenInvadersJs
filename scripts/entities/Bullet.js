import { GameConfig } from "../config/Config.js";

export class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.moveSpeed = 10;
    this.isActive = true;
  }

    get width() {
      return GameConfig.getBulletWidth();
    }
    get height() {
      return GameConfig.getBulletHeight();
    }
  /**
   * Move bullet upward
   */
  move() {
    this.y -= this.moveSpeed;
  }

  /**
   * Get bounding box for collision
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
   * Mark bullet for removal
   */
  deactivate() {
    this.isActive = false;
  }
}
