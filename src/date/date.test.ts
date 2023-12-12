import { RealDate } from "./date";

test("RealDate", () => {
  const baseDate = new RealDate(2021, 1, 1);

  /** Test getters */
  expect(baseDate.year).toBe(2021);
  expect(baseDate.month).toBe(1);
  expect(baseDate.monthName).toBe("January");
  expect(baseDate.day).toBe(1);

  /** Test setters */
  const setDate = new RealDate();
  setDate.year = 2021;
  setDate.month = 1;
  setDate.day = 1;
  expect(setDate.year).toBe(2021);
  expect(setDate.month).toBe(1);
  expect(setDate.monthName).toBe("January");
  expect(setDate.day).toBe(1);

  /** Setter arithmetic */
  const strangeDate = new RealDate();
  strangeDate.year += 1;
  expect(strangeDate.year).toBe(1901);
  strangeDate.year -= 2;
  expect(strangeDate.year).toBe(1899);
  strangeDate.month += 3;
  expect(strangeDate.year).toBe(1899);


  /** Test toReadable */
  const readableDate = new RealDate(2021, 3, 1);
  expect(readableDate.toReadable()).toBe("01/03/2021");
  expect(readableDate.toReadable({ f: "DD/MM/YYYY" })).toBe("01/03/2021");
  expect(readableDate.toReadable({ f: "MM/DD/YYYY" })).toBe("03/01/2021");
  expect(readableDate.toReadable({ f: "YYYY/MM/DD" })).toBe("2021/03/01");
  expect(readableDate.toReadable({ f: "Month DD, YYYY" })).toBe("March 01, 2021");


  /** Test round */
  const roundDate = new RealDate(2021, 3, 23);
  expect(roundDate.round().toReadable()).toBe("23/03/2021");
  expect(roundDate.round({ p: "d" }).toReadable()).toBe("23/03/2021");
  expect(roundDate.round({ p: "m" }).toReadable()).toBe("01/03/2021");
  expect(roundDate.round({ p: "y" }).toReadable()).toBe("01/01/2021");

  expect(roundDate.round({ p: "d", r: "up" }).toReadable()).toBe("23/03/2021");
  expect(roundDate.round({ p: "m", r: "up" }).toReadable()).toBe("01/04/2021");
  expect(roundDate.round({ p: "y", r: "up" }).toReadable()).toBe("01/01/2022");

  expect(roundDate.round({ p: "d", r: "down" }).toReadable()).toBe("23/03/2021");
  expect(roundDate.round({ p: "m", r: "down" }).toReadable()).toBe("01/03/2021");
  expect(roundDate.round({ p: "y", r: "down" }).toReadable()).toBe("01/01/2021");


  /** Test arithmetic */
  const arithmeticDate = new RealDate(2021, 3, 23);
  expect(arithmeticDate.toReadable()).toBe("23/03/2021");
  expect(arithmeticDate.add().toReadable()).toBe("24/03/2021");
  expect(arithmeticDate.add({ u: "d", v: 1 }).toReadable()).toBe("24/03/2021");
  expect(arithmeticDate.add({ u: "m", v: 1 }).toReadable()).toBe("23/04/2021");
  expect(arithmeticDate.add({ u: "y", v: 1 }).toReadable()).toBe("23/03/2022");

  expect(arithmeticDate.add([
    { u: "d", v: 1 }, 
    { u: "m", v: 1 }
  ]).toReadable()).toBe("24/04/2021");
  expect(arithmeticDate.add([
    { u: "d", v: 1 }, 
    { u: "m", v: 1 },
    { u: "y", v: 1 }
  ]).toReadable()).toBe("24/04/2022");

  // Subtract
  expect(arithmeticDate.subtract().toReadable()).toBe("22/03/2021");
  expect(arithmeticDate.subtract({ u: "d", v: 1 }).toReadable()).toBe("22/03/2021");
  expect(arithmeticDate.subtract({ u: "m", v: 1 }).toReadable()).toBe("23/02/2021");
  expect(arithmeticDate.subtract({ u: "y", v: 1 }).toReadable()).toBe("23/03/2020");

  expect(arithmeticDate.subtract([
    { u: "d", v: 1 }, 
    { u: "m", v: 1 }
  ]).toReadable()).toBe("22/02/2021");
  expect(arithmeticDate.subtract([
    { u: "d", v: 1 }, 
    { u: "m", v: 1 },
    { u: "y", v: 1 }
  ]).toReadable()).toBe("22/02/2020");


  /** Test comparison */
  const equalDate1 = new RealDate(2021, 3, 23);
  const equalDate2 = new RealDate(2021, 3, 23);
  const equalDate3 = new RealDate(2021, 3, 24);
  const equalDate4 = new RealDate(2021, 4, 23);

  // Equals
  expect(equalDate1.equals(equalDate2)).toBe(true);
  expect(equalDate1.equals(equalDate3)).toBe(false);

  expect(equalDate1.equals(equalDate2, { p: "d" })).toBe(true);
  expect(equalDate1.equals(equalDate3, { p: "d" })).toBe(false);

  expect(equalDate1.equals(equalDate2, { p: "m" })).toBe(true);
  expect(equalDate1.equals(equalDate3, { p: "m" })).toBe(true);

  expect(equalDate1.equals(equalDate2, { p: "y" })).toBe(true);
  expect(equalDate1.equals(equalDate3, { p: "y" })).toBe(true);

  expect(equalDate1.equals(equalDate4, { p: "d" })).toBe(false);
  expect(equalDate1.equals(equalDate4, { p: "m" })).toBe(false);
  expect(equalDate1.equals(equalDate4, { p: "y" })).toBe(true);


  // isBefore
  expect(equalDate1.isBefore(equalDate2)).toBe(false);
  expect(equalDate1.isBefore(equalDate3)).toBe(true);

  expect(equalDate1.isBefore(equalDate2, { p: "d" })).toBe(false);
  expect(equalDate1.isBefore(equalDate3, { p: "d" })).toBe(true);

  expect(equalDate1.isBefore(equalDate2, { p: "m" })).toBe(false);
  expect(equalDate1.isBefore(equalDate3, { p: "m" })).toBe(false);

  expect(equalDate1.isBefore(equalDate2, { p: "y" })).toBe(false);
  expect(equalDate1.isBefore(equalDate3, { p: "y" })).toBe(false);

  expect(equalDate1.isBefore(equalDate4, { p: "d" })).toBe(true);
  expect(equalDate1.isBefore(equalDate4, { p: "m" })).toBe(true);
  expect(equalDate1.isBefore(equalDate4, { p: "y" })).toBe(false);

  expect(equalDate4.isBefore(equalDate1, { p: "d" })).toBe(false);
  expect(equalDate4.isBefore(equalDate1, { p: "m" })).toBe(false);
  expect(equalDate4.isBefore(equalDate1, { p: "y" })).toBe(false);


  // isAfter
  expect(equalDate1.isAfter(equalDate2)).toBe(false);
  expect(equalDate3.isAfter(equalDate1)).toBe(true);

  expect(equalDate1.isAfter(equalDate2, { p: "d" })).toBe(false);
  expect(equalDate3.isAfter(equalDate1, { p: "d" })).toBe(true);

  expect(equalDate1.isAfter(equalDate2, { p: "m" })).toBe(false);
  expect(equalDate3.isAfter(equalDate1, { p: "m" })).toBe(false);

  expect(equalDate1.isAfter(equalDate2, { p: "y" })).toBe(false);
  expect(equalDate3.isAfter(equalDate1, { p: "y" })).toBe(false);

  expect(equalDate4.isAfter(equalDate1, { p: "d" })).toBe(true);
  expect(equalDate4.isAfter(equalDate1, { p: "m" })).toBe(true);
  expect(equalDate4.isAfter(equalDate1, { p: "y" })).toBe(false);


  // isBetween
  expect(equalDate1.isBetween(equalDate2, equalDate3)).toBe(true);
  expect(equalDate1.isBetween(equalDate3, equalDate2)).toBe(true);

  expect(equalDate3.isBetween(equalDate1, equalDate2)).toBe(false);
  expect(equalDate3.isBetween(equalDate2, equalDate1)).toBe(false);

  expect(equalDate3.isBetween(equalDate1, equalDate2, { p: "m" })).toBe(true);
  expect(equalDate3.isBetween(equalDate2, equalDate1, { p: "m" })).toBe(true);


  /** Test static methods */
  // fromJson
  const fromJsonDate = new RealDate(2021, 3, 23);
  const fromJsonString = JSON.parse(JSON.stringify(fromJsonDate));
  const fromJsonDate2 = RealDate.fromJson(fromJsonString);
  expect(fromJsonDate.equals(fromJsonDate2)).toBe(true);
  expect(fromJsonDate.day).toBe(fromJsonDate2.day);
});