export const ENTITY_RATIOS = {
  CHICKEN_WIDTH: 0.06,
  CHICKEN_HEIGHT: 0.09,
  PLAYER_WIDTH: 0.06,
  PLAYER_HEIGHT: 0.06,
  EGG_WIDTH: 0.012,
  EGG_HEIGHT: 0.025,
  FRIED_CHICKEN_WIDTH: 0.012,
  FRIED_CHICKEN_HEIGHT: 0.025,
  BULLET_WIDTH: 0.005,
  BULLET_HEIGHT: 0.03,
  ROCK_WIDTH: 0.05,
  ROCK_HEIGHT: 0.08,
  UMBRELLA_CHICKEN_WIDTH: 0.07,
  UMBRELLA_CHICKEN_HEIGHT: 0.1,
};

export const PLAYER = {
  MOVE_SPEED: 5,
  FIRE_RATE: 500,
  INVULNERABILITY_DURATION: 2000,
  BLINK_INTERVAL: 100,
  INITIAL_LIVES: 3,
  IMAGE: "/assets/images/player.png",
  AUDIO: "/assets/audio/Hit.wav",
};

export const BULLET = {
  MOVE_SPEED: 10,
  IMAGE: "/assets/images/bullet.png",
  AUDIO: "/assets/audio/Laser.mp3",
};

export const EGG = {
  MOVE_SPEED: 3,
  IMAGE: "/assets/images/Egg.webp",
};

export const ROCK = {
  MOVE_SPEED: 6,
  IMAGE: "/assets/images/rock.webp",
};

export const CHICKEN = {
  HORIZONTAL_RANGE: 100,
  VERTICAL_RANGE: 15,
  FRAME_COUNT: 4,
  FRAME_DELAY: 15,
  COLS: 2,
  ROWS: 2,
  TIME_INCREMENT: 0.02,
  MOVE_SPEED: 1,
  IMAGE: "/assets/images/chicken_spritesheet.png",
  SCORE: 100,
};

export const FRIED_CHICKEN = {
  MOVE_SPEED: 3,
  IMAGE: "/assets/images/fried-chicken.png",
};

export const UMBRELLA_CHICKEN = {
  MOVE_SPEED: 4,
  IMAGE: "/assets/images/chicken_umbrellas_spritesheet.png",
  SCORE: 150,
};

export const GAME = {
  AUDIO: "/assets/audio/Game Audio.wav",
};
export const LIVE = {
  IMAGE: "/assets/images/lives.webp",
};
