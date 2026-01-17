import { GameConfig } from "../config/Config.js";
export class Chicken {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.isAlive = true;
    this.score = 100;
    this.speed = speed;
    this.direction = 1;
    this.health = 1;
    this.movementRange = 20;
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
  move() {
    this.x += this.speed * this.direction;
    if (this.x > this.startX + this.movementRange) this.changeDirection();
    if (this.x < this.startX - this.movementRange) this.changeDirection();
  }
  changeDirection() {
    return (this.direction *= -1);
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
