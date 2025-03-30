import { Organization } from "./Organization.js"
import { OrganizationJson } from "./OrganizationJson.js"
import { TypedDataFactory } from "../TypedDataFactory.js"
import { RR0EventFactory } from "../event/RR0EventFactory.js"

export class OrganizationFactory<O extends Organization = Organization, J extends OrganizationJson = OrganizationJson> extends TypedDataFactory<O, J> {

  constructor(eventFactory: RR0EventFactory) {
    super(eventFactory, "org", ["index"])
  }

  parse(orgJson: J): O {
    const base = super.parse(orgJson)
    const id = base.id || orgJson.dirName.replaceAll("/", "-")
    const org = this.create(id, orgJson)
    org.title = base.title
    org.dirName = base.dirName
    org.parent = base.parent
    return org
  }

  create(id: string, orgJson: J): O {
    return new Organization(id, orgJson.places, orgJson.kind) as O
  }
}
