export namespace Round {
  /** A rounding function that works correctly for negative numbers.
   * [Original source](https://stackoverflow.com/questions/41586838/rounding-of-negative-numbers-in-javascript)
   * @param number The number to round
   */
  export function round(number: number) {
    let sign = number >= 0 ? 1 : -1;
    let round = Math.round(Math.abs(number));
    return round === 0 ? 0 : sign * round;
  }

  /** A floor function that works correctly for negative numbers.
   * [Original source](https://stackoverflow.com/questions/41586838/rounding-of-negative-numbers-in-javascript)
   * @param number The number to floor
   */
  export function floor(number: number) {
    let sign = number >= 0 ? 1 : -1;
    let floor = Math.floor(Math.abs(number));
    return floor === 0 ? 0 : sign * floor;
  }

  /** A ceil function that works correctly for negative numbers.
   * [Original source](https://stackoverflow.com/questions/41586838/rounding-of-negative-numbers-in-javascript)
   * @param number The number to ceil
   */
  export function ceil(number: number) {
    let sign = number >= 0 ? 1 : -1;
    let ceil = Math.ceil(Math.abs(number));
    return ceil === 0 ? 0 : sign * ceil;
  }
}