import { describe, expect, test } from "vitest"
import { Level2Date as EdtfDate } from "@rr0/time"
import { People } from "./People.js"
import { EventTime } from "../event/EventTime.js"

describe("People", () => {

  test("age", async () => {
    const hynek = new People()
    expect(hynek.isDeceased()).toBe(false)
    expect(hynek.getAge()).toBe(undefined)

    const hynek2 = new People([], "Hynek", [], [], [], false)
    hynek2.events.push({type: "event", eventType: "birth", time: EdtfDate.fromString("1910-05-01"), events: []})
    expect(hynek2.isDeceased()).toBe(false)
    expect(hynek2.isDeceased(EdtfDate.fromString("2040"))).toBe(true)
    expect(hynek2.getAge(EdtfDate.fromString("1972-08-12"))).toBe(62)

    const hynek3 = new People([], "Hynek", [], [], [], false)
    hynek3.events.push({type: "event", eventType: "birth", time: EdtfDate.fromString("1910-05-01"), events: []})
    hynek3.events.push({type: "event", eventType: "death", time: EdtfDate.fromString("1986-04-27"), events: []})
    expect(hynek3.isDeceased()).toBe(true)
    expect(hynek3.getAge(EdtfDate.fromString("1986-04-27"))).toBe(75)
    expect(hynek3.getAge(EdtfDate.fromString("2020-04-27"))).toBe(75)
  })

  test("age when the birth is only known to be within an interval", () => {
    const person = new People([], "Someone", [], [], [], false)
    person.events.push({type: "event", eventType: "birth", time: EventTime.parse("1920/1922"), events: []})
    expect(EventTime.start(person.birthTime).year.value).toBe(1920)
    expect(person.isDeceased()).toBe(false)
    expect(person.isDeceased(EdtfDate.fromString("2050"))).toBe(true)
    expect(person.getAge(EdtfDate.fromString("1950"))).toBe(30)  // From the start of the interval
  })

  test("age when the death is only known to be within an interval", () => {
    const person = new People([], "Someone", [], [], [], false)
    person.events.push({type: "event", eventType: "birth", time: EdtfDate.fromString("1900-05-01"), events: []})
    person.events.push({type: "event", eventType: "death", time: EventTime.parse("1950-01/1950-12"), events: []})
    expect(person.isDeceased()).toBe(true)
    expect(person.getAge()).toBe(49)  // To the start of the interval
  })
})
