import { Level2Date as EdtfDate, Level2Interval as EdtfInterval } from "@rr0/time"

/**
 * When something occurred: a date, or an interval when it is only known to be within bounds ("between x and y",
 * "from x" for `x/..`, "until y" for `../y`). An approximate date ("around x") is a date: `~x`.
 */
export type EventTimeValue = EdtfDate | EdtfInterval

/**
 * Reads and uses the time of an event, a publication, a birth, etc.
 */
export class EventTime {

  /**
   * @param str An EDTF string: an interval ("1952-07-19/1952-07-26", "1989/..") if it holds a "/", else a date ("1952-07-19", "~1952").
   * @return The interval, or else the date.
   */
  static parse(str: string): EventTimeValue {
    return str.includes("/") ? EdtfInterval.fromString(str) : EdtfDate.fromString(str)
  }

  static isInterval(time: EventTimeValue | undefined): time is EdtfInterval {
    return time instanceof EdtfInterval
  }

  /**
   * @return The date itself, or the date an interval starts at (the one it ends at, if it has no start).
   */
  static start(time: EventTimeValue | undefined): EdtfDate | undefined {
    return EventTime.isInterval(time) ? (time.start ?? time.end) ?? undefined : time
  }

  /**
   * @return If both are the same date, or the same interval (same start and same end).
   */
  static equals(a: EventTimeValue | undefined, b: EventTimeValue | undefined): boolean {
    let same: boolean
    if (!a || !b) {
      same = a === b
    } else if (EventTime.isInterval(a) || EventTime.isInterval(b)) {
      same = EventTime.isInterval(a) && EventTime.isInterval(b) && a.toString() === b.toString()
    } else {
      same = a.isEqual(b)
    }
    return same
  }

  /**
   * @return The date itself, or the date an interval ends at (the one it starts at, if it has no end).
   */
  static end(time: EventTimeValue | undefined): EdtfDate | undefined {
    return EventTime.isInterval(time) ? (time.end ?? time.start) ?? undefined : time
  }
}
