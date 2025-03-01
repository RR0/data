import { describe, expect, test } from "@javarome/testscript"
import { EventDataFactory } from "./EventDataFactory.js"
import { RR0EventFactory } from "./RR0EventFactory.js"
import { FileContents, FileContentsLang } from "@javarome/fileutil"

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
    const event = factory.create(file)
    expect(event.eventType).toEqual("sighting")
    const imageEvent = event.events.find(e => e.eventType === "image")
    expect(imageEvent.url).toEqual("saturne-jupiter.jpg")
  })
})
