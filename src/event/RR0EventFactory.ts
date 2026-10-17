import { RR0Event } from "./RR0Event.js"
import { RR0EventJson } from "./RR0EventJson.js"
import { NamedPlace, Place } from "@rr0/place"
import { EventTime } from "./EventTime.js"
import { TypedDataFactory } from "../TypedDataFactory.js"
import { RR0Interview } from "./interview/RR0Interview.js"
import { RR0InterviewEventJson } from "./interview/RR0InterviewJson.js"

export class RR0EventFactory extends TypedDataFactory<RR0Event, RR0EventJson> {

  constructor() {
    super(null, "event")
    this.eventFactory = this
  }

  parse(eventJson: RR0EventJson): RR0Event {
    const data = super.parse(eventJson)
    const time = eventJson.time ? EventTime.parse(eventJson.time) : undefined
    const eventType = eventJson.eventType || eventJson["type"]
    let placeJson = eventJson.place
    let place: Place | undefined
    if (typeof placeJson === "string") {
      place = new NamedPlace(placeJson) as any
    }
    // An interview has more than an event does: whom it was held with, who held it, what it established. Read as itself, it keeps them.
    const event = eventType === "interview" ? RR0Interview.fromEventJson(eventJson as unknown as RR0InterviewEventJson) : new RR0Event(eventType, time)
    Object.assign(event, {
      id: data.id,
      dirName: data.dirName,
      name: data.name,
      // An interview's title may be said in several languages: it has read it as a plain string itself, and keeps both.
      title: event instanceof RR0Interview ? event.title : data.title,
      url: data.url,
      place,
      sources: data.sources,
      notes: data.notes
    })
    return event as RR0Event
  }
}
