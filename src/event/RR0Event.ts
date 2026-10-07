import { RR0Data } from "../RR0Data.js"
import { EventTimeValue } from "./EventTime.js"
import { Place } from "@rr0/place"
import { RR0EventType } from "./RR0EventType.js"

export class RR0Event<T = RR0EventType> extends RR0Data {

  constructor(readonly eventType: T,
              /**
               * When this event occurred.
               */
              readonly time?: EventTimeValue) {
    super("event")
  }

  /**
   * Where this event occurred
   */
  place?: Place
}
