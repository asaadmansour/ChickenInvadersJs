import {
  GAME,
  BULLET,
  PLAYER,
  CHICKEN_DEATH_AUDIO,
  FRIED_CHICKEN_CRUNCH_AUDIO,
} from "../config/Constants.js";
export class AudioManager {
  static #instance = null;
  constructor() {
    if (AudioManager.#instance) {
      throw new Error("Use AudioManager.getInstance() instead of new");
    }
    this.sounds = {
      game: new Audio(GAME.AUDIO),
      bullet: new Audio(BULLET.AUDIO),
      hit: new Audio(PLAYER.AUDIO),
      chickenDeath: new Audio(CHICKEN_DEATH_AUDIO.AUDIO),
      crunch: new Audio(FRIED_CHICKEN_CRUNCH_AUDIO.AUDIO),
    };
    this.sounds.game.loop = true;
    this.sounds.game.volume = 0.7;
  }

  // Singleton access method
  static getInstance() {
    if (!AudioManager.#instance) AudioManager.#instance = new AudioManager();
    return AudioManager.#instance;
  }

  // For sound effects (bullet, hit) - restarts each time
  play(soundName) {
    const audio = this.sounds[soundName];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }

  // For background music - only starts if paused, doesn't restart
  playMusic() {
    const music = this.sounds.game;
    if (music.paused) {
      music.play().catch(() => {});
    }
  }

  // Pause background music
  pauseMusic() {
    this.sounds.game.pause();
  }
}
