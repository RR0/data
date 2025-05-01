import { RR0DataJson } from "../RR0DataJson.js"

export type PublicationJson = {
  /**
   * The editor of the publication
   */
  publisher: string

  /**
   * When the publication occurred.
   */
  time?: string
}

/**
 * The origin of some RR0 data.
 */
export type SourceJson = RR0DataJson & {
  /**
   * Dependent sources.
   * @deprecated Use sources of this source-typed RR0Data
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
  publication?: PublicationJson

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
}
