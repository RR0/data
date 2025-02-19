import { describe, expect, test } from "@javarome/testscript"
import { AllDataService } from "./AllDataService"
import { Occupation, People } from "./people"
import { CountryCode, Organization } from "./org"
import { Gender } from "@rr0/common"
import { rr0TestUtil } from "./test"

describe("AllDataService", () => {

  test("people from file", async () => {
    const peopleFactory = rr0TestUtil.peopleFactory
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

  test("org from file", async () => {
    const orgFactory = rr0TestUtil.orgFactory
    const dataService = new AllDataService([orgFactory])
    const peopleFiles = await orgFactory.getFiles()
    let orgList: Organization[] = []
    const fileSpec = ["org*.json", "index*.json"]
    for (const dirName of peopleFiles) {
      const list = await dataService.getFromDir<Organization>(dirName, ["org", undefined], fileSpec)
      orgList.push(...list)
    }
    expect(orgList.length).toBe(1)
    const faa = orgList.find(faa => faa.dirName === "test/org/us/faa")
    expect(faa.type).toBe("org")
    expect(faa.title).toBe("FAA")
  })
})
