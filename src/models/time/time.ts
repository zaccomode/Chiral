import padNumber from "../../helpers/padNumber";
import { BaseTime } from "./baseTime";
import { DeltaTime } from "./deltaTime";
import { TimeInterfaces } from "./interfaces";

type toDigitalOptions = {
  /** Whether or not to use "military" aka 24-hour time. Default = `false` */
  military?: boolean,
  /** Whether or not to use "military" aka 24-hour time. Default = `false` */
  m?: boolean,
  /** The precision level to round to. Default = `"m"` */
  precision?: TimeInterfaces.TimePrecision,
  /** The precision level to round to. Default = `"m"` */
  p?: TimeInterfaces.TimePrecision,
};


export class Time extends BaseTime implements
  TimeInterfaces.Readable<Time>,
  TimeInterfaces.Base<Time>,
  TimeInterfaces.Comparable<Time> {
  protected _type: string = "RealTime";


  constructor(
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0,
  ) {
    super(hours, minutes, seconds, milliseconds);
    return this;
  }


  // READOUTS
  toDigital(options?: toDigitalOptions): string {
    const military = options?.military || options?.m || false;
    const precision = options?.precision || options?.p || "m";

    // Because of our normalisation algorithm, we can assume that 
    // if the hours are negative, then all values are negative, thus we can
    // we can run just this one check to see if the time is negative.
    const isNegative = this.hours < 0;
    const outTime = this.absolute();

    let suffix = military ? Time.SUFFIXES.mil : Time.SUFFIXES.AM;
    const isPm = !military && outTime.hours >= 12;
    if (isPm) {
      outTime.hours -= 12;
      suffix = Time.SUFFIXES.PM;
    }

    let out = isNegative ? "-" : "";
    if (Math.abs(outTime.hours) === 0 && isPm) out += "12";
    else out += `${padNumber(Math.abs(outTime.hours))}`;
    if (precision === "h") return (out + suffix).trim();
    out += `:${padNumber(Math.abs(outTime.minutes))}`;
    if (precision === "m") return (out + suffix).trim();
    out += `:${padNumber(Math.abs(outTime.seconds))}`;
    if (precision === "s") return (out + suffix).trim();
    out += `:${padNumber(Math.abs(outTime.milliseconds), 3)}`;
    return (out + suffix).trim();
  }

  toString(): string {
    return this.toDigital();
  }


  // METHODS
  absolute(): Time {
    return new Time(
      Math.abs(this.hours),
      Math.abs(this.minutes),
      Math.abs(this.seconds),
      Math.abs(this.milliseconds),
    );
  }

  round(options?: TimeInterfaces.roundOptions): Time {
    const precision = options?.precision || options?.p || "m";
    const rounding = options?.rounding || options?.r || "nearest";

    switch (precision) { 
      case "ms": { 
        return new Time(this.hours, this.minutes, this.seconds, this.milliseconds);
      }
      case "s": {
        switch (rounding) {
          case "up": return new Time(this.hours, this.minutes, this.seconds + 1, 0);
          case "down": return new Time(this.hours, this.minutes, this.seconds, 0);
          case "nearest": return new Time(
            this.hours, this.minutes,
            this.milliseconds >= 500 ? this.seconds + 1 : this.seconds,
            0
          );
        }
      }
      case "m": {
        const r = this.round({ p: "s", r: rounding });
        switch (rounding) {
          case "up": return new Time(r.hours, r.minutes + 1, 0, 0);
          case "down": return new Time(r.hours, r.minutes, 0, 0);
          case "nearest": return new Time(
            r.hours,
            r.seconds >= 30 ? r.minutes + 1 : r.minutes,
            0, 0
          );
        }
      }
      case "h": {
        const r = this.round({ p: "m", r: rounding });
        switch (rounding) {
          case "up": return new Time(r.hours + 1, 0, 0, 0);
          case "down": return new Time(r.hours, 0, 0, 0);
          case "nearest": return new Time(
            r.minutes >= 30 ? r.hours + 1 : r.hours,
            0, 0, 0
          );
        }
      }
      default: return this;
    }
  }


  // COMPARISON
  equals(time: Time, options?: TimeInterfaces.compareOptions): boolean {
    const precision = options?.precision ?? options?.p ?? "ms";
    const rounding = options?.rounding ?? options?.r ?? "down";

    const r = this.round({ p: precision, r: rounding });
    const t = time.round({ p: precision, r: rounding });
    
    return (r.hours === t.hours 
      && r.minutes === t.minutes 
      && r.seconds === t.seconds 
      && r.milliseconds === t.milliseconds
    )
  }

  typeof(other: any): other is Time {
    return other._type === this._type;
  }


  // ARITHMETIC
  /** Adds a `DeltaTime` object to this `Time`
   * @param time The `DeltaTime` object to add
   */
  add(time: DeltaTime): Time { 
    return new Time(
      this.hours + time.hours,
      this.minutes + time.minutes,
      this.seconds + time.seconds,
      this.milliseconds + time.milliseconds,
    );
  }

  /** Subtracts a `DeltaTime` object from this `Time`
   * @param time The `DeltaTime` object to subtract
   */
  subtract(time: DeltaTime): Time {
    return new Time(
      this.hours - time.hours,
      this.minutes - time.minutes,
      this.seconds - time.seconds,
      this.milliseconds - time.milliseconds,
    );
  }


  // STATIC METHODS
  /** Returns a new Time object with the current system time */
  static now(): Time {
    const date = new Date();
    return new Time(
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    );
  }

  /** Creates a `DeltaTime` instance using the time between two provided times 
   * @param t1 The first time
   * @param t2 The second time
  */
  static calcDelta(t1: Time, t2: Time): DeltaTime { 
    return new DeltaTime(
      t2.hours - t1.hours,
      t2.minutes - t1.minutes,
      t2.seconds - t1.seconds,
      t2.milliseconds - t1.milliseconds,
    );
  }


  // STATIC VALUES
  static readonly SUFFIXES = {
    AM: " AM",
    PM: " PM",
    mil: "",
  };
}