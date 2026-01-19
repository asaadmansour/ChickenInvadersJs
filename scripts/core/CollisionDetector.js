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
   * Check all collisions between entities
   * @param {*} gameState - the current game state object
   */
  checkCollisions(gameState) {
    this.checkBulletsVsChickens(gameState.bullets, gameState.chickens);
    this.checkPlayerVsChickens(gameState.player, gameState.chickens);
    this.checkEggsVsPlayer(gameState.eggs, gameState.player);
  }

  /**
   * check collisions between bullets and chickens
   * mark both as inactive if collision detected
   * @param {*} bullets - array of bullet entities
   * @param {*} chickens - array of chicken entities
   */
  checkBulletsVsChickens(bullets, chickens) {
    bullets.forEach((bullet) => {
      if (!bullet.isActive) return;

      chickens.forEach((chicken) => {
        if (!chicken.isActive) return;

        if (this.isOverlap(bullet, chicken)) {
          bullet.deactivate();
          chicken.deactivate();
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
   * @returns
   */
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

  /**
   * check collisions between eggs and player
   * hit the player if collision detected
   * deactivate egg if collision detected
   * @param {*} eggs - array of egg entities
   * @param {*} player - player entity
   * @returns
   */
  checkEggsVsPlayer(eggs, player) {
    if (!player.isAlive()) return;
    if (player.isInvulnerable && player.isInvulnerable()) return;

    for (const egg of eggs) {
      if (!egg.isActive) continue;

      if (this.isOverlap(egg, player)) {
        egg.deactivate();
        player.hit();
        break;
      }
    }
  }
}
