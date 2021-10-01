import Resource from '/src/engine/core/Resource';

export default class SpriteSheetResource extends Resource {
  path = null;
  config = null;

  constructor(path, config = {}) {
    super();

    this.path = path;
    this.config = config;
  }

  load(phaserScene) {
    phaserScene.load.spritesheet(this.key, this.path, this.config);
  }
}

