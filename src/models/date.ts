import padNumber from "../helpers/padNumber";
import { Chiral } from "./types";

export default class RealDate implements Chiral.Date.I_Date<RealDate> {
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

    return (r.year === d.year && r.month === d.month && r.day === d.day);
  }

  isBefore(date: RealDate, params?: Chiral.Date.RoundingParams): boolean {
    const precision = params?.precision ?? params?.p ?? "d";
    const rounding = params?.rounding ?? params?.r ?? "down";

    const r = this.round({ precision, rounding });
    const d = date.round({ precision, rounding });

    switch (precision) {
      case "d": return r.day < d.day
        || (r.day === d.day
          && r.month < d.month)
        || (r.day === d.day
          && r.month === d.month
          && r.year < d.year);
      case "m": return r.month < d.month
        || (r.month === d.month
          && r.year < d.year);
      case "y": return r.year < d.year;
      default: return false;
    }
  }

  isAfter(date: RealDate, params?: Chiral.Date.RoundingParams): boolean {
    const precision = params?.precision ?? params?.p ?? "d";
    const rounding = params?.rounding ?? params?.r ?? "down";

    const r = this.round({ precision, rounding });
    const d = date.round({ precision, rounding });

    switch (precision) {
      case "d": return r.day > d.day
        || (r.day === d.day
          && r.month > d.month)
        || (r.day === d.day
          && r.month === d.month
          && r.year > d.year);
      case "m": return r.month > d.month
        || (r.month === d.month
          && r.year > d.year);
      case "y": return r.year > d.year;
      default: return false;
    }
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
}