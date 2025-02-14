import { RR0Event } from "./event"
import { Level2Date as EdtfDate } from "@rr0/time"
import { Source } from "./source"
import { RR0EventType } from "./event/RR0EventJson"

/**
 * Any kind of data on RR0 (see implementing classes).
 */
export interface RR0Data<T = RR0EventType> {
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
  readonly url?: string

  /**
   * Events of the data.
   */
  events: RR0Event[]

  /**
   * The data type
   */
  type?: T

  /**
   * Parent data.
   */
  parent?: RR0Data

  /**
   * Short name
   */
  name?: string

  /**
   * Unofficial name
   */
  surname?: string

  /**
   * Long name
   */
  title?: string

  /**
   * When this data occurred.
   */
  time?: EdtfDate

  /**
   * If this data is not more relevant, not the latest version, or state of art,
   * this will hold the dirname (or name) of its successor.
   */
  next?: string

  /**
   * @deprecated Use #notes
   * A possible note about this data.
   */
  note?: string

  /**
   * Where this data occurred
   */
  place?: { name: string }

  /**
   * A possible short description of this data.
   */
  description?: string

  /**
   * External data from which this data was devised.
   */
  sources?: Source[]

  /**
   *
   */
  readonly notes?: string[]

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
