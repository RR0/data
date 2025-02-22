import { describe, expect, test } from "@javarome/testscript"
import path from "path"
import { TypedDataFactory } from "./TypedDataFactory"
import { RR0EventFactory } from "./event"
import { FileContents } from "@javarome/fileutil"
import { NamedPlace } from "@rr0/place"
import { PeopleJson } from "./people"

describe("TypedDataFactory", () => {

  const eventFactory = new RR0EventFactory()

  describe("create from file", () => {

    const dataRoot = "test/people"
    const peopleFiles = [
      path.join(dataRoot, "d/DeforgeGerard"),
      path.join("test/science/crypto/ufo/enquete/dossier", "Villa")
    ]
    const factory = new TypedDataFactory(eventFactory, "people", peopleFiles)

    test("with events", () => {
      const filePath = path.resolve(peopleFiles[0], "people.json")
      const dataFile = FileContents.read(filePath, "utf-8")
      const data = factory.create(dataFile)
      const events = data.events
      expect(events.length).toBe(3)
      const birth = events.find(event => event.eventType === "birth")
      expect(birth.time.year.value).toBe(1940)
      const death = events.find(event => event.eventType === "death")
      expect(death.time.year.value).toBe(2025)
      expect(death.time.month.value).toBe(1)
      expect(death.time.day.value).toBe(4)
      expect((death.place as NamedPlace).name).toBe("Marseille")
      const portrait = events.find(event => event.eventType === "image")
      expect(portrait.url).toBe("portrait.png")
    })

    test("create from file without events", () => {
      const filePath = path.resolve(peopleFiles[1], "people.json")
      const dataFile = FileContents.read(filePath, "utf-8")
      const data = factory.create(dataFile)
      const events = data.events
      expect(events.length).toBe(3)
      const birth = events.find(event => event.eventType === "birth")
      expect(birth.time.year.value).toBe(1916)
      expect(birth.time.month.value).toBe(9)
      expect(birth.time.day.value).toBe(24)
      const death = events.find(event => event.eventType === "death")
      expect(death.time.year.value).toBe(1980)
      expect(death.time.month.value).toBe(11)
      expect(death.time.day.value).toBe(22)
      const portrait = events.find(event => event.eventType === "image")
      expect(portrait.url).toBe("portrait.jpg")
    })
  })

  describe("create from json", () => {

    const factory = new TypedDataFactory(eventFactory, "people", [])

    test("create events from old birth/death fields", () => {
      const birthTime = "1916-09-24"
      const deathTime = "1980-11-22"
      const villaJson: PeopleJson = {birthTime, deathTime}
      const data = factory.parse(villaJson)
      expect(data.events.length).toBe(2)
    })

    test("create title from dirName", () => {
      const peopleJson: PeopleJson = {dirName: "people/b/BeauJerome"}
      const peopleData = factory.parse(peopleJson)
      expect(peopleData.title).toBe("Beau, Jerome")

      const peopleJsonWithTitle: PeopleJson = {dirName: "people/b/BeauJerome", title: "Jérôme Beau"}
      const peopleDataWithTitle = factory.parse(peopleJsonWithTitle)
      expect(peopleDataWithTitle.title).toBe("Jérôme Beau")

      const orgJson: PeopleJson = {dirName: "org/us/faa"}
      const orgData = factory.parse(orgJson)
      expect(orgData.title).toBe("Faa")

      const orgJsonWithTitle: PeopleJson = {title: "FAA", dirName: "org/us/faa"}
      const orgDataWithTitle = factory.parse(orgJsonWithTitle)
      expect(orgDataWithTitle.title).toBe("FAA")
    })
  })
})
