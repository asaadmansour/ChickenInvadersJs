import { CanvasManager } from "./CanvasManager.js";
import { InputHandler } from "./InputHandler.js";
import { Player } from "../entities/Player.js";
import { Bullet } from "../entities/Bullet.js";
import { Chicken } from "../entities/Chicken.js";
import { Egg } from "../entities/Egg.js";
import { CollisionDetector } from "./CollisionDetector.js";
import { GameState } from "./GameState.js";
import { WaveController } from "./WaveController.js";
import { WAVE_CONFIGS } from "../config/Config.js";

export class Game {
  constructor() {
    this.canvasManager = CanvasManager.getInstance();
    this.inputHandler = new InputHandler();
    this.collisionDetector = new CollisionDetector();
    this.gameState = GameState.getInstance();
    this.waveController = new WaveController();

    this.backgroundAudio = new Audio();
    this.backgroundAudio.src = "../assets/audio/Game Audio.wav";
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = 0.8; // 3ashan ne5aly al soot mayeb2ash 3aly

    this.waveController.createFirstWave(this.gameState);
    this.setupControls();
    this.start();

    this.canvasManager.onResize = () => {
      this.gameState.player.clampToBounds();
    };
  }

  setupControls() {
    this.inputHandler.bindKey("ArrowLeft", () => {
      this.gameState.player.move({ left: true });
      this.startBackgroundAudio();
    });

    this.inputHandler.bindKey("ArrowRight", () => {
      this.gameState.player.move({ right: true });
      this.startBackgroundAudio();
    });

    this.inputHandler.bindKey("ArrowUp", () => {
      this.gameState.player.move({ up: true });
      this.startBackgroundAudio();
    });

    this.inputHandler.bindKey("ArrowDown", () => {
      this.gameState.player.move({ down: true });
      this.startBackgroundAudio();
    });

    this.inputHandler.bindKey("Space", () => {
      if (this.gameState.player.canShoot()) {
        const spawn = this.gameState.player.shoot();
        this.gameState.addBullet(new Bullet(spawn.x, spawn.y));
      }
      this.startBackgroundAudio();
    });
  }

  startBackgroundAudio() {
    if (this.backgroundAudio.paused) {
      this.backgroundAudio.play().catch(() => {});
    }
  }

  gameLoop() {
    this.inputHandler.processInput();
    this.gameState.updateTime();
    this.updateEntitiesPositions();
    this.attemptSpawnEggs();
    this.collisionDetector.checkCollisions(this.gameState);
    this.filterInactiveEntities();
    this.canvasManager.render(this.gameState);
    requestAnimationFrame(() => this.gameLoop());
  }

  updateEntitiesPositions() {
    this.gameState.bullets.forEach((bullet) => bullet.move());
    this.gameState.eggs.forEach((egg) => egg.move());
    this.gameState.chickens.forEach((chicken) =>
      chicken.move(this.gameState.gameTime),
    );
  }

  attemptSpawnEggs() {
    this.gameState.chickens.forEach((chicken) => {
      if (
        chicken.isActive &&
        Math.random() <
          WAVE_CONFIGS[this.gameState.currentWave - 1].eggsDropRate
      ) {
        const spawn = chicken.drop();
        this.gameState.addEgg(new Egg(spawn.x, spawn.y));
      }
    });
  }

  filterInactiveEntities() {
    this.gameState.bullets = this.gameState.bullets.filter(
      (bullet) => bullet.isActive && bullet.y + bullet.height > 0,
    );

    this.gameState.eggs = this.gameState.eggs.filter(
      (egg) => egg.isActive && egg.y < CanvasManager.getInstance().height,
    );

    this.gameState.chickens = this.gameState.chickens.filter(
      (chicken) => chicken.isActive,
    );
  }

  start() {
    this.gameLoop();
  }
}

new Game();
