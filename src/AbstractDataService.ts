import { AllDataService } from "./AllDataService.js"
import { TypedDataFactory } from "./TypedDataFactory.js"
import { RR0Data } from "./RR0Data.js"
import { RR0DataJson } from "./RR0DataJson.js"

export interface DataServiceConfig {
  rootDir: string
  files: string[]
}

export abstract class AbstractDataService<T extends RR0Data, J extends RR0DataJson> {

  readonly cache = new Map<string, T>()

  protected constructor(protected readonly dataService: AllDataService, protected factory: TypedDataFactory<T, J>,
                        readonly files: string[]) {
  }

  get type(): string {
    return this.factory.type
  }

  async getByDir(path: string): Promise<T[] | undefined> {
    return this.dataService.getFromDir<T>(path, [this.type, undefined], [this.type + ".json"])
  }

  async getAll(): Promise<T[]> {
    return this.getFromDirs(this.files)
  }

  async getFromDirs(dirNames: string[]): Promise<T[]> {
    let dataList: T[] = []
    for (const dirName of dirNames) {
      const list = await this.getFromDir(dirName)
      dataList.push(...list)
    }
    return dataList
  }

  /**
   * Get people information found in a directory.
   *
   * @param dirName
   * @return {People[]} The found people information.
   */
  async getFromDir(dirName: string): Promise<T[]> {
    const fileSpec = [`${this.type}*.json`]
    return this.dataService.getFromDir<T>(dirName, [this.type, undefined], fileSpec)
  }
}
