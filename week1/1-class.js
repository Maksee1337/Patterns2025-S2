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

let data = `city,population,area,density,country
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

class City {
  #PADS = {
    CITY_NAME: 18,
    POPULATION: 10,
    AREA: 8,
    DENSITY: 8,
    COUNTRY: 18,
    PERSENTAGE: 6,
  };

  #cityName = '';
  #population = 0;
  #area = 0;
  #density = 0;
  #country = '';

  constructor(data) {
    const fields = data.split(',');
    if (fields.length !== 5) {
      throw Error('WrongData');
    }

    this.#cityName = fields[0].trim();
    this.#population = Number(fields[1]);
    this.#area = Number(fields[2]);
    this.#density = Number(fields[3]);
    this.#country = fields[4];
  }
  get density() {
    return this.#density;
  }

  toString({ addDensityPercentage = true, maxDensity = 0 } = {}) {
    let result = '';
    result += this.#cityName.padEnd(this.#PADS.CITY_NAME);
    result += String(this.#population).padStart(this.#PADS.POPULATION);
    result += String(this.#area).padStart(this.#PADS.AREA);
    result += String(this.#density).padStart(this.#PADS.DENSITY);
    result += this.#country.padStart(this.#PADS.COUNTRY);
    if (addDensityPercentage) {
      const percentage = Math.round((this.#density * 100) / maxDensity);
      result += String(percentage).padStart(this.#PADS.PERSENTAGE);
    }
    return result;
  }

  print({ addDensityPercentage = true, maxDensity = 0 } = {}) {
    console.log(this.toString({ addDensityPercentage, maxDensity }));
  }
}

class Cities {
  static fromList(list, { skipHeader = true } = {}) {
    return new Cities().importList(list, { skipHeader });
  }

  #list = [];
  #maxDensity = 0;

  importList(list, { skipHeader = true } = {}) {
    const lines = list.split('\n');
    for (let i = skipHeader ? 1 : 0; i < lines.length; i++) {
      this.addCity(new City(lines[i]));
    }
    return this;
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

  print({ addDensityPercentage = true } = {}) {
    this.#list.forEach((city) => {
      city.print({ addDensityPercentage, maxDensity: this.#maxDensity });
    });
  }
}

const startTime = performance.now();

const cities = Cities.fromList(data);
cities.addCity(new City('New1 York City,8537673,784,110892,United States'));
cities.sortByDensity();
cities.print();
const endTime = performance.now();
console.log(`${endTime - startTime} milliseconds`);
