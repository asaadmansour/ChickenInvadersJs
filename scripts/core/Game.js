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

// Firebase imports
import { db } from "../firebase/firebaseConfig.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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
    this.waveController.createWave(this.gameState);

    this.canvasManager.onResizeAction = () => {
      this.gameState.player.clampToBounds();
    };

    this.hudManager.printLives(this.gameState);
    this.start();
  }

  setupControls() {
    this.inputHandler.bindKey("ArrowLeft", () => {
      this.gameState.player.move({ left: true });
    });
    this.inputHandler.bindKey("ArrowRight", () => {
      this.gameState.player.move({ right: true });
    });
    this.inputHandler.bindKey("ArrowUp", () => {
      this.gameState.player.move({ up: true });
    });
    this.inputHandler.bindKey("ArrowDown", () => {
      this.gameState.player.move({ down: true });
    });
    this.inputHandler.bindKey("Space", () => {
      if (this.gameState.player.canShoot()) {
        const spawn = this.gameState.player.shoot();
        this.audioManager.play("bullet");
        this.gameState.addBullet(new Bullet(spawn.x, spawn.y));
      }
    });
    this.inputHandler.bindKey("Escape", () => {
      if (this.gameState.isPaused) this.resume();
      else this.pause();
    });
  }

  // Main game loop called every frame
  gameLoop() {
    // If the game is paused or over, do not continue the loop
    if (this.gameState.isPaused || this.gameState.status === "gameover") {
      return;
    }

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

  // Check all collisions between entities and handle their effects
  checkCollisions() {
    this.checkBulletsVsChickens();

    this.checkPlayerVsFriedChickens();

    if (this.gameState.player.isInvulnerable()) return;

    this.checkPlayerVsChickens();

    this.checkPlayerVsEggs();

    this.checkPlayerVsRocks();
  }

  /**
   * Check collisions between bullets and chickens
   * On collision, deactivate both and spawn fried chicken
   */
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
          import("./AudioManager.js").then(({ AudioManager }) => {
            AudioManager.getInstance().play("chickenDeath");
          });
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

  /**
   * Check collisions between player and fried chickens
   * On collision, deactivate fried chicken and increase score
   */
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

  /**
   * Check collisions between player and chickens
   * On collision, deactivate chicken and handle player hit
   */
  checkPlayerVsChickens() {
    this.collisionDetector.checkGroupVsItem(
      this.gameState.chickens,
      this.gameState.player,
      (chicken) => {
        chicken.deactivate();
        this.handlePlayerHit();
      },
    );
  }

  /**
   * Check collisions between player and eggs
   * On collision, deactivate egg and handle player hit
   */
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

  /**
   * Check collisions between player and rocks
   * On collision, deactivate rock and handle player hit
   */
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

  // Remove inactive entities caused by collisions or moving out of bounds
  removeInactiveEntities() {
    this.gameState.bullets = this.gameState.bullets.filter(
      (bullet) => bullet.isActive,
    );

    this.gameState.eggs = this.gameState.eggs.filter((egg) => egg.isActive);

    this.gameState.chickens = this.gameState.chickens.filter(
      (chicken) => chicken.isActive,
    );

    this.gameState.rocks = this.gameState.rocks.filter((rock) => rock.isActive);

    this.gameState.friedChickens = this.gameState.friedChickens.filter(
      (fc) => fc.isActive,
    );

    this.gameState.deathEffects = this.gameState.deathEffects.filter(
      (effect) => effect.isActive,
    );
  }

  /**
   * Check if the current wave is completed and advance to the next wave if so,
   * if all waves are completed, handle game completion.
   */
  checkAndAdvanceWave() {
    let waveCompleted = false;
    switch (this.gameState.currentWave) {
      case 1:
        if (
          this.gameState.chickens.length === 0 &&
          this.gameState.eggs.length === 0
        )
          waveCompleted = true;
        break;

      case 2:
        if (
          !this.gameState.hasPendingSpawns &&
          this.gameState.rocks.length === 0
        ) {
          waveCompleted = true;
        }
        break;

      case 3:
        if (
          !this.gameState.hasPendingSpawns &&
          this.gameState.chickens.length === 0 &&
          this.gameState.eggs.length === 0
        ) {
          waveCompleted = true;
        }
        break;

      default:
        this.handleGameComplete();
        break;
    }
    if (waveCompleted) {
      this.gameState.incrementWaveNumber();
      this.waveController.createWave(this.gameState);
    }
  }

  // handle player hit logic: play sound, lose life, check for game over
  handlePlayerHit() {
    const wasHit = this.gameState.player.hit();

    if (!wasHit) return;

    this.audioManager.play("hit");
    const isDead = this.gameState.loseLife();
    this.hudManager.printLives(this.gameState);

    if (isDead) this.handleGameOver();
  }

  // --- Firebase Saving Logic ---
  async saveScoreToFirebase() {
    let playerName = prompt(
      "Game Over! Enter your name for the leaderboard:",
      "Hero",
    );

    // Handle cancel or empty name
    if (playerName === null || playerName.trim() === "") {
      playerName = "Anonymous";
    }

    try {
      await addDoc(collection(db, "scores"), {
        name: playerName,
        score: this.gameState.score,
        createdAt: serverTimestamp(),
      });
      console.log("Score saved to Firebase successfully!");
    } catch (error) {
      console.error("Firebase Error:", error);
    }
  }

  /**
   * TEAM NOTE: Updated handleGameOver to prevent the loop from re-triggering the prompt.
   * 1. Check if already in gameover state.
   * 2. Cancel the animation frame immediately.
   */
  async handleGameOver() {
    // PREVENT LOOP: If we are already handling gameover, exit.
    if (this.gameState.status === "gameover") return;

    this.gameState.status = "gameover";

    localStorage.setItem("finalScore", this.gameState.score);

    // STOP ENGINE: Stop the game loop before showing the prompt
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Redirect to the Game Over screen
    window.location.href = "../pages/gameover.html";
  }

  // Same logic as handleGameOver but for successful completion
  async handleGameComplete() {
    if (this.gameState.status === "complete") return;

    this.gameState.status = "complete";

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // // Interaction with user and database
    await this.saveScoreToFirebase();

    // Redirect to the Scoreboard screen
    window.location.href = "./scoreboard.html";
  }

  pause() {
    if (!this.gameState.isPaused) {
      this.gameState.pause();
      this.audioManager.pauseMusic();
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }
  }

  resume() {
    if (this.gameState.isPaused) {
      this.gameState.resume();
      this.audioManager.resumeMusic();
      this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }
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

new Game();
