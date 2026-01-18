import { CHICKEN,PLAYER,BULLET,EGG } from "../config/Constants.js";
export class CanvasManager {
  static #instance = null;

  constructor() {
    if (CanvasManager.#instance) {
      throw new Error("Use CanvasManager.getInstance() instead of new");
    }

    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.chickenSpriteSheet = new Image();
    this.chickenSpriteSheet.src = CHICKEN.IMAGE;

    this.Boss = new Image();
    this.chickenSpriteSheet.src = "./assets/images/chicken_spritesheet.png";

    this.playerSprite = new Image();
    this.playerSprite.src = PLAYER.IMAGE;

    this.bulletSprite = new Image();
    this.bulletSprite.src = BULLET.IMAGE ;

    this.eggSprite = new Image();
    this.eggSprite.src = EGG.IMAGE ;
    this.resizeCanvas();
    this.canavasChanges();
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  static getInstance() {
    if (!CanvasManager.#instance) {
      CanvasManager.#instance = new CanvasManager();
    }
    return CanvasManager.#instance;
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (this.onResize) this.onResize();
  }
  canavasChanges() {
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  render(gameState) {
    this.clear();

    if (!gameState.player.shouldRender || gameState.player.shouldRender()) {
      this.drawSprite(gameState.player, this.playerSprite);
    }

    gameState.bullets.forEach((bullet) => {
      this.drawSprite(bullet, this.bulletSprite);
    });

    gameState.chickens.forEach((chicken) => {
      chicken.updateAnimation();
      this.drawAnimatedSprite(chicken, this.chickenSpriteSheet);
    });

    gameState.eggs.forEach((egg) => {
      this.drawSprite(egg, this.eggSprite);
    });
  }

  drawEntity(entity, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
  }

  drawSprite(entity, image) {
    if (image.complete) {
      this.ctx.drawImage(
        image,
        entity.x,
        entity.y,
        entity.width,
        entity.height,
      );
    }
  }

  drawAnimatedSprite(entity, spriteSheet) {
    if (spriteSheet.complete) {
      const frameWidth = spriteSheet.width / entity.cols;
      const frameHeight = spriteSheet.height / entity.rows;
      const col = entity.currentFrame % entity.cols;
      const row = Math.floor(entity.currentFrame / entity.cols);

      this.ctx.drawImage(
        spriteSheet,
        col * frameWidth,
        row * frameHeight, // Source x, y
        frameWidth,
        frameHeight, // Source width, height
        entity.x,
        entity.y, // Destination x, y
        entity.width,
        entity.height, // Destination width, height
      );
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
