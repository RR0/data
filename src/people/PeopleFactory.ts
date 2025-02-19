import { People } from "./People.js"
import { PeopleJson } from "./PeopleJson.js"
import { RR0EventFactory } from "../event"
import { TypedDataFactory } from "../TypedDataFactory"
import { Occupation } from "./Occupation"
import { CountryCode } from "../org"
import { Gender } from "@rr0/common"
import { Level2Date as EdtfDate } from "@rr0/time"
import { RR0Data } from "../RR0Data"

export class PeopleFactory extends TypedDataFactory<People, PeopleJson> {

  constructor(eventFactory: RR0EventFactory) {
    super(eventFactory, "people")
  }

  parse(peopleJson: PeopleJson): People {
    peopleJson = this.completeFromDirName(peopleJson)
    const peopleData = Object.assign(peopleJson, super.parse(peopleJson)) as RR0Data
    const occupations = (peopleJson.occupations || []).map(occupation => Occupation[occupation])
    const countries = (peopleJson.countries || []).map(country => CountryCode[country])
    const discredited = peopleJson.discredited || false
    const gender = Gender[peopleJson.gender] || Gender.male
    const birthTimeJson = peopleJson.birthTime
    const birthTime = birthTimeJson ? EdtfDate.fromString(birthTimeJson) : undefined
    const deathTimeJSon = peopleJson.deathTime
    const deathTime = deathTimeJSon ? EdtfDate.fromString(deathTimeJSon) : undefined
    const people = new People(peopleJson.firstNames, peopleJson.lastName, peopleJson.pseudonyms,
      occupations, countries, discredited, birthTime, deathTime, gender,
      peopleData.id, peopleData.dirName, peopleData.image, peopleData.url, peopleData.events)
    peopleJson.name = people.name
    let title = peopleJson.title
    let qualifier: string | undefined
    if (title) {
      const qualifStart = title.indexOf("(")
      if (qualifStart > 0) {
        qualifier = title.substring(qualifStart + 1, title.indexOf(")"))
        title = title.substring(0, qualifStart).trim()
      }
      const names = title.split(",")
      if (names.length > 1) {
        people.lastName = people.lastName || names.splice(0, 1)[0].trim()
        if (!people.firstNames || people.firstNames.length <= 0) {
          people.firstNames.length = 0
          people.firstNames.push(...names[0].trim().split(" "))
        }
      } else {
        const names = title.split(" ")
        people.firstNames = people.firstNames || names.slice(0, names.length - 1)
        people.name = people.lastName = people.lastName || names[names.length - 1]
      }
      people.lastAndFirstName = people.getLastAndFirstName()
    }
    people.title = people.firstAndLastName + (qualifier ? ` (${qualifier})` : "")
    return people
  }

  /**
   * Determine people name from directory name.
   *
   * @param peopleJson
   */
  protected completeFromDirName(peopleJson: PeopleJson): PeopleJson {
    const dirName = peopleJson.dirName
    const completedJson = super.completeFromDirName(peopleJson)
    if (dirName) {
      const title = completedJson.title
      const firstSpace = title.indexOf(" ")
      const lastName = title.substring(0, firstSpace)
      completedJson.lastName = peopleJson.lastName || lastName
      let firstNames = peopleJson.firstNames || []
      if (firstNames.length <= 0 && firstSpace > 0) {
        const firstNameStr = title.substring(firstSpace + 1)
        firstNames = firstNameStr.split(" ")
      }
      completedJson.firstNames = firstNames
      completedJson.title = `${firstNames.join(" ")} ${lastName}`
    }
    return completedJson
  }
}
