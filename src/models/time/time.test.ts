import { DeltaTime } from "./deltaTime";
import { Time } from "./time";

test("Time", () => {
  /** Test getters */
  const baseTime = new Time(1, 2, 3, 4);
  expect(baseTime.hours).toBe(1);
  expect(baseTime.minutes).toBe(2);
  expect(baseTime.rawMinutes).toBe(62);
  expect(baseTime.seconds).toBe(3);
  expect(baseTime.rawSeconds).toBe(3723);
  expect(baseTime.milliseconds).toBe(4);
  expect(baseTime.rawMilliseconds).toBe(3723004);


  /** Test negatives */
  const negativeTime = new Time(-1, -2, -3, -4);
  expect(negativeTime.hours).toBe(-1);
  expect(negativeTime.minutes).toBe(-2);
  expect(negativeTime.rawMinutes).toBe(-62);
  expect(negativeTime.seconds).toBe(-3);
  expect(negativeTime.rawSeconds).toBe(-3723);
  expect(negativeTime.milliseconds).toBe(-4);
  expect(negativeTime.rawMilliseconds).toBe(-3723004);


  /** Test setters */
  const setTime = new Time();
  setTime.hours = 1;
  setTime.minutes = 2;
  setTime.seconds = 3;
  setTime.milliseconds = 4;
  expect(setTime.hours).toBe(1);
  expect(setTime.minutes).toBe(2);
  expect(setTime.rawMinutes).toBe(62);
  expect(setTime.seconds).toBe(3);
  expect(setTime.rawSeconds).toBe(3723);
  expect(setTime.milliseconds).toBe(4);
  expect(setTime.rawMilliseconds).toBe(3723004);

  const setNegativeTime = new Time();
  setNegativeTime.hours = -1;
  setNegativeTime.minutes = -2;
  setNegativeTime.seconds = -3;
  setNegativeTime.milliseconds = -4;
  expect(setNegativeTime.hours).toBe(-1);
  expect(setNegativeTime.minutes).toBe(-2);
  expect(setNegativeTime.rawMinutes).toBe(-62);
  expect(setNegativeTime.seconds).toBe(-3);
  expect(setNegativeTime.rawSeconds).toBe(-3723);
  expect(setNegativeTime.milliseconds).toBe(-4);
  expect(setNegativeTime.rawMilliseconds).toBe(-3723004);


  /** Strange setter outliers */
  const strangeTime = new Time();
  strangeTime.hours += 1;
  expect(strangeTime.hours).toBe(1);
  strangeTime.hours -= 2;
  expect(strangeTime.hours).toBe(-1);
  strangeTime.minutes += 3;
  expect(strangeTime.hours).toBe(0);
  expect(strangeTime.minutes).toBe(-57);
  strangeTime.hours += 1;
  expect(strangeTime.hours).toBe(0);
  expect(strangeTime.minutes).toBe(3);
  strangeTime.minutes -= 4;
  expect(strangeTime.hours).toBe(0);
  expect(strangeTime.minutes).toBe(-1);


  /** Test toDigital */
  const digitalTime = new Time(1, 2, 3, 4);
  expect(digitalTime.toDigital({ p: "ms" })).toBe("01:02:03:004 AM");
  expect(digitalTime.toDigital({ p: "s" })).toBe("01:02:03 AM");
  expect(digitalTime.toDigital({ p: "m" })).toBe("01:02 AM");
  expect(digitalTime.toDigital({ p: "h" })).toBe("01 AM");

  const digitalTime2 = new Time(13, 2, 3, 4);
  expect(digitalTime2.toDigital({ p: "ms" })).toBe("01:02:03:004 PM");
  expect(digitalTime2.toDigital({ p: "s" })).toBe("01:02:03 PM");
  expect(digitalTime2.toDigital({ p: "m" })).toBe("01:02 PM");
  expect(digitalTime2.toDigital({ p: "h" })).toBe("01 PM");

  expect(digitalTime2.toDigital({ p: "ms", m: true })).toBe("13:02:03:004");

  /** Test with negatives */
  const negativeDigitalTime = new Time(-1, -2, -3, -4);
  expect(negativeDigitalTime.toDigital({ p: "ms" })).toBe("-01:02:03:004 AM");
  expect(negativeDigitalTime.toDigital({ p: "s" })).toBe("-01:02:03 AM");
  expect(negativeDigitalTime.toDigital({ p: "m" })).toBe("-01:02 AM");
  expect(negativeDigitalTime.toDigital({ p: "h" })).toBe("-01 AM");


  /** Test with strange outliers */
  const strangeDigitalTime = new Time();
  strangeDigitalTime.hours += 1;
  expect(strangeDigitalTime.toDigital({ p: "ms" })).toBe("01:00:00:000 AM");
  strangeDigitalTime.minutes -= 2;
  expect(strangeDigitalTime.toDigital({ p: "ms" })).toBe("00:58:00:000 AM");
  strangeDigitalTime.seconds -= 2;
  expect(strangeDigitalTime.toDigital({ p: "ms" })).toBe("00:57:58:000 AM");
  strangeDigitalTime.milliseconds -= 2;
  expect(strangeDigitalTime.toDigital({ p: "ms" })).toBe("00:57:57:998 AM");


  /** Test rounding */
  const roundingTime = new Time(1, 2, 3, 4);
  expect(roundingTime.round({ p: "ms" }).toDigital({ p: "ms" })).toBe("01:02:03:004 AM");
  expect(roundingTime.round({ p: "s" }).toDigital({ p: "ms" })).toBe("01:02:03:000 AM");
  expect(roundingTime.round({ p: "m" }).toDigital({ p: "ms" })).toBe("01:02:00:000 AM");
  expect(roundingTime.round({ p: "h" }).toDigital({ p: "ms" })).toBe("01:00:00:000 AM");

  const roundingTime2 = new Time(1, 29, 29, 500);
  expect(roundingTime2.round({ p: "ms" }).toDigital({ p: "ms" })).toBe("01:29:29:500 AM");
  expect(roundingTime2.round({ p: "s" }).toDigital({ p: "ms" })).toBe("01:29:30:000 AM");
  expect(roundingTime2.round({ p: "m" }).toDigital({ p: "ms" })).toBe("01:30:00:000 AM");
  expect(roundingTime2.round({ p: "h" }).toDigital({ p: "ms" })).toBe("02:00:00:000 AM");

  expect(roundingTime.round({ p: "ms", r: "down" }).toDigital({ p: "ms" })).toBe("01:02:03:004 AM");
  expect(roundingTime.round({ p: "s", r: "down" }).toDigital({ p: "ms" })).toBe("01:02:03:000 AM");
  expect(roundingTime.round({ p: "m", r: "down" }).toDigital({ p: "ms" })).toBe("01:02:00:000 AM");
  expect(roundingTime.round({ p: "h", r: "down" }).toDigital({ p: "ms" })).toBe("01:00:00:000 AM");

  expect(roundingTime.round({ p: "ms", r: "up" }).toDigital({ p: "ms" })).toBe("01:02:03:004 AM");
  expect(roundingTime.round({ p: "s", r: "up" }).toDigital({ p: "ms" })).toBe("01:02:04:000 AM");
  expect(roundingTime.round({ p: "m", r: "up" }).toDigital({ p: "ms" })).toBe("01:03:00:000 AM");
  expect(roundingTime.round({ p: "h", r: "up" }).toDigital({ p: "ms" })).toBe("02:00:00:000 AM");

  const roundingTime3 = new Time(1, 2, 3, -499);
  expect(roundingTime3.round({ p: "ms" }).toDigital({ p: "ms" })).toBe("01:02:02:501 AM");
  const roundingTime4 = new Time(-1, -2, -3, -499);
  expect(roundingTime4.round({ p: "ms" }).toDigital({ p: "ms" })).toBe("-01:02:03:499 AM");


  /** Test comparisons */
  const comparisonTime = new Time(1, 2, 3, 4);
  const comparisonTime2 = new Time(1, 2, 3, 4);
  expect(comparisonTime.equals(comparisonTime2)).toBe(true);
  const comparisonTime3 = new Time(1, 2, 3, 5);
  expect(comparisonTime.equals(comparisonTime3)).toBe(false);
  expect(comparisonTime2.equals(comparisonTime3, { p: "s" })).toBe(true);
  const comparisonTime4 = new Time(1, 2, 3, 500);
  expect(comparisonTime2.equals(comparisonTime4, { p: "m", r: "nearest" })).toBe(true);


  /** Test arithmetic */
  const addTime = new DeltaTime(2, 3, 4, 5);
  expect(baseTime.add(addTime).toDigital()).toBe("03:05 AM");
  const negativeAddTime = new DeltaTime(-2, -3, -4, -5);
  expect(baseTime.add(negativeAddTime).toDigital()).toBe("-01:01 AM");

  expect(baseTime.subtract(addTime).toDigital()).toBe("-01:01 AM");
  expect(baseTime.subtract(negativeAddTime).toDigital()).toBe("03:05 AM");


  /** Test typechecking */
  expect(baseTime.typeof(baseTime)).toBe(true);
  expect(baseTime.typeof(addTime)).toBe(false);


  /** Test calcDelta */
  const deltaTime1 = new Time(2, 3, 4, 5);
  const deltaTime2 = new Time(1, 2, 3, 4);
  expect(Time.calcDelta(deltaTime2, deltaTime1).toDigital()).toBe("01:01");
  expect(Time.calcDelta(deltaTime1, deltaTime2).toDigital()).toBe("-01:01");

  const deltaTime3 = new Time(-1, -2, -3, -4);
  expect(Time.calcDelta(deltaTime2, deltaTime3).toDigital()).toBe("-02:04");
  expect(Time.calcDelta(deltaTime3, deltaTime2).toDigital()).toBe("02:04");
});
