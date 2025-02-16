import { RR0Event, RR0EventFactory } from "./index"
import { FileContents } from "@javarome/fileutil"
import { TypedDataFactory } from "../TypedDataFactory"
import { RR0EventJson, RR0EventType } from "./RR0EventJson"

/**
 * A RR0Data factory which can read either <someType>.json files of index.json with a "type": "<someType>" property.
 */
export class EventDataFactory<T extends RR0EventType = RR0EventType> extends TypedDataFactory<RR0Event, RR0EventJson> {

  constructor(eventFactory: RR0EventFactory, readonly eventType: RR0EventType,
              readonly fileNames: string[] = [eventType]) {
    super(eventFactory, "event", fileNames)
  }

  create(file: FileContents): RR0Event<T> | undefined {
    const event = super.create(file) as RR0Event<T>
    let eventData: RR0Event<T> | undefined
    if (event?.eventType === this.eventType) {
      eventData = event
    }
    return eventData
  }
}
