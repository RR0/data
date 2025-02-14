import { RR0Data } from "./RR0Data.js"
import { RR0DataJson } from "./RR0DataJson"

/**
 * Instantiates RR0Data from (JSON) file contents.
 */
export interface RR0DataFactory<T extends RR0Data> {

  parse(data: RR0DataJson): T
}
