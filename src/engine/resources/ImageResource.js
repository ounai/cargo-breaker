import Resource from '/src/engine/core/Resource';

export default class ImageResource extends Resource {
  path = null;

  constructor(path) {
    super();

    this.path = path;
  }

  load(phaserScene) {
    phaserScene.load.image(this.key, this.path);

    return this;
  }
}

