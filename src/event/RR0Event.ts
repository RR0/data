import { RR0Data } from "../RR0Data"
import { RR0EventType } from "./RR0EventJson"

export interface RR0Event<T = RR0EventType> extends RR0Data {
  type: "event"
  eventType: T
}
