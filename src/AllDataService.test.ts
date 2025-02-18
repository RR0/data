import { describe, expect, test } from "@javarome/testscript"
import { AllDataService } from "./AllDataService"
import { RR0EventFactory } from "./event"
import { Occupation, People, PeopleFactory } from "./people"
import { CountryCode } from "./org"
import { Gender } from "@rr0/common"

describe("AllDataService", () => {

  test("create from file", async () => {
    const peopleFactory = new PeopleFactory(new RR0EventFactory())
    const dataService = new AllDataService([peopleFactory])
    const peopleFiles = await peopleFactory.getFiles()
    let peopleList: People[] = []
    const fileSpec = ["people*.json"]
    for (const dirName of peopleFiles) {
      const list = await dataService.getFromDir<People>(dirName, ["people", undefined], fileSpec)
      peopleList.push(...list)
    }
    expect(peopleList.length).toBe(4)
    const deforge = peopleList.find(people => people.lastName === "Deforge")
    const birthEvent = deforge.events.find(event => event.eventType === "birth")
    expect(birthEvent.time.year.value).toBe(1940)
    const deathEvent = deforge.events.find(event => event.eventType === "death")
    expect(deathEvent.time.year.value).toBe(2025)
    expect(deathEvent.time.month.value).toBe(1)
    expect(deforge.occupations).toEqual([Occupation.ufologist, Occupation.teacher])
    expect(deforge.countries).toEqual([CountryCode.fr])
    expect(deforge.gender).toEqual(Gender.male)
    expect(deforge.discredited).toEqual(false)
  })
})
