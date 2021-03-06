import Phaser from '/src/lib/phaser';

const config = {
  debug: false,
  debugTexts: false,

  itemRain: false,
  itemsPerRound: 3,
  health: 3,

  spawnClick: false,
  skipBoatArriving: true,

  game: {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    pixelArt: true
  },

  audio: {
    disableWebAudio: true
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

      MUIKKU: 1,
      FELIX: 1,
      TRIANGLE: 1,
      GRAMOPHONE: 1,
      LONG_CONTAINER: 1,
      BOMB: 1,
      BOTTLE: 1,
      BRIEFCASE: 1,
      AKIMBO_CONTAINER: 1,
    */

    // How many past frames to check for hasStopped
    maxVelocities: {
      default: 30
    },

    // Max velocity to be considered as stopped
    stopVelocityTreshold: {
      default: .2
    },

    stopRotationTreshold: {
      default: .2
    },

    // Min velocity to do auto positioning
    autoPositionVelocityTreshold: {
      default: .1,
    },

    // How aggressive the auto positioning is, higher is less aggressive
    autoPositionFactor: {
      default: 75000
    },

    // Show auto position debug messages every frame
    autoPositionDebug: {
      default: false
    },

    // Show physics debug messages on create
    physicsDebug: {
      default: false
    },

    mass: {
      default: 1,

      AKIMBO_CONTAINER: 60,
      LONG_CONTAINER: 50,
      SHIPPING_CONTAINER: 40,
      SAFE: 40,
      WASHING_MACHINE: 40,
      CRT_SCREEN: 40,
      GRASS_BLOCK: 30,
      TRIANGLE: 30,
      WIDE_PLANK: 25,
      BOMB: 25,
      WOODEN_CRATE: 20,
      ROTARY_PHONE: 20,
      GRAMOPHONE: 20,
      GIFT_BOX: 20,
      WIDE_PAINTING: 20,
      MUIKKU: 20,
      FELIX: 20,
      BOTTLE: 15,
      BRIEFCASE: 15,
      CARDBOARD_BOX: 15
    },

    scale: {
      // [0, inf[
      default: [3, 5],
      LONG_CONTAINER: [4, 5]
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
      //default: 0.01
      default: 0
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

    minHeight: {
      default: null,
      MUIKKU: 10,
      FELIX: 10,
      TRIANGLE: 10,
      GRAMOPHONE: 10,
      LONG_CONTAINER: 10,
      BOMB: 10,
      BOTTLE: 10,
      BRIEFCASE: 10,
      AKIMBO_CONTAINER: 10,
    },

    maxHeight: {
      default: null
    }
  }
};

export default config;
