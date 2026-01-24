import { Chicken } from "../entities/Chicken.js";
import { Rock } from "../entities/Rock.js";
import { UmbrellaChicken } from "../entities/UmbrellaChicken.js";
import { CanvasManager } from "./CanvasManager.js";
import { WAVE_CONFIGS } from "../config/Config.js";

export class WaveController {
  constructor() {}

  createWave(gameState) {
    const savedChickensStr = localStorage.getItem("savedChickens");
    const savedRocksStr = localStorage.getItem("savedRocks");

    let savedChickens = null;
    let savedRocks = null;

    try {
      if (savedChickensStr) {
        const parsed = JSON.parse(savedChickensStr);
        if (Array.isArray(parsed) && parsed.length > 0) savedChickens = parsed;
      }
      if (savedRocksStr) {
        const parsed = JSON.parse(savedRocksStr);
        if (Array.isArray(parsed) && parsed.length > 0) savedRocks = parsed;
      }
    } catch (e) {
      console.error("Error parsing saved state:", e);
    }

    // Check if we are resuming from a pause
    if (savedChickens || savedRocks) {
      this.rehydrateGameState(gameState, savedChickens, savedRocks);
      
      // Special logic to resume spawners for Wave 2 and Wave 3
      if (gameState.currentWave === 2) {
        this.createSecondWave(gameState, true);
      } else if (gameState.currentWave === 3) {
        this.createThirdWave(gameState, true);
      }
      return; 
    }

    // Normal progression if no saved data exists
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

  rehydrateGameState(gameState, chickensData, rocksData) {
    if (chickensData && Array.isArray(chickensData)) {
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

    if (rocksData && Array.isArray(rocksData)) {
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

  createSecondWave(gameState, isResuming = false) {
    const config = WAVE_CONFIGS[1];
    const canvas = CanvasManager.getInstance();
    
    // Calculate how many rocks are left to spawn
    const currentOnScreen = gameState.rocks.length;
    const totalToSpawn = isResuming ? Math.max(0, config.count - currentOnScreen) : config.count;

    if (totalToSpawn <= 0) {
      gameState.hasPendingSpawns = false;
      return;
    }

    let accumulatedTime = 0;
    gameState.hasPendingSpawns = true;

    for (let i = 0; i < totalToSpawn; i++) {
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
        rock.moveSpeed *= (config.minSpeedFactor + Math.random() * (config.maxSpeedFactor - config.minSpeedFactor));
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
    const totalToSpawn = isResuming ? Math.max(0, config.count - currentOnScreen) : config.count;

    if (totalToSpawn <= 0) {
      gameState.hasPendingSpawns = false;
      return;
    }

    let accumulatedTime = 0;
    gameState.hasPendingSpawns = true;

    for (let i = 0; i < totalToSpawn; i++) {
      const nextDelay = config.minSpawnInterval + Math.random() * (config.maxSpawnInterval - config.minSpawnInterval);
      accumulatedTime += nextDelay;

      setTimeout(() => {
        if (gameState.isPaused || gameState.status !== "playing") return;
        
        const x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
        const y = -50;
        const uc = new UmbrellaChicken(x, y);
        uc.moveSpeed *= (config.minSpeedFactor + Math.random() * (config.maxSpeedFactor - config.minSpeedFactor));
        gameState.addChicken(uc);

        if (i === totalToSpawn - 1) gameState.hasPendingSpawns = false;
      }, accumulatedTime);
    }
  }
}