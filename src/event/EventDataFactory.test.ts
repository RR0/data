import { describe, expect, test } from "vitest"
import { EventDataFactory } from "./EventDataFactory.js"
import { RR0EventFactory } from "./RR0EventFactory.js"
import { FileContents, FileContentsLang } from "@javarome/fileutil"
import { Level2Interval as EdtfInterval } from "@rr0/time"
import { EventTime } from "./EventTime.js"

describe("EventDatafactory", () => {

  test("build people with no name", () => {
    const eventFactory = new RR0EventFactory()
    const factory = new EventDataFactory(eventFactory, ["sighting"], ["index.json"])
    const lang = new FileContentsLang()
    lang.lang = ""
    lang.variants = []
    const file = new FileContents("test/time/2/0/2/0/12/21/ConjonctionSaturneJupiter/index.json", "utf-8", `{
  "type": "event",
  "eventType": "sighting",
  "time": "2020-12-21 ~06:00",
  "place": {
    "name": "Spicheren (Moselle)"
  },
  "description": "conjonction de Jupiter et Saturne dans le ciel, pris en photo par le Dr Sebastian Voltmer astro-photographe allemand résidant en Moselle-Est",
  "image": "saturne-jupiter.jpg",
  "sources": [
    {
      "authors": [
        "Stéphane MAZZUCOTELLI"
      ],
      "url": "https://www.republicain-lorrain.fr/culture-loisirs/2020/12/21/planetes-le-rapprochement-de-jupiter-et-saturne-dans-le-ciel-de-spicheren-pres-de-forbach",
      "title": "Planètes : le rapprochement de Jupiter et Saturne dans le ciel de Spicheren, près de Forbach",
      "publication": {
        "publisher": "Le Républicain Lorrain",
        "time": "2020-12-21"
      }
    }
  ]
}
`, new Date("2025-02-22T22:22:07.720Z"), lang)
    const event = factory.createFromFile(file)
    expect(event.eventType).toEqual("sighting")
    const imageEvent = event.events.find(e => e.eventType === "image")
    expect(imageEvent.url).toEqual("saturne-jupiter.jpg")
  })

  test("a time can be an interval", () => {
    const lang = new FileContentsLang()
    lang.lang = ""
    lang.variants = []
    const file = new FileContents("test/time/1/9/5/2/07/19/Washington/index.json", "utf-8", `{
  "type": "event",
  "eventType": "sighting",
  "time": "1952-07-19/1952-07-26",
  "place": "Washington",
  "sources": [{"title": "A book", "publication": {"publisher": "Some publisher", "time": "1953/1955"}}]
}
`, new Date("2025-02-22T22:22:07.720Z"), lang)
    const factory = new EventDataFactory(new RR0EventFactory(), ["sighting"], ["index.json"])
    const event = factory.createFromFile(file)
    expect(event.time).toBeInstanceOf(EdtfInterval)
    expect(event.time.toString()).toBe("1952-07-19/1952-07-26")
    expect(EventTime.start(event.time).day.value).toBe(19)
    expect(event.sources[0].publication.time.toString()).toBe("1953/1955")
  })
})
