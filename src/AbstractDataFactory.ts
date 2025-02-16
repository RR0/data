import path from "path"
import fs from "fs"
import { RR0Data } from "./RR0Data.js"
import { RR0DataFactory } from "./RR0DataFactory.js"
import { RR0DataJson } from "./RR0DataJson.js"
import { RR0Event, RR0EventFactory, RR0EventJson } from "./event/index.js"

export abstract class AbstractDataFactory<T extends RR0Data, J extends RR0DataJson> implements RR0DataFactory<T> {
  /**
   * @param eventFactory The factory to create sub-events.
   * @param defaultImageFileNames
   */
  protected constructor(
    protected eventFactory: RR0EventFactory,
    readonly defaultImageFileNames = ["portrait.jpg", "portrait.gif", "portrait.png", "portrait.webp"]
  ) {
  }

  parse(dataJson: J): T {
    const jsonEvents = dataJson.events || []
    const birthTime = dataJson.birthTime
    if (birthTime) {
      jsonEvents.push({type: "event", eventType: "birth", time: birthTime as any, events: []})
    }
    const deathTime = dataJson.deathTime
    if (deathTime) {
      jsonEvents.push({type: "event", eventType: "death", time: deathTime as any, events: []})
    }
    if (!dataJson.image) {
      let hasDefaultFile = false
      for (const defaultImageFile of this.defaultImageFileNames) {
        hasDefaultFile = fs.existsSync(path.join(dataJson.dirName || "", defaultImageFile))
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

  parseEvents(jsonEvents: RR0EventJson[] = [], defaultParent: RR0Data): RR0Event[] {
    const events: RR0Event[] = []
    for (const eventJson of jsonEvents) {
      const event = this.eventFactory.parse(eventJson)
      switch (event.eventType) {
        case "image":
          event.name = event.name || defaultParent?.name || "<unknown name>"
          event.title = event.title || defaultParent?.title || "<unknown title>"
          break
      }
      events.push(event)
    }
    return events
  }
}
