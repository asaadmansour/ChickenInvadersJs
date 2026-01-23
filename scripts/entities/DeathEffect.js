import { CanvasManager } from "../core/CanvasManager.js";
import { GameObject } from "./GameObject.js";
import { DEATH_EFFECT, ENTITY_RATIOS } from "../config/Constants.js";

export class DeathEffect extends GameObject {
  constructor(x, y, chickenWidth, chickenHeight) {
    super(x, y, 0);
    this.currentFrame = 0;
    this.frameCount = DEATH_EFFECT.FRAME_COUNT;
    this.cols = DEATH_EFFECT.COLS;
    this.rows = DEATH_EFFECT.ROWS;
    this.frameTimer = 0;
    this.frameDelay = DEATH_EFFECT.FRAME_DELAY;

    // Center the death effect on the chicken
    this.x = x + (chickenWidth - this.width) / 2;
    this.y = y + (chickenHeight - this.height) / 2;
  }

  get width() {
    return CanvasManager.getInstance().width * ENTITY_RATIOS.DEATH_EFFECT_WIDTH;
  }

  get height() {
    return (
      CanvasManager.getInstance().height * ENTITY_RATIOS.DEATH_EFFECT_HEIGHT
    );
  }

  updateAnimation() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameDelay) {
      this.frameTimer = 0;
      this.currentFrame++;
      if (this.currentFrame >= this.frameCount) {
        this.deactivate();
      }
    }
  }
}
