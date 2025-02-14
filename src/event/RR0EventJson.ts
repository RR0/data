import { RR0DataJson } from "../RR0DataJson"

export type RR0EventType =
  "birth"
  | "death"
  | "image"
  | "book"
  | "article"
  | "sighting"

export interface RR0EventJson extends RR0DataJson {
  type: "event"
  eventType: RR0EventType
}
