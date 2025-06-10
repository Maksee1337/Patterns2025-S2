'use strict';

class Poolify {
  #instances = [];
  #size = 10;
  #max = 15;
  #factory;
  constructor(factory, { size, max } = {}) {
    this.#instances = new Array(size || this.#size).map(factory);
    this.#factory = factory;
    this.#max = max || this.#max;
    this.#size = size || this.#size;
  }

  acquire() {
    return this.#instances.pop() || this.#factory();
  }

  release(instance) {
    if (this.#instances.length < this.#max) {
      this.#instances.push(instance);
    }
  }

  get length() {
    return this.#instances.length;
  }
}
// Usage

const createBuffer = (size) => new Uint8Array(size);

const FILE_BUFFER_SIZE = 10;
const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);

const pool = new Poolify(createFileBuffer);
let instance = pool.acquire();
console.log({ instance });
console.log(pool.length);
pool.release(instance);
instance[0] = 1;
console.log(pool.length);
instance = pool.acquire();
console.log(instance);
