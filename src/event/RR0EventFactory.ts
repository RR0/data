import { RR0Event } from "./RR0Event.js"
import { AbstractDataFactory } from "../AbstractDataFactory"
import { RR0EventJson } from "./RR0EventJson"
import { NamedPlace, Place } from "@rr0/place"
import { Level2Date as EdtfDate } from "@rr0/time"

export class RR0EventFactory extends AbstractDataFactory<RR0Event, RR0EventJson> {

  constructor() {
    super(null)
  }

  parse(eventJson: RR0EventJson): RR0Event {
    const time = eventJson.time ? EdtfDate.fromString(eventJson.time) : undefined
    const eventType = eventJson.eventType || eventJson["type"]
    const name = eventJson.name
    const title = eventJson.title
    const url = eventJson.url
    let placeJson = eventJson.place
    let place: Place | undefined
    if (typeof placeJson === "string") {
      place = new NamedPlace(placeJson)
    }
    return {type: "event", eventType, time, name, title, url, place} as RR0Event
  }
}
