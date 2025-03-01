import { describe, expect, test } from "@javarome/testscript"
import { AllDataService } from "./AllDataService.js"
import { Occupation, People } from "./people/index.js"
import { CountryCode, Organization } from "./org/index.js"
import { Gender } from "@rr0/common"
import { rr0TestUtil } from "./test/index.js"

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
    expect(peopleList.length).toBe(7)
    {
      const deforge = peopleList.find(people => people.title.includes("Deforge"))
      const birthEvent = deforge.events.find(event => event.eventType === "birth")
      expect(birthEvent.time.year.value).toBe(1940)
      const deathEvent = deforge.events.find(event => event.eventType === "death")
      expect(deathEvent.time.year.value).toBe(2025)
      expect(deathEvent.time.month.value).toBe(1)
      expect(deforge.occupations).toEqual([Occupation.ufologist, Occupation.teacher])
      expect(deforge.countries).toEqual([CountryCode.fr])
      expect(deforge.gender).toEqual(Gender.male)
      expect(deforge.discredited).toEqual(false)
    }
    {
      const carter = peopleList.find(people => people.lastName === "Carter")
      expect(carter.qualifier).toBe("Junior")
    }
    {
      const carter = peopleList.find(people => people.lastName === "Altshuler")
      expect(carter.firstNames).toEqual(["John", "Henry"])
    }
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
