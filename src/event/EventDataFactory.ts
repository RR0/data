import { RR0Event, RR0EventFactory, RR0EventJson } from "./index.js"
import { EventTime } from "./EventTime.js"
import { FileContents } from "@javarome/fileutil"
import { TypedDataFactory } from "../TypedDataFactory.js"
import { RR0EventType } from "./RR0EventType.js"
import { NamedPlace } from "@rr0/place"

/**
 * A RR0Data factory which can read either <someType>.json files of index.json with a "type": "<someType>" property.
 */
export class EventDataFactory<T extends RR0EventType = RR0EventType> extends TypedDataFactory<RR0Event, RR0EventJson> {

  constructor(eventFactory: RR0EventFactory, readonly eventTypes: RR0EventType[],
              readonly fileNames: string[] = eventTypes) {
    super(eventFactory, "event", fileNames)
  }


  parse(dataJson: RR0EventJson): RR0Event {
    const data = super.parse(dataJson)
    Object.assign(data, {
      eventType: dataJson.eventType,
      time: dataJson.time ? EventTime.parse(dataJson.time) : undefined,
      place: new NamedPlace(dataJson.place)
    })
    return data
  }

  createFromFile(file: FileContents): RR0Event<T> | undefined {
    const event = super.createFromFile(file) as RR0Event<T>
    let eventData: RR0Event<T> | undefined
    if (this.eventTypes.includes(event?.eventType)) {
      eventData = event
    }
    return eventData
  }
}
