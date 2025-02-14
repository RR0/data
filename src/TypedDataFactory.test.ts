import { describe, expect, test } from "@javarome/testscript"
import path from "path"
import { TypedDataFactory } from "./TypedDataFactory"
import { RR0EventFactory } from "./event"
import { FileContents } from "@javarome/fileutil"

describe("TypedDataFactory", () => {

  const eventFactory = new RR0EventFactory()
  const dataRoot = "test/people"
  const peopleFiles = [
    path.join(dataRoot, "d/DeforgeGerard")
  ]
  const factory = new TypedDataFactory(eventFactory, "people", peopleFiles)

  test("create from file", () => {
    const filePath = path.resolve(peopleFiles[0], "people.json")
    const dataFile = FileContents.read(filePath, "utf-8")
    const data = factory.create(dataFile)
    const events = data.events
    expect(events.length).toBe(3)
    const birth = events.find(event => event.eventType === "birth")
    expect(birth.time.toString()).toBe("1940")
    const death = events.find(event => event.eventType === "death")
    expect(death.time.toString()).toBe("2025-01-04")
    expect(death.place).toEqual({name: "Marseille"})
    const portrait = events.find(event => event.eventType === "image")
    expect(portrait.url).toBe("portrait.png")
  })
})
