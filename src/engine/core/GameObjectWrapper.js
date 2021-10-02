export default class GameObjectWrapper {
  #gameObject = null;

  #setupNamespace(gameObject) {
    for (const symbol in gameObject) {
      if (gameObject[symbol]) {
        if (typeof gameObject[symbol] === 'function') {
          this[symbol] = gameObject[symbol].bind(gameObject);
        } else {
          this[symbol] = gameObject[symbol];
        }
      }
    }
  }

  constructor(gameObject, addToScene = true) {
    if (addToScene) gameObject.scene.add.existing(gameObject);

    this.#setupNamespace(gameObject);

    this.#gameObject = gameObject;
  }

  get gameObject() {
    return this.#gameObject;
  }
}

