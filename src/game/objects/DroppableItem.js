import MatterImage from '/src/engine/objects/MatterImage';

export default class DroppableItem extends MatterImage {
  #itemType;

  constructor(itemType, ...rest) {
    super(...rest);

    console.log(`New ${itemType.name} (scale: ${itemType.scale}, density: ${itemType.density}, friction: ${itemType.friction}, frictionAir: ${itemType.frictionAir}, frictionStatic: ${itemType.frictionStatic})`);

    this.setScale(itemType.scale, itemType.scale);
    this.setDensity(itemType.density);
    this.setFriction(itemType.friction, itemType.frictionAir, itemType.fictionStatic);

    this.#itemType = itemType;
  }

  get hasStopped() {
    return this.velocity.length < 0.1;
  }

  get itemType() {
    return this.#itemType;
  }
}

