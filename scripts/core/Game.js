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
import { addButtonHoverSound } from "../utils/AudioHelper.js";
import { BossChicken } from "../entities/BossChicken.js";

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
    this.isTransitioningWave = false;

    this.setupControls();
    this.bindPauseMenu();
    this.setupVisibilityHandler();

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
    this.inputHandler.bindKey("Escape", () => {
      if (this.gameState.isPaused) {
        this.resume();
      } else {
        this.pause();
      }
    });
    this.inputHandler.bindKey("KeyP", () => this.pause());
  }

  // This is for binding the pause menu buttons to game actions
  bindPauseMenu() {
    const pauseTrigger = document.getElementById("pause-trigger");
    if (pauseTrigger) {
      pauseTrigger.addEventListener("click", () => this.pause());
    }

    const resumeBtn = document.getElementById("resumeBtn");
    const restartBtn = document.getElementById("restartBtn");
    const exitBtn = document.getElementById("exitBtn");

    if (resumeBtn) {
      resumeBtn.addEventListener("click", () => this.resume());
    }
    if (restartBtn) {
      restartBtn.addEventListener("click", () => this.restart());
    }
    if (exitBtn) {
      exitBtn.addEventListener("click", () => this.exitToMenu());
    }

    addButtonHoverSound();
  }

  setupVisibilityHandler() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Automatically pause when user leaves the page
        if (!this.gameState.isPaused && this.gameState.status === "playing") {
          this.pause();
        }
      }
    });
  }

  gameLoop() {
    if (this.gameState.isPaused || this.gameState.status === "gameover") return;

    this.inputHandler.processInput();
    this.gameState.updateTime();
    this.updateEntitiesPositions();
    this.waveController.updateSpawner(this.gameState); // Handle timed spawns
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
    this.gameState.chickens.forEach((chicken) => {
      if (
        chicken.isActive &&
        chicken.lives > 0 &&
        Math.random() < chicken.dropRate
      ) {
        const spawnPositions = chicken.drop();
        spawnPositions.forEach((pos) =>
          this.gameState.addEgg(new Egg(pos.x, pos.y)),
        );
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

        if (chicken instanceof BossChicken) {
          chicken.onHit();
        }

        if (chicken.lives <= 0) {
          chicken.deactivate();
          const spawnPositions = chicken.drop();
          this.audioManager.play("chickenDeath");
          this.gameState.addDeathEffect(
            new DeathEffect(
              chicken.x,
              chicken.y,
              chicken.width,
              chicken.height,
            ),
          );

          if (chicken instanceof BossChicken) {
            // Add boss score directly
            this.gameState.addScore(chicken.score);
            this.hudManager.updateScore(this.gameState);
          } else {
            this.gameState.addFriedChicken(
              new FriedChicken(
                spawnPositions[0].x,
                spawnPositions[0].y,
                chicken.score,
              ),
            );
          }
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
    // Skip check if we're already transitioning to a new wave
    if (this.isTransitioningWave) return;

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
      case 4:
        if (
          !this.gameState.hasPendingSpawns &&
          this.gameState.chickens.length === 0 &&
          this.gameState.friedChickens.length === 0
        ) {
          waveCompleted = true;
        }
        break;
      default:
        // Wave 5 or beyond - game complete
        this.handleGameComplete();
        return;
    }

    if (waveCompleted) {
      // Check if this is the last wave (wave 4)
      if (this.gameState.currentWave === 4) {
        this.handleGameComplete();
        return;
      }
      
      this.isTransitioningWave = true;
      this.gameState.incrementWaveNumber();
      this.showWaveIntroOverlay();
      // Delay wave creation until overlay animation is done
      setTimeout(() => {
        this.waveController.createWave(this.gameState);
        this.isTransitioningWave = false;
      }, 2400);
    }
  }

  showWaveIntroOverlay() {
    const waveNumber = this.gameState.currentWave;
    const waveConfig = WAVE_CONFIGS[waveNumber - 1];
    const waveTitle = waveConfig?.title || "WAVE " + waveNumber;

    const overlay = document.getElementById("waveIntroOverlay");
    const numberDisplay = document.getElementById("waveNumber");
    const titleDisplay = document.getElementById("waveTitle");

    if (!overlay || !numberDisplay || !titleDisplay) return;

    overlay.classList.remove("hidden");
    numberDisplay.textContent = `WAVE ${waveNumber}`;
    numberDisplay.classList.add("show");
    titleDisplay.classList.remove("show");
    titleDisplay.textContent = waveTitle;

    setTimeout(() => {
      numberDisplay.classList.remove("show");
      titleDisplay.classList.add("show");
    }, 1200);

    setTimeout(() => {
      overlay.classList.add("hidden");
      numberDisplay.classList.remove("show");
      titleDisplay.classList.remove("show");
    }, 2400);
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
    if (this.gameState.isPaused || this.gameState.isCountdownActive) return;

    this.gameState.pause();
    this.audioManager.pauseMusic();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    // Show pause overlay
    const pauseOverlay = document.getElementById("pauseMenuContainer");
    if (pauseOverlay) {
      pauseOverlay.classList.add("active");
    }
  }

  resume() {
    if (!this.gameState.isPaused) return;

    // Hide pause overlay
    const pauseOverlay = document.getElementById("pauseMenuContainer");
    if (pauseOverlay) {
      pauseOverlay.classList.remove("active");
    }

    this.gameState.resume();
    this.audioManager.resumeMusic();

    this.gameLoop();
  }

  restart() {
    window.location.reload();
  }

  exitToMenu() {
    window.location.href = "../index.html";
  }

  start() {
    this.showCountdown();
  }

  async showCountdown() {
    this.gameState.isCountdownActive = true;
    const countdown = new CountdownManager({
      countStart: 3,
      countDuration: 1000,
      finalMessage: "DEFEND EARTH!",
      finalMessageDuration: 1000,
    });

    await countdown.start();
    this.gameState.isCountdownActive = false;

    if (document.hidden && !this.gameState.isPaused) {
      this.pause();
      return;
    }

    // Show Wave 1 intro before starting game loop
    this.showWaveIntroOverlay();

    // Start game loop after intro delay
    setTimeout(() => {
      this.gameLoop();
    }, 2400);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Game();
});
