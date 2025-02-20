import { describe, expect, test } from "@javarome/testscript"
import { Level2Date as EdtfDate } from "@rr0/time"
import { People } from "./People"

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
})
