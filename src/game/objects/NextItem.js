import Phaser from '/src/lib/phaser';

import DroppableItem from '/src/game/objects/DroppableItem';

export default class NextItem {
  itemType = null;
  scale = 1;

  constructor(itemType) {
    this.itemType = itemType;

    this.scale = (
      Array.isArray(itemType.scale)
        ? Phaser.Math.FloatBetween(itemType.scale[0], itemType.scale[1])
        : itemType.scale
    );

    console.log('NextItem', this);
  }

  createItem(scene, x, y, opt) {
    return new DroppableItem(this.itemType, this.scale, scene.matter.world, x, y, this.itemType.res, 0, opt);
  }
}

