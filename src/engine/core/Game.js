class Game extends Phaser.Game {
  constructor(config, scenes) {
    super({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes,
      ...config
    });
  }
}

export default Game;

