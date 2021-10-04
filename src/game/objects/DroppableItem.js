import Phaser from '/src/lib/phaser';

import config from '/src/config';

import { debug as logDebug } from '/src/engine/services/log';

import MatterImage from '/src/engine/objects/MatterImage';
import Vector2 from '/src/engine/math/Vector2';

export default class DroppableItem extends MatterImage {
  #maxVelocities = null;
  #stopVelocityTreshold = null;
  #stopRotationTreshold = null;
  #autoPositionVelocityTreshold = null;
  #autoPositionFactor = null;

  #autoPositionDebug = false;
  #physicsDebug = false;

  #itemType;
  #lastVelocities = [];
  #lastRotations = [];

  demolish = false;

  #autoPosition(center) {
    const posDiff = Math.abs(this.x - center);
    const velocity = this.velocity.x;
    const changeBy = posDiff / this.#autoPositionFactor;

    if (this.x < center && velocity < 0 && Math.abs(velocity) > this.#autoPositionVelocityTreshold) {
      // More velocity towards zero
      if (this.#autoPositionDebug) this.debug('Moving to the right, diff', posDiff, 'velocity', velocity, 'changeBy', changeBy);

      //this.setVelocityX(velocity + changeBy);
      this.applyForce(new Vector2(changeBy, 0));
    } else if (this.x > center && velocity > 0 && Math.abs(velocity) > this.#autoPositionVelocityTreshold) {
      // Less velocity towards zero
      if (this.#autoPositionDebug) this.debug('Moving to the left, diff', posDiff, 'velocity', velocity, 'changeBy', changeBy);

      //this.setVelocityX(velocity - changeBy);
      this.applyForce(new Vector2(-changeBy, 0));
    }
  }

  constructor(itemType, ...rest) {
    super(...rest);

    if (this.#physicsDebug) this.debug(`New ${itemType.name} (scale: ${JSON.stringify(itemType.scale)}, density: ${itemType.density}, mass: ${itemType.mass}, friction: ${itemType.friction}, frictionAir: ${itemType.frictionAir}, frictionStatic: ${itemType.frictionStatic}, bounce: ${itemType.bounce})`);

    const scale = (
      Array.isArray(itemType.scale)
        ? Phaser.Math.FloatBetween(itemType.scale[0], itemType.scale[1])
        : itemType.scale
    );

    this.setScale(scale, scale);
    this.setBounce(itemType.bounce);

    //this.setDensity(itemType.density);
    this.setMass(itemType.mass);

    this.setFriction(itemType.friction);
    this.setFrictionAir(itemType.frictionAir);
    this.setFrictionStatic(itemType.frictionStatic);

    this.#maxVelocities = config.droppableItems.maxVelocities[itemType.name] ?? config.droppableItems.maxVelocities.default;
    this.#stopVelocityTreshold = config.droppableItems.stopVelocityTreshold[itemType.name] ?? config.droppableItems.stopVelocityTreshold.default;
    this.#stopRotationTreshold = config.droppableItems.stopRotationTreshold[itemType.name] ?? config.droppableItems.stopRotationTreshold.default;
    this.#autoPositionVelocityTreshold = config.droppableItems.autoPositionVelocityTreshold[itemType.name] ?? config.droppableItems.autoPositionVelocityTreshold.default;
    this.#autoPositionFactor = config.droppableItems.autoPositionFactor[itemType.name] ?? config.droppableItems.autoPositionFactor.default;
    this.#autoPositionDebug = config.droppableItems.autoPositionDebug[itemType.name] ?? config.droppableItems.autoPositionDebug.default;
    this.#physicsDebug = config.droppableItems.physicsDebug[itemType.name] ?? config.droppableItems.physicsDebug.default;

    if (this.#physicsDebug) this.debug(`Done! (scale: ${this.body.scale.x === this.body.scale.y ? this.body.scale.x : JSON.stringify(this.body.scale)}, density: ${this.body.density}, mass: ${this.body.mass}, friction: ${this.body.friction}, frictionAir: ${this.body.frictionAir}, frictionStatic: ${this.body.frictionStatic}, bounce: ${this.body.restitution})`);

    this.#itemType = itemType;
  }

  get hasStopped() {
    for (let i = 0; i < this.#lastRotations.length - 1; i++) {
      if (Math.abs(this.#lastRotations[i] - this.#lastRotations[i + 1]) > this.#stopRotationTreshold) {
        return false;
      }
    }

    return (this.#lastVelocities.length === this.#maxVelocities && !this.#lastVelocities.find(v => v > this.#stopVelocityTreshold));
  }

  get itemType() {
    return this.#itemType;
  }

  debug(...args) {
    logDebug(`[${this.constructor.name}]`, ...args);
  }

  onUpdate(boatCenter) {
    if (!this.demolish) {
      if (this.#lastRotations.length >= this.#maxVelocities) this.#lastRotations.shift();
      if (this.#lastVelocities.length >= this.#maxVelocities) this.#lastVelocities.shift();

      this.#lastRotations.push(this.rotation);
      this.#lastVelocities.push(this.velocity.length);

      this.#autoPosition(boatCenter);
    }

    return this;
  }

  onStop(callback) {
    const timeoutFunction = () => {
      if (this.hasStopped) callback(false);
      else if (this.scene) setTimeout(timeoutFunction.bind(this), 100);
      else callback(true);
    };

    setTimeout(timeoutFunction.bind(this), 100);

    return this;
  }
}

