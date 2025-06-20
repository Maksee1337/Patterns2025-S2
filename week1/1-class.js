'use strict';

// Tasks for rewriting:
//   - Watch week 1 lectures about SoC, SRP, code characteristics, V8
//   - Apply optimizations of computing resources: processor, memory
//   - Minimize cognitive complexity
//   - Respect SRP and SoC
//   - Improve readability (understanding), reliability
//   - Optimize for maintainability, reusability, flexibility
//   - Make code testable
//   - Implement simple unittests without frameworks
// Additional tasks:
//   - Try to implement in multiple paradigms: OOP, FP, procedural, mixed
//   - Prepare load testing and trace V8 deopts

const data = `city,population,area,density,country
  Shanghai,24256800,6340,3826,China
  Delhi,16787941,1484,11313,India
  Lagos,16060303,1171,13712,Nigeria
  Istanbul,14160467,5461,2593,Turkey
  Tokyo,13513734,2191,6168,Japan
  Sao Paulo,12038175,1521,7914,Brazil
  Mexico City,8874724,1486,5974,Mexico
  London,8673713,1572,5431,United Kingdom
  New York City,8537673,784,10892,United States
  Bangkok,8280925,1569,5279,Thailand`;

class ConsolePrinter {
  #schema = {};
  #formatters = {
    padStart: ({ str, args }) => str.padStart(...args),
    padEnd: ({ str, args }) => str.padEnd(...args),
  };
  constructor(schema = {}) {
    this.#schema = schema;
  }

  print(data) {
    let result = '';
    for (const [key, schemaItem] of Object.entries(this.#schema)) {
      const { stringMethod, args } = schemaItem.format;
      const str = String(data[key]);
      if (!data[key] || !stringMethod) continue;

      result += this.formatString({ str, stringMethod, args });
    }
    console.log(result);
  }

  formatString({ str, stringMethod, args }) {
    if (!this.#formatters[stringMethod]) {
      throw new Error(`Unknown format method: ${stringMethod}`);
    }
    return this.#formatters[stringMethod]({ str, args });
  }
}

class Parser {
  #schema = {};
  #normalizedSchema = [];

  #getType(type) {
    const types = {
      string: String,
      number: Number,
    };
    if (!types[type]) throw new Error(`Unknown type: ${type}`);
    return types[type];
  }

  #normalizeSchema() {
    for (const [index, [key, { type, parse = true } = {}]] of Object.entries(
      this.#schema,
    ).entries()) {
      this.#normalizedSchema.push({
        index,
        name: key,
        type: this.#getType(type),
        parse,
      });
    }
  }

  constructor(schema = {}) {
    this.#schema = schema;
    this.#normalizeSchema();
  }

  parseList(list, { skipHeader = true } = {}) {
    const result = [];
    const lines = list.split('\n');
    for (let i = skipHeader ? 1 : 0; i < lines.length; i++) {
      const fields = lines[i].split(',');
      const item = {};
      for (const { index, name, type, parse } of this.#normalizedSchema) {
        if (!parse) continue;
        const parsedData = type(fields[index]);
        const value = type === String ? parsedData.trim() : parsedData;
        item[name] = value;
      }
      result.push(item);
    }
    return result;
  }
}
class City {
  #name = '';
  #population = 0;
  #area = 0;
  #density = 0;
  #country = '';

  constructor({ name, population, area, density, country }) {
    this.#name = name;
    this.#population = population;
    this.#area = area;
    this.#density = density;
    this.#country = country;
  }
  get density() {
    return this.#density;
  }

  toObject() {
    return {
      name: this.#name,
      population: this.#population,
      area: this.#area,
      density: this.#density,
      country: this.#country,
    };
  }
}

class Cities {
  #list = [];
  #maxDensity = 0;

  get maxDensity() {
    return this.#maxDensity;
  }

  addCity(city) {
    this.#list.push(city);
    if (city.density > this.#maxDensity) {
      this.#maxDensity = city.density;
    }
  }

  sortByDensity() {
    this.#list.sort((d1, d2) => d2.density - d1.density);
  }

  forEach(callback) {
    for (const city of this.#list) {
      callback(city.toObject());
    }
  }
}
const startTime = performance.now();

const schema = {
  name: { type: 'string', format: { stringMethod: 'padEnd', args: [14] } },
  population: {
    type: 'number',
    format: { stringMethod: 'padStart', args: [10] },
  },
  area: { type: 'number', format: { stringMethod: 'padStart', args: [8] } },
  density: { type: 'number', format: { stringMethod: 'padStart', args: [8] } },
  country: { type: 'string', format: { stringMethod: 'padStart', args: [18] } },
  percentage: {
    type: 'number',
    format: { stringMethod: 'padStart', args: [5] },
    parse: false,
  },
};

const consolePrinter = new ConsolePrinter(schema);
const citiesParser = new Parser(schema);

const citiesList = citiesParser.parseList(data);

const cities = new Cities();

citiesList.forEach((city) => cities.addCity(new City(city)));

cities.sortByDensity();
cities.forEach((city) => {
  consolePrinter.print({
    ...city,
    percentage: Math.round((city.density * 100) / cities.maxDensity),
  });
});

const endTime = performance.now();
console.log(`${endTime - startTime} milliseconds`);
