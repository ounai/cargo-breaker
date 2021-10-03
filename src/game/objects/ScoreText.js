import TextObject from '/src/engine/objects/Text';

export default class ScoreText extends TextObject {
  #score = null;

  constructor(scene) {
    super(scene, scene.screenCenter.x, scene.screenCenter.y / 2, '0 m', {
      fontSize: '16px'
    });

    this.setOrigin(.5);
    this.setScrollFactor(0);

    scene.add.existing(this);
  }

  get score() {
    return this.#score;
  }

  updateScore(newScore) {
    if (this.#score === null || newScore > this.#score) {
      console.log('new score', newScore);
      this.#score = newScore;

      this.setText(`${newScore} m`).setDepth(1);

      const newSize = 16 + Math.floor(newScore / 2);
      this.setStyle({ fontSize: `${newSize}px` });
    }
  }
}
