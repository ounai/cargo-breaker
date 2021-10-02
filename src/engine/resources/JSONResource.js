import Resource from '/src/engine/core/Resource';

export default class JSONResource extends Resource {
  path = null;

  constructor(path) {
    super();

    this.path = path;
  }

  load(phaserScene) {
    phaserScene.load.json(this.key, this.path);

    return this;
  }
}

