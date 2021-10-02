import MatterImage from '/src/engine/objects/MatterImage';

export default class DroppableItem extends MatterImage {
  #itemType;

  constructor(itemType, ...rest) {
    super(...rest);

    console.log(`New ${itemType.name} (scale: ${itemType.scale}, density: ${itemType.density}, friction: ${itemType.friction}, frictionAir: ${itemType.frictionAir}, frictionStatic: ${itemType.frictionStatic}, bounce: ${itemType.bounce})`);

    this.setScale(itemType.scale, itemType.scale);
    this.setDensity(itemType.density);
    this.setBounce(itemType.bounce);

    this.setFriction(itemType.friction);
    this.setFrictionAir(itemType.frictionAir);
    this.setFrictionStatic(itemType.frictionStatic);

    console.log(`Done! (scale: ${this.body.scale.x === this.body.scale.y ? this.body.scale.x : JSON.stringify(this.body.scale)}, density: ${this.body.density}, friction: ${this.body.friction}, frictionAir: ${this.body.frictionAir}, frictionStatic: ${this.body.frictionStatic}, bounce: ${this.body.restitution})`);

    this.#itemType = itemType;
  }

  get hasStopped() {
    return this.velocity.length < 0.1;
  }

  get itemType() {
    return this.#itemType;
  }
}

