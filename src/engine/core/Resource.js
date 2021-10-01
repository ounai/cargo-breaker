import { nextKey } from '/src/engine/services/keyGenerator';

export default class Resource {
  key = null;

  constructor() {
    this.key = nextKey(this.constructor.name);
  }

  toString() {
    return this.key;
  }
}

