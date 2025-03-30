import { describe, expect, test } from "@javarome/testscript"
import { RR0EventFactory } from "../event/RR0EventFactory.js"
import { PeopleFactory } from "./PeopleFactory.js"
import { PeopleJson } from "./PeopleJson.js"
import { People } from "./People.js"
import { Occupation } from "./Occupation.js"
import { CountryCode } from "../org/country/CountryCode.js"
import { Gender } from "@rr0/common"
import { RR0Event } from "../event/index.js"
import { Level2Date as EdtfDate } from "@rr0/time"

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
      [CountryCode.us], json.discredited, Gender[json.gender], json.id, json.dirName, json.image, json.url, [],
      json.qualifier)
    expected.title = "Paul Villa"
    const events = factory.parseEvents(factory.defaultJsonEvents(json), expected)
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

  test("build people with multiple first names", () => {
    const json: PeopleJson = {
      dirName: "people/m/MellonChris",
      lastName: "Mellon",
      firstNames: [
        "Christopher",
        "K."
      ],
      url: "https://www.christophermellon.net",
      occupations: [
        "writer",
        "ufologist",
        "politician"
      ],
      countries: [
        "us"
      ],
      events: [
        {
          type: "event",
          eventType: "birth",
          time: "1957-10-02"
        }
      ]
    }
    const expected = new People(json.firstNames, json.lastName, json.pseudonyms,
      [Occupation.writer, Occupation.ufologist, Occupation.politician], [CountryCode.us],
      json.discredited, Gender.male, json.id, json.dirName, json.image, json.url,
      [new RR0Event("birth", EdtfDate.fromString("1957-10-02"))], json.qualifier)
    const parsed = factory.parse(json)
    expect(parsed).toEqual(expected)
    expect(parsed.title).toEqual("Christopher K. Mellon")
  })

  test("build people with a composed first name", () => {
    const json: PeopleJson = {
      dirName: "people/v/VertongenJeanLuc",
      lastName: "Vertongen",
      firstNames: ["Jean-Luc"]
    }
    const expected = new People(json.firstNames, json.lastName, json.pseudonyms,
      [], [],
      json.discredited, Gender.male, json.id, json.dirName, json.image, json.url,
      [], json.qualifier)
    const parsed = factory.parse(json)
    expect(parsed).toEqual(expected)
    expect(parsed.title).toEqual("Jean-Luc Vertongen")
  })
})
