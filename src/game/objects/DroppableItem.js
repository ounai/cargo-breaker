import MatterImage from '/src/engine/objects/MatterImage';

export default class DroppableItem extends MatterImage {
  get hasStopped() {
    return this.velocity.length < 0.1;
  }
}

