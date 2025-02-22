import { RR0Event, RR0EventFactory, RR0EventJson } from "./index"
import { FileContents } from "@javarome/fileutil"
import { TypedDataFactory } from "../TypedDataFactory.js"
import { RR0EventType } from "./RR0EventType.js"
import { NamedPlace } from "@rr0/place"
import { Level2Date as EdtfDate } from "@rr0/time"

/**
 * A RR0Data factory which can read either <someType>.json files of index.json with a "type": "<someType>" property.
 */
export class EventDataFactory<T extends RR0EventType = RR0EventType> extends TypedDataFactory<RR0Event, RR0EventJson> {

  constructor(eventFactory: RR0EventFactory, readonly eventType: RR0EventType,
              readonly fileNames: string[] = [eventType]) {
    super(eventFactory, "event", fileNames)
  }


  parse(dataJson: RR0EventJson): RR0Event {
    const data = super.parse(dataJson)
    data.eventType = dataJson.eventType
    data.time = EdtfDate.fromString(dataJson.time)
    data.place = new NamedPlace(dataJson.place)
    return data
  }

  create(file: FileContents): RR0Event<T> | undefined {
    const event = super.create(file) as RR0Event<T>
    let eventData: RR0Event<T> | undefined
    if (this.eventType === event?.eventType) {
      eventData = event
    }
    return eventData
  }
}
