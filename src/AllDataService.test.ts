import { describe, expect, test } from "@javarome/testscript"
import { AllDataService } from "./AllDataService"
import { RR0Event, RR0EventFactory, RR0EventJson } from "./event"
import { TypedDataFactory } from "./TypedDataFactory"
import { RR0Data } from "./RR0Data"
import { RR0DataJson } from "./RR0DataJson"

export class PeopleJson implements RR0DataJson {
  events: RR0EventJson[]
  occupations: string[]
  countries: string[]
}

export class People implements RR0Data {
  constructor(readonly events: RR0Event[], readonly occupations: string[], readonly countries: string[]) {
  }
}

export class PeopleFactory extends TypedDataFactory<People, PeopleJson> {
  constructor() {
    super(new RR0EventFactory(), "people")
  }

  parse(peopleJson: PeopleJson): People {
    const jsonEvents = peopleJson.events || []
    return new People(jsonEvents.map(this.eventFactory.parse), peopleJson.occupations, peopleJson.countries)
  }
}

describe("AllDataService", () => {

  test("create from file", async () => {
    const peopleFactory = new PeopleFactory()
    const dataService = new AllDataService([peopleFactory])
    const peopleFiles = await peopleFactory.getFiles()
    let peopleList: People[] = []
    const fileSpec = ["people*.json"]
    for (const dirName of peopleFiles) {
      const list = await dataService.getFromDir<People>(dirName, ["people", undefined], fileSpec)
      peopleList.push(...list)
    }
    expect(peopleList.length).toBe(2)
    const deforge = peopleList[0]
    const birthEvent = deforge.events.find(event => event.eventType === "birth")
    expect(birthEvent.time.year.value).toBe(1940)
    const deathEvent = deforge.events.find(event => event.eventType === "death")
    expect(deathEvent.time.year.value).toBe(2025)
    expect(deathEvent.time.month.value).toBe(1)
    expect(deforge.occupations).toEqual(["ufologist", "teacher"])
    expect(deforge.countries).toEqual(["fr"])
  })
})
