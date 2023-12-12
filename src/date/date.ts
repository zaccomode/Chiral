import padNumber from "../helpers/padNumber";
import { Chiral } from "../types/types";

export class RealDate implements Chiral.Date.I_Date<RealDate> {
  protected _type: "RealDate" = "RealDate";

  private _date: Date;


  constructor(
    year: number = 0,
    month: number = 1,
    day: number = 1,
  ) {
    this._date = new Date(year, month - 1, day);
  }


  get year(): number {
    return this._date.getFullYear();
  }
  get month(): number {
    return this._date.getMonth() + 1;
  }
  get monthName(): string {
    return RealDate.MONTHS[this._date.getMonth()];
  }
  get day(): number {
    return this._date.getDate();
  }
  get raw(): Date {
    return new Date(this._date);
  }


  set year(n: number) {
    this._date.setFullYear(n);
  }
  set month(n: number) {
    this._date.setMonth(n - 1);
  }
  set day(n: number) {
    this._date.setDate(n);
  }


  // READOUTS
  toReadable(params?: Chiral.Date.ReadoutParams): string {
    const format = params?.format ?? params?.f ?? "DD/MM/YYYY";

    const day = padNumber(this.day),
      month = padNumber(this.month),
      monthName = this.monthName,
      year = padNumber(this.year, 4);

    switch (format) {
      case "DD/MM/YYYY": return `${day}/${month}/${year}`;
      case "MM/DD/YYYY": return `${month}/${day}/${year}`;
      case "YYYY/MM/DD": return `${year}/${month}/${day}`;
      case "Month DD, YYYY": return `${monthName} ${day}, ${year}`;
      default: return `${day}/${month}/${year}`;
    }
  }


  // METHODS
  copy(): RealDate {
    return new RealDate(this.year, this.month, this.day);
  }


  // ARITHMETIC
  round(params?: Chiral.Date.RoundingParams): RealDate {
    const precision = params?.precision ?? params?.p ?? "d";
    const rounding = params?.rounding ?? params?.r ?? "down";

    switch (precision) {
      case "d": {
        return new RealDate(this.year, this.month, this.day);
      }
      case "m": {
        const r = this.round({ precision: "d", rounding });
        switch (rounding) {
          case "up": return new RealDate(r.year, r.month + 1, 1);
          case "down": return new RealDate(r.year, r.month, 1);
          case "nearest": return new RealDate(
            r.year,
            r.day >= 15 ? r.month + 1 : r.month,
            1,
          )
        }
      }
      case "y": {
        const r = this.round({ precision: "m", rounding });
        switch (rounding) {
          case "up": return new RealDate(r.year + 1, 1, 1);
          case "down": return new RealDate(r.year, 1, 1);
          case "nearest": return new RealDate(
            r.month >= 6 ? r.year + 1 : r.year,
            1, 1,
          );
        }
      }
      default: return this;
    }
  }

  add(params?: Chiral.Date.ArithmeticParams | Chiral.Date.ArithmeticParams[]): RealDate {
    if (Array.isArray(params)) {
      let out = this.copy();
      for (const p of params) out = out.add(p);
      return out;
    }

    const unit = params?.unit ?? params?.u ?? "d";
    const value = params?.value ?? params?.v ?? 1;
    const out = this.copy();

    switch (unit) {
      case "d": {
        out.day += value;
        return out;
      }
      case "m": {
        out.month += value;
        return out;
      }
      case "y": {
        out.year += value;
        return out;
      }
      default: return out;
    }
  }

  subtract(params?: Chiral.Date.ArithmeticParams | Chiral.Date.ArithmeticParams[]): RealDate {
    if (Array.isArray(params)) {
      let out = this.copy();
      for (const p of params) out = out.subtract(p);
      return out;
    }

    const unit = params?.unit ?? params?.u ?? "d";
    const value = params?.value ?? params?.v ?? 1;
    const out = this.copy();

    switch (unit) {
      case "d": {
        out.day -= value;
        return out;
      }
      case "m": {
        out.month -= value;
        return out;
      }
      case "y": {
        out.year -= value;
        return out;
      }
      default: return out;
    }
  }


  // COMPARISON
  equals(date: RealDate, params?: Chiral.Date.RoundingParams): boolean {
    const precision = params?.precision ?? params?.p ?? "d";
    const rounding = params?.rounding ?? params?.r ?? "down";

    const r = this.round({ precision, rounding });
    const d = date.round({ precision, rounding });

    return r.raw.getTime() === d.raw.getTime();
  }

  isBefore(date: RealDate, params?: Chiral.Date.RoundingParams): boolean {
    const precision = params?.precision ?? params?.p ?? "d";
    const rounding = params?.rounding ?? params?.r ?? "down";

    const d = this.round({ precision, rounding });
    const o = date.round({ precision, rounding });

    return d.raw.getTime() < o.raw.getTime();
  }

  isAfter(date: RealDate, params?: Chiral.Date.RoundingParams): boolean {
    const precision = params?.precision ?? params?.p ?? "d";
    const rounding = params?.rounding ?? params?.r ?? "down";

    const r = this.round({ precision, rounding });
    const d = date.round({ precision, rounding });

    return r.raw.getTime() > d.raw.getTime();
  }

  isBetween(start: RealDate, end: RealDate, params?: Chiral.Date.RoundingParams): boolean {
    return this.equals(start, params) || this.equals(end, params)
      || (this.isAfter(start, params) && this.isBefore(end, params));
  }

  typeof(other: any): other is RealDate {
    return other._type === this._type;
  }


  // STATIC
  static readonly MONTHS = [
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December",
  ];

  /** Creates a new `RealDate` from the current system date */
  static now(): RealDate {
    const d = new Date();
    return new RealDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  /** Creates a new `RealDate` from a JSON object */
  static fromJson(json: any): RealDate {
    if (!json.hasOwnProperty("_date")) throw new Error("Invalid JSON");
    const date = new RealDate();
    date._date = new Date(json._date);
    return date;
  }
}