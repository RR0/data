import { globSync } from "glob"
import { FileContents } from "@javarome/fileutil"
import { RR0Data } from "./RR0Data.js"
import { TypedDataFactory } from "./TypedDataFactory.js"
import { RR0DataJson } from "./RR0DataJson.js"

/**
 * Fetch RR0 data from JSON files.
 */
export class AllDataService {

  readonly pathToData = new Map<string, RR0Data[]>()

  /**
   *
   * @param factories The factories to instantiate different RR0Data types.
   */
  constructor(readonly factories: TypedDataFactory<RR0Data, RR0DataJson>[]) {
  }

  async getFromDir<T extends RR0Data = RR0Data>(
    dirName: string, types: string[],
    fileNames: string[] = this.factories.reduce(
      (allFileNames, factory) => Array.from(new Set(allFileNames.concat(factory.fileNames))), [])
  ): Promise<T[]> {
    const key = dirName + "$" + fileNames.join("$")
    let dataList = this.pathToData.get(key)
    if (dataList === undefined) {
      dataList = await this.readAll<T>(dirName, fileNames)
      this.pathToData.set(key, dataList)
    }
    return dataList.filter(data => types.includes(data.type)) as T[]
  }

  protected async read<T extends RR0Data = RR0Data>(fileName: string): Promise<T> {
    const dataFile = FileContents.read(fileName, "utf-8")
    let data: T | undefined
    for (let i = 0; !data && i < this.factories.length; i++) {
      const factory = this.factories[i]
      try {
        data = (factory.createFromFile(dataFile) as T)
      } catch (e) {
        console.warn("Could not create a", factory.type, "from", dataFile, "because of", e)
      }
    }
    return data
  }

  protected async readAll<T extends RR0Data = RR0Data>(dirName: string, fileNames: string[]): Promise<T[]> {
    const dataList: T[] = []
    const p = `${dirName}/*(${fileNames.join("|")})`
    const files = globSync(p)
    for (const file of files) {
      try {
        const dataFile = await this.read(file)
        if (dataFile) {
          dataList.push(dataFile as T)
        } else {
          throw new Error("No factory to handle " + dataFile.name)
        }
      } catch (e) {
        console.warn(`Could not create data from ${file}`, e)
      }
    }
    return dataList
  }
}
