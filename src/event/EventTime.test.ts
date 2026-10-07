import { describe, expect, test } from "vitest"
import { Level2Date as EdtfDate, Level2Interval as EdtfInterval } from "@rr0/time"
import { EventTime } from "./EventTime.js"

describe("EventTime", () => {

  describe("parse", () => {
    test("a date", () => {
      const time = EventTime.parse("1952-07-19")
      expect(time).toBeInstanceOf(EdtfDate)
      expect(EventTime.isInterval(time)).toBe(false)
    })

    test("an approximate date is a date, written ~x", () => {
      const time = EventTime.parse("~1952-07")
      expect(time).toBeInstanceOf(EdtfDate)
      expect((time as EdtfDate).year.approximate).toBe(true)
    })

    test("between x and y", () => {
      const time = EventTime.parse("1952-07-19/1952-07-26")
      expect(EventTime.isInterval(time)).toBe(true)
      const interval = time as EdtfInterval
      expect(interval.start.day.value).toBe(19)
      expect(interval.end.day.value).toBe(26)
      expect(time.toString()).toBe("1952-07-19/1952-07-26")
    })

    test("years", () => {
      expect(EventTime.parse("1966/1993").toString()).toBe("1966/1993")
      expect(EventTime.parse("-7/-5").toString()).toBe("-7/-5")
    })

    test("from x, until y", () => {
      const from = EventTime.parse("1989/..") as EdtfInterval
      expect(from.start.year.value).toBe(1989)
      expect(from.end).toBeFalsy()
      const until = EventTime.parse("../1993") as EdtfInterval
      expect(until.start).toBeFalsy()
      expect(until.end.year.value).toBe(1993)
    })

    test("anything that is not EDTF is rejected", () => {
      expect(() => EventTime.parse("1952-07-19junk")).toThrow()
      expect(() => EventTime.parse("1952/1953junk")).toThrow()
    })
  })

  describe("equals", () => {
    test("dates", () => {
      expect(EventTime.equals(EventTime.parse("1952-07-19"), EventTime.parse("1952-07-19"))).toBe(true)
      expect(EventTime.equals(EventTime.parse("1952-07-19"), EventTime.parse("1952-07-20"))).toBe(false)
    })

    test("intervals", () => {
      expect(EventTime.equals(EventTime.parse("1952/1953"), EventTime.parse("1952/1953"))).toBe(true)
      expect(EventTime.equals(EventTime.parse("1952/1953"), EventTime.parse("1952/1954"))).toBe(false)
    })

    test("a date is not an interval", () => {
      expect(EventTime.equals(EventTime.parse("1952"), EventTime.parse("1952/1953"))).toBe(false)
    })

    test("nothing", () => {
      expect(EventTime.equals(undefined, undefined)).toBe(true)
      expect(EventTime.equals(undefined, EventTime.parse("1952"))).toBe(false)
    })
  })

  describe("start and end", () => {
    test("of a date, it is the date", () => {
      const date = EdtfDate.fromString("1952-07-19")
      expect(EventTime.start(date)).toBe(date)
      expect(EventTime.end(date)).toBe(date)
    })

    test("of an interval, its bounds", () => {
      const interval = EventTime.parse("1952-07-19/1952-07-26")
      expect(EventTime.start(interval).day.value).toBe(19)
      expect(EventTime.end(interval).day.value).toBe(26)
    })

    test("of an open interval, the bound it has", () => {
      expect(EventTime.start(EventTime.parse("../1993")).year.value).toBe(1993)
      expect(EventTime.end(EventTime.parse("1989/..")).year.value).toBe(1989)
    })

    test("of nothing, nothing", () => {
      expect(EventTime.start(undefined)).toBeUndefined()
      expect(EventTime.end(undefined)).toBeUndefined()
    })
  })
})
