import ImageResource from '/src/engine/resources/ImageResource';

const droppableItemTypes = [];

export default class DroppableItemType {
  static SHIPPING_CONTAINER = new DroppableItemType(1, '/assets/shipping-container.png');
  static SAFE = new DroppableItemType(1, '/assets/safe.png');
  static WOODEN_CRATE = new DroppableItemType(1, '/assets/wooden-crate.png');
  static CARDBOARD_BOX = new DroppableItemType(1, '/assets/cardboard-box.png');
  static GRASS_BLOCK = new DroppableItemType(1, '/assets/grass-block.png');
  static ROTARY_PHONE = new DroppableItemType(1, '/assets/rotary-phone.png');
  static GIFT_BOX = new DroppableItemType(1, '/assets/gift-box.png');
  static CRT_SCREEN = new DroppableItemType(1, '/assets/crt-screen.png');
  static WASHING_MACHINE = new DroppableItemType(1, '/assets/washing-machine.png');
  static WIDE_PAINTING = new DroppableItemType(1, '/assets/wide-painting.png');
  static WIDE_PLANK = new DroppableItemType(1, '/assets/wide-plank.png');

  #mass;
  #assetPath;
  #minHeight;
  #maxHeight;

  #resource = null;

  constructor(mass, asset, minHeight = null, maxHeight = null) {
    if (typeof mass !== 'number' || isNaN(mass)) throw new Error(`Invalid mass ${mass}`);
    if (typeof asset !== 'string' || asset.length === 0) throw new Error(`Invalid asset name ${asset}`);
    if (isNaN(minHeight)) throw new Error('Min height is NaN');
    if (isNaN(maxHeight)) throw new Error('Min height is NaN');

    this.#mass = mass;
    this.#assetPath = asset;
    this.#minHeight = minHeight;
    this.#maxHeight = maxHeight;

    droppableItemTypes.push(this);
  }

  get mass() {
    return this.#mass;
  }

  get minHeight() {
    return this.#minHeight;
  }

  get maxHeight() {
    return this.#maxHeight;
  }

  get resource() {
    return this.#resource;
  }

  get res() {
    return this.#resource;
  }

  preload(scene) {
    this.#resource = new ImageResource(this.#assetPath).load(scene);
  }

  static preloadAll(scene) {
    console.log('Preloading', droppableItemTypes.length, 'droppable item types...');

    droppableItemTypes.forEach(d => d.preload(scene));
  }
}

