export class CollisionDetector {
  /**
   *  Check if two entities overlap (AABB collision detection)
   * @param {*} entityA - first entity
   * @param {*} entityB - second entity
   */
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

  /**
   * check collisions between bullets and chickens
   * mark both as inactive if collision detected
   * @param {*} bullets - array of bullet entities
   * @param {*} chickens - array of chicken entities
   * @param {*} onCollision - callback function to handle collision
   */
  checkBulletsVsChickens(bullets, chickens, onCollision) {
    bullets.forEach((bullet) => {
      if (!bullet.isActive) return;

      chickens.forEach((chicken) => {
        if (!chicken.isActive) return;

        if (this.isOverlap(bullet, chicken)) {
          onCollision(bullet, chicken);
        }
      });
    });
  }

  /**
   * check collisions between player and chickens
   * hit the player if collision detected
   * mark chicken as inactive if collision detected
   * @param {*} player - player entity
   * @param {*} chickens - array of chicken entities
   * @param {*} onCollision - callback function to handle collision
   */
  checkPlayerVsChickens(player, chickens, onCollision) {
    if (player.isInvulnerable()) return;

    for (const chicken of chickens) {
      if (!chicken.isActive) continue;

      if (this.isOverlap(player, chicken)) {
        onCollision(chicken);
        return;
      }
    }
  }

  /**
   * check collisions between eggs and player
   * hit the player if collision detected
   * deactivate egg if collision detected
   * @param {*} eggs - array of egg entities
   * @param {*} player - player entity
   * @param {*} onCollision - callback function to handle collision
   */
  checkEggsVsPlayer(eggs, player, onCollision) {
    if (player.isInvulnerable()) return;

    for (const egg of eggs) {
      if (!egg.isActive) continue;

      if (this.isOverlap(egg, player)) {
        onCollision(egg);
        return;
      }
    }
  }
}
