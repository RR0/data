import { People } from "./People.js"
import { PeopleJson } from "./PeopleJson.js"
import { RR0EventFactory } from "../event"
import { TypedDataFactory } from "../TypedDataFactory"
import { Occupation } from "./Occupation"
import { CountryCode } from "../org"
import { Gender } from "@rr0/common"
import * as assert from "node:assert"

export class PeopleFactory extends TypedDataFactory<People, PeopleJson> {

  constructor(eventFactory: RR0EventFactory) {
    super(eventFactory, "people")
  }

  namesFromTitle(title: string): { lastName: string, firstNames: string[] } {
    title = title.trim()
    let lastName: string
    let firstNames: string[]
    let commaPos = title.indexOf(",")
    if (commaPos > 0) {
      lastName = title.substring(0, commaPos).trim()
      firstNames = title.substring(commaPos + 1).trim().replace("  ", " ").split(" ")
    } else {
      let spaceParts = title.split(" ")
      if (spaceParts.length > 1) {
        const lastPos = spaceParts.length - 1
        lastName = spaceParts[lastPos]
        firstNames = spaceParts.slice(0, lastPos)
      } else {
        lastName = ""
        firstNames = [title]
      }
    }
    return {lastName, firstNames}
  }

  parse(peopleJson: PeopleJson): People {
    const peopleData = super.parse(peopleJson)
    let title = peopleData.title
    const {lastName, firstNames} = title ? this.namesFromTitle(title) : {
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
    let qualifier: string | undefined
    const qualifStart = title.indexOf("(")
    if (qualifStart > 0) {
      qualifier = title.substring(qualifStart + 1, title.indexOf(")"))
      title = title.substring(0, qualifStart).trim()
    }
    peopleJson.name = peopleJson.name || lastName || firstNames[0] || pseudonyms[0] || ""
    peopleJson.title = title + (qualifier ? ` (${qualifier})` : "")
    return new People(firstNames, lastName, pseudonyms, occupations, countries,
      discredited, gender, peopleData.id, peopleData.dirName, peopleData.image, peopleData.url, peopleData.events)
  }
}
