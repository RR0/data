import path from "path"
import { People } from "./People.js"
import { PeopleFactory } from "./PeopleFactory.js"
import { PeopleJson } from "./PeopleJson.js"
import { AbstractDataService, DataServiceConfig } from "../AbstractDataService.js"
import { AllDataService } from "../AllDataService.js"
import { StringUtil } from "../util/string/StringUtil.js"


export class PeopleService extends AbstractDataService<People, PeopleJson> {

  constructor(dataService: AllDataService, factory: PeopleFactory, protected config: DataServiceConfig) {
    super(dataService, factory, config.files)
  }

  getUrl(lastName: string, firstNames: string[]): string {
    const normalizedLastName = StringUtil.textToCamel(lastName)
    const normalizedFirstNames = firstNames.map(StringUtil.textToCamel)
    const firstLetter = (normalizedLastName + normalizedFirstNames.join("")).charAt(0).toLowerCase()
    return path.join(this.config.rootDir,
      `${firstLetter}/${normalizedLastName}${normalizedFirstNames.join("")}`)
  }

  createFromTitle(title: string): People {
    const peopleFactory = this.factory as PeopleFactory
    const {lastName, firstNames, qualifier} = peopleFactory.namesFromTitle(title)
    const key = this.cacheKey(lastName, title)
    const dirName: string | undefined = lastName ? this.dirNameFromNames(lastName, firstNames, title) : this.getUrl(
      StringUtil.textToCamel(title), [])
    const created = peopleFactory.parse({title, firstNames, lastName, dirName})
    if (this.files.indexOf(dirName) < 0) {
      console.warn(`Could not find dirName "${dirName}" in PeopleService files; clearing dirName`)
      Object.assign(created, {dirName: undefined})
    }
    this.cache.set(key, created)
    return created
  }

  protected cacheKey(lastName: string, title: string): string {
    const titleKey = StringUtil.textToCamel(title)
    return StringUtil.textToCamel(lastName) || titleKey
  }

  protected dirNameFromNames(lastName: string, firstNames: string[], title: string) {
    const cacheKey = this.cacheKey(lastName, title)
    return this.cache.get(cacheKey)?.dirName || this.getUrl(lastName, firstNames)
  }
}
