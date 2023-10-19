import { Round } from "../../helpers";
import { TimeInterfaces } from "./interfaces";

export abstract class BaseTime implements TimeInterfaces.Base<BaseTime> {
  private _millis: number;


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


  get hours() {
    return this._millisToHours(this._millis);
  }
  set hours(n: number) {
    this._millis -= this._hoursToMillis(this.hours);
    this._millis += this._hoursToMillis(n);
  }

  get minutes() {
    return this.rawMinutes - (this.hours * 60);
  }
  get rawMinutes() {
    return this._millisToMinutes(this._millis);
  }
  set minutes(n: number) {
    this._millis -= this._minutesToMillis(this.minutes);
    this._millis += this._minutesToMillis(n);
  }

  get seconds() {
    return this.rawSeconds - (this.minutes * 60) - (this.hours * 60 * 60);
  }
  get rawSeconds() {
    return this._millisToSeconds(this._millis);
  }
  set seconds(n: number) {
    this._millis -= this._secondsToMillis(this.seconds);
    this._millis += this._secondsToMillis(n);
  }

  get milliseconds() {
    return this.rawMilliseconds - (this.seconds * 1000) - (this.minutes * 60 * 1000) - (this.hours * 60 * 60 * 1000);
  }
  get rawMilliseconds() {
    return this._millis;
  }
  set milliseconds(n: number) {
    this._millis -= this.milliseconds;
    this._millis += n;
  }


  abstract absolute(): BaseTime;
  abstract round(): BaseTime;
}