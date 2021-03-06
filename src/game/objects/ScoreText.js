import TextObject from '/src/engine/objects/Text';

export default class ScoreText extends TextObject {
  #score = null;
  #fontSize = 16;

  constructor(scene, fontSize = 20) {
    super(scene, scene.screenCenter.x, scene.screenCenter.y / 8, '0.0 m', {
      font: 'Courier'
    });

    this.#fontSize = fontSize;

    this.setFontSize(fontSize);
    this.setOrigin(.5);
    this.setScrollFactor(0);
    this.setDepth(100);

    scene.add.existing(this);
  }

  get score() {
    return this.#score;
  }

  updateScore(newScore) {
    if (this.#score === null || newScore > this.#score) {
      const newSize = 16 + Math.floor(newScore / 2);
      const oldScore = this.#score ?? 0;

      this.scene.tweens.addCounter({
        from: this.#fontSize,
        to: newSize,
        duration: 250,
        yoyo: true,
        onUpdate: ({ totalProgress }, { value }) => {
          const progressValue = Math.floor((oldScore + totalProgress * (newScore - oldScore)) * 10) / 10;

          const fontSize = Math.floor(value);

          this.setFontSize(fontSize);
          this.setText(`${progressValue.toFixed(1)} m`);

          if (totalProgress >= 1) {
            this.setFontSize(newSize);

            this.#fontSize = newSize;
          }
        }
      });

      this.#score = newScore;
    }

    return this;
  }
}

