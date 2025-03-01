import { RR0Event } from "./RR0Event.js"
import { RR0EventJson } from "./RR0EventJson.js"
import { NamedPlace, Place } from "@rr0/place"
import { Level2Date as EdtfDate } from "@rr0/time"
import { TypedDataFactory } from "../TypedDataFactory.js"

export class RR0EventFactory extends TypedDataFactory<RR0Event, RR0EventJson> {

  constructor() {
    super(null, "event")
    this.eventFactory = this
  }

  parse(eventJson: RR0EventJson): RR0Event {
    const data = super.parse(eventJson)
    const time = eventJson.time ? EdtfDate.fromString(eventJson.time) : undefined
    const eventType = eventJson.eventType || eventJson["type"]
    let placeJson = eventJson.place
    let place: Place | undefined
    if (typeof placeJson === "string") {
      place = new NamedPlace(placeJson) as any
    }
    return {
      id: data.id,
      type: data.type,
      eventType,
      dirName: data.dirName,
      name: data.name,
      title: data.title,
      url: data.url,
      events: data.events,
      time,
      place
    } as RR0Event
  }
}
