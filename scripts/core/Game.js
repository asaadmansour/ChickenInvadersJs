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

    this.player = new Player(
      this.canvasManager.width,
      this.canvasManager.height
    );
    this.bullets = [];

    this.chickens = [
      new Chicken(110, 50),
      new Chicken(210, 50),
      new Chicken(310, 50),
      new Chicken(410, 50),
      new Chicken(510, 50),
    ];

    this.setupControls();
    this.start();
  }

  setupControls() {
    this.inputHandler.bindKey("ArrowLeft", () =>
      this.player.move({ left: true })
    );

    this.inputHandler.bindKey("ArrowRight", () =>
      this.player.move({ right: true })
    );

    this.inputHandler.bindKey("ArrowUp", () => this.player.move({ up: true }));

    this.inputHandler.bindKey("ArrowDown", () =>
      this.player.move({ down: true })
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
      (bullet) => bullet.y + bullet.height > 0 && bullet.isActive
    );

    this.chickens = this.chickens.filter((chicken) => chicken.isAlive);
  }

  gameLoop() {
    this.updateState();
    this.canvasManager.render(this.player, this.bullets, this.chickens);
    requestAnimationFrame(() => this.gameLoop());
  }

  start() {
    this.gameLoop();
  }
}

new Game();
