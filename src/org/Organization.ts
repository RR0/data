import { Place } from "@rr0/place"
import { OrganizationKind } from "./OrganizationKind"
import { RR0Data } from "../RR0Data"
import { RR0Event } from "../event"

export class Organization implements RR0Data {

  readonly type = "org"

  dirName: string

  title: string

  events: RR0Event[] = []

  constructor(readonly id: string, readonly places: Place[], readonly kind: OrganizationKind,
              readonly parent?: Organization) {
  }
}
