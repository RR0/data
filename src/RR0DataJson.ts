import { SourceJson } from "./source/SourceJson.js"
import { RR0EventJson } from "./event/RR0EventJson.js"

/**
 * Default possible types for RR0Data.
 *
 * @see RR0EventType for event data subtypes ("sighting", etc.)
 */
export type RR0DataType = "people" | "place" | "org" | "book" | "case" | "event" | "article" | "api" | "product"

/**
 * Any kind of data on RR0 (see implementing classes).
 */
export type RR0DataJson = {
  /**
   * @deprecated
   */
  birthTime?: string

  /**
   * @deprecated
   */
  deathTime?: string

  /**
   * A unique identifier for this data.
   * // TODO: Make it mandatory
   */
  id?: string

  /**
   * The directory where the data is stored, relatively to RR0's root.
   * Should end with a trailing slash ("/").
   */
  dirName?: string

  /**
   * Public URL of the data (not the RR0 URL)
   */
  url?: string

  /**
   * Events of the data.
   */
  events?: RR0EventJson[]

  /**
   * The data type
   */
  type?: RR0DataType

  /**
   * Parent data id.
   */
  parent?: string

  /**
   * Short name
   */
  name?: string

  /**
   * Unofficial name
   */
  surname?: string

  /**
   * ex: "senior", "junior", "II"
   */
  qualifier?: string

  /**
   * Long name
   */
  title?: string

  /**
   * If this data is not more relevant, not the latest version, or state of art,
   * this will hold the dirname (or name) of its successor.
   */
  next?: string

  /**
   * A possible note about this data.
   */
  note?: string

  /**
   * A possible short description of this data.
   */
  description?: string

  /**
   * External data from which this data was devised.
   */
  sources?: SourceJson[]

  /**
   *
   */
  notes?: string[]

  /**
   * Keywords about that data.
   */
  tags?: string[]

  /**
   * An image representing the data.
   *
   * @deprecated Should be an "image" event type.
   * @see RR0Event
   */
  image?: string
}
