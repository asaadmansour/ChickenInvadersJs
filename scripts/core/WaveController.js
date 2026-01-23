import { Chicken } from "../entities/Chicken.js";
import { Rock } from "../entities/Rock.js";
import { UmbrellaChicken } from "../entities/UmbrellaChicken.js";

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
      case 3:
        this.createThirdWave(gameState);
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
    const canvas = CanvasManager.getInstance();

    // Calculate actual pixel spacing from ratios
    const spacingX = canvas.width * config.spacingXRatio;
    const spacingY = canvas.height * config.spacingYRatio;
    const startY = canvas.height * config.startYRatio;

    
    const chickenWidth = canvas.width * 0.06; // ENTITY_RATIOS.CHICKEN_WIDTH
    const oscillationRange = canvas.width * 0.077; // ENTITY_RATIOS.CHICKEN_HORIZONTAL_RANGE

    // Total width includes: all spacing + one chicken width + oscillation on both sides
    const totalWidth = (config.cols - 1) * spacingX + chickenWidth + oscillationRange * 2;
    const startX = (canvas.width - totalWidth) / 2 + oscillationRange;

    for (let rows = 0; rows < config.rows; rows++) {
      for (let cols = 0; cols < config.cols; cols++) {
        const x = startX + cols * spacingX;
        const y = startY + rows * spacingY;
        gameState.addChicken(new Chicken(x, y));
      }
    }
  }

  // Create the second wave of rocks
  createSecondWave(gameState) {
    const config = WAVE_CONFIGS[1];
    const canvas = CanvasManager.getInstance();

    let accumulatedTime = 0;
    gameState.hasPendingSpawns = true;

    for (let i = 0; i < config.count; i++) {
      const nextDelay =
        config.minSpawnInterval +
        Math.random() * (config.maxSpawnInterval - config.minSpawnInterval);

      accumulatedTime += nextDelay;

      setTimeout(() => {
        if (gameState.status !== "playing") return;

        const startOffset = 60;
        let x, y, direction;

        // Randomly pick a side
        const spawnSeed = Math.random();

        if (spawnSeed < 0.33) {
          // --- OPTION 1: TOP SPAWN ---
          const zoneWidth = canvas.width * 0.35; // Use 35% of width on each side
          const isLeftZone = Math.random() > 0.5;

          if (isLeftZone) {
            // Top-Left Zone -> Move Right
            x = Math.random() * zoneWidth;
            direction = 1;
          } else {
            // Top-Right Zone -> Move Left
            x = canvas.width - Math.random() * zoneWidth;
            direction = -1;
          }

          y = -startOffset;
        } else if (spawnSeed < 0.66) {
          // --- OPTION 2: LEFT SPAWN ---
          x = -startOffset;
          y = Math.random() * (canvas.height * 0.35);
          direction = 1;
        } else {
          // --- OPTION 3: RIGHT SPAWN ---
          x = canvas.width + startOffset;
          y = Math.random() * (canvas.height * 0.35);
          direction = -1;
        }

        const rock = new Rock(x, y, direction);

        const speedVar =
          config.minSpeedFactor +
          Math.random() * (config.maxSpeedFactor - config.minSpeedFactor);

        rock.moveSpeed *= speedVar;

        gameState.addRock(rock);

        if (i === config.count - 1) {
          gameState.hasPendingSpawns = false;
        }
      }, accumulatedTime);
    }
  }

  // Create the third wave of umbrella chickens - spawn at random intervals from the top
  createThirdWave(gameState) {
    const config = WAVE_CONFIGS[2];

    let accumulatedTime = 0;
    gameState.hasPendingSpawns = true;

    for (let i = 0; i < config.count; i++) {
      const nextDelay =
        config.minSpawnInterval +
        Math.random() * (config.maxSpawnInterval - config.minSpawnInterval);

      accumulatedTime += nextDelay;

      setTimeout(() => {
        if (gameState.status !== "playing") return;

        const canvas = CanvasManager.getInstance();

        const x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
        const y = -50;

        const uc = new UmbrellaChicken(x, y);

        const speedVar =
          config.minSpeedFactor +
          Math.random() * (config.maxSpeedFactor - config.minSpeedFactor);

        uc.moveSpeed *= speedVar;

        gameState.addChicken(uc);

        if (i === config.count - 1) {
          gameState.hasPendingSpawns = false;
        }
      }, accumulatedTime);
    }
  }
}
