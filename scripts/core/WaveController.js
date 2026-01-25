import { Chicken } from "../entities/Chicken.js";
import { Rock } from "../entities/Rock.js";
import { UmbrellaChicken } from "../entities/UmbrellaChicken.js";
import { CanvasManager } from "./CanvasManager.js";
import { WAVE_CONFIGS } from "../config/Config.js";
import { BossChicken } from "../entities/BossChicken.js";
import { ENTITY_RATIOS } from "../config/Constants.js";
import { AudioManager } from "./AudioManager.js";

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
      case 4:
        this.createFourthWave(gameState);
        break;
      default:
        console.warn(`No configuration for wave ${gameState.currentWave}.`);
        break;
    }
  }

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
    const totalWidth =
      (config.cols - 1) * spacingX + chickenWidth + oscillationRange * 2;
    const startX = (canvas.width - totalWidth) / 2 + oscillationRange;

    for (let rows = 0; rows < config.rows; rows++) {
      for (let cols = 0; cols < config.cols; cols++) {
        const x = startX + cols * spacingX;
        const y = startY + rows * spacingY;
        gameState.addChicken(new Chicken(x, y));
      }
    }
  }

  createSecondWave(gameState, isResuming = false) {
    const config = WAVE_CONFIGS[1];
    const canvas = CanvasManager.getInstance();

    // Calculate how many rocks are left to spawn
    const currentOnScreen = gameState.rocks.length;
    const totalToSpawn = isResuming
      ? Math.max(0, config.count - currentOnScreen)
      : config.count;

    if (totalToSpawn <= 0) {
      gameState.hasPendingSpawns = false;
      return;
    }

    let accumulatedTime = 0;
    gameState.hasPendingSpawns = true;

    for (let i = 0; i < totalToSpawn; i++) {
      const nextDelay =
        config.minSpawnInterval +
        Math.random() * (config.maxSpawnInterval - config.minSpawnInterval);
      accumulatedTime += nextDelay;

      setTimeout(() => {
        if (gameState.isPaused || gameState.status !== "playing") return;

        const startOffset = 60;
        let x, y, direction;
        const spawnSeed = Math.random();

        if (spawnSeed < 0.33) {
          const zoneWidth = canvas.width * 0.35;
          const isLeftZone = Math.random() > 0.5;
          if (isLeftZone) {
            x = Math.random() * zoneWidth;
            direction = 1;
          } else {
            x = canvas.width - Math.random() * zoneWidth;
            direction = -1;
          }
          y = -startOffset;
        } else if (spawnSeed < 0.66) {
          x = -startOffset;
          y = Math.random() * (canvas.height * 0.35);
          direction = 1;
        } else {
          x = canvas.width + startOffset;
          y = Math.random() * (canvas.height * 0.35);
          direction = -1;
        }

        const rock = new Rock(x, y, direction);
        rock.moveSpeed *=
          config.minSpeedFactor +
          Math.random() * (config.maxSpeedFactor - config.minSpeedFactor);
        gameState.addRock(rock);

        if (i === totalToSpawn - 1) gameState.hasPendingSpawns = false;
      }, accumulatedTime);
    }
  }

  createThirdWave(gameState, isResuming = false) {
    const config = WAVE_CONFIGS[2];
    const canvas = CanvasManager.getInstance();

    // Calculate how many umbrella chickens are left to spawn
    const currentOnScreen = gameState.chickens.length;
    const totalToSpawn = isResuming
      ? Math.max(0, config.count - currentOnScreen)
      : config.count;

    if (totalToSpawn <= 0) {
      gameState.hasPendingSpawns = false;
      return;
    }

    let accumulatedTime = 0;
    gameState.hasPendingSpawns = true;

    for (let i = 0; i < totalToSpawn; i++) {
      const nextDelay =
        config.minSpawnInterval +
        Math.random() * (config.maxSpawnInterval - config.minSpawnInterval);
      accumulatedTime += nextDelay;

      setTimeout(() => {
        if (gameState.isPaused || gameState.status !== "playing") return;

        const x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
        const y = -50;
        const uc = new UmbrellaChicken(x, y);
        uc.moveSpeed *=
          config.minSpeedFactor +
          Math.random() * (config.maxSpeedFactor - config.minSpeedFactor);
        gameState.addChicken(uc);

        if (i === totalToSpawn - 1) gameState.hasPendingSpawns = false;
      }, accumulatedTime);
    }
  }
  createFourthWave(gameState) {
    const canvas = CanvasManager.getInstance();
    const bossWidth = canvas.width * ENTITY_RATIOS.BOSS_CHICKEN_WIDTH;
    const centeredX = (canvas.width - bossWidth) / 2;

    const audioManager = AudioManager.getInstance();
    audioManager.play("suspenseSting");

    gameState.hasPendingSpawns = true;

    setTimeout(() => {
      if (gameState.isPaused || gameState.status !== "playing") return;
      gameState.addChicken(new BossChicken(centeredX, 100));
      gameState.hasPendingSpawns = false;
    }, 2000); // 2 second delay
  }
}
