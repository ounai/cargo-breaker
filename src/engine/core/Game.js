class Game extends Phaser.Game {
  constructor(config) {
    super({
      type: Phaser.AUTO,
      ...config
    });
  }
}

export default Game;

