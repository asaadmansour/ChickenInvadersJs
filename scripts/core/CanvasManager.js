import {
  CHICKEN,
  PLAYER,
  BULLET,
  EGG,
  FRIED_CHICKEN,
  ROCK,
  UMBRELLA_CHICKEN,
  DEATH_EFFECT,
} from "../config/Constants.js";

import { UmbrellaChicken } from "../entities/UmbrellaChicken.js";
import { BOSS_CHICKEN } from "../config/Constants.js";
import { BossChicken } from "../entities/BossChicken.js";
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
    this.chickenSpriteSheet.src = CHICKEN.IMAGE;

    this.playerSprite = new Image();
    this.playerSprite.src = PLAYER.IMAGE;

    this.bulletSprite = new Image();
    this.bulletSprite.src = BULLET.IMAGE;
    this.bulletSprite.src = BULLET.IMAGE;

    this.eggSprite = new Image();
    this.eggSprite.src = EGG.IMAGE;

    this.rockSprite = new Image();
    this.rockSprite.src = ROCK.IMAGE;

    this.friedChickenSprite = new Image();
    this.friedChickenSprite.src = FRIED_CHICKEN.IMAGE;
    this.onResizeAction = null;

    this.umbrellaChickenSpriteSheet = new Image();
    this.umbrellaChickenSpriteSheet.src = UMBRELLA_CHICKEN.IMAGE;

    this.deathEffectSpriteSheet = new Image();
    this.deathEffectSpriteSheet.src = DEATH_EFFECT.IMAGE;
    this.bossSpriteSheet = new Image();
    this.bossSpriteSheet.src = BOSS_CHICKEN.IMAGE;

    this.bossHurtSpriteSheet = new Image();
    this.bossHurtSpriteSheet.src = BOSS_CHICKEN.IMAGE_HURT;
    this.resizeCanvas();

    this.setResizeListener();
  }

  // Getters for canvas dimensions
  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  // Singleton access method
  static getInstance() {
    if (!CanvasManager.#instance) {
      CanvasManager.#instance = new CanvasManager();
    }
    return CanvasManager.#instance;
  }

  // Resize canvas to fit window
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Handle window resize events
  setResizeListener() {
    window.addEventListener("resize", () => {
      this.resizeCanvas();
      if (this.onResizeAction) this.onResizeAction();
    });
  }

  /**
   * render the game state onto the canvas [player, bullets, chickens, eggs]
   * @param {*} gameState - the current game state object
   */
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

        if (chicken instanceof BossChicken) {
            const sprite = chicken.isHurt ? this.bossHurtSpriteSheet : this.bossSpriteSheet;
            this.drawAnimatedSprite(chicken, sprite);
        } else if (chicken instanceof UmbrellaChicken && chicken.lives == 2) {
            this.drawAnimatedSprite(chicken, this.umbrellaChickenSpriteSheet);
        } else {
            this.drawAnimatedSprite(chicken, this.chickenSpriteSheet);
        }
    });

    gameState.eggs.forEach((egg) => {
      this.drawSprite(egg, this.eggSprite);
    });

    gameState.rocks.forEach((rock) => {
      this.drawSprite(rock, this.rockSprite);
    });
    gameState.friedChickens.forEach((fc) => {
      this.drawSprite(fc, this.friedChickenSprite);
    });

    gameState.deathEffects.forEach((effect) => {
      effect.updateAnimation();
      this.drawAnimatedSprite(effect, this.deathEffectSpriteSheet);
    });
  }

  // Draw a static sprite
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

  // Draw an animated sprite from a sprite sheet
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

  // Clear the entire canvas
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
