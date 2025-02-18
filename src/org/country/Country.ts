import { CountryCode } from "./CountryCode.js"
import { Place } from "@rr0/place"
import { OrganizationKind } from "../OrganizationKind"
import { Organization } from "../Organization"

export class Country extends Organization {

  constructor(code: CountryCode, places: Place[] = []) {
    super(code, places, OrganizationKind.country)
  }
}
