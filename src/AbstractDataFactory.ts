import path from "path"
import fs from "fs"
import { RR0Data } from "./RR0Data.js"
import { RR0DataFactory } from "./RR0DataFactory.js"
import { RR0DataJson } from "./RR0DataJson.js"
import { RR0Event, RR0EventFactory, RR0EventJson } from "./event/index.js"

export abstract class AbstractDataFactory<T extends RR0Data, J extends RR0DataJson> implements RR0DataFactory<T> {

  static readonly defaultPreviewFileNames = ["portrait.jpg", "portrait.gif", "portrait.png", "portrait.webp"]

  /**
   * @param eventFactory The factory to create sub-events.
   * @param previewFileNames
   */
  protected constructor(
    protected eventFactory: RR0EventFactory,
    protected previewFileNames = AbstractDataFactory.defaultPreviewFileNames
  ) {
  }

  parse(dataJson: J): T {
    const jsonEvents = this.getDefaultEvents(dataJson)
    const data: RR0Data = {
      events: [],
      id: dataJson.id,
      url: dataJson.url,
      dirName: dataJson.dirName,
      title: dataJson.title,
      type: dataJson.type
    }
    data.events = this.parseEvents(jsonEvents, data)
    return data as T
  }

  protected getDefaultEvents(dataJson: J) {
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
      for (const defaultImageFile of this.previewFileNames) {
        hasDefaultFile = fs.existsSync(path.join(dataJson.dirName || "", defaultImageFile))
        if (hasDefaultFile) {
          jsonEvents.push(
            {type: "event", eventType: "image", url: defaultImageFile as any, name: dataJson.name, events: []})
          break
        }
      }
    }
    return jsonEvents
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
