import { CanvasManager } from "./CanvasManager.js";
import { InputHandler } from "./InputHandler.js";
import { Player } from "../entities/Player.js";
import { Bullet } from "../entities/Bullet.js";
import { Chicken } from "../entities/Chicken.js";
import { Egg } from "../entities/Egg.js";
import { CollisionDetector } from "./CollisionDetector.js";
import { AudioManager } from "./AudioManager.js";
import { GameState } from "./GameState.js";
import { WaveController } from "./WaveController.js";
import { WAVE_CONFIGS } from "../config/Config.js";
import { HUDManager } from "./HUDManager.js";
import { FriedChicken } from "../entities/FriedChicken.js";
import { DeathEffect } from "../entities/DeathEffect.js";
import { CountdownManager } from "./CountdownManager.js";

export class Game {
  constructor() {
    this.audioManager = AudioManager.getInstance();
    this.canvasManager = CanvasManager.getInstance();
    this.inputHandler = new InputHandler();
    this.collisionDetector = new CollisionDetector();
    this.gameState = GameState.getInstance();
    this.hudManager = new HUDManager();
    this.waveController = new WaveController();

    this.animationFrameId = null;

    this.setupControls();
    this.bindPauseMenu();

    // Initialize the game session correctly
    this.init();

    this.canvasManager.onResizeAction = () => {
      this.gameState.player.clampToBounds();
    };
  }

  init() {
    // Clear lists before creating/restoring wave to prevent duplicates or ghost entities
    this.gameState.chickens = [];
    this.gameState.rocks = [];
    this.gameState.bullets = [];
    this.gameState.eggs = [];

    // Create wave (will automatically check for saved data from Pause)
    this.waveController.createWave(this.gameState);

    this.hudManager.updateScore(this.gameState);
    this.hudManager.printLives(this.gameState);

    // Start the game loop
    this.start();
  }

  setupControls() {
    this.inputHandler.bindKey("ArrowLeft", () =>
      this.gameState.player.move({ left: true }),
    );
    this.inputHandler.bindKey("ArrowRight", () =>
      this.gameState.player.move({ right: true }),
    );
    this.inputHandler.bindKey("ArrowUp", () =>
      this.gameState.player.move({ up: true }),
    );
    this.inputHandler.bindKey("ArrowDown", () =>
      this.gameState.player.move({ down: true }),
    );
    this.inputHandler.bindKey("Space", () => {
      if (this.gameState.player.canShoot()) {
        const spawn = this.gameState.player.shoot();
        this.audioManager.play("bullet");
        this.gameState.addBullet(new Bullet(spawn.x, spawn.y));
      }
    });
    this.inputHandler.bindKey("Escape", () => this.pause());
    this.inputHandler.bindKey("KeyP", () => this.pause());
  }

  bindPauseMenu() {
    const pauseTrigger = document.getElementById("pause-trigger");
    if (pauseTrigger) {
      pauseTrigger.addEventListener("click", () => this.pause());
    }
  }

  gameLoop() {
    if (this.gameState.isPaused || this.gameState.status === "gameover") return;

    this.inputHandler.processInput();
    this.gameState.updateTime();
    this.updateEntitiesPositions();
    this.attemptSpawnEggs();
    this.checkCollisions();
    this.removeInactiveEntities();
    this.checkAndAdvanceWave();
    this.canvasManager.render(this.gameState);

    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  updateEntitiesPositions() {
    this.gameState.bullets.forEach((bullet) => bullet.move());
    this.gameState.eggs.forEach((egg) => egg.move());
    this.gameState.chickens.forEach((chicken) =>
      chicken.move(this.gameState.gameTime),
    );
    this.gameState.rocks.forEach((rock) => rock.move());
    this.gameState.friedChickens.forEach((fc) => fc.move());
    this.gameState.deathEffects.forEach((de) => de.update?.());
  }

  attemptSpawnEggs() {
    const currentWaveIdx = this.gameState.currentWave - 1;
    const dropRate = WAVE_CONFIGS[currentWaveIdx]?.eggsDropRate || 0.001;

    this.gameState.chickens.forEach((chicken) => {
      if (chicken.isActive && Math.random() < dropRate) {
        const spawn = chicken.drop();
        this.gameState.addEgg(new Egg(spawn.x, spawn.y));
      }
    });
  }

  checkCollisions() {
    this.checkBulletsVsChickens();
    this.checkPlayerVsFriedChickens();
    if (this.gameState.player.isInvulnerable()) return;
    this.checkPlayerVsChickens();
    this.checkPlayerVsEggs();
    this.checkPlayerVsRocks();
  }

  checkBulletsVsChickens() {
    this.collisionDetector.checkGroupVsGroup(
      this.gameState.bullets,
      this.gameState.chickens,
      (bullet, chicken) => {
        chicken.decreaseLives();
        bullet.deactivate();
        if (chicken.getLives() <= 0) {
          chicken.deactivate();
          const spawn = chicken.drop();
          this.audioManager.play("chickenDeath");
          this.gameState.addDeathEffect(
            new DeathEffect(
              chicken.x,
              chicken.y,
              chicken.width,
              chicken.height,
            ),
          );
          this.gameState.addFriedChicken(
            new FriedChicken(spawn.x, spawn.y, chicken.score),
          );
        }
      },
    );
  }

  checkPlayerVsFriedChickens() {
    this.collisionDetector.checkGroupVsItem(
      this.gameState.friedChickens,
      this.gameState.player,
      (fc) => {
        fc.deactivate();
        this.audioManager.play("crunch");
        this.gameState.addScore(fc.score);
        this.hudManager.updateScore(this.gameState);
      },
    );
  }

  checkPlayerVsChickens() {
    this.collisionDetector.checkGroupVsItem(
      this.gameState.chickens,
      this.gameState.player,
      (chicken) => {
        if (chicken.isActive) {
          chicken.deactivate();
          this.handlePlayerHit();
        }
      },
    );
  }

  checkPlayerVsEggs() {
    this.collisionDetector.checkGroupVsItem(
      this.gameState.eggs,
      this.gameState.player,
      (egg) => {
        egg.deactivate();
        this.handlePlayerHit();
      },
    );
  }

  checkPlayerVsRocks() {
    this.collisionDetector.checkGroupVsItem(
      this.gameState.rocks,
      this.gameState.player,
      (rock) => {
        rock.deactivate();
        this.handlePlayerHit();
      },
    );
  }

  removeInactiveEntities() {
    this.gameState.bullets = this.gameState.bullets.filter((b) => b.isActive);
    this.gameState.eggs = this.gameState.eggs.filter((e) => e.isActive);
    this.gameState.chickens = this.gameState.chickens.filter((c) => c.isActive);
    this.gameState.rocks = this.gameState.rocks.filter((r) => r.isActive);
    this.gameState.friedChickens = this.gameState.friedChickens.filter(
      (f) => f.isActive,
    );
    this.gameState.deathEffects = this.gameState.deathEffects.filter(
      (d) => d.isActive,
    );
  }

  checkAndAdvanceWave() {
    let waveCompleted = false;
    switch (this.gameState.currentWave) {
      case 1:
        if (this.gameState.chickens.length === 0) waveCompleted = true;
        break;
      case 2:
        if (
          !this.gameState.hasPendingSpawns &&
          this.gameState.rocks.length === 0
        )
          waveCompleted = true;
        break;
      case 3:
        if (
          !this.gameState.hasPendingSpawns &&
          this.gameState.chickens.length === 0
        )
          waveCompleted = true;
        break;
      default:
        this.handleGameComplete();
        return;
    }

    if (waveCompleted) {
      this.gameState.incrementWaveNumber();
      this.waveController.createWave(this.gameState);
    }
  }

  handlePlayerHit() {
    const wasHit = this.gameState.player.hit();
    if (!wasHit) return;
    this.audioManager.play("hit");
    const isDead = this.gameState.loseLife();
    this.hudManager.printLives(this.gameState);
    if (isDead) this.handleGameOver();
  }

  async handleGameOver() {
    if (this.gameState.status === "gameover") return;
    this.gameState.status = "gameover";
    localStorage.setItem("finalScore", this.gameState.score);
    localStorage.setItem("gameStatus", "lose");
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.location.href = "../pages/gameover.html";
  }

  async handleGameComplete() {
    if (this.gameState.status === "complete") return;
    this.gameState.status = "complete";
    localStorage.setItem("finalScore", this.gameState.score);
    localStorage.setItem("gameStatus", "win");
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.location.href = "../pages/gameover.html";
  }

  pause() {
    const keysToRemove = [
      "savedScore",
      "savedLives",
      "savedWave",
      "savedChickens",
      "savedRocks",
      "savedBullets",
      "savedEggs",
      "savedFriedChickens",
      "playerX",
      "playerY",
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // 1. Save Core State
    localStorage.setItem("savedScore", this.gameState.score);
    localStorage.setItem("savedLives", this.gameState.lives);
    localStorage.setItem("savedWave", this.gameState.currentWave);

    // 2. Save Player Position
    localStorage.setItem("playerX", this.gameState.player.x);
    localStorage.setItem("playerY", this.gameState.player.y);

    // 3. Save Chickens (Wave 1 & 3)
    const chickensData = this.gameState.chickens.map((c) => ({
      x: c.x,
      y: c.y,
      lives: c.lives,
      type: c.constructor.name,
    }));
    localStorage.setItem("savedChickens", JSON.stringify(chickensData));

    // 4. Save Rocks (Wave 2)
    const rocksData = this.gameState.rocks.map((r) => ({
      x: r.x,
      y: r.y,
      direction: r.direction,
    }));
    localStorage.setItem("savedRocks", JSON.stringify(rocksData));

    // 5. Save Bullets
    const bulletData = this.gameState.bullets.map((b) => ({
      x: b.x,
      y: b.y,
    }));
    localStorage.setItem("savedBullets", JSON.stringify(bulletData));

    // 6. Save Eggs
    const eggData = this.gameState.eggs.map((e) => ({
      x: e.x,
      y: e.y,
    }));
    localStorage.setItem("savedEggs", JSON.stringify(eggData));

    // 6. Save Fried Chickens
    const friedChickenData = this.gameState.friedChickens.map((f) => ({
      x: f.x,
      y: f.y,
      score: f.score,
    }));
    localStorage.setItem(
      "savedFriedChickens",
      JSON.stringify(friedChickenData),
    );

    // 7. Execution Clean up
    this.gameState.pause();
    this.audioManager.pauseMusic();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    window.location.href = "../pages/pausemenu.html";
  }

  start() {
    this.showCountdown();
  }

  async showCountdown() {
    const countdown = new CountdownManager({
      countStart: 3,
      countDuration: 1000,
      finalMessage: "DEFEND EARTH!",
      finalMessageDuration: 1000,
    });

    await countdown.start();
    this.gameLoop();
  }
}

// Clear local storage only if the page was reloaded
if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
  window.localStorage.clear();
}

document.addEventListener("DOMContentLoaded", () => {
  new Game();
});
