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

const parseCities = (list, { skipHeader = true } = {}) => {
    let maxDensity = 0;
    const items = [];
    const lines = list.split('\n');
    for (let i = skipHeader ? 1 : 0; i < lines.length; i++) {
        const fields = lines[i].split(',');
        const density = Number(fields[3]);
        items.push({
            city: fields[0].trim(),
            population: Number(fields[1]),
            area: Number(fields[2]),
            density,
            country: fields[4],
        });
        if (density > maxDensity) maxDensity = density;
    }
    return { items, maxDensity };
};

const printCities = (
    { items = [], maxDensity = 0 } = {},
    { addDestinyPercentage = true } = {},
) => {
    const PADS = {
        CITY_NAME: 18,
        POPULATION: 10,
        AREA: 8,
        DENSITY: 8,
        COUNTRY: 18,
        PERCENTAGE: 6,
    };

    for (const item of items) {
        let result = '';
        result += item.city.padEnd(PADS.CITY_NAME);
        result += String(item.population).padStart(PADS.POPULATION);
        result += String(item.area).padStart(PADS.AREA);
        result += String(item.density).padStart(PADS.DENSITY);
        result += item.country.padStart(PADS.COUNTRY);
        if (addDestinyPercentage) {
            const percentage = Math.round((item.density * 100) / maxDensity);
            result += String(percentage).padStart(PADS.PERCENTAGE);
        }
        console.log(result);
    }
};


const startTime = performance.now();

const cities = parseCities(data);
cities.items.sort((d1, d2) => d2.density - d1.density);
printCities(cities);

const endTime = performance.now();
console.log(`${endTime - startTime} milliseconds`);
