import { describe, expect, test } from "@javarome/testscript"
import { RR0EventFactory } from "../event"
import { PeopleFactory } from "./PeopleFactory"
import { PeopleJson } from "./PeopleJson"
import { People } from "./People"
import { Occupation } from "./Occupation"
import { CountryCode } from "../org"
import { Gender } from "@rr0/common"

describe("PeopleFactory", () => {

  const eventFactory = new RR0EventFactory()
  const factory = new PeopleFactory(eventFactory)

  test("build people with two first names", () => {
    const birthTime = "1916-09-24"
    const deathTime = "1980-11-22"
    const villaJson: PeopleJson = {
      "birthTime": birthTime,
      "deathTime": deathTime,
      "occupations": [
        "contactee",
        "mechanic"
      ],
      "countries": [
        "us"
      ],
      "pseudonyms": [
        "Paul Villa"
      ]
    }
    const parsed = factory.parse(villaJson)
    const expected = new People(undefined, undefined, ["Paul Villa"], [Occupation.contactee, Occupation.mechanic],
      [CountryCode.us], false, Gender.male, "", undefined, undefined, undefined)
    Object.assign(expected, {events: factory.parseEvents(factory.getDefaultEvents(villaJson), expected)})
    expect(parsed).toEqual(expected)
  })
})
