import Phaser from '/src/lib/phaser';

import config from '/src/config.js';

import { debug as logDebug } from '/src/engine/services/log';

import Text from '/src/engine/objects/Text';
import Vector2 from '/src/engine/math/Vector2';

export default class Scene extends Phaser.Scene {
  baseURL = null;
  resources = null;
  eventHandlers = null;
  cursors = null;
  screenCenter = null;

  #cursorKeys = null;
  #lastDebugStrings = null;
  #debugStringTexts = [];
  #cameraOrigin = null;

  #preloadBaseURL(baseURL) {
    if (baseURL !== null) {
      if (typeof baseURL === 'string' && baseURL.length > 0) {
        this.debug('Setting base URL to', baseURL);

        this.load.setBaseURL(baseURL);
      } else {
        throw new Error(`Invalid ${this.constructor.name}.baseURL, expected string, got ${typeof baseURL}`);
      }
    }
  }

  #preloadResources(resources) {
    if (typeof resources === 'object') {
      for (const [name, resource] of Object.entries(resources)) {
        this.debug('Loading resource', name, `(type: ${resource.constructor.name})`);

        resource.load(this);
      }
    } else {
      throw new Error(`Invalid ${this.constructor.name}.resources, expected object, got ${typeof resources}`);
    }
  }

  #createKeyDownEventHandlers(keydown) {
    for (const [key, listener] of Object.entries(keydown)) {
      this.input.keyboard.on(`keydown-${key}`, listener, this);
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
        this.debug('Registering event', eventName);

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

  #drawDebugStrings(debugStrings) {
    if (this.#debugStringTexts.length > 0) {
      this.debug('Destroying', this.#debugStringTexts.length, 'old debug string texts');

      for (const text of this.#debugStringTexts) text.destroy();

      this.#debugStringTexts = [];
    }

    const fontSize = 16;
    const style = { fontSize: `${fontSize}px` };

    let y = 8;

    for (const str of debugStrings) {
      const text = new Text(this, 8, y, str, style).setScrollFactor(0).setDepth(1);

      this.add.existing(text);
      this.#debugStringTexts.push(text);

      y += fontSize + 4;
    }
  }

  #updateScreenCenter() {
    if (this.screenCenter === null) {
      this.screenCenter = new Vector2();
    }

    this.screenCenter.x = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenter.y = this.cameras.main.worldView.y + this.cameras.main.height / 2;
  }

  #argsToVector(x, y) {
    if (typeof y !== 'number') return new Vector2(x.x, x.y);
    else return new Vector2(x, y);
  }

  #setCameraOrigin() {
    this.#cameraOrigin = new Vector2(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y);
  }

  constructor(config) {
    super(config);
  }

  get res() {
    return this.resources;
  }

  get cameraOrigin() {
    return this.#cameraOrigin;
  }

  get cameraPosition() {
    return new Vector2(this.cameras.main.scrollX, this.cameras.main.scrollY);
  }

  get cameraCenter() {
    return new Vector2(this.cameras.main.midPoint.x, this.cameras.main.midPoint.y);
  }

  debug(...args) {
    logDebug(`[${this.constructor.name}]`, ...args);
  }

  // Takes either (x, y) or (Vector2(x, y))
  viewportToWorld(x, y) {
    const viewportPosition = this.#argsToVector(x, y);

    return new Vector2(viewportPosition.x + this.cameraPosition.x, viewportPosition.y + this.cameraPosition.y);
  }

  // Takes either (x, y) or (Vector2(x, y))
  worldToViewport(x, y) {
    const viewportPosition = this.#argsToVector(x, y);

    return new Vector2(viewportPosition.x - this.cameraPosition.x, viewportPosition.y - this.cameraPosition.y);
  }

  preload() {
    this.debug('Preloading scene', this.constructor.name);

    if (this.baseURL !== null) {
      this.#preloadBaseURL(this.baseURL);
    }

    if (this.resources !== null) {
      this.#preloadResources(this.resources);
    }

    this.onPreload();
  }

  create() {
    if (typeof this.cursorKeysDown === 'function') {
      this.#cursorKeys = this.input.keyboard.createCursorKeys();
    }

    if (this.eventHandlers !== null) {
      this.#createEventHandlers(this.eventHandlers);
    }

    this.#setCameraOrigin();
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

    const debugStrings = this.debugStrings();

    if (config.debug && Array.isArray(debugStrings) && JSON.stringify(debugStrings) !== JSON.stringify(this.#lastDebugStrings)) {
      this.debug('Updating debug strings...');

      this.#drawDebugStrings(debugStrings);
      this.#lastDebugStrings = debugStrings;
    }

    this.#updateScreenCenter();

    this.onUpdate(...args);
  }

  // Subclass methods
  onPreload() {}
  onCreate() {}
  onUpdate() {}
  debugStrings() {}
}

