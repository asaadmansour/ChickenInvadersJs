import { GameConfig } from "../config/Config.js";

export class Chicken {
  static time = 0;

  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.isAlive = true;
    this.score = 100;
    this.speed = speed || 1;
    this.direction = 1;
    this.health = 1;
    this.horizontalRange = 100;
    this.verticalRange = 15;
  }
  get width() {
    return GameConfig.getChickenWidth();
  }
  get height() {
    return GameConfig.getChickenHeight();
  }
  takeDamage() {
    this.health--;
    if (this.health <= 0) {
      this.isAlive = false;
    }
  }
  dropEgg() {
    return new Egg(this.x, this.y);
  }
  static updateTime() {
    Chicken.time += 0.02;
  }
  move() {
    this.x = this.startX + Math.sin(Chicken.time) * this.horizontalRange;
    this.y = this.startY + Math.sin(Chicken.time * 2) * this.verticalRange;
  }
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
