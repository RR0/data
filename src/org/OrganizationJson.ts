import { Place } from "@rr0/place"
import { RR0DataJson } from "../RR0DataJson.js"
import { OrganizationKind } from "./OrganizationKind.js"

export type OrganizationJson = RR0DataJson & {

  type: "org"

  places: Place[]

  kind: OrganizationKind
}
