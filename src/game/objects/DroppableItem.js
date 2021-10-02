import MatterImage from '/src/engine/objects/MatterImage';
import MatterSprite from '/src/engine/objects/MatterSprite';

import GameObjectWrapper from '/src/engine/core/GameObjectWrapper';

export default class DroppableItem extends GameObjectWrapper {
  constructor(gameObject) {
    if (!(gameObject instanceof MatterImage) && !(gameObject instanceof MatterSprite)) {
      throw new Error(`new ${this.constructor.name}() called without valid game object!`);
    }

    super(gameObject);
  }
}

