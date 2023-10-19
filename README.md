# Chiral
Chiral is a timekeeping library built for JavaScript and TypeScript projects. 
It sits as a layer of abstraction on top of JavaScript's `Date` class, aiming to effectively replace it for most uses.

> **Note:** Chiral is currently in pre-release, so does not currently support its planned implementation of `Date`. For now, it only supports the `Time` and `DeltaTime` objects.

## Installation
[npm](https://www.npmjs.com/package/chiral)
```bash
npm install chiral
```

## Usage
```ts
import { Time } from "chiral";

// Create a new time, 9:30:15:000 AM
const time1 = new Time(9, 30, 15, 0);
console.log(time1.toDigital({ p: "s" }));    
// > 09:30:15 AM

// Add 15 seconds to the time
time1.seconds += 15;
console.log(time1.toDigital({ p: "s" }));    
// > 09:30:30 AM

// Round to the nearest minute
console.log(time1.round({ p: "m" }).toDigital({ p: "s" }))    
// > 09:30:00 AM

// Create a DeltaTime, 3 hours & 15 minutes
const deltaTime = new DeltaTime(3, 15);
console.log(deltaTime.toDigital({ p: "s" }));   
// > 03:15:00

// Create a DeltaTime using the time between two Times
const deltaTime2 = Time.calcDelta(
  new Time(10, 30, 30, 0),
  time1
);
console.log(deltaTime2.toDigital({ p: "s" }));   
// > 01:00:00

// Add two DeltaTimes together
console.log(deltaTime.add(deltaTime2).toDigital({ p: "s" }));     
// > 4:15:00

// Add a DeltaTime to time1
console.log(time1.add(deltaTime2).toDigital({ p: "s" }));     
// > 10:30:30 AM
```