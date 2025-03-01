import path from "path"
import { People } from "./People.js"
import { PeopleFactory } from "./PeopleFactory.js"
import { PeopleJson } from "./PeopleJson.js"
import { AbstractDataService } from "../AbstractDataService.js"
import { AllDataService } from "../AllDataService.js"
import { StringUtil } from "../util/string/StringUtil.js"

export interface PeopleServiceConfig {
  rootDir: string
  files: string[]
}

export class PeopleService extends AbstractDataService<People, PeopleJson> {

  readonly cache = new Map<string, People>()

  constructor(dataService: AllDataService, protected peopleFactory: PeopleFactory,
              protected config: PeopleServiceConfig) {
    super(dataService, peopleFactory, config.files)
  }

  getUrl(lastName: string, firstNames: string[]): string {
    const normalizedLastName = StringUtil.removeAccents(lastName)
    const normalizedFirstNames = firstNames.map(StringUtil.removeAccents).map(StringUtil.withoutDots)
    const firstLetter = (normalizedLastName + normalizedFirstNames.join("")).charAt(0).toLowerCase()
    return path.join(this.config.rootDir,
      `${firstLetter}/${normalizedLastName}${normalizedFirstNames.join("")}`)
  }

  createFromTitle(title: string): People {
    const {lastName, firstNames} = this.peopleFactory.namesFromTitle(title)
    const dirName: string | undefined = this.dirNameFromNames(lastName, firstNames)
    const created = this.peopleFactory.parse({title, firstNames, lastName, dirName})
    if (this.files.indexOf(dirName) < 0) {
      console.warn(`Could not find dirName "${dirName}" in PeopleService files; clearing dirName`)
      Object.assign(created, {dirName: undefined})
    }
    this.cache.set(lastName, created)
    return created
  }

  protected dirNameFromNames(lastName: string, firstNames: string[]) {
    return this.cache.get(lastName.toLowerCase())?.dirName || this.getUrl(lastName, firstNames)
  }

  async getAll(): Promise<People[]> {
    return this.getFromDirs(this.files)
  }

  async getFromDirs(dirNames: string[]): Promise<People[]> {
    let peopleList: People[] = []
    for (const dirName of dirNames) {
      const list = await this.getFromDir(dirName)
      peopleList.push(...list)
    }
    return peopleList
  }

  /**
   * Get people information found in a directory.
   *
   * @param dirName
   * @return {People[]} The found people information.
   */
  async getFromDir(dirName: string): Promise<People[]> {
    const fileSpec = ["people*.json"]
    return this.dataService.getFromDir<People>(dirName, ["people", undefined], fileSpec)
  }
}
