import { RealDate } from "../date";
import { RealTime } from "./time";

test("RealTime", () => {
  const baseTime = new RealTime(1, 2, 3, 4);

  /** Test getters */
  expect(baseTime.hours).toBe(1);
  expect(baseTime.minutes).toBe(2);
  expect(baseTime.seconds).toBe(3);
  expect(baseTime.milliseconds).toBe(4);

  /** Test setters */
  const setTime = new RealTime();
  setTime.hours = 1;
  setTime.minutes = 2;
  setTime.seconds = 3;
  setTime.milliseconds = 4;
  expect(setTime.hours).toBe(1);
  expect(setTime.minutes).toBe(2);
  expect(setTime.seconds).toBe(3);
  expect(setTime.milliseconds).toBe(4);

  /** Setter arithmetic */
  const strangeTime = new RealTime();
  strangeTime.hours += 1;
  expect(strangeTime.hours).toBe(1);
  strangeTime.hours -= 2;
  expect(strangeTime.hours).toBe(-1);
  strangeTime.minutes += 3;
  expect(strangeTime.hours).toBe(0);
  expect(strangeTime.minutes).toBe(-57);


  /** Test toDigital */
  const readableTime = new RealTime(1, 2, 3, 4);
  expect(readableTime.toDigital()).toBe("01:02:03 AM");
  expect(readableTime.toDigital({ p: "ms" })).toBe("01:02:03:004 AM");
  expect(readableTime.toDigital({ p: "s" })).toBe("01:02:03 AM");
  expect(readableTime.toDigital({ p: "m" })).toBe("01:02 AM");
  expect(readableTime.toDigital({ p: "h" })).toBe("01 AM");


  /** Test round */
  const roundTime = new RealTime(1, 4, 4, 499);
  expect(roundTime.round().toDigital()).toBe("01:04:04 AM");
  expect(roundTime.round({ p: "s" }).toDigital()).toBe("01:04:04 AM");
  expect(roundTime.round({ p: "m" }).toDigital()).toBe("01:04:00 AM");
  expect(roundTime.round({ p: "h" }).toDigital()).toBe("01:00:00 AM");

  expect(roundTime.round({ p: "s", r: "up" }).toDigital()).toBe("01:04:05 AM");
  expect(roundTime.round({ p: "m", r: "up" }).toDigital()).toBe("01:05:00 AM");
  expect(roundTime.round({ p: "h", r: "up" }).toDigital()).toBe("02:00:00 AM");

  expect(roundTime.round({ p: "s", r: "down" }).toDigital()).toBe("01:04:04 AM");
  expect(roundTime.round({ p: "m", r: "down" }).toDigital()).toBe("01:04:00 AM");
  expect(roundTime.round({ p: "h", r: "down" }).toDigital()).toBe("01:00:00 AM");


  /** Test arithmetic */
  const arithmeticTime = new RealTime(1, 2, 3, 4);

  // Add
  expect(arithmeticTime.add({ v: 1 }).toDigital()).toBe("01:02:04 AM");
  expect(arithmeticTime.add({ v: 1, u: "s" }).toDigital()).toBe("01:02:04 AM");
  expect(arithmeticTime.add({ v: 1, u: "m" }).toDigital()).toBe("01:03:03 AM");
  expect(arithmeticTime.add({ v: 1, u: "h" }).toDigital()).toBe("02:02:03 AM");

  expect(arithmeticTime.add([
    { v: 1, u: "s" }
  ]).toDigital()).toBe("01:02:04 AM");
  expect(arithmeticTime.add([
    { v: 1, u: "s" },
    { v: 1, u: "m" }
  ]).toDigital()).toBe("01:03:04 AM");
  expect(arithmeticTime.add([
    { v: 1, u: "s" },
    { v: 1, u: "m" },
    { v: 1, u: "h" }
  ]).toDigital()).toBe("02:03:04 AM");

  // Subtract
  expect(arithmeticTime.subtract({ v: 1 }).toDigital()).toBe("01:02:02 AM");
  expect(arithmeticTime.subtract({ v: 1, u: "s" }).toDigital()).toBe("01:02:02 AM");
  expect(arithmeticTime.subtract({ v: 1, u: "m" }).toDigital()).toBe("01:01:03 AM");
  expect(arithmeticTime.subtract({ v: 1, u: "h" }).toDigital()).toBe("00:02:03 AM");

  expect(arithmeticTime.subtract([
    { v: 1, u: "s" }
  ]).toDigital()).toBe("01:02:02 AM");
  expect(arithmeticTime.subtract([
    { v: 1, u: "s" },
    { v: 1, u: "m" }
  ]).toDigital()).toBe("01:01:02 AM");
  expect(arithmeticTime.subtract([
    { v: 1, u: "s" },
    { v: 1, u: "m" },
    { v: 1, u: "h" }
  ]).toDigital()).toBe("00:01:02 AM");





  /** Test comparison */
  const equalTime1 = new RealTime(1, 2, 3, 4);
  const equalTime2 = new RealTime(1, 2, 3, 4);
  const equalTime3 = new RealTime(1, 2, 3, 5);

  // Equals
  expect(equalTime1.equals(equalTime2)).toBe(true);
  expect(equalTime1.equals(equalTime3)).toBe(false);

  expect(equalTime1.equals(equalTime2, { p: "s" })).toBe(true);
  expect(equalTime1.equals(equalTime3, { p: "s" })).toBe(true);

  expect(equalTime1.equals(equalTime2, { p: "m" })).toBe(true);
  expect(equalTime1.equals(equalTime3, { p: "m" })).toBe(true);

  expect(equalTime1.equals(equalTime2, { p: "h" })).toBe(true);
  expect(equalTime1.equals(equalTime3, { p: "h" })).toBe(true);

  // isBefore
  expect(equalTime1.isBefore(equalTime2)).toBe(false);
  expect(equalTime1.isBefore(equalTime3)).toBe(true);
  expect(equalTime3.isBefore(equalTime1)).toBe(false);
  expect(equalTime1.isBefore(equalTime3, { p: "m" })).toBe(false);

  // isAfter
  expect(equalTime1.isAfter(equalTime2)).toBe(false);
  expect(equalTime1.isAfter(equalTime3)).toBe(false);
  expect(equalTime3.isAfter(equalTime1)).toBe(true);
  expect(equalTime1.isAfter(equalTime3, { p: "m" })).toBe(false);

  // isBetween
  expect(equalTime1.isBetween(equalTime2, equalTime3)).toBe(true);
  expect(equalTime1.isBetween(equalTime3, equalTime2)).toBe(true);
  expect(equalTime3.isBetween(equalTime1, equalTime2)).toBe(false);
  expect(equalTime3.isBetween(equalTime2, equalTime1)).toBe(false);

  expect(equalTime3.isBetween(equalTime1, equalTime2, { p: "m" })).toBe(true);


  /** Test typeof */
  const typeofTime = new RealTime(1, 2, 3, 4);
  expect(typeofTime.typeof(new RealDate())).toBe(false);
  expect(typeofTime.typeof(new RealTime())).toBe(true);


  /** Test fromJson */
  const jsonTime = new RealTime(1, 2, 3, 4);
  const jsonTimeJson = JSON.parse(JSON.stringify(jsonTime));
  const fromJsonTime = RealTime.fromJson(jsonTimeJson);
  const jsonTime2 = new RealTime(1, 2, 3, 4);
  expect(fromJsonTime.equals(jsonTime2)).toBe(true);
  expect(fromJsonTime.hours).toBe(jsonTime2.hours);
  expect(fromJsonTime.minutes).toBe(2);
});