import { PeopleService } from "./PeopleService.js"
import { People } from "./People.js"
import { describe, expect, test } from "@javarome/testscript"
import path from "path"
import { rr0TestUtil } from "../test/index.js"

describe("PeopleService", () => {

  const rootDir = "test/people"
  const hynekDir = path.join(rootDir, "h/HynekJosefAllen")
  const beauDir = path.join(rootDir, "b/BeauJerome")
  const aristoteDir = path.join(rootDir, "a/Aristote")
  const vonBraunDir = path.join(rootDir, "v/VonBraunWerner")
  const files = [
    aristoteDir,
    beauDir,
    path.join(rootDir, "c/CondonEdwardU"),
    hynekDir,
    vonBraunDir,
    path.join("test/science/crypto/ufo/enquete/dossier", "Villa"),
    path.join("test/science/crypto/ufo/enquete/dossier", "WaltonTravis")
  ]
  const service = new PeopleService(rr0TestUtil.dataService, rr0TestUtil.peopleFactory, {rootDir, files})

  test("build people with one first name", () => {
    const expected = new People(["Jérôme"], "Beau", [], [], [], false, undefined, undefined, beauDir)
    const fromName = service.createFromTitle("Jérôme Beau")
    expect(fromName).toEqual(expected)
  })

  test("build people with two first names", () => {
    const people = service.createFromTitle("Jérôme Pierre Beau")
    expect(people.title).toBe("Jérôme Pierre Beau")
    expect(people.countries).toEqual([])
    expect(people.lastName).toBe("Beau")
    expect(people.firstNames).toEqual(["Jérôme", "Pierre"])
    expect(people.hoax).toBe(false)
    expect(people.discredited).toBe(false)
    expect(people.dirName).toBe("test/people/b/BeauJerome")
    expect(people.occupations).toEqual([])
    expect(people.pseudonyms).toEqual([])
  })

  test("build people with two last names", () => {
    const people = service.createFromTitle("Werner VonBraun")
    expect(people.title).toBe("Werner VonBraun")
    expect(people.countries).toEqual([])
    expect(people.lastName).toBe("Von Braun")
    expect(people.firstNames).toEqual(["Werner"])
    expect(people.hoax).toBe(false)
    expect(people.discredited).toBe(false)
    expect(people.dirName).toBe(vonBraunDir)
    expect(people.occupations).toEqual([])
    expect(people.pseudonyms).toEqual([])
  })

  test("build people with one initial first names", () => {
    const people = service.createFromTitle("Edward U. Condon")
    expect(people.title).toBe("Edward U. Condon")
    expect(people.countries).toEqual([])
    expect(people.lastName).toBe("Condon")
    expect(people.firstNames).toEqual(["Edward", "U."])
    expect(people.hoax).toBe(false)
    expect(people.discredited).toBe(false)
    expect(people.dirName).toBe(path.join(rootDir, "c/CondonEdwardU"))
    expect(people.occupations).toEqual([])
    expect(people.pseudonyms).toEqual([])
  })

  test("build people with last name first", () => {
    const people = service.createFromTitle("Hynek, Josef Allen")
    expect(people.title).toBe("Hynek, Josef Allen")
    expect(people.countries).toEqual([])
    expect(people.lastName).toBe("Hynek")
    expect(people.firstNames).toEqual(["Josef", "Allen"])
    expect(people.hoax).toBe(false)
    expect(people.discredited).toBe(false)
    expect(people.dirName).toBe(path.join(rootDir, "h/HynekJosefAllen"))
    expect(people.occupations).toEqual([])
    expect(people.pseudonyms).toEqual([])
  })

  test("Single name", () => {
    const people = service.createFromTitle("Aristote")
    expect(people.title).toBe("Aristote")
    expect(people.countries).toEqual([])
    expect(people.firstNames).toEqual([])
    expect(people.lastName).toEqual("")
    expect(people.hoax).toBe(false)
    expect(people.discredited).toBe(false)
    expect(people.dirName).toBe(aristoteDir)
    expect(people.occupations).toEqual([])
    expect(people.pseudonyms).toEqual([])
  })

  test("build url", () => {
    expect(service.getUrl("Beau", ["Jérôme"])).toBe(beauDir)
    expect(service.getUrl("Beau", ["Jérôme", "Pierre"])).toBe(path.join(rootDir, "b/BeauJeromePierre"))
    expect(service.getUrl("VonBraun", ["Werner"])).toBe(vonBraunDir)
  })

  test("get all", async () => {
    const all = await service.getAll()
    expect(all.length).toBe(5)
  })
})
