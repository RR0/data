import { PeopleService } from "./PeopleService.js"
import { People } from "./People.js"
import { describe, expect, test } from "@javarome/testscript"
import path from "path"
import { rr0TestUtil } from "../test"

describe("PeopleService", () => {

  const rootDir = "test/people"
  const hynekDir = path.join(rootDir, "h/HynekJosefAllen")
  const beauDir = path.join(rootDir, "b/BeauJerome")
  const files = [
    path.join(rootDir, "a/Aristote"),
    beauDir,
    path.join(rootDir, "c/CondonEdwardU"),
    hynekDir,
    path.join(rootDir, "v/VonBraunWerner"),
    path.join("test/science/crypto/ufo/enquete/dossier", "Villa")
  ]
  const service = new PeopleService(rr0TestUtil.dataService, rr0TestUtil.peopleFactory, {rootDir, files})

  test("build people with one first name", () => {
    const fromName = service.createFromFullName("Jérôme Beau")
    const expected = new People(["Jérôme"], "Beau", [], [], [], false, undefined, undefined,
      path.join(rootDir, "b/BeauJerome"))
    expect(fromName).toEqual(expected)
  })

  test("build people with two first names", () => {
    const people = service.createFromFullName("Jérôme Pierre Beau")
    expect(people.title).toBe("Jérôme Pierre Beau")
    expect(people.countries).toEqual([])
    expect(people.lastName).toBe("Beau")
    expect(people.firstNames).toEqual(["Jérôme", "Pierre"])
    expect(people.hoax).toBe(false)
    expect(people.discredited).toBe(false)
    expect(people.dirName).toBeUndefined()  // Not "people/b/BeauJeromePierre" because the file doesn't exist
    expect(people.occupations).toEqual([])
    expect(people.pseudonyms).toEqual([])
  })

  test("build people with two last names", () => {
    const people = service.createFromFullName("Werner VonBraun")
    expect(people.title).toBe("Werner Von Braun")
    expect(people.countries).toEqual([])
    expect(people.lastName).toBe("VonBraun")
    expect(people.firstNames).toEqual(["Werner"])
    expect(people.hoax).toBe(false)
    expect(people.discredited).toBe(false)
    expect(people.dirName).toBe(path.join(rootDir, "v/VonBraunWerner"))
    expect(people.occupations).toEqual([])
    expect(people.pseudonyms).toEqual([])
  })

  test("build people with one initial first names", () => {
    const people = service.createFromFullName("Edward U. Condon")
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
    const people = service.createFromFullName("Hynek, Josef Allen")
    expect(people.title).toBe("Josef Allen Hynek")
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
    const people = service.createFromFullName("Aristote")
    expect(people.title).toBe("Aristote")
    expect(people.countries).toEqual([])
    expect(people.lastName).toBe("Aristote")
    expect(people.firstNames).toEqual([])
    expect(people.hoax).toBe(false)
    expect(people.discredited).toBe(false)
    expect(people.dirName).toBe(path.join(rootDir, "a/Aristote"))
    expect(people.occupations).toEqual([])
    expect(people.pseudonyms).toEqual([])
  })

  test("build url", () => {
    expect(service.getUrl("Beau", ["Jérôme"])).toBe(beauDir)
    expect(service.getUrl("Beau", ["Jérôme", "Pierre"])).toBe(path.join(rootDir, "b/BeauJeromePierre"))
    expect(service.getUrl("VonBraun", ["Werner"])).toBe(path.join(rootDir, "v/VonBraunWerner"))
  })
})
