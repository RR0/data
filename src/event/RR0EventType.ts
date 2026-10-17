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
   * An analyst's reading of one of a case's sightings: what they hold was seen, as bodies in metres
   * (a UFO@home interpretation), naming the sighting it explains.
   */
  | "interpretation"
  /**
   * An interview about a case: who put the questions, to whom (the sighting event(s) of the witness it names in `interviewOf`), when, and
   * what it established. The questions asked and the answers given are what the case keeps of it, not a sighting.
   */
  | "interview"
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
  /**
   * Mariage
   */
  | "union"
