import { RR0Event } from "./event/RR0Event.js"
import { RR0SourceType, Source } from "./source/Source.js"
import { RR0DataType } from "./RR0DataJson.js"

/**
 * Any kind of data on RR0 (see implementing classes).
 */
export class RR0Data<T = RR0DataType> {

  /**
   * External data from which this data was devised.
   */
  sources?: Source<RR0SourceType>[] = []

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
  events: RR0Event[] = []

  /**
   * Parent data.
   */
  parent?: RR0Data

  /**
   * The name used to reference.
   */
  name?: string

  /**
   * The name used to describe.
   */
  title?: string

  /**
   * Unofficial name
   */
  surname?: string

  /**
   * If this data is not more relevant, not the latest version, or state of art,
   * this will hold the dirname (or name) of its successor.
   */
  next?: string

  /**
   * A possible short description of this data.
   */
  description?: string

  constructor(
    /**
     * The data type
     */
    readonly type?: T
  ) {
  }

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
