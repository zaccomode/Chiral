export namespace TimeInterfaces {
  export type TimePrecision = "h" | "m" | "s" | "ms";
  export type RoundingType = "up" | "down" | "nearest";

  export type roundOptions = {
    /** The specificity level to round to. Default = `"m"` */
    precision?: TimePrecision,
    /** The specificity level to round to. Default = `"m"` */
    p?: TimePrecision,
    /** The type of rounding to use. Default = `"nearest"` */
    rounding?: RoundingType,
    /** The type of rounding to use. Default = `"nearest"` */
    r?: RoundingType,
  };


  export interface Base<T> {
    get hours(): number;
    get minutes(): number;
    get rawMinutes(): number;
    get seconds(): number;
    get rawSeconds(): number;
    get milliseconds(): number;
    get rawMilliseconds(): number;

    set hours(n: number);
    set minutes(n: number);
    set seconds(n: number);
    set milliseconds(n: number);


    /** Returns a new Time object with the absolute value of the current time */
    absolute(): T;
    /** Rounds the time off to the nearest precision level. This function will
   * round all values below the precision level before it. For example, if
   * the precision is "m", then the seconds and milliseconds will be rounded
   * before the minutes are rounded.
   * @param options The options to use when rounding
   */
    round(options?: roundOptions): T;
  }

  export interface Readable<T> {
    /** Provides a digital-like readout of the time 
     * @param options The options to use when generating the readout
     */
    toDigital(): string;
    /** An override of the `.toString()` method */
    toString(): string;
  }

  export interface Operatable<T> {
    /** Adds the given time to the current time and returns a new Time object 
     * @param time The time to add to the current time
     */
    add(time: T): T;
    /** Subtracts the given time from the current time and returns a new Time object 
     * @param time The time to subtract from the current time
     */
    subtract(time: T): T;
  }


  export type compareOptions = { 
    /** The specificity level to round to. Default = `"ms"` */
    precision?: TimePrecision,
    /** The specificity level to round to. Default = `"ms"` */
    p?: TimePrecision,
    /** The type of rounding to use. Default = `"down"` */
    rounding?: RoundingType,
    /** The type of rounding to use. Default = `"down"` */
    r?: RoundingType,
  }

  export interface Comparable<T> { 
    /** Checks if the given time is equal to the current time
     * @param time The time to compare to the current time
     * @param options The options to use when comparing the times
     */
    equals(time: T, options?: compareOptions): boolean;
    
    /** Checks if the provided object has the same type as the current time
     * @param other The object to check the type of
     */
    typeof(other: any): other is T;
  }
}