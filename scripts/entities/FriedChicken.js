import { CanvasManager } from "../core/CanvasManager.js";
import { GameObject } from "./GameObject.js";
import { ENTITY_RATIOS, FRIED_CHICKEN } from "../config/Constants.js";

export class FriedChicken extends GameObject {
  constructor(x, y, score) {
    super(x, y, FRIED_CHICKEN.MOVE_SPEED);
    this.score = score;  // Points from the chicken it came from
  }

  /**
   * Get egg width dynamically based on current canvas size
   */
  get width() {
    return CanvasManager.getInstance().width * ENTITY_RATIOS.FRIED_CHICKEN_WIDTH;
  }

  /**
   * Get egg height dynamically based on current canvas size
   */
  get height() {
    return CanvasManager.getInstance().height * ENTITY_RATIOS.FRIED_CHICKEN_HEIGHT;
  }

  /**
   * Move friedchicken downward
   */
  move() {
    this.y += this.moveSpeed;
  }
}
