'use strict';

// Create Iterator for given dataset with Symbol.asyncIterator
// Use for..of to iterate it and pass data to Basket
// Basket is limited to certain amount
// After iteration ended Basket should return Thenable
// to notify us with final list of items, total and
// escalated errors

const purchase  = [
    { name: 'Laptop',  price: 1500 },
    { name: 'Mouse',  price: 25 },
    { name: 'Keyboard',  price: 100 },
    { name: 'HDMI cable',  price: 10 },
    { name: 'Bag', price: 50 },
    { name: 'Mouse pad', price: 5 },
];

class PurchaseIterator {
    static create(items) {
        return new PurchaseIterator(items);
    }
    #items = [];
    constructor(items) {
        this.#items = items;
    }
    [Symbol.asyncIterator]() {
       const items = this.#items;
       let i = 0;
       return {
           next() {
               return {
                   value: items[i],
                   done: items[i++] === undefined,
               };
           },
       };
    }
}

class Basket {
    #items = [];
    #limit = 1000;
    #total = 0;
    #callback;

    constructor({ limit }, callback) {
        this.#limit = limit;
        this.#callback = callback;
    }
    add(item) {
        if (this.#total + item.price > this.#limit) return;
        this.#total += item.price;
        this.#items.push(item);

        if (typeof this.#callback !== 'function') return;
        this.#callback(this.#items, this.#total);
    }

    result() {
        setTimeout(() => {
            const total = { name: 'Total', price: this.#total };
            this.ready([ ...this.#items, total ]);
        }, 1000);
        return this;
    }

    then(onFulfilled) {
        this.onFulfilled = onFulfilled;
    }

    ready(data) {
        this.onFulfilled(data);
    }
}

const main = async () => {
    const goods = PurchaseIterator.create(purchase);
    const basket = new Basket({ limit: 1050 }, (items, total) => {
        console.log(total);
    });
    for await (const item of goods) {
        basket.add(item);
    }
    const result = await basket.result();
    console.log(result);
};

main();

