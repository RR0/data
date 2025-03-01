import { People } from "./People.js"
import { PeopleJson } from "./PeopleJson.js"
import { RR0EventFactory } from "../event/RR0EventFactory.js"
import { TypedDataFactory } from "../TypedDataFactory.js"
import { Occupation } from "./Occupation.js"
import { CountryCode } from "../org/country/CountryCode.js"
import { Gender } from "@rr0/common"
import * as assert from "node:assert"

export class PeopleFactory extends TypedDataFactory<People, PeopleJson> {

  constructor(eventFactory: RR0EventFactory) {
    super(eventFactory, "people")
  }

  namesFromTitle(title: string): { lastName: string, firstNames: string[], qualifier?: string } {
    title = title.trim()
    let lastName: string
    let firstNames: string[]
    let qualifier: string
    let commaPos = title.indexOf(",")
    if (commaPos > 0) {
      lastName = title.substring(0, commaPos).trim()
      firstNames = title.substring(commaPos + 1).trim().replace("  ", " ").split(" ")
    } else {
      let spaceParts = title.split(" ")
      if (spaceParts.length > 1) {
        let qualifierDone = false
        let lastPos = spaceParts.length - 1
        do {
          lastName = spaceParts[lastPos]
          if (lastName.startsWith("(")) {
            qualifier = lastName.substring(1, lastName.length - 1)
            lastPos--
          } else {
            qualifierDone = true
          }
        } while (qualifier && !qualifierDone)
        firstNames = spaceParts.slice(0, lastPos)
      } else {
        lastName = ""
        firstNames = [title]
      }
    }
    return {lastName, firstNames, qualifier}
  }

  parse(peopleJson: PeopleJson): People {
    const peopleData = super.parse(peopleJson)
    let title = peopleData.title
    const {lastName, firstNames, qualifier} = title ? this.namesFromTitle(title) : {
      lastName: peopleJson.lastName || "",
      firstNames: peopleJson.firstNames || []
    }
    const pseudonyms = peopleJson.pseudonyms || []
    if (!title) {
      title = (firstNames.join(" ") + lastName || "") || pseudonyms.join(" ") || ""
    }
    assert.ok(title, `Could not devise People title from ${JSON.stringify(peopleJson)}`)
    const occupations = (peopleJson.occupations || []).map(occupation => Occupation[occupation])
    const countries = (peopleJson.countries || []).map(country => CountryCode[country])
    const discredited = peopleJson.discredited || false
    const gender = Gender[peopleJson.gender] || Gender.male
    peopleJson.name = peopleJson.name || lastName || firstNames[0] || pseudonyms[0] || ""
    return new People(firstNames, lastName, pseudonyms, occupations, countries,
      discredited, gender, peopleData.id, peopleData.dirName, peopleData.image, peopleData.url, peopleData.events,
      qualifier)
  }
}
