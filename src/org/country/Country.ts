import { CountryCode } from "./CountryCode.js"
import { Place } from "@rr0/place"
import { OrganizationKind } from "../OrganizationKind.js"
import { Organization } from "../Organization.js"

export class Country extends Organization {

  constructor(code: CountryCode, places: Place[] = []) {
    super(code, places, OrganizationKind.country)
  }
}
