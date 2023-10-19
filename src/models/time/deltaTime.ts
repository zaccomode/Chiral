import padNumber from "../../helpers/padNumber";
import { BaseTime } from "./baseTime";
import { TimeInterfaces } from "./interfaces";


type toDigitalOptions = {
  /** The specificity level to round to. Default = `"m"` */
  precision?: TimeInterfaces.TimePrecision,
  /** The specificity level to round to. Default = `"m"` */
  p?: TimeInterfaces.TimePrecision,
};
type toReadableOptions = toDigitalOptions & {
  /** Whether or not to completely spell out words for the time increments. Default = `false` */
  verbose?: boolean,
  /** Whether or not to completely spell out words for the time increments. Default = `false` */
  v?: boolean,
  /** Whether or not to include zeroes in the readout. Default = `false` */
  includeZeroes?: boolean,
  /** Whether or not to include zeroes in the readout. Default = `false` */
  iz?: boolean,
};


export class DeltaTime extends BaseTime implements
  TimeInterfaces.Operatable<DeltaTime>,
  TimeInterfaces.Readable<DeltaTime>,
  TimeInterfaces.Base<DeltaTime>,
  TimeInterfaces.Comparable<DeltaTime> {
  protected _type: string = "DeltaTime";


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
    const precision = options?.precision || options?.p || "m";

    const isNegative = this.hours < 0;
    const outTime = this.absolute();

    let out = isNegative ? "-" : "";
    out += `${padNumber(outTime.hours)}`;
    if (precision === "h") return out.trim();
    out += `:${padNumber(outTime.minutes)}`;
    if (precision === "m") return out.trim();
    out += `:${padNumber(outTime.seconds)}`;
    if (precision === "s") return out.trim();
    out += `:${padNumber(outTime.milliseconds, 3)}`;
    return out.trim();
  }

  /** Provides a human-readable readout of the deltaTime
   * @param options The options to use when generating the readout
   */
  toReadable(options?: toReadableOptions): string {
    const precision = options?.precision || options?.p || "m";
    const verbose = options?.verbose || options?.v || false;
    const includeZeroes = options?.includeZeroes || options?.iz || false;

    const isNegative = this.hours < 0;
    const outTime = this.absolute();

    let out = DeltaTime.INCREMENT_NAMES.negative[isNegative ? verbose ? 0 : 1 : 2];
    if (outTime.hours > 0 || includeZeroes) out += `${outTime.hours}${verbose
      ? outTime.hours === 1
        ? DeltaTime.INCREMENT_NAMES.h[1]
        : DeltaTime.INCREMENT_NAMES.h[0]
      : DeltaTime.INCREMENT_NAMES.h[2]
      }`;
    if (precision === "h") return out.trim();
    if (outTime.minutes > 0 || includeZeroes) out += `${outTime.minutes}${verbose
      ? outTime.minutes === 1
        ? DeltaTime.INCREMENT_NAMES.m[1]
        : DeltaTime.INCREMENT_NAMES.m[0]
      : DeltaTime.INCREMENT_NAMES.m[2]
      }`;
    if (precision === "m") return out.trim();
    if (outTime.seconds > 0 || includeZeroes) out += `${outTime.seconds}${verbose
      ? outTime.seconds === 1
        ? DeltaTime.INCREMENT_NAMES.s[1]
        : DeltaTime.INCREMENT_NAMES.s[0]
      : DeltaTime.INCREMENT_NAMES.s[2]
      }`;
    if (precision === "s") return out.trim();
    if (outTime.milliseconds > 0 || includeZeroes) out += `${outTime.milliseconds}${verbose
      ? outTime.milliseconds === 1
        ? DeltaTime.INCREMENT_NAMES.ms[1]
        : DeltaTime.INCREMENT_NAMES.ms[0]
      : DeltaTime.INCREMENT_NAMES.ms[2]
      }`;
    return out.trim();
  }


  // OPERATIONS
  absolute(): DeltaTime {
    return new DeltaTime(
      Math.abs(this.hours),
      Math.abs(this.minutes),
      Math.abs(this.seconds),
      Math.abs(this.milliseconds),
    );
  }

  round(options?: TimeInterfaces.roundOptions): DeltaTime {
    const precision = options?.precision ?? options?.p ?? "m";
    const rounding = options?.rounding ?? options?.r ?? "nearest";

    switch (precision) {
      case "ms": {
        return new DeltaTime(this.hours, this.minutes, this.seconds, this.milliseconds);
      }
      case "s": {
        switch (rounding) {
          case "up": return new DeltaTime(this.hours, this.minutes, this.seconds + 1, 0);
          case "down": return new DeltaTime(this.hours, this.minutes, this.seconds, 0);
          case "nearest": return new DeltaTime(
            this.hours, this.minutes,
            this.milliseconds >= 500 ? this.seconds + 1 : this.seconds,
            0
          );
        }
      }
      case "m": {
        const r = this.round({ p: "s", r: rounding });
        switch (rounding) {
          case "up": return new DeltaTime(r.hours, r.minutes + 1, 0, 0);
          case "down": return new DeltaTime(r.hours, r.minutes, 0, 0);
          case "nearest": return new DeltaTime(
            r.hours,
            r.seconds >= 30 ? r.minutes + 1 : r.minutes,
            0, 0
          );
        }
      }
      case "h": {
        const r = this.round({ p: "m", r: rounding });
        switch (rounding) {
          case "up": return new DeltaTime(r.hours + 1, 0, 0, 0);
          case "down": return new DeltaTime(r.hours, 0, 0, 0);
          case "nearest": return new DeltaTime(
            r.minutes >= 30 ? r.hours + 1 : r.hours,
            0, 0, 0
          );
        }
      }
      default: return this;
    }
  }


  // ARITHMETIC
  add(time: DeltaTime): DeltaTime {
    return new DeltaTime(
      this.hours + time.hours,
      this.minutes + time.minutes,
      this.seconds + time.seconds,
      this.milliseconds + time.milliseconds,
    );
  }

  subtract(time: DeltaTime): DeltaTime {
    return new DeltaTime(
      this.hours - time.hours,
      this.minutes - time.minutes,
      this.seconds - time.seconds,
      this.milliseconds - time.milliseconds,
    );
  }


  // COMPARISON
  equals(time: DeltaTime, options?: TimeInterfaces.compareOptions): boolean {
    const precision = options?.precision ?? options?.p ?? "ms";
    const rounding = options?.rounding ?? options?.r ?? "down";

    const r = this.round({ p: precision, r: rounding });

    return (r.hours === time.hours
      && r.minutes === time.minutes
      && r.seconds === time.seconds
      && r.milliseconds === time.milliseconds
    )
  }

  typeof(other: any): other is DeltaTime {
    return other._type === this._type;
  }


  // STATIC VALUES
  static readonly INCREMENT_NAMES = {
    h: [" hours ", " hour ", "h "],
    m: [" minutes ", " minute ", "m "],
    s: [" seconds ", " second ", "s "],
    ms: [" milliseconds ", " millisecond ", "ms "],
    negative: ["negative ", "-", ""],
  }
}