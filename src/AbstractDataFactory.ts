import path from "path"
import fs from "fs"
import { RR0Data } from "./RR0Data.js"
import { RR0DataFactory } from "./RR0DataFactory.js"
import { RR0Event, RR0EventFactory } from "./event"
import { RR0DataJson } from "./RR0DataJson"
import { RR0EventJson } from "./event/RR0EventJson"

export abstract class AbstractDataFactory<T extends RR0Data, J extends RR0DataJson> implements RR0DataFactory<T> {

  static readonly defaultImageFileNames = ["portrait.jpg", "portrait.gif", "portrait.png", "portrait.webp"]

  /**
   * @param eventFactory The factory to create sub-events.
   */
  protected constructor(protected eventFactory: RR0EventFactory) {
  }

  parse(dataJson: J): T {
    const jsonEvents = dataJson.events || []
    if (!dataJson.image) {
      let hasDefaultFile = false
      for (const defaultImageFile of AbstractDataFactory.defaultImageFileNames) {
        hasDefaultFile = fs.existsSync(path.join(dataJson.dirName, defaultImageFile))
        if (hasDefaultFile) {
          jsonEvents.push(
            {type: "event", eventType: "image", url: defaultImageFile as any, name: dataJson.name, events: []})
          break
        }
      }
    }
    const data: RR0Data = {events: [], id: dataJson.id, url: dataJson.url, dirName: dataJson.dirName}
    data.events = this.parseEvents(jsonEvents, data)
    return data as T
  }

  protected parseEvents(jsonEvents: RR0EventJson[] = [], defaultParent: RR0Data): RR0Event[] {
    const events: RR0Event[] = []
    for (const eventJson of jsonEvents) {
      const resolvedEvent = this.eventFactory.parse(eventJson)
      switch (resolvedEvent.eventType) {
        case "image":
          resolvedEvent.name = resolvedEvent.name || defaultParent?.name || "<unknown name>"
          resolvedEvent.title = resolvedEvent.title || defaultParent?.title || "<unknown title>"
          break
      }
      events.push(resolvedEvent)
    }
    return events
  }
}
