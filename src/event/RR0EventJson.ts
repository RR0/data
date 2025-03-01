import { RR0DataJson } from "../RR0DataJson.js"
import { RR0EventType } from "./RR0EventType.js"

export type RR0EventJson = RR0DataJson & {
  type: "event"

  eventType: RR0EventType

  /**
   * When this event occurred.
   */
  time?: string

  /**
   * Where this event occurred
   */
  place?: string
}
