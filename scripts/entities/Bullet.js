import { CanvasManager } from "../core/CanvasManager.js";
import { GameObject } from "./GameObject.js";
import { ENTITY_RATIOS } from "../config/Constants.js";
import { BULLET } from "../config/Constants.js";
export class Bullet extends GameObject {
  constructor(x, y) {
    super(x, y, BULLET.MOVE_SPEED);
  }

  /**
   * Get bullet width dynamically based on current canvas size
   */
  get width() {
    return CanvasManager.getInstance().width * ENTITY_RATIOS.BULLET_WIDTH;
  }

  /**
   * Get bullet height dynamically based on current canvas size
   */
  get height() {
    return CanvasManager.getInstance().height * ENTITY_RATIOS.BULLET_HEIGHT;
  }

  /**
   * Move bullet upward
   */
  move() {
    this.y -= this.moveSpeed;

    if (this.y + this.height < 0) {
      this.deactivate();
    }
  }
}
