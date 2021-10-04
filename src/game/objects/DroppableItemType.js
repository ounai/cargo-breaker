import config from '/src/config.js';

import { debug } from '/src/engine/services/log';

import ImageResource from '/src/engine/resources/ImageResource';

const droppableItemTypes = [];

export default class DroppableItemType {
  static SHIPPING_CONTAINER = new DroppableItemType('SHIPPING_CONTAINER', '/assets/items/shipping-container.png');
  static SAFE = new DroppableItemType('SAFE', '/assets/items/safe.png');
  static WOODEN_CRATE = new DroppableItemType('WOODEN_CRATE', '/assets/items/wooden-crate.png');
  static CARDBOARD_BOX = new DroppableItemType('CARDBOARD_BOX', '/assets/items/cardboard-box.png');
  static GRASS_BLOCK = new DroppableItemType('GRASS_BLOCK', '/assets/items/grass-block.png');
  static ROTARY_PHONE = new DroppableItemType('ROTARY_PHONE', '/assets/items/rotary-phone.png');
  static GIFT_BOX = new DroppableItemType('GIFT_BOX', '/assets/items/gift-box.png');
  static CRT_SCREEN = new DroppableItemType('CRT_SCREEN', '/assets/items/crt-screen.png');
  static WASHING_MACHINE = new DroppableItemType('WASHING_MACHINE', '/assets/items/washing-machine.png');
  static WIDE_PAINTING = new DroppableItemType('WIDE_PAINTING', '/assets/items/wide-painting.png');
  static WIDE_PLANK = new DroppableItemType('WIDE_PLANK', '/assets/items/wide-plank.png');
  static MUIKKU = new DroppableItemType('MUIKKU', '/assets/items/Muikku1.png');
  static FELIX = new DroppableItemType('FELIX', '/assets/items/Felix1.png');
  static TRIANGLE = new DroppableItemType('TRIANGLE', '/assets/items/Kolmio_Hagrid.png');
  static GRAMOPHONE = new DroppableItemType('GRAMOPHONE', '/assets/items/Grafomoni.png');
  static LONG_CONTAINER = new DroppableItemType('LONG_CONTAINER', '/assets/items/Long_Container.png');
  static BOMB = new DroppableItemType('BOMB', '/assets/items/Pommi.png');
  static BOTTLE = new DroppableItemType('BOTTLE', '/assets/items/Pullo.png');
  static BRIEFCASE = new DroppableItemType('BRIEFCASE', '/assets/items/Salkku.png');
  static AKIMBO_CONTAINER = new DroppableItemType('AKIMBO_CONTAINER', '/assets/items/Weird_ass_container.png');

  #name;
  #assetPath;

  #scale;
  #density;
  #mass;
  #bounce;

  #friction;
  #frictionAir;
  #frictionStatic;

  #minHeight;
  #maxHeight;

  #resource = null;

  constructor(name, assetPath) {
    if (typeof name !== 'string' || name.length === 0) {
      throw new Error(`Invalid name ${name}`);
    }

    if (typeof assetPath !== 'string' || assetPath.length === 0) {
      throw new Error(`Invalid asset path ${assetPath}`);
    }

    this.#name = name;
    this.#assetPath = assetPath;

    this.#scale = config.droppableItems.scale[name] ?? config.droppableItems.scale.default;
    this.#density = config.droppableItems.density[name] ?? config.droppableItems.density.default;
    this.#mass = config.droppableItems.mass[name] ?? config.droppableItems.mass.default;
    this.#bounce = config.droppableItems.bounce[name] ?? config.droppableItems.bounce.default;

    this.#friction = config.droppableItems.friction[name] ?? config.droppableItems.friction.default;
    this.#frictionAir = config.droppableItems.frictionAir[name] ?? config.droppableItems.frictionAir.default;
    this.#frictionStatic = config.droppableItems.frictionStatic[name] ?? config.droppableItems.frictionStatic.default;

    this.#minHeight = config.droppableItems.minHeight[name] ?? config.droppableItems.minHeight.default;
    this.#maxHeight = config.droppableItems.maxHeight[name] ?? config.droppableItems.maxHeight.default;

    droppableItemTypes.push(this);
  }

  get name() {
    return this.#name;
  }

  get resource() {
    return this.#resource;
  }

  get res() {
    return this.#resource;
  }

  get density() {
    return this.#density;
  }

  get mass() {
    return this.#mass;
  }

  get bounce() {
    return this.#bounce;
  }

  get scale() {
    return this.#scale;
  }

  get friction() {
    return this.#friction;
  }

  get frictionAir() {
    return this.#frictionAir;
  }

  get frictionStatic() {
    return this.#frictionStatic;
  }

  get minHeight() {
    return this.#minHeight;
  }

  get maxHeight() {
    return this.#maxHeight;
  }

  preload(scene) {
    this.#resource = new ImageResource(this.#assetPath).load(scene);
  }

  static preloadAll(scene) {
    debug('[DroppableItemType] Preloading', droppableItemTypes.length, 'droppable item types...');

    droppableItemTypes.forEach(d => d.preload(scene));
  }
}

