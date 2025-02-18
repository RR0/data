/**
 * Default possible eventTypes for RR0 "event" data type.
 */
export type RR0EventType =
/**
 * Is born
 */
  "birth"
  /**
   * Dies
   */
  | "death"
  /**
   * Was pictured
   */
  | "image"
  /**
   * Published a book
   */
  | "book"
  /**
   * Published article
   */
  | "article"
  /**
   * Sighting of an UAP
   */
  | "sighting"
  /**
   * Nationality change
   */
  | "nationality"
  /**
   * Residence move
   */
  | "move"
  /**
   * Do new occupation
   */
  | "occupation"
