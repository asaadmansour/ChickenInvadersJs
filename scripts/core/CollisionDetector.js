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
   * returns true if the player was hit by chicken or an egg
   */
  checkCollisions(gameState) {
    if (!gameState.isAlive()) return;
    const hitByChicken = this.checkPlayerVsChickens(
      gameState.player,
      gameState.chickens,
    );
    const hitByEgg = this.checkEggsVsPlayer(gameState.eggs, gameState.player);

    return hitByChicken || hitByEgg;
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
   * returns collisions
   */
  checkBulletsVsChickens(bullets, chickens) {
    const collisions = [];
    bullets.forEach((bullet) => {
      chickens.forEach((chicken) => {
        if (
          bullet.isActive &&
          chicken.isActive &&
          this.isOverlap(bullet, chicken)
        ) {
          collisions.push({ bullet, chicken });
        }
      });
    });
    return collisions;
  }

  /**
   * check collisions between player and chickens
   * hit the player if collision detected
   * mark chicken as inactive if collision detected
   * @param {*} player - player entity
   * @param {*} chickens - array of chicken entities
   * @returns true if the player was hit and false if not
   */
  checkPlayerVsChickens(player, chickens) {
    if (player.isInvulnerable()) return false;

    for (const chicken of chickens) {
      if (!chicken.isActive) continue;

      if (this.isOverlap(player, chicken)) {
        player.hit();
        return true;
      }
    }
    return false;
  }

  /**
   * check collisions between eggs and player
   * hit the player if collision detected
   * deactivate egg if collision detected
   * @param {*} eggs - array of egg entities
   * @param {*} player - player entity
   * @param {*} onCollision - callback function to handle collision
   */
  checkEggsVsPlayer(eggs, player) {
    if (player.isInvulnerable()) return false;

    for (const egg of eggs) {
      if (!egg.isActive) continue;

      if (this.isOverlap(egg, player)) {
        egg.deactivate();
        player.hit();
        return true;
      }
    }
    return false;
  }

  /**
   * check collisions between rocks and player
   * hit the player if collision detected
   * deactivate rock if collision detected
   * @param {*} player - player entity
   * @param {*} rocks - array of rock entities
   * @param {*} onCollision - callback function to handle collision
   */
  checkPlayerVsRocks(player, rocks, onCollision) {
    if (player.isInvulnerable()) return;

    for (const rock of rocks) {
      if (!rock.isActive) continue;

      if (this.isOverlap(rock, player)) {
        onCollision(rock);
        return;
      }
    }
  }

  /**
   * check collisions between friedchicken and player
   * @param {*} friedChickens - array of egg entities
   * @param {*} player - player entity
   * @returns collected friedchickens if the player was hit and false if not
   */
  checkFriedChickensVsPlayer(friedChickens, player) {
    const collected = [];
    for (const fc of friedChickens) {
      if (!fc.isActive) continue;
      if (this.isOverlap(fc, player)) {
        collected.push(fc);
      }
    }
    return collected;
  }
}
