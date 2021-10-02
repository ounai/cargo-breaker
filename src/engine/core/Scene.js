import Phaser from '/src/lib/phaser';

import Vector2 from '/src/engine/math/Vector2';

export default class Scene extends Phaser.Scene {
  baseURL = null;
  resources = null;
  eventHandlers = null;
  cursors = null;
  screenCenter = null;

  #cursorKeys = null;

  #preloadBaseURL(baseURL) {
    if (baseURL !== null) {
      if (typeof baseURL === 'string' && baseURL.length > 0) {
        console.log('Setting base URL to', baseURL);

        this.load.setBaseURL(baseURL);
      } else {
        throw new Error(`Invalid ${this.constructor.name}.baseURL, expected string, got ${typeof baseURL}`);
      }
    }
  }

  #preloadResources(resources) {
    if (typeof resources === 'object') {
      for (const [name, resource] of Object.entries(resources)) {
        console.log('Loading resource', name, `(type: ${resource.constructor.name})`);

        resource.load(this);
      }
    } else {
      throw new Error(`Invalid ${this.constructor.name}.resources, expected object, got ${typeof resources}`);
    }
  }

  #createKeyDownEventHandlers(keydown) {
    for (const [key, listener] of Object.entries(keydown)) {
      this.input.keyboard.on(`keydown-${key}`, listener);
    }
  }

  #createInputEventHandlers(eventHandlers) {
    const eventNames = [
      'pointerdown',
      'pointerup'
    ];

    for (const eventName of eventNames) {
      const handler = eventHandlers[eventName];

      if (typeof handler === 'function') {
        console.log('Registering event', eventName);

        this.input.on(eventName, handler, this);
      }
    }
  }

  #createEventHandlers(eventHandlers) {
    if (eventHandlers.keydown) {
      this.#createKeyDownEventHandlers(eventHandlers.keydown);
    }

    if (eventHandlers.input) {
      this.#createInputEventHandlers(eventHandlers.input);
    }
  }

  #updateScreenCenter() {
    if (this.screenCenter === null) {
      this.screenCenter = new Vector2();
    }

    this.screenCenter.x = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenter.y = this.cameras.main.worldView.y + this.cameras.main.height / 2;
  }

  constructor(config) {
    super(config);
  }

  get res() {
    return this.resources;
  }

  preload() {
    console.log('Preloading scene', this.constructor.name);

    if (this.baseURL !== null) {
      this.#preloadBaseURL(this.baseURL);
    }

    if (this.resources !== null) {
      this.#preloadResources(this.resources);
    }
  }

  create() {
    if (typeof this.cursorKeysDown === 'function') {
      this.#cursorKeys = this.input.keyboard.createCursorKeys();
    }

    if (this.eventHandlers !== null) {
      this.#createEventHandlers(this.eventHandlers);
    }

    this.#updateScreenCenter();
    this.onCreate();
  }

  update(...args) {
    if (this.#cursorKeys !== null) {
      const { up, down, left, right } = this.#cursorKeys;

      this.cursorKeysDown({
        up: up.isDown,
        down: down.isDown,
        left: left.isDown,
        right: right.isDown
      });
    }

    this.#updateScreenCenter();
    this.onUpdate(...args);
  }

  // Subclass methods
  onCreate() {}
  onUpdate() {}
}

