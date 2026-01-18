import { CanvasManager } from "./CanvasManager.js";
import { InputHandler } from "./InputHandler.js";
import { Player } from "../entities/Player.js";
import { Bullet } from "../entities/Bullet.js";
import { Chicken } from "../entities/Chicken.js";
import { Egg } from "../entities/Egg.js";
import { CollisionDetector } from "./CollisionDetector.js";

export class Game {
  constructor() {
    this.canvasManager = CanvasManager.getInstance();
    this.inputHandler = new InputHandler();
    this.collisionDetector = new CollisionDetector();

    this.backgroundAudio = new Audio();
    this.backgroundAudio.src = "../assets/audio/Game Audio.wav";
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = 0.8; // 3ashan ne5aly al soot mayeb2ash 3aly

    this.gameTime = 0;

    this.player = new Player();

    this.bullets = [];
    this.eggs = [];

    this.chickens = [];
    this.initChickens();

    this.setupControls();
    this.start();

    this.canvasManager.onResize = () => {
      this.player.clampToBounds();
    };
  }

  initChickens() {
    const rowCount = 2;
    const colCount = 13;
    const spacingX = 100;
    const spacingY = 80;
    const startY = 50;

    const totalWidth = (colCount - 1) * spacingX;
    const startX = (this.canvasManager.canvas.width - totalWidth) / 2;

    for (let r = 0; r < rowCount; r++) {
      for (let c = 0; c < colCount; c++) {
        const x = startX + c * spacingX;
        const y = startY + r * spacingY;
        this.chickens.push(new Chicken(x, y));
      }
    }
  }
  setupControls() {
    this.inputHandler.bindKey("ArrowLeft", () => {
      this.player.move({ left: true });
      this.startBackgroundAudio();
    });

    this.inputHandler.bindKey("ArrowRight", () => {
      this.player.move({ right: true });
      this.startBackgroundAudio();
    });

    this.inputHandler.bindKey("ArrowUp", () => {
      this.player.move({ up: true });
      this.startBackgroundAudio();
    });

    this.inputHandler.bindKey("ArrowDown", () => {
      this.player.move({ down: true });
      this.startBackgroundAudio();
    });

    this.inputHandler.bindKey("Space", () => {
      if (this.player.canShoot()) {
        const spawn = this.player.shoot();
        this.bullets.push(new Bullet(spawn.x, spawn.y));
      }
      this.startBackgroundAudio();
    });
  }

  startBackgroundAudio() {
    if (this.backgroundAudio.paused) {
      this.backgroundAudio.play().catch(() => {});
    }
  }

  updateState() {
    this.inputHandler.processInput();
    this.updateTime();

    this.bullets.forEach((bullet) => bullet.move());
    this.eggs.forEach((egg) => egg.move());

    this.chickens.forEach((chicken) => {
      chicken.move(this.gameTime);
      // 0.1% kol frame
      if (chicken.isActive && Math.random() < 0.001) {
        const spawn = chicken.drop();
        this.eggs.push(new Egg(spawn.x, spawn.y));
      }
    });

    this.collisionDetector.checkBulletsVsChickens(this.bullets, this.chickens);
    this.collisionDetector.checkPlayerVsChickens(this.player, this.chickens);
    this.collisionDetector.checkEggsVsPlayer(this.eggs, this.player);

    this.bullets = this.bullets.filter(
      (bullet) => bullet.y + bullet.height > 0 && bullet.isActive,
    );

    this.eggs = this.eggs.filter(
      (egg) => egg.isActive && egg.y < this.canvasManager.height,
    );

    this.chickens = this.chickens.filter((chicken) => chicken.isActive);
  }

  /**
   * Update global time for movement calculations
   */
  updateTime() {
    this.gameTime += 0.02;
  }

  gameLoop() {
    this.updateState();
    this.canvasManager.render(
      this.player,
      this.bullets,
      this.chickens,
      this.eggs,
    );
    requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    this.gameLoop();
  }
}

new Game();
