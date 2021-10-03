import Phaser from '/src/lib/phaser';

import MatterImage from '/src/engine/objects/MatterImage';

export default class DroppableItem extends MatterImage {
  #maxVelocities = 30;
  #stopVelocityTreshold = 1;
  #autoPositionVelocityTreshold = .1;
  #autoPositionFactor = 10000;
  #autoPositionDebug = false;

  #itemType;
  #lastVelocities = [];

  #autoPosition(center) {
    const posDiff = Math.abs(this.x - center);
    const velocity = this.velocity.x;
    const changeBy = posDiff / this.#autoPositionFactor;

    if (this.x < center && velocity < 0 && Math.abs(velocity) > this.#autoPositionVelocityTreshold) {
      // More velocity towards zero
      if (this.#autoPositionDebug) console.log('Moving to the right, diff', posDiff, 'velocity', velocity, 'changeBy', changeBy);

      this.setVelocityX(velocity + changeBy);
    } else if (this.x > center && velocity > 0 && Math.abs(velocity) > this.#autoPositionVelocityTreshold) {
      // Less velocity towards zero
      if (this.#autoPositionDebug) console.log('Moving to the left, diff', posDiff, 'velocity', velocity, 'changeBy', changeBy);

      this.setVelocityX(velocity - changeBy);
    }
  }

  constructor(itemType, ...rest) {
    super(...rest);

    console.log(`New ${itemType.name} (scale: ${itemType.scale}, density: ${itemType.density}, friction: ${itemType.friction}, frictionAir: ${itemType.frictionAir}, frictionStatic: ${itemType.frictionStatic}, bounce: ${itemType.bounce})`);

    const scale = (
      Array.isArray(itemType.scale)
        ? Phaser.Math.FloatBetween(itemType.scale[0], itemType.scale[1])
        : itemType.scale
    );

    this.setScale(scale, scale);
    this.setDensity(itemType.density);
    this.setBounce(itemType.bounce);

    this.setFriction(itemType.friction);
    this.setFrictionAir(itemType.frictionAir);
    this.setFrictionStatic(itemType.frictionStatic);

    console.log(`Done! (scale: ${this.body.scale.x === this.body.scale.y ? this.body.scale.x : JSON.stringify(this.body.scale)}, density: ${this.body.density}, mass: ${this.body.mass}, friction: ${this.body.friction}, frictionAir: ${this.body.frictionAir}, frictionStatic: ${this.body.frictionStatic}, bounce: ${this.body.restitution})`);

    this.#itemType = itemType;
  }

  get hasStopped() {
    return this.#lastVelocities.length === this.#maxVelocities && !this.#lastVelocities.find(v => v > this.#stopVelocityTreshold);
  }

  get itemType() {
    return this.#itemType;
  }

  onUpdate(boatCenter) {
    if (this.#lastVelocities.length >= this.#maxVelocities) this.#lastVelocities.shift();

    this.#lastVelocities.push(this.velocity.length);

    this.#autoPosition(boatCenter);
  }
}

