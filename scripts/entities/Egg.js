class Egg {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "../../assets/images/egg.png";
    this.speed = 3;
    this.width = 16;
    this.isActive = true;
    this.height = 24;
  }
  move(canvasHeight) {
    this.y += this.speed;
      if(this.y > canvasHeight)
        this.isActive = false;
  }
  draw(ctx) {
    ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
  }
}
