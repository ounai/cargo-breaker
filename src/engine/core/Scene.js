export default class Scene extends Phaser.Scene {
  baseURL = null;
  resources = null;
  eventHandlers = null;

  cursors = null;
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
      this.input.keyboard.on(`keydown-${key}`, listener.bind(this));
    }
  }

  #createEventHandlers(eventHandlers) {
    if (eventHandlers.keydown) {
      this.#createKeyDownEventHandlers(eventHandlers.keydown);
    }
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

    this.onUpdate(...args);
  }

  // Subclass methods
  onCreate() {}
  onUpdate() {}
}

