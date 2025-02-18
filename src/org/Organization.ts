import path from "path"
import assert from "assert"
import { RR0Data, RR0Event } from "@rr0/data"

import { Place } from "@rr0/place"
import { OrganizationKind } from "./OrganizationKind"

export class Organization implements RR0Data {

  readonly type = "org"

  readonly dirName: string

  events: RR0Event[] = []

  constructor(readonly id: string, readonly places: Place[], readonly kind: OrganizationKind,
              readonly parent?: Organization) {
    assert.ok(id, `id must be defined for organization of type ${kind}`)
    this.dirName = path.join(parent?.dirName ?? "org/", id)
    assert.ok(id, `Code must be defined for organization of type ${kind}`)
  }
}
