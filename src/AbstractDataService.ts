import { AllDataService } from "./AllDataService.js"
import { TypedDataFactory } from "./TypedDataFactory.js"
import { RR0Data } from "./RR0Data.js"

export abstract class AbstractDataService<T extends RR0Data> {

  protected constructor(protected readonly dataService: AllDataService, protected factory: TypedDataFactory<T>,
                        readonly files: string[]) {
  }

  get type(): string {
    return this.factory.type
  }

  async get(path: string): Promise<T[] | undefined> {
    return this.dataService.getFromDir<T>(path, [this.type, undefined], [this.type + ".json"])
  }
}
