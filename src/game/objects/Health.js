export default class Health {
  #health = null;

  constructor(health) {
    if (typeof health !== 'number' || isNaN(health)) {
      throw new Error(`new ${this.constructor.name}() given invalid amount of health: ${typeof health} ${health}`);
    }

    this.#health = health;
  }

  valueOf() {
    return this.#health;
  }

  toString() {
    return this.#health.toString();
  }
}

