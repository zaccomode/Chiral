import { Round } from "../helpers";
import padNumber from "../helpers/padNumber";
import { Chiral } from "../types/types";

export class RealTime implements Chiral.Time.I_Time<RealTime> {
  protected _type: "RealTime" = "RealTime";


  private _millis: number = 0;


  constructor(
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0,
  ) {
    this._millis = this._hoursToMillis(hours)
      + this._minutesToMillis(minutes)
      + this._secondsToMillis(seconds)
      + milliseconds;
    return this;
  }


  // CONVERSION
  private _hoursToMillis(hours: number) {
    return hours * 60 * 60 * 1000;
  }
  private _minutesToMillis(minutes: number) {
    return minutes * 60 * 1000;
  }
  private _secondsToMillis(seconds: number) {
    return seconds * 1000;
  }
  private _millisToHours(millis: number) {
    return Round.floor(millis / this._hoursToMillis(1));
  }
  private _millisToMinutes(millis: number) {
    return Round.floor(millis / this._minutesToMillis(1));
  }
  private _millisToSeconds(millis: number) {
    return Round.floor(millis / this._secondsToMillis(1));
  }


  // GETTERS
  get hours() {
    return this._millisToHours(this._millis);
  }
  get minutes() {
    return this._millisToMinutes(this._millis)
      - (this.hours * 60);
  }
  get seconds() {
    return this._millisToSeconds(this._millis)
      - (this.minutes * 60)
      - (this.hours * 60 * 60);
  }
  get milliseconds() {
    return this._millis
      - (this.seconds * 1000)
      - (this.minutes * 60 * 1000)
      - (this.hours * 60 * 60 * 1000);
  }


  // SETTERS
  set hours(n: number) {
    this._millis -= this._hoursToMillis(this.hours);
    this._millis += this._hoursToMillis(n);
  }
  set minutes(n: number) {
    this._millis -= this._minutesToMillis(this.minutes);
    this._millis += this._minutesToMillis(n);
  }
  set seconds(n: number) {
    this._millis -= this._secondsToMillis(this.seconds);
    this._millis += this._secondsToMillis(n);
  }
  set milliseconds(n: number) {
    this._millis -= this.milliseconds;
    this._millis += n;
  }


  // READOUTS
  toDigital(params?: Chiral.Time.ReadoutParams): string {
    const military = params?.military || params?.m || false;
    const precision = params?.precision || params?.p || "s";

    // Because of our normalisation algorithm, we can assume that 
    // if the hours are negative, then all values are negative, thus we can
    // we can run just this one check to see if the time is negative.
    const isNegative = this.hours < 0;
    const outTime = this.absolute();

    let suffix = military ? RealTime.SUFFIXES.mil : RealTime.SUFFIXES.AM;
    const isPm = !military && outTime.hours >= 12;
    if (isPm) {
      outTime.hours -= 12;
      suffix = RealTime.SUFFIXES.PM;
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


  // METHODS
  copy(): RealTime {
    return new RealTime(this.hours, this.minutes, this.seconds, this.milliseconds);
  }


  // ARITHMETIC
  absolute(): RealTime {
    return new RealTime(
      Math.abs(this.hours),
      Math.abs(this.minutes),
      Math.abs(this.seconds),
      Math.abs(this.milliseconds),
    );
  }

  round(params?: Chiral.Time.RoundingParams): RealTime {
    const precision = params?.precision || params?.p || "ms";
    const rounding = params?.rounding || params?.r || "down";

    switch (precision) {
      case "ms": {
        return new RealTime(this.hours, this.minutes, this.seconds, this.milliseconds);
      }
      case "s": {
        switch (rounding) {
          case "up": return new RealTime(this.hours, this.minutes, this.seconds + 1, 0);
          case "down": return new RealTime(this.hours, this.minutes, this.seconds, 0);
          case "nearest": return new RealTime(
            this.hours, this.minutes,
            this.milliseconds >= 500 ? this.seconds + 1 : this.seconds,
            0
          );
        }
      }
      case "m": {
        const r = this.round({ p: "s", r: rounding });
        switch (rounding) {
          case "up": return new RealTime(r.hours, r.minutes + 1, 0, 0);
          case "down": return new RealTime(r.hours, r.minutes, 0, 0);
          case "nearest": return new RealTime(
            r.hours,
            r.seconds >= 30 ? r.minutes + 1 : r.minutes,
            0, 0
          );
        }
      }
      case "h": {
        const r = this.round({ p: "m", r: rounding });
        switch (rounding) {
          case "up": return new RealTime(r.hours + 1, 0, 0, 0);
          case "down": return new RealTime(r.hours, 0, 0, 0);
          case "nearest": return new RealTime(
            r.minutes >= 30 ? r.hours + 1 : r.hours,
            0, 0, 0
          );
        }
      }
      default: return this.copy();
    }
  }

  add(params?: Chiral.Time.ArithmeticParams | Chiral.Time.ArithmeticParams[]): RealTime {
    if (Array.isArray(params)) {
      let out = this.copy();
      for (const param of params) out = out.add(param);
      return out;
    }

    const unit = params?.unit || params?.u || "s";
    const value = params?.value || params?.v || 1;
    const out = this.copy();

    switch (unit) {
      case "h": {
        out.hours += value;
        return out;
      }
      case "m": {
        out.minutes += value;
        return out;
      }
      case "s": {
        out.seconds += value;
        return out;
      }
      case "ms": {
        out.milliseconds += value;
        return out;
      }
      default: return this.copy();
    }
  }

  subtract(params?: Chiral.Time.ArithmeticParams | Chiral.Time.ArithmeticParams[]): RealTime {
    if (Array.isArray(params)) {
      let out = this.copy();
      for (const param of params) {
        out = out.subtract(param);
      }
      return out;
    }

    const unit = params?.unit || params?.u || "s";
    const value = params?.value || params?.v || 1;
    const out = this.copy();

    switch (unit) {
      case "h": {
        out.hours -= value;
        return out;
      }
      case "m": {
        out.minutes -= value;
        return out;
      }
      case "s": {
        out.seconds -= value;
        return out;
      }
      case "ms": {
        out.milliseconds -= value;
        return out;
      }
      default: return this.copy();
    }
  }


  // COMPARISON
  equals(time: RealTime, params?: Chiral.Time.RoundingParams): boolean {
    const precision = params?.precision || params?.p || "ms";
    const rounding = params?.rounding || params?.r || "down";

    const r = this.round({ p: precision, r: rounding });
    const t = time.round({ p: precision, r: rounding });

    return (r.hours === t.hours
      && r.minutes === t.minutes
      && r.seconds === t.seconds
      && r.milliseconds === t.milliseconds
    )
  }

  isBefore(time: RealTime, params?: Chiral.Time.RoundingParams): boolean {
    const precision = params?.precision || params?.p || "ms";
    const rounding = params?.rounding || params?.r || "down";

    const r = this.round({ p: precision, r: rounding });
    const t = time.round({ p: precision, r: rounding });

    switch (precision) {
      case "ms": return r.hours < t.hours
        || (r.hours === t.hours
          && r.minutes < t.minutes)
        || (r.hours === t.hours
          && r.minutes === t.minutes
          && r.seconds < t.seconds)
        || (r.hours === t.hours
          && r.minutes === t.minutes
          && r.seconds === t.seconds
          && r.milliseconds < t.milliseconds);
      case "s": return r.hours < t.hours
        || (r.hours === t.hours
          && r.minutes < t.minutes)
        || (r.hours === t.hours
          && r.minutes === t.minutes
          && r.seconds < t.seconds);
      case "m": return r.hours < t.hours
        || (r.hours === t.hours
          && r.minutes < t.minutes);
      case "h": return r.hours < t.hours;
      default: return false;
    }
  }

  isAfter(time: RealTime, params?: Chiral.Time.RoundingParams): boolean {
    const precision = params?.precision || params?.p || "ms";
    const rounding = params?.rounding || params?.r || "down";

    const r = this.round({ p: precision, r: rounding });
    const t = time.round({ p: precision, r: rounding });

    switch (precision) {
      case "ms": return r.hours > t.hours
        || (r.hours === t.hours
          && r.minutes > t.minutes)
        || (r.hours === t.hours
          && r.minutes === t.minutes
          && r.seconds > t.seconds)
        || (r.hours === t.hours
          && r.minutes === t.minutes
          && r.seconds === t.seconds
          && r.milliseconds > t.milliseconds);
      case "s": return r.hours > t.hours
        || (r.hours === t.hours
          && r.minutes > t.minutes)
        || (r.hours === t.hours
          && r.minutes === t.minutes
          && r.seconds > t.seconds);
      case "m": return r.hours > t.hours
        || (r.hours === t.hours
          && r.minutes > t.minutes);
      case "h": return r.hours > t.hours;
      default: return false;
    }
  }

  isBetween(start: RealTime, end: RealTime, params?: Chiral.Time.RoundingParams): boolean {
    return this.equals(start, params) || this.equals(end, params) ||
      (this.isAfter(start, params) && this.isBefore(end, params));
  }

  typeof(other: any): other is RealTime {
    return other._type === "RealTime";
  }


  // STATIC
  static readonly SUFFIXES = {
    AM: " AM",
    PM: " PM",
    mil: "",
  };


  /** Creates a new `RealTime` from the current system time */
  static now() {
    const now = new Date();
    return new RealTime(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );
  }

  /** Creates a new `RealTime` from a JSON object */
  static fromJson(json: any): RealTime {
    if (!json.hasOwnProperty("_millis")) throw new Error("Invalid JSON");
    const time = new RealTime();
    time._millis = json._millis;
    return time;
  }
}