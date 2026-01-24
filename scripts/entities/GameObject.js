import { CanvasManager } from '../core/CanvasManager.js';
export class GameObject {
  constructor(x, y, moveSpeed = 0) {
    if (new.target === GameObject) {
      throw new Error(
        "GameObject is abstract and cannot be instantiated directly",
      );
    }

    this.x = x;
    this.y = y;
    this.moveSpeed = moveSpeed;
    this.isActive = true;
  }

  // Abstract getters — child MUST override
  get width() {
    throw new Error("width getter must be implemented by subclass");
  }
  get height() {
    throw new Error("height getter must be implemented by subclass");
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
   * deactivate the object
   */
  deactivate() {
    this.isActive = false;
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
}
