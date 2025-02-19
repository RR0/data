import path from "path"
import { RR0Data } from "./RR0Data.js"
import { AbstractDataFactory } from "./AbstractDataFactory.js"
import { RR0EventFactory } from "./event"
import { FileContents, findDirsContaining } from "@javarome/fileutil"
import { RR0DataJson, RR0DataType } from "./RR0DataJson"
import { StringUtil } from "./util/string/string"

/**
 * A RR0Data factory which can read either <someType>.json files of index.json with a "type": "<someType>" property.
 */
export class TypedDataFactory<T extends RR0Data, J extends RR0DataJson> extends AbstractDataFactory<T, J> {

  constructor(eventFactory: RR0EventFactory, readonly type: RR0DataType, readonly fileNames: string[] = [type]) {
    super(eventFactory)
  }

  /**
   * Determine people name from directory name.
   *
   * @param dataJson
   */
  protected completeFromDirName(dataJson: J): J {
    const dirName = dataJson.dirName
    const completedJson = {...dataJson, dirName: dirName || ""}
    if (dirName) {
      const lastSlash = dirName.lastIndexOf("/")
      const lastDir = dirName.substring(lastSlash + 1)
      completedJson.title = completedJson.title || StringUtil.camelToText(lastDir)
    }
    return completedJson
  }

  create(file: FileContents): T | undefined {
    const dataJson = JSON.parse(file.contents) as J
    const basename = path.basename(file.name)
    if (!dataJson.type) {  // Guess type fromfile name
      dataJson.type = basename.substring(0, basename.indexOf(".")).toLowerCase() as RR0DataType
    }
    let datum: T | undefined
    if (dataJson.type === this.type) {
      dataJson.dirName = path.dirname(file.name)
      datum = this.parse(dataJson)
    }
    return datum
  }

  async getFiles(): Promise<string[]> {
    return findDirsContaining(this.fileNames[0] + ".json", "out")
  }
}
