import path from "path"
import { PeopleFactory } from "../people/index.js"
import { AllDataService } from "../AllDataService"
import { EventDataFactory, RR0EventFactory } from "../event"
import { TypedDataFactory } from "../TypedDataFactory"

export class RR0TestUtil {

  readonly dataService: AllDataService

  readonly peopleFactory: PeopleFactory

  constructor(readonly rootDir = "test", readonly outDir = "out") {
    const eventFactory = new RR0EventFactory()
    const sightingFactory = new EventDataFactory(eventFactory, "sighting", ["index"])
    this.peopleFactory = new PeopleFactory(eventFactory)
    const bookFactory = new TypedDataFactory(eventFactory, "book")
    const articleFactory = new TypedDataFactory(eventFactory, "article")
    this.dataService = new AllDataService(
      [this.peopleFactory, bookFactory, articleFactory, sightingFactory])
    this.dataService.getFromDir("", ["people", "case"]).then(data => {
      //   console.debug(data)
    })
  }

  filePath(inputFileName: string): string {
    return path.join(this.rootDir, inputFileName)
  }
}

export const rr0TestUtil = new RR0TestUtil()

export function testFilePath(filePath: string) {
  return path.join(rr0TestUtil.rootDir, filePath)
}
