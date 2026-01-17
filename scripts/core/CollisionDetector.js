export class CollisionDetector {
  isOverlap(entityA, entityB) {
    const aBounds = entityA.getBounds();
    const bBounds = entityB.getBounds();

    return (
      aBounds.x + aBounds.width >= bBounds.x &&
      aBounds.x <= bBounds.x + bBounds.width &&
      aBounds.y + aBounds.height >= bBounds.y &&
      aBounds.y <= bBounds.y + bBounds.height
    );
  }

  checkBulletsVsChickens(bullets, chickens) {
    bullets.forEach((bullet) => {
      if (!bullet.isActive) return;

      chickens.forEach((chicken) => {
        if (!chicken.isAlive) return;

        if (this.isOverlap(bullet, chicken)) {
          bullet.isActive = false;
          chicken.isAlive = false;
        }
      });
    });
  }
}
