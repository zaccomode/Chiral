import { DeltaTime } from "./deltaTime";
import { Time } from "./time";

test("DeltaTime", () => {
  const baseTime = new DeltaTime(1, 2, 3, 4);
  const negativeTime = new DeltaTime(-1, -2, -3, -4);

  /** Test getters */
  expect(baseTime.hours).toBe(1);
  expect(baseTime.minutes).toBe(2);
  expect(baseTime.rawMinutes).toBe(62);
  expect(baseTime.seconds).toBe(3);
  expect(baseTime.rawSeconds).toBe(3723);
  expect(baseTime.milliseconds).toBe(4);
  expect(baseTime.rawMilliseconds).toBe(3723004);


  /** Test toDigital */
  expect(baseTime.toDigital()).toBe("01:02");
  expect(baseTime.toDigital({ p: "ms" })).toBe("01:02:03:004");

  expect(negativeTime.toDigital()).toBe("-01:02");
  expect(negativeTime.toDigital({ p: "ms" })).toBe("-01:02:03:004");


  /** Test toReadable */
  expect(baseTime.toReadable()).toBe("1h 2m");
  expect(baseTime.toReadable({ p: "ms" })).toBe("1h 2m 3s 4ms");
  expect(baseTime.toReadable({ v: true })).toBe("1 hour 2 minutes");
  expect(baseTime.toReadable({ p: "ms", v: true })).toBe("1 hour 2 minutes 3 seconds 4 milliseconds");

  expect(negativeTime.toReadable()).toBe("-1h 2m");  
  expect(negativeTime.toReadable({ p: "ms" })).toBe("-1h 2m 3s 4ms");
  expect(negativeTime.toReadable({ v: true })).toBe("negative 1 hour 2 minutes");
  expect(negativeTime.toReadable({ p: "ms", v: true })).toBe("negative 1 hour 2 minutes 3 seconds 4 milliseconds");


  /** Test arithmetic */
  const addTime = new DeltaTime(2, 3, 4, 5);
  expect(baseTime.add(addTime).toDigital()).toBe("03:05");
  const negativeAddTime = new DeltaTime(-2, -3, -4, -5);
  expect(baseTime.add(negativeAddTime).toDigital()).toBe("-01:01");

  expect(baseTime.subtract(addTime).toDigital()).toBe("-01:01");
  expect(baseTime.subtract(negativeAddTime).toDigital()).toBe("03:05");


  /** Test typechecking */
  expect(baseTime.typeof(baseTime)).toBe(true);
  expect(baseTime.typeof(new Time(1))).toBe(false);
});