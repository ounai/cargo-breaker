export default class Health {
  #health = null;
  #listeners = {};

  constructor(health) {
    if (typeof health !== 'number' || isNaN(health)) {
      throw new Error(`new ${this.constructor.name}() given invalid amount of health: ${typeof health} ${health}`);
    }

    this.#health = health;
  }

  on(value, listener) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error(`Invalid value ${value}`);
    }

    if (typeof listener !== 'function') {
      throw new Error(`Invalid listener ${listener}`);
    }

    this.#listeners[value.toString()] = listener;
  }

  decrease() {
    this.#health--;

    if (typeof this.#listeners[this.toString()] === 'function') {
      this.#listeners[this.#health]();
    }
  }

  valueOf() {
    return this.#health;
  }

  toString() {
    return this.#health.toString();
  }
}

