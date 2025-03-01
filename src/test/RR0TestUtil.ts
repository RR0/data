import { PeopleFactory } from "../people/index.js"
import { AllDataService } from "../AllDataService.js"
import { EventDataFactory, RR0EventFactory } from "../event/index.js"
import { TypedDataFactory } from "../TypedDataFactory.js"
import { OrganizationFactory } from "../org/OrganizationFactory.js"

export class RR0TestUtil {

  readonly dataService: AllDataService
  readonly peopleFactory: PeopleFactory
  readonly orgFactory: OrganizationFactory

  constructor(readonly rootDir = "test") {
    const eventFactory = new RR0EventFactory()
    const sightingFactory = new EventDataFactory(eventFactory, ["sighting"], ["index"])
    this.peopleFactory = new PeopleFactory(eventFactory)
    this.orgFactory = new OrganizationFactory(eventFactory)
    const bookFactory = new TypedDataFactory(eventFactory, "book")
    const articleFactory = new TypedDataFactory(eventFactory, "article")
    this.dataService = new AllDataService([this.peopleFactory, bookFactory, articleFactory, sightingFactory])
  }
}

export const rr0TestUtil = new RR0TestUtil()
