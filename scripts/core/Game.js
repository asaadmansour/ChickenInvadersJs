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

export class Game {
  constructor() {
    this.audioManager = AudioManager.getInstance();
    this.canvasManager = CanvasManager.getInstance();
    this.inputHandler = new InputHandler();
    this.collisionDetector = new CollisionDetector();
    this.gameState = GameState.getInstance();
    this.hudManager = new HUDManager();
    this.waveController = new WaveController();

    this.setupControls();

    this.waveController.createWave(this.gameState);

    this.canvasManager.onResizeAction = () => {
      this.gameState.player.clampToBounds();
    };
    this.hudManager.printLives(this.gameState);
    this.start();

    // this.startBackgroundAudio(); browser blocks autoplay audio on refersh
  }

  // Setup keyboard controls for player movement and shooting
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
  }

  // Start background music playback
  startBackgroundAudio() {
    this.audioManager.playMusic();
  }

  // check if the player was hit and returns true if so
  checkAllCollisions() {
    return this.collisionDetector.checkCollisions(this.gameState);
  }

  // check if the player should still be alive after the hit or no
  handlePlayerHit(wasHit) {
    if (wasHit) {
      const isDead = this.gameState.loseLife();
      this.hudManager.printLives(this.gameState);
      if (isDead) this.handleGameOver();
    }
  }

  // Handle bullet-chicken collisions: deactivate both and spawn fried chicken
  handleBulletChickenCollisions(collisions) {
    collisions.forEach(({ bullet, chicken }) => {
      bullet.deactivate();
      chicken.deactivate();
      this.gameState.addFriedChicken(
        new FriedChicken(chicken.x, chicken.y, chicken.score),
      );
    });
  }

  // Check and return bullet-chicken collisions
  bulletChickenCollisions() {
    return this.collisionDetector.checkBulletsVsChickens(
      this.gameState.bullets,
      this.gameState.chickens,
    );
  }

  // Handle fried chicken collection: deactivate and add score
  handleFriedChickenCollection(collected) {
    collected.forEach((fc) => {
      fc.deactivate();
      this.gameState.addScore(fc.score);
    });
    this.hudManager.updateScore(this.gameState);
  }

  // Check and return fried chicken-player collisions
  friedChickenCollection() {
    return this.collisionDetector.checkFriedChickensVsPlayer(
      this.gameState.friedChickens,
      this.gameState.player,
    );
  }

  handleGameOver() {
    this.gameState.status = "gameover";
    window.location.href = "/pages/gameover.html";
  }

  // Main game loop called every frame
  gameLoop() {
    this.inputHandler.processInput();
    this.gameState.updateTime();
    this.updateEntitiesPositions();
    this.attemptSpawnEggs();
    this.handleBulletChickenCollisions(this.bulletChickenCollisions());
    this.handlePlayerHit(this.checkAllCollisions());
    this.handleFriedChickenCollection(this.friedChickenCollection());
    this.removeInactiveEntities();
    this.checkAndAdvanceWave();
    // this.checkAllCollisions2();

    this.canvasManager.render(this.gameState);
    requestAnimationFrame(() => this.gameLoop());
  }

  // simple redirection if the wave is complete "will change when we add more waves"
  handleWaveComplete() {
    this.gameState.status = "complete";
    window.location.href = "/pages/scoreboard.html";
  }

  // Update positions of all entities based on their velocities and movement types
  updateEntitiesPositions() {
    this.gameState.bullets.forEach((bullet) => bullet.move());

    this.gameState.eggs.forEach((egg) => egg.move());

    this.gameState.chickens.forEach((chicken) =>
      chicken.move(this.gameState.gameTime),
    );

    this.gameState.rocks.forEach((rock) => rock.move());

    this.gameState.friedChickens.forEach((fc) => fc.move());
  }

  // Attempt to spawn eggs from active chickens based on the current wave's drop rate
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

  // // Check all collisions between entities and handle their effects
  // checkAllCollisions2() {
  //   this.collisionDetector.checkBulletsVsChickens(
  //     this.gameState.bullets,
  //     this.gameState.chickens,
  //     (bullet, chicken) => {
  //       bullet.deactivate();
  //       chicken.deactivate();
  //       this.gameState.addScore(20);
  //     },
  //   );

  //   this.collisionDetector.checkPlayerVsChickens(
  //     this.gameState.player,
  //     this.gameState.chickens,
  //     (chicken) => {
  //       chicken.deactivate();
  //       this.handlePlayerHit();
  //     },
  //   );

  //   this.collisionDetector.checkEggsVsPlayer(
  //     this.gameState.eggs,
  //     this.gameState.player,
  //     (egg) => {
  //       egg.deactivate();
  //       this.handlePlayerHit();
  //     },
  //   );

  //   this.collisionDetector.checkPlayerVsRocks(
  //     this.gameState.player,
  //     this.gameState.rocks,
  //     (rock) => {
  //       rock.deactivate();
  //       this.handlePlayerHit();
  //     },
  //   );
  // }

  // check if the player should still be alive after the hit or no
  handlePlayerHit() {
    const wasHit = this.gameState.player.hit();
    if (!wasHit) return;
    this.audioManager.play("hit");
    const isDead = this.gameState.loseLife();
    if (isDead) this.handleGameOver();
  }

  // Handle game over state and redirect to game over screen
  handleGameOver() {
    this.gameState.status = "gameover";
    window.location.href = "/pages/gameover.html";
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
  }

  checkAndAdvanceWave() {
    let waveCompleted = false;

    switch (this.gameState.currentWave) {
      case 1:
        if (
          this.gameState.chickens.length === 0 &&
          this.gameState.eggs.length === 0
        ) {
          waveCompleted = true;
        }
        break;
      case 2:
        if (this.gameState.rocks.length === 0) {
          waveCompleted = true;
        }
        break;
      case 3:
        this.handleGameOver();
        break;
    }

    if (waveCompleted) {
      this.gameState.incrementWaveNumber();
      this.waveController.createWave(this.gameState);
    }
  }

  start() {
    this.gameLoop();
  }
}

new Game();
