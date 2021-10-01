import Scene from '/src/engine/core/Scene';

export default class TestScene extends Scene {
  constructor() {
    super({
      physics: {
        default: 'matter',
        matter: {
          enableSleeping: true,
          gravity: {
            y: 0
          },
          debug: {
            showBody: true,
            showStaticBody: true
          }
        }
      }
    });
  }

  onCreate() {
    console.log('Game.onCreate()');
  }

  onUpdate() {}
}

