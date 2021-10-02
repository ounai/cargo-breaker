import Phaser from '/src/lib/phaser';

import Vector2 from '/src/engine/math/Vector2';

export default class MatterImage extends Phaser.Physics.Matter.Image {
  horizontalMovement(from, to, duration) {
    const startX = this.x;

    this.scene.tweens.addCounter({
      from, to, duration,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween, target) => {
        const x = startX + target.value;

        this.x = x;
        this.setVelocityX(x - this.x);
      }
    });

    return this;
  }

  get velocity() {
    return new Vector2(this.body.velocity.x, this.body.velocity.y);
  }
}

