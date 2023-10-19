/** Pads a number with leading zeros to a certain length
 * @param number The number to pad
 * @param length The length to pad to 
 */
export default function padNumber(number: number, length: number = 2): string { 
  return number.toString().padStart(length, "0");
}