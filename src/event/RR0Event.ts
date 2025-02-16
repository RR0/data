import { RR0Data } from "../RR0Data"
import { Level2Date as EdtfDate } from "@rr0/time"
import { Place } from "@rr0/place"
import { RR0EventType } from "./RR0EventType"

export interface RR0Event<T = RR0EventType> extends RR0Data {
  type: "event"
  eventType: T

  /**
   * When this event occurred.
   */
  time?: EdtfDate

  /**
   * Where this event occurred
   */
  place?: Place
}
