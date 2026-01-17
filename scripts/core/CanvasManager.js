import { GameConfig } from "../config/Config.js";
export class CanvasManager {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.chickenSprite = new Image();
    this.chickenSprite.src = "./assets/images/chicken.png";

    this.playerSprite = new Image();
    this.playerSprite.src = "./assets/images/player.png";

    this.bulletSprite = new Image();
    this.bulletSprite.src = "./assets/images/bullet.png";

    this.eggSprite = new Image();
    this.eggSprite.src = "./assets/images/Egg.webp";
    this.resizeCanvas();
    this.canavasChanges();
  }
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    GameConfig.updateDimensions(this.canvas.width, this.canvas.height);
    if (this.onResize) this.onResize();
  }
  canavasChanges() {
    window.addEventListener("resize", () => this.resizeCanvas());
  }
  render(player, bullets, chickens, eggs) {
    this.clear();

    if (!player.shouldRender || player.shouldRender()) {
      this.drawSprite(player, this.playerSprite);
    }

    bullets.forEach((bullet) => {
      this.drawSprite(bullet, this.bulletSprite);
    });

    chickens.forEach((chicken) => {
      this.drawSprite(chicken, this.chickenSprite);
    });

    eggs.forEach((egg) => {
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

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
