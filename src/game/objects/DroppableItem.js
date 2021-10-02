import MatterImage from '/src/engine/objects/MatterImage';
import MatterSprite from '/src/engine/objects/MatterSprite';

export default class DroppableItem {
  #gameObject = null;

  constructor(gameObject) {
    if (!(gameObject instanceof MatterImage) && !(gameObject instanceof MatterSprite)) {
      throw new Error(`new ${this.constructor.name}() called without valid game object!`);
    }

    console.log('Droppable item created!');
    console.log(gameObject);

    gameObject.scene.add.existing(gameObject);

    this.#gameObject = gameObject;
  }

  setScale(...args) { console.log(...args); return this.#gameObject.setScale(...args); }
}

