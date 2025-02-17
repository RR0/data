import { describe, expect, test } from "@javarome/testscript"
import path from "path"
import { TypedDataFactory } from "./TypedDataFactory"
import { RR0EventFactory } from "./event"
import { FileContents } from "@javarome/fileutil"
import { NamedPlace } from "@rr0/place"

describe("TypedDataFactory", () => {

  const eventFactory = new RR0EventFactory()
  const dataRoot = "test/people"
  const peopleFiles = [
    path.join(dataRoot, "d/DeforgeGerard"),
    path.join("test/science/crypto/ufo/enquete/dossier", "Villa")
  ]
  const factory = new TypedDataFactory(eventFactory, "people", peopleFiles)

  test("create from file with events", () => {
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
