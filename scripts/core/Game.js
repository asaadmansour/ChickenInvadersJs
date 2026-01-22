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

// Firebase imports
import { db } from "../firebase/firebaseConfig.js"; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

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
        this.audioManager.play("bullet");
        this.gameState.addBullet(new Bullet(spawn.x, spawn.y));
      }
      this.startBackgroundAudio();
    });
    this.inputHandler.bindKey("Escape", () => {
      if (this.gameState.isPaused) this.resume();
      else this.pause();
    });
  }

  startBackgroundAudio() {
    this.audioManager.playMusic();
  }

  checkAllCollisions() {
    return this.collisionDetector.checkCollisions(this.gameState);
  }

  handlePlayerHit(wasHit) {
    if (wasHit) {
      this.audioManager.play("hit");
      const isDead = this.gameState.loseLife();
      this.hudManager.printLives(this.gameState);
      // TEAM NOTE: We only trigger handleGameOver if the player is dead
      if (isDead) this.handleGameOver();
    }
  }

  // --- Firebase Saving Logic ---
  async saveScoreToFirebase() {
    let playerName = prompt("Game Over! Enter your name for the leaderboard:", "Hero");
    
    // Handle cancel or empty name
    if (playerName === null || playerName.trim() === "") {
        playerName = "Anonymous";
    }

    try {
      await addDoc(collection(db, "scores"), {
        name: playerName,
        score: this.gameState.score,
        createdAt: serverTimestamp() 
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

    // Interaction with user and database
    await this.saveScoreToFirebase();
    
    // Redirect to the Game Over screen
    window.location.href = "../pages/gameover.html";
  }

  gameLoop() {
    // If the game is paused or over, do not continue the loop
    if (this.gameState.isPaused || this.gameState.status === "gameover") {
      return;
    }

    this.inputHandler.processInput();
    this.gameState.updateTime();
    this.updateEntitiesPositions();
    this.attemptSpawnEggs();
    this.handleBulletChickenCollisions(this.bulletChickenCollisions());
    this.handlePlayerHit(this.checkAllCollisions());
    this.handleFriedChickenCollection(this.friedChickenCollection());
    this.removeInactiveEntities();
    this.checkAndAdvanceWave();

    this.canvasManager.render(this.gameState);
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }

  // Same logic as handleGameOver but for successful completion
  async handleWaveComplete() {
    if (this.gameState.status === "complete") return;
    this.gameState.status = "complete";
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    await this.saveScoreToFirebase();
    window.location.href = "./scoreboard.html";
  }

  // Helper methods
  handleBulletChickenCollisions(collisions) {
    collisions.forEach(({ bullet, chicken }) => {
      bullet.deactivate();
      chicken.deactivate();
      this.gameState.addFriedChicken(new FriedChicken(chicken.x, chicken.y, chicken.score));
    });
  }

  bulletChickenCollisions() {
    return this.collisionDetector.checkBulletsVsChickens(this.gameState.bullets, this.gameState.chickens);
  }

  handleFriedChickenCollection(collected) {
    collected.forEach((fc) => {
      fc.deactivate();
      this.gameState.addScore(fc.score);
    });
    this.hudManager.updateScore(this.gameState);
  }

  friedChickenCollection() {
    return this.collisionDetector.checkFriedChickensVsPlayer(this.gameState.friedChickens, this.gameState.player);
  }

  updateEntitiesPositions() {
    this.gameState.bullets.forEach((bullet) => bullet.move());
    this.gameState.eggs.forEach((egg) => egg.move());
    this.gameState.chickens.forEach((chicken) => chicken.move(this.gameState.gameTime));
    this.gameState.rocks.forEach((rock) => rock.move());
    this.gameState.friedChickens.forEach((fc) => fc.move());
  }

  attemptSpawnEggs() {
    this.gameState.chickens.forEach((chicken) => {
      if (chicken.isActive && Math.random() < WAVE_CONFIGS[this.gameState.currentWave - 1].eggsDropRate) {
        const spawn = chicken.drop();
        this.gameState.addEgg(new Egg(spawn.x, spawn.y));
      }
    });
  }

  removeInactiveEntities() {
    this.gameState.bullets = this.gameState.bullets.filter((b) => b.isActive);
    this.gameState.eggs = this.gameState.eggs.filter((e) => e.isActive);
    this.gameState.chickens = this.gameState.chickens.filter((c) => c.isActive);
    this.gameState.rocks = this.gameState.rocks.filter((r) => r.isActive);
    this.gameState.friedChickens = this.gameState.friedChickens.filter((fc) => fc.isActive);
  }

  checkAndAdvanceWave() {
    let waveCompleted = false;
    switch (this.gameState.currentWave) {
      case 1:
        if (this.gameState.chickens.length === 0 && this.gameState.eggs.length === 0) waveCompleted = true;
        break;
      case 2:
        if (this.gameState.rocks.length === 0) waveCompleted = true;
        break;
      case 3:
        this.handleWaveComplete();
        break;
    }
    if (waveCompleted) {
      this.gameState.incrementWaveNumber();
      this.waveController.createWave(this.gameState);
    }
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
    this.gameLoop();
  }
}

new Game();