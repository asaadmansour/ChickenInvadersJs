import { GameObject } from "./GameObject.js";
import { CanvasManager } from "../core/CanvasManager.js";
import { ENTITY_RATIOS, ROCK } from "../config/Constants.js";
export class Rock extends GameObject {
  constructor(x, y, direction) {
    super(x, y, ROCK.MOVE_SPEED);
    this.direction = direction; // 1 = moving right, -1 = moving left
  }

  // Get rock width dynamically based on current canvas size
  get width() {
    return CanvasManager.getInstance().width * ENTITY_RATIOS.ROCK_WIDTH;
  }

  // Get rock height dynamically based on current canvas size
  get height() {
    return CanvasManager.getInstance().height * ENTITY_RATIOS.ROCK_HEIGHT;
  }

  // move rock diagonally downwards
  move() {
    this.x += this.moveSpeed * this.direction;
    this.y += this.moveSpeed; // Always moves down

    if (this.y > CanvasManager.getInstance().height) {
      this.deactivate();
    }
  }
}
