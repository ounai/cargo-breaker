import Phaser from '/src/lib/phaser';

export default class Vector2 extends Phaser.Math.Vector2 {
  get length() {
    console.log('math', Phaser.Math);
    return Phaser.Math.Distance.Between(0, 0, this.x, this.y);
  }
}

