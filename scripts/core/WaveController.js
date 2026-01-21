import { Chicken } from "../entities/Chicken.js";
import { Rock } from "../entities/Rock.js";
import { CanvasManager } from "./CanvasManager.js";
import { WAVE_CONFIGS } from "../config/Config.js";
export class WaveController {
  constructor() {}

  createWave(gameState) {
    switch (gameState.currentWave) {
      case 1:
        this.createFirstWave(gameState);
        break;
      case 2:
        this.createSecondWave(gameState);
        break;
      default:
        console.warn(
          `No configuration for wave ${gameState.currentWave}. No entities created.`,
        );
        break;
    }
  }

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

  // Create the second wave of rocks - spawn from left or right at random intervals
  createSecondWave(gameState) {
    const config = WAVE_CONFIGS[1];

    let accumulatedTime = 0;

    for (let i = 0; i < config.count && gameState.status === "playing"; i++) {
      const nextDelay =
        config.minSpawnInterval +
        Math.random() * (config.maxSpawnInterval - config.minSpawnInterval);

      accumulatedTime += nextDelay;

      setTimeout(() => {
        if (gameState.status !== "playing") return;

        const fromLeft = Math.random() > 0.5;

        const startOffset = 60;

        const x = fromLeft
          ? -startOffset
          : CanvasManager.getInstance().width + startOffset;

        const y = Math.random() * (CanvasManager.getInstance().height * 0.4);

        const direction = fromLeft ? 1 : -1;

        const rock = new Rock(x, y, direction);

        const speedVar =
          config.minSpeedFactor +
          Math.random() * (config.maxSpeedFactor - config.minSpeedFactor);

        rock.moveSpeed *= speedVar;

        gameState.addRock(rock);
      }, accumulatedTime);
    }
  }
}
