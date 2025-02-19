import { Organization } from "./Organization.js"
import { OrganizationJson } from "./OrganizationJson.js"
import { TypedDataFactory } from "../TypedDataFactory"
import { RR0EventFactory } from "../event"

export class OrganizationFactory extends TypedDataFactory<Organization, OrganizationJson> {

  constructor(eventFactory: RR0EventFactory) {
    super(eventFactory, "org", ["index"])
  }

  parse(orgJson: OrganizationJson): Organization {
    const completedJson = this.completeFromDirName(orgJson)
    const base = super.parse(completedJson)
    const id = base.id || orgJson.dirName.replaceAll("/", "-")
    const org = new Organization(id, orgJson.places, orgJson.kind)
    org.title = base.title
    org.dirName = base.dirName
    org.parent = base.parent
    return org
  }
}
