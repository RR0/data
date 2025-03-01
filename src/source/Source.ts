import { Level2Date as EdtfDate } from "@rr0/time"
import { RR0Data } from "../RR0Data.js"
import { RR0Event } from "../event"

export type Publication = {
  /**
   * The editor of the publication
   */
  publisher: string

  /**
   * When the publication occurred.
   */
  time: EdtfDate | undefined
}

/**
 * The origin of some RR0 data.
 */
export class Source extends RR0Data {
  /**
   * Dependent sources.
   */
  previousSourceRefs: string[]

  /**
   * A possible subtitle of this source.
   */
  subTitle?: string

  /**
   * The author(s) name(s) of this source document.
   */
  authors?: string[]

  /**
   * The details about where and when the source was published.
   */
  publication?: Publication

  /**
   * A possible series this source was part of.
   */
  series?: string

  /**
   * A possible summary of the source's contents.
   */
  summary?: string

  /**
   * Chapter, page, etc.
   */
  index?: string

  /**
   * Events of the data.
   */
  events: RR0Event[]
}
