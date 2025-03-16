import { People } from "./People.js"
import { PeopleJson } from "./PeopleJson.js"
import { RR0EventFactory } from "../event/RR0EventFactory.js"
import { TypedDataFactory } from "../TypedDataFactory.js"
import { Occupation } from "./Occupation.js"
import { CountryCode } from "../org/country/CountryCode.js"
import { Gender } from "@rr0/common"
import * as assert from "node:assert"
import { StringUtil } from "../util/string/index.js"

export class PeopleFactory extends TypedDataFactory<People, PeopleJson> {

  constructor(eventFactory: RR0EventFactory) {
    super(eventFactory, "people")
  }

  namesFromTitle(title: string): { lastName: string, firstNames: string[], qualifier?: string } {
    let lastName: string = ""
    let firstNames: string[] = []
    let qualifier: string = ""
    if (title) {
      title = title.trim()
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
              lastName = StringUtil.camelToText(lastName)
              qualifierDone = true
            }
          } while (qualifier && !qualifierDone)
          firstNames = spaceParts.slice(0, lastPos)
        } else {
          lastName = ""
          firstNames = []
        }
      }
    }
    return {lastName, firstNames, qualifier}
  }

  parse(json: PeopleJson): People {
    const data = super.parse(json)
    let title = data.title
    let {lastName, firstNames, qualifier} = this.namesFromTitle(title)
    lastName = json.lastName || lastName
    firstNames = json.firstNames || firstNames
    qualifier = json.qualifier || qualifier
    const pseudonyms = json.pseudonyms || []
    if (!title) {
      title = (firstNames.join(" ") + lastName || "") || pseudonyms.join(" ") || ""
    }
    assert.ok(title, `Could not devise People title from ${JSON.stringify(json)}`)
    const occupations = (json.occupations || []).map(occupation => Occupation[occupation])
    const countries = (json.countries || []).map(country => CountryCode[country])
    const discredited = json.discredited || false
    const gender = Gender[json.gender] || Gender.male
    json.name = json.name || lastName || firstNames[0] || pseudonyms[0] || ""
    const people = new People(firstNames, lastName, pseudonyms, occupations, countries,
      discredited, gender, data.id, data.dirName, data.image, data.url, data.events,
      qualifier)
    if (!people.title) {
      people.title = title
    }
    return people
  }

  protected createTitle(json: PeopleJson): string {
    const firstNames = (json.firstNames || []).join(" ")
    const lastName = json.lastName || ""
    const qualifier = json.qualifier ? `(${json.qualifier})` : ""
    const title = [firstNames, lastName, qualifier].join(" ").trim()
    return title || super.createTitle(json)
  }
}
