import { RR0DataJson } from "../RR0DataJson"

/**
 * Default possible eventTypes for RR0 "event" data type.
 */
export type RR0EventType =
  "birth"
  | "death"
  | "image"
  | "book"
  | "article"
  | "sighting"
  | "event"

export interface RR0EventJson extends RR0DataJson {
  type: "event"
  eventType: RR0EventType
}
