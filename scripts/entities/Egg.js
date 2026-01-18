import { CanvasManager } from "../core/CanvasManager.js";
import { GameObject } from "./GameObject.js";
import { ENTITY_RATIOS } from "../config/Constants.js";
import { EGG } from "../config/Constants.js";

export class Egg extends GameObject {
  constructor(x, y) {
    super(x, y, EGG.MOVE_SPEED);
  }

  /**
   * Get egg width dynamically based on current canvas size
   */
  get width() {
    return CanvasManager.getInstance().width * ENTITY_RATIOS.EGG_WIDTH;
  }

  /**
   * Get egg height dynamically based on current canvas size
   */
  get height() {
    return CanvasManager.getInstance().height * ENTITY_RATIOS.EGG_HEIGHT;
  }

  /**
   * Move egg downward
   */
  move() {
    this.y += this.moveSpeed;
  }
}
