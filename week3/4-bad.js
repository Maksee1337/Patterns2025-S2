'use strict';

// TODO: Refactor to respect SoC principle and
// optimize JavaScript for V8

const poolify = (factory, { size, max }) => {
  const instances = new Array(size).fill(null).map(factory);
  const getInstance = () => instances.pop() || factory();
  const addInstance = (instance) => {
    if (instances.length < max) {
      instances.push(instance);
    }
  };
  const getSize = () => instances.length;
  return { getInstance, addInstance, getSize };
};

// Usage
const FILE_BUFFER_SIZE = 3;

const createBuffer = (size) => new Uint8Array(size);
const createFileBuffer = () => createBuffer(FILE_BUFFER_SIZE);

const pool = poolify(createFileBuffer, { size: 10, max: 15 });

console.log(pool.getInstance());
console.log(pool.getSize());

console.log(pool.getInstance());
pool.addInstance();
console.log(pool.getSize());

console.log(pool.getInstance());
console.log(pool.getSize());

console.log(pool.getInstance());
pool.addInstance();
console.log(pool.getSize());

console.log(pool.getInstance());
console.log(pool.getSize());

console.log(pool.getInstance());
console.log(pool.getSize());

console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
console.log(pool.getInstance());
console.log(pool.getSize());
pool.addInstance();
pool.addInstance();
pool.addInstance();
pool.addInstance();
pool.addInstance();
pool.addInstance();
pool.addInstance();
pool.addInstance();
console.log(pool.getSize());
