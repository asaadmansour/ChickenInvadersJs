import { Chicken } from "../entities/Chicken.js";
import { Rock } from "../entities/Rock.js";
import { UmbrellaChicken } from "../entities/UmbrellaChicken.js";
import { CanvasManager } from "./CanvasManager.js";
import { WAVE_CONFIGS } from "../config/Config.js";

export class WaveController {
  constructor() {}

  createWave(gameState) {
    const savedChickens = localStorage.getItem("savedChickens");
    const savedRocks = localStorage.getItem("savedRocks");

    if (savedChickens || savedRocks) {
      this.rehydrateGameState(gameState, savedChickens, savedRocks);
      return; 
    }

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
        console.warn(`No configuration for wave ${gameState.currentWave}.`);
        break;
    }
  }

  rehydrateGameState(gameState, chickensJson, rocksJson) {
    if (chickensJson) {
      const chickensData = JSON.parse(chickensJson);
      chickensData.forEach((data) => {
        let chicken;
        if (data.type === "UmbrellaChicken") {
          chicken = new UmbrellaChicken(data.x, data.y);
        } else {
          chicken = new Chicken(data.x, data.y);
        }
        chicken.lives = data.lives;
        gameState.addChicken(chicken);
      });
      localStorage.removeItem("savedChickens");
    }

    if (rocksJson) {
      const rocksData = JSON.parse(rocksJson);
      rocksData.forEach((data) => {
        const rock = new Rock(data.x, data.y, data.direction);
        gameState.addRock(rock);
      });
      localStorage.removeItem("savedRocks");
    }
    
    gameState.hasPendingSpawns = false; 
  }

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

  createSecondWave(gameState) {
    const config = WAVE_CONFIGS[1];
    const canvas = CanvasManager.getInstance();
    let accumulatedTime = 0;
    gameState.hasPendingSpawns = true;

    for (let i = 0; i < config.count; i++) {
      const nextDelay = config.minSpawnInterval + Math.random() * (config.maxSpawnInterval - config.minSpawnInterval);
      accumulatedTime += nextDelay;

      setTimeout(() => {
        if (gameState.isPaused || gameState.status !== "playing") return;
        const startOffset = 60;
        let x, y, direction;
        const spawnSeed = Math.random();

        if (spawnSeed < 0.33) {
          const zoneWidth = canvas.width * 0.35;
          const isLeftZone = Math.random() > 0.5;
          if (isLeftZone) { x = Math.random() * zoneWidth; direction = 1; }
          else { x = canvas.width - Math.random() * zoneWidth; direction = -1; }
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
        const speedVar = config.minSpeedFactor + Math.random() * (config.maxSpeedFactor - config.minSpeedFactor);
        rock.moveSpeed *= speedVar;
        gameState.addRock(rock);

        if (i === config.count - 1) gameState.hasPendingSpawns = false;
      }, accumulatedTime);
    }
  }

  createThirdWave(gameState) {
    const config = WAVE_CONFIGS[2];
    let accumulatedTime = 0;
    gameState.hasPendingSpawns = true;

    for (let i = 0; i < config.count; i++) {
      const nextDelay = config.minSpawnInterval + Math.random() * (config.maxSpawnInterval - config.minSpawnInterval);
      accumulatedTime += nextDelay;

      setTimeout(() => {
        if (gameState.isPaused || gameState.status !== "playing") return;
        const canvas = CanvasManager.getInstance();
        const x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
        const y = -50;
        const uc = new UmbrellaChicken(x, y);
        const speedVar = config.minSpeedFactor + Math.random() * (config.maxSpeedFactor - config.minSpeedFactor);
        uc.moveSpeed *= speedVar;
        gameState.addChicken(uc);

        if (i === config.count - 1) gameState.hasPendingSpawns = false;
      }, accumulatedTime);
    }
  }
}