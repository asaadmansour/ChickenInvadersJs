import { GameConfig } from "../config/Config.js";

class Egg {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.isActive = true;
  }
  get width() {
    return GameConfig.getEggWidth();
  }
  get height() {
    return GameConfig.getEggHeight();
  }
  move(canvasHeight) {
    this.y += this.speed;
      if(this.y > canvasHeight)
        this.isActive = false;
  }
}
