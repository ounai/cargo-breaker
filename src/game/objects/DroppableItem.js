import MatterImage from '/src/engine/objects/MatterImage';
import MatterSprite from '/src/engine/objects/MatterSprite';

import GameObjectWrapper from '/src/engine/core/GameObjectWrapper';

export default class DroppableItem extends GameObjectWrapper {
  constructor(gameObject) {
    if (!(gameObject instanceof MatterImage) && !(gameObject instanceof MatterSprite)) {
      throw new Error(`Invalid game object type ${typeof gameObject}`);
    }

    super(gameObject);
  }

  get velocity() {
    return this.gameObject.velocity;
  }

  get hasStopped() {
    return this.velocity.length < 0.1;
  }

  get x() {
    if (this.gameObject && this.gameObject.body && this.gameObject.body.position) return this.gameObject.body.position.x;
    else return null;
  }

  get y() {
    if (this.gameObject && this.gameObject.body && this.gameObject.body.position) return this.gameObject.body.position.y;
    else return null;
  }
}

