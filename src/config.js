const config = {
  game: {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    pixelArt: true
  },
  droppableItems: {
    /*
      SHIPPING_CONTAINER: 1,
      SAFE: 1,
      WOODEN_CRATE: 1,
      CARDBOARD_BOX: 1,
      GRASS_BLOCK: 1,
      ROTARY_PHONE: 1,
      GIFT_BOX: 1,
      CRT_SCREEN: 1,
      WASHING_MACHINE: 1,
      WIDE_PAINTING: 1,
      WIDE_PLANK: 1,
    */

    density: {
      // [0, inf[ ?
      default: 1,
      SHIPPING_CONTAINER: 100,
      SAFE: 100,
      WOODEN_CRATE: 30,
      CARDBOARD_BOX: 5,
      GRASS_BLOCK: 30,
      ROTARY_PHONE: 10,
      GIFT_BOX: 10,
      CRT_SCREEN: 70,
      WASHING_MACHINE: 100,
      WIDE_PAINTING: 20,
      WIDE_PLANK: 20
    },
    scale: {
      // [0, inf[ ?
      default: 2
    },
    friction: {
      // [0, 1] ?
      default: 0.5,
      SHIPPING_CONTAINER: 0.9,
      SAFE: 0.9,
      WOODEN_CRATE: 0.4,
      CARDBOARD_BOX: 0.3,
      GRASS_BLOCK: 0.5,
      ROTARY_PHONE: 0.5,
      GIFT_BOX: 0.4,
      CRT_SCREEN: 0.7,
      WASHING_MACHINE: 0.9,
      WIDE_PAINTING: 0.5,
      WIDE_PLANK: 0.7
    },
    frictionAir: {
      // [0, 1] ?
      default: 0.01
    },
    frictionStatic: {
      // [0, inf[ ?
      default: 5,
      SHIPPING_CONTAINER: 9,
      SAFE: 9,
      WOODEN_CRATE: 4,
      CARDBOARD_BOX: 3,
      GRASS_BLOCK: 5,
      ROTARY_PHONE: 5,
      GIFT_BOX: 4,
      CRT_SCREEN: 7,
      WASHING_MACHINE: 9,
      WIDE_PAINTING: 5,
      WIDE_PLANK: 7
    },
    bounce: {
      // [0, 1]
      default: 0.01
    },

    minHeight: { default: null },
    maxHeight: { default: null }
  }
};

export default config;
