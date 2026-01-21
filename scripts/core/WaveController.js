import { Chicken } from "../entities/Chicken.js";
import { CanvasManager } from "./CanvasManager.js";
import { WAVE_CONFIGS } from "../config/Config.js";
export class WaveController {
  constructor() {}

  // Create the first wave of chickens - 2 rows, 13 chickens per row
  createFirstWave(gameState) {
    const config = WAVE_CONFIGS[0];

    const totalWidth = (config.cols - 1) * config.spacingX;
    const startX = (CanvasManager.getInstance().width - totalWidth) / 2;

    for (let rows = 0; rows < config.rows; rows++) {
      for (let cols = 0; cols < config.cols; cols++) {
        const x = startX + cols * config.spacingX;
        const y = config.startY + rows * config.spacingY;
        gameState.addChicken(new Chicken(x, y));
      }
    }
  }
}
