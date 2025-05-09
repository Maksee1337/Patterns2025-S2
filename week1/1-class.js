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

class City {
  #cityName = '';
  #population = 0;
  #area = 0;
  #density = 0;
  #country = '';
  constructor(data) {
    const fields = data.split(',');
    if (fields.length !== 5) { throw Error('WrongData'); }

    this.#cityName = fields[0].trim();
    this.#population = fields[1];
    this.#area = fields[2];
    this.#density = fields[3];
    this.#country = fields[4];
  }
  get destiny() {
    return +this.#density;
  }

  toString() {
    let result = '';
    result += this.#cityName.padEnd(18);
    result += this.#population.padStart(10);
    result += this.#area.padStart(8);
    result += this.#density.padStart(8);
    result += this.#country.padStart(18);
    return result;
  }
}

class Cities {
  static fromList(list, { skipHeader = true } = {}) {
    return new Cities().importList(list, { skipHeader });
  }

  #list = [];
  #maxDestiny = 0;

  importList(list, { skipHeader = true } = {}) {
    const lines = list.split('\n');
    for (let i = skipHeader ? 1 : 0; i < lines.length; i++) {
      this.addCity(new City(lines[i]));
    }
    return this;
  }

  addCity(city) {
    this.#list.push(city);
    if (city.destiny > this.#maxDestiny) { this.#maxDestiny = city.destiny; }
  }

  sortByDestiny() {
    this.#list = this.#list.sort((d1, d2) => d2.destiny - d1.destiny);
  }

  printTable({ addDestinyPercentage = true } = {}) {
    this.#list.forEach((city) => {
      let result = city.toString();
      if (addDestinyPercentage) {
        result +=
            String(Math.round((city.destiny * 100) / this.#maxDestiny))
                .padStart(6);
      }
      console.log(result);
    });
  }
}

const startTime = performance.now();

const cities =  Cities.fromList(data);
cities.addCity(new City('New1 York City,8537673,784,110892,United States'));
cities.sortByDestiny();
cities.printTable();
const endTime = performance.now();
console.log(`${endTime - startTime} milliseconds`);
