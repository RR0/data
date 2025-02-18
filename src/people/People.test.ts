import path from "path"
import { describe, expect, test } from "@javarome/testscript"
import { PeopleService } from "./PeopleService.js"
import { Level2Date as EdtfDate } from "@rr0/time"
import { rr0TestUtil } from "../test"
import { People } from "./People"

describe("People", () => {

  const rootDir = "test/people"
  const hynekDir = path.join(rootDir, "h/HynekJosefAllen")
  const beauDir = path.join(rootDir, "b/BeauJerome")
  const files = [
    beauDir,
    path.join(rootDir, "b/BeauJeromePierre"),
    hynekDir,
    path.join(rootDir, "v/VonBraunWerner")
  ]
  const service = new PeopleService(rr0TestUtil.dataService, rr0TestUtil.peopleFactory, {rootDir, files})

  test("age", async () => {
    const hynek = new People()
    expect(hynek.isDeceased()).toBe(false)
    expect(hynek.getAge()).toBe(undefined)

    const hynek2 = new People([], "Hynek", [], [], [], false, EdtfDate.fromString("1910-05-01"))
    expect(hynek2.isDeceased()).toBe(false)
    expect(hynek2.isDeceased(EdtfDate.fromString("2040"))).toBe(true)
    expect(hynek2.getAge(EdtfDate.fromString("1972-08-12"))).toBe(62)

    const hynek3 = new People([], "Hynek", [], [], [], false, EdtfDate.fromString("1910-05-01"),
      EdtfDate.fromString("1986-04-27"))
    expect(hynek3.isDeceased()).toBe(true)
    expect(hynek3.getAge(EdtfDate.fromString("1986-04-27"))).toBe(75)
    expect(hynek3.getAge(EdtfDate.fromString("2020-04-27"))).toBe(75)
  })

  test("build url", () => {
    expect(service.getUrl("Beau", ["Jérôme"])).toBe(beauDir)
    expect(service.getUrl("Beau", ["Jérôme", "Pierre"])).toBe(path.join(rootDir, "b/BeauJeromePierre"))
    expect(service.getUrl("VonBraun", ["Werner"])).toBe(path.join(rootDir, "v/VonBraunWerner"))
  })
})
