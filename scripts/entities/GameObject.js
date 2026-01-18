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
}
