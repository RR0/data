import { Place } from "@rr0/place"
import { OrganizationKind } from "./OrganizationKind.js"
import { RR0Data } from "../RR0Data.js"
import { RR0Event } from "../event/RR0Event.js"

export class Organization implements RR0Data {

  readonly type = "org"

  dirName: string

  title: string

  events: RR0Event[] = []

  constructor(readonly id: string, readonly places: Place[], readonly kind: OrganizationKind,
              parent?: Organization) {
    this._parent = parent
  }

  private _parent: Organization

  get parent() {
    return this._parent
  }

  set parent(parent) {
    this._parent = parent
  }
}
