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
        if (!chicken.isActive) return;

        if (this.isOverlap(bullet, chicken)) {
          bullet.isActive = false;
          chicken.isActive = false;
        }
      });
    });
  }

  checkPlayerVsChickens(player, chickens) {
    if (!player.isAlive()) return;
    if (player.isInvulnerable && player.isInvulnerable()) return;

    for (const chicken of chickens) {
      if (!chicken.isActive) continue;

      if (this.isOverlap(player, chicken)) {
        player.hit();
        break;
      }
    }
  }

  checkEggsVsPlayer(eggs, player) {
    if (!player.isAlive()) return;
    if (player.isInvulnerable && player.isInvulnerable()) return;

    for (const egg of eggs) {
      if (!egg.isActive) continue;

      if (this.isOverlap(egg, player)) {
        egg.isActive = false;
        player.hit();
        break;
      }
    }
  }
}
