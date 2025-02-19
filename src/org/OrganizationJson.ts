import { Place } from "@rr0/place"
import { RR0DataJson } from "../RR0DataJson"
import { OrganizationKind } from "./OrganizationKind"

export type OrganizationJson = RR0DataJson & {

  type: "org"

  places: Place[]

  kind: OrganizationKind
}
