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

    for (let r = 0; r < config.rows; r++) {
      for (let c = 0; c < config.cols; c++) {
        const x = startX + c * config.spacingX;
        const y = config.startY + r * config.spacingY;
        gameState.addChicken(new Chicken(x, y));
      }
    }
  }
}
