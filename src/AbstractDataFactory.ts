import path from "path"
import fs from "fs"
import { RR0Data } from "./RR0Data.js"
import { RR0DataFactory } from "./RR0DataFactory.js"
import { RR0DataJson } from "./RR0DataJson.js"
import { RR0Event, RR0EventFactory, RR0EventJson } from "./event/index.js"
import { StringUtil } from "./util/string/StringUtil.js"

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
    const title = this.createTitle(dataJson)
    const jsonEvents = this.defaultJsonEvents(dataJson)
    const data: RR0Data = {
      id: dataJson.id,
      type: dataJson.type,
      dirName: dataJson.dirName,
      name: dataJson.name,
      title,
      url: dataJson.url,
      events: []
    }
    data.events = this.parseEvents(jsonEvents, data)
    return data as T
  }

  defaultJsonEvents(dataJson: J) {
    const jsonEvents = dataJson.events || []
    const birthTime = dataJson.birthTime
    if (birthTime) {
      jsonEvents.push({type: "event", eventType: "birth", time: birthTime as any, events: []})
    }
    const deathTime = dataJson.deathTime
    if (deathTime) {
      jsonEvents.push({type: "event", eventType: "death", time: deathTime as any, events: []})
    }
    let imageJsonEvent: RR0EventJson = {type: "event", eventType: "image", events: []}
    if (dataJson.image) {
      imageJsonEvent.url = dataJson.image
    } else {
      let hasDefaultFile = false
      const dirName = dataJson.dirName
      if (dirName) {
        for (const defaultImageFile of this.previewFileNames) {
          hasDefaultFile = fs.existsSync(path.join(dirName, defaultImageFile))
          if (hasDefaultFile) {
            imageJsonEvent.url = defaultImageFile
            imageJsonEvent.name = dataJson.name   // In a default portrait image, label is parent's name
            break
          }
        }
      }
    }
    if (imageJsonEvent.url) {
      jsonEvents.push(imageJsonEvent)
    }
    return jsonEvents
  }

  parseEvents(jsonEvents: RR0EventJson[] = [], defaultParent: RR0Data): RR0Event[] {
    const events: RR0Event[] = []
    for (const eventJson of jsonEvents) {
      const event = this.parseEvent(eventJson, defaultParent)
      events.push(event)
    }
    return events
  }

  /**
   * Determine people name from directory name.
   *
   * @param dataJson
   */
  protected createTitle(dataJson: J): string {
    let title = dataJson.title
    if (!title && dataJson.dirName) {
      title = StringUtil.camelToText(path.basename(dataJson.dirName))
      const names = title.split(" ")
      title = names.length <= 1 ? title : `${names[0]}, ${names.slice(1).join(" ")}`
    }
    return title
  }

  protected parseEvent(eventJson: RR0EventJson, defaultParent: RR0Data) {
    const event = this.eventFactory.parse(eventJson)
    switch (event.eventType) {
      case "image":
        event.name = event.name || defaultParent?.name || "<unknown name>"
        event.title = event.title || defaultParent?.title || "<unknown title>"
        break
    }
    return event
  }
}
