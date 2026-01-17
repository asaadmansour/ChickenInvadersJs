export class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.width = 8;
    this.height = 16;

    this.moveSpeed = 10;

    this.isActive = true;
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
