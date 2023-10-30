export namespace Chiral {
  export type RoundingType = "up" | "down" | "nearest";


  export namespace Date {
    export type UnitType = "y" | "m" | "d";
    export type DateFormat = "DD/MM/YYYY"
      | "MM/DD/YYYY"
      | "YYYY/MM/DD"
      | "Month DD, YYYY";


    export type RoundingParams = {
      /** The precision level to round to. Default = `"d"` */
      precision?: UnitType,
      /** The precision level to round to. Default = `"d"` */
      p?: UnitType,
      /** The type of rounding to use. Default = `"down"` */
      rounding?: RoundingType,
      /** The type of rounding to use. Default = `"down"` */
      r?: RoundingType,
    }

    export type ArithmeticParams = {
      /** The unit type to add to the current date. Default = `"d"` */
      unit?: UnitType,
      /** The unit type to add to the current date. Default = `"d"` */
      u?: UnitType,
      /** The value to add to the current date. Default = `1` */
      value?: number,
      /** The value to add to the current date. Default = `1` */
      v?: number,
    }

    export type ReadoutParams = {
      /** The format to use when generating the readout. Default = `"DD/MM/YYYY"` */
      format?: DateFormat;
      /** The format to use when generating the readout. Default = `"DD/MM/YYYY"` */
      f?: DateFormat;
    }


    export interface I_Date<T> {
      get year(): number;
      get month(): number;
      get day(): number;

      set year(n: number);
      set month(n: number);
      set day(n: number);


      /** Provides a classic readout of the date 
       * @param params The parameters to use when generating the readout
      */
      toReadable(params?: ReadoutParams): string;


      /** Returns a new date object that has been rounded off to the nearest
       * precision level. This function will round all values below the precision
       * level before it. For example, if the precision is "m", then the days
       * will be rounded before the months are rounded.
       */
      round(params?: RoundingParams): T;

      /** Returns a new date that includes the sum of the current date and any
       * new parameters. 
       * @param params The parameters to add to the current date
       */
      add(params?: ArithmeticParams | ArithmeticParams[]): T;

      /** Returns a new date that includes the difference between the current
       * date and any new parameters. 
       * @param params The parameters to subtract from the current date
       */
      subtract(params?: ArithmeticParams | ArithmeticParams[]): T;


      /** Checks if the current date is equal to the provided date. 
       * @param date The date to compare to
       * @param params The parameters to use when comparing the dates
       */
      equals(date: T, params?: RoundingParams): boolean;

      /** Checks if the current date is before the provided date. 
       * @param date The date to compare to
       * @param params The parameters to use when comparing the dates
       */
      isBefore(date: T, params?: RoundingParams): boolean;

      /** Checks if the current date is after the provided date. 
       * @param date The date to compare to
       * @param params The parameters to use when comparing the dates
       */
      isAfter(date: T, params?: RoundingParams): boolean;

      /** Checks if the current date is between the provided dates. 
       * @param start The starting date to compare to
       * @param end The ending date to compare to
       * @param params The parameters to use when comparing the dates
       */
      isBetween(start: T, end: T, params?: RoundingParams): boolean;

      /** Checks if the supplied object is an instance of a Date
       * @param other The object to check
       */
      typeof(other: any): other is T;
    }
  }


  export namespace Time {
    export type UnitType = "h" | "m" | "s" | "ms";

    export type RoundingParams = {
      /** The specificity level to round to. Default = `"ms"` */
      precision?: UnitType,
      /** The specificity level to round to. Default = `"ms"` */
      p?: UnitType,
      /** The type of rounding to use. Default = `"down"` */
      rounding?: RoundingType,
      /** The type of rounding to use. Default = `"down"` */
      r?: RoundingType,
    }

    export type ReadoutParams = {
      /** Whether or not to use "military" aka 24-hour time. Default = `false` */
      military?: boolean,
      /** Whether or not to use "military" aka 24-hour time. Default = `false` */
      m?: boolean,
      /** The precision level to round to. Default = `"s"` */
      precision?: UnitType,
      /** The precision level to round to. Default = `"s"` */
      p?: UnitType,
    };

    export type ArithmeticParams = {
      /** The unit type to add to the current time. Default = `"s"` */
      unit?: UnitType,
      /** The unit type to add to the current time. Default = `"s"` */
      u?: UnitType,
      /** The value to add to the current time. Default = `1` */
      value?: number,
      /** The value to add to the current time. Default = `1` */
      v?: number,
    }


    export interface I_Time<T> {
      get hours(): number;
      get minutes(): number;
      get seconds(): number;
      get milliseconds(): number;

      set hours(n: number);
      set minutes(n: number);
      set seconds(n: number);
      set milliseconds(n: number);


      /** Provides a digital-like readout of the current time
       * @param params The parameters to use when generating the readout
       */
      toDigital(params?: ReadoutParams): string;


      /** Returns a new Time that has been rounded according to the supplied
       * parameters.
       * @param params The parameters to use when rounding the time
       */
      round(params?: RoundingParams): T;

      /** Returns a new time that includes the sum of the current time and any
       * new parameters. 
       * @param params The parameters to add to the current time
       */
      add(params?: ArithmeticParams | ArithmeticParams[]): T;

      /** Returns a new time that includes the difference between the current
       * time and any new parameters. 
       * @param params The parameters to subtract from the current time
       */
      subtract(params?: ArithmeticParams | ArithmeticParams[]): T;


      /** Checks if the current time is equal to the provided time. 
       * @param time The time to compare to
       * @param params The parameters to use when comparing the times
       */
      equals(time: T, params?: RoundingParams): boolean;

      /** Checks if the current time is before the provided time. 
       * @param time The time to compare to
       * @param params The parameters to use when comparing the times
       */
      isBefore(time: T, params?: RoundingParams): boolean;

      /** Checks if the current time is after the provided time. 
       * @param time The time to compare to
       * @param params The parameters to use when comparing the times
       */
      isAfter(time: T, params?: RoundingParams): boolean;

      /** Checks if the current time is between the provided times. 
       * @param start The starting time to compare to
       * @param end The ending time to compare to
       * @param params The parameters to use when comparing the times
       */
      isBetween(start: T, end: T, params?: RoundingParams): boolean;

      /** Checks if the supplied object is an instance of a Time
       * @param other The object to check
       */
      typeof(other: any): other is T;
    }
  }
}