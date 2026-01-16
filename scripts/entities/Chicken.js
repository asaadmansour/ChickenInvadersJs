class Chicken {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.image = new Image();
    this.image.src = "../../assets/images/chicken.png";
    this.isAlive = true;
    this.score = 100;
    this.width = 40;
    this.height = 40;
    this.speed = speed;
    this.direction = 1;
    this.health = 1;
    this.movementRange = 20;
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
  draw(ctx) {
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
}
// add getbounds if we add collison in the future