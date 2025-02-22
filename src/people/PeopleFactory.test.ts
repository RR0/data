import { describe, expect, test } from "@javarome/testscript"
import { RR0EventFactory } from "../event"
import { PeopleFactory } from "./PeopleFactory"
import { PeopleJson } from "./PeopleJson"
import { People } from "./People"
import { Occupation } from "./Occupation"
import { CountryCode } from "../org"

describe("PeopleFactory", () => {

  const eventFactory = new RR0EventFactory()
  const factory = new PeopleFactory(eventFactory)

  test("build people with no name", () => {
    const birthTime = "1916-09-24"
    const deathTime = "1980-11-22"
    const json: PeopleJson = {
      "birthTime": birthTime,
      "deathTime": deathTime,
      "occupations": ["contactee", "mechanic"],
      "countries": ["us"],
      "pseudonyms": ["Paul Villa"]
    }
    const expected = new People(undefined, undefined, ["Paul Villa"], [Occupation.contactee, Occupation.mechanic],
      [CountryCode.us])
    const events = factory.parseEvents(factory.getDefaultEvents(json), expected)
    Object.assign(expected, {events})
    expect(expected.events.length).toBe(2)
    const parsed = factory.parse(json)
    expect(parsed).toEqual(expected)
  })

  test("build people with title", () => {
    const json: PeopleJson = {title: "Jérôme Beau"}
    const expected = new People(["Jérôme"], "Beau")
    const parsed = factory.parse(json)
    expect(parsed).toEqual(expected)
  })
})
