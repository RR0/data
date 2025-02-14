import { RR0Event } from "./RR0Event.js"
import { AbstractDataFactory } from "../AbstractDataFactory"
import { RR0EventJson } from "./RR0EventJson"

export class RR0EventFactory extends AbstractDataFactory<RR0Event, RR0EventJson> {

  constructor() {
    super(null)
  }

  parse(eventJson: RR0EventJson): RR0Event {
    const time = this.createTimeFromString(eventJson.time as any)
    const eventType = eventJson.eventType || eventJson["type"]
    const name = eventJson.name
    const title = eventJson.title
    const url = eventJson.url
    let place = eventJson.place
    if (typeof place === "string") {
      place = {name: place}
    }
    return {type: "event", eventType, time, name, title, url, place} as RR0Event
  }
}
