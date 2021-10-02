import Phaser from '/src/lib/phaser';

import Vector2 from '/src/engine/math/Vector2';

export default class MatterImage extends Phaser.Physics.Matter.Image {
  get velocity() {
    return new Vector2(this.body.velocity.x, this.body.velocity.y);
  }
}

