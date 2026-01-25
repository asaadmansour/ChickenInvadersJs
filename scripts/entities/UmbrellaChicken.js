import { Chicken } from "./Chicken.js";
import { CanvasManager } from "../core/CanvasManager.js";
import { ENTITY_RATIOS, UMBRELLA_CHICKEN } from "../config/Constants.js";
export class UmbrellaChicken extends Chicken {
  constructor(x, y, speed = UMBRELLA_CHICKEN.MOVE_SPEED, lives = UMBRELLA_CHICKEN.LIVES) {
    super(x, y, speed, lives);
    this.score = UMBRELLA_CHICKEN.SCORE;
    this.dropRate = UMBRELLA_CHICKEN.DROP_RATE;
  }

  // Override width and height getters for UmbrellaChicken
  get width() {
    return (
      CanvasManager.getInstance().width * ENTITY_RATIOS.UMBRELLA_CHICKEN_WIDTH
    );
  }

  get height() {
    return (
      CanvasManager.getInstance().height * ENTITY_RATIOS.UMBRELLA_CHICKEN_HEIGHT
    );
  }

  // Override move method for UmbrellaChicken
  move() {
    this.y += this.moveSpeed;

    if (this.y > CanvasManager.getInstance().height) {
      this.deactivate();
    }
  }
}
