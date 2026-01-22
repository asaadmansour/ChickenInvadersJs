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
   * Check collisions between two lists of entities
   * @param {Array} groupA
   * @param {Array} groupB
   * @param {Function} onCollision - callback function to handle collision
   */
  checkGroupVsGroup(groupA, groupB, onCollision) {
    groupA.forEach((itemA) => {
      if (!itemA.isActive) return;

      groupB.forEach((itemB) => {
        if (!itemB.isActive) return;

        if (this.isOverlap(itemA, itemB)) {
          onCollision(itemA, itemB);
        }
      });
    });
  }

  /**
   * Check collisions between a list and a single entity
   * @param {Array} group
   * @param {Object} item
   * @param {Function} onCollision - (callback function to handle collision
   */
  checkGroupVsItem(group, item, onCollision) {
    for (const entity of group) {
      if (!entity.isActive) continue;

      if (this.isOverlap(entity, item)) {
        onCollision(entity);
        return;
      }
    }
  }
}
