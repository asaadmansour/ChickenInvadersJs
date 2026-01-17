import { CanvasManager } from "./CanvasManager.js";
import { InputHandler } from "./InputHandler.js";
import { Player } from "../entities/Player.js";
import { Bullet } from "../entities/Bullet.js";
import { Chicken } from "../entities/Chicken.js";
import { CollisionDetector } from "./CollisionDetector.js";

export class Game {
  constructor() {
    this.canvasManager = new CanvasManager();
    this.inputHandler = new InputHandler();
    this.collisionDetector = new CollisionDetector();

    this.backgroundAudio = new Audio("../assets/audio/Game Audio.wav");
    this.backgroundAudio.loop = true;
    this.backgroundAudio.volume = 0.8; // 3ashan ne5aly al soot mayeb2ash 3aly

    this.player = new Player(
      this.canvasManager.width,
      this.canvasManager.height,
    );

    this.bullets = [];

    this.chickens = [
      new Chicken(110, 50),
      new Chicken(210, 50),
      new Chicken(310, 50),
      new Chicken(410, 50),
      new Chicken(510, 50),
      new Chicken(610, 50),
      new Chicken(710, 50),
      new Chicken(810, 50),
      new Chicken(910, 50),
    ];

    this.setupControls();
    this.start();

    this.canvasManager.onResize = () => {
      this.player.clampToBounds();
    };
  }
  setupControls() {
    this.inputHandler.bindKey("ArrowLeft", () =>
      this.player.move({ left: true }),
    );

    this.inputHandler.bindKey("ArrowRight", () =>
      this.player.move({ right: true }),
    );

    this.inputHandler.bindKey("ArrowUp", () => this.player.move({ up: true }));

    this.inputHandler.bindKey("ArrowDown", () =>
      this.player.move({ down: true }),
    );

    this.inputHandler.bindKey("Space", () => {
      if (this.player.canShoot()) {
        const spawn = this.player.shoot();
        this.bullets.push(new Bullet(spawn.x, spawn.y));
      }
    });
  }

  updateState() {
    this.inputHandler.processInput();

    this.bullets.forEach((bullet) => bullet.move());

    this.collisionDetector.checkBulletsVsChickens(this.bullets, this.chickens);

    this.bullets = this.bullets.filter(
      (bullet) => bullet.y + bullet.height > 0 && bullet.isActive,
    );

    this.chickens = this.chickens.filter((chicken) => chicken.isAlive);
  }

  gameLoop() {
    this.updateState();
    this.canvasManager.render(this.player, this.bullets, this.chickens);
    requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    if (this.backgroundAudio.paused) {
      this.backgroundAudio.currentTime = 0;
      this.backgroundAudio.play();
    }
    this.gameLoop();
  }
}

new Game();
