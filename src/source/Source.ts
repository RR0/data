import { Level2Date as EdtfDate } from "@rr0/time"
import { RR0Data } from "../RR0Data.js"

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

export type RR0SourceType = "book" | "article"

/**
 * The origin of some RR0 data.
 */
export class Source<T extends RR0SourceType> extends RR0Data<T> {
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

  constructor(type: T) {
    super(type)
  }
}
