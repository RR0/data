import { RR0Event } from "../RR0Event.js"
import { EventTime, EventTimeValue } from "../EventTime.js"
import {
  AgentJson, RR0InterviewEventJson, RR0InterviewFileJson, RR0InterviewMedium, RR0InterviewSegmentJson, RR0InterviewSpeakerJson, SaidTextJson
} from "./RR0InterviewJson.js"

/**
 * An interview about a case: who held it, with which witness (an observer of the case), when, what it established and, when it was kept,
 * what was said.
 *
 * It is both an event of the case (see {@link toEventJson}) and a file of its own (see {@link toFileJson}), and the two hold the same fields: the
 * file is the whole interview, the event what the case lists of it. Reading one from the event, or from the file, or from both, gives the same thing.
 */
export class RR0Interview extends RR0Event<"interview"> {

  /**
   * The ids of the sighting events of the case it was held with.
   */
  interviewOf: string[] = []

  /**
   * Who held it.
   */
  by: AgentJson[] = []

  /**
   * Its title in the languages it has (`title`, which every RR0 data has, is a plain string: the one a reader of the first language there reads).
   */
  titleText?: SaidTextJson

  /**
   * What it established.
   */
  summary?: SaidTextJson

  /**
   * What it was held through.
   */
  medium?: RR0InterviewMedium

  /**
   * The language it was held in.
   */
  language?: string

  speakers: Record<string, RR0InterviewSpeakerJson> = {}
  segments: RR0InterviewSegmentJson[] = []
  transcription?: RR0InterviewFileJson["transcription"]
  proofreading?: RR0InterviewFileJson["proofreading"]
  anonymization?: RR0InterviewFileJson["anonymization"]

  /**
   * When it was held, as it is written (`time` is that read as a date).
   */
  timeText?: string

  constructor(time?: EventTimeValue) {
    super("interview", time)
  }

  /**
   * True when every speaker has approved the transcript (approved, or covered by a fuller version they approved).
   */
  get proofread(): boolean {
    const ids = Object.keys(this.speakers)
    return ids.length > 0 && ids.every(id => {
      const status = this.proofreading?.[id]?.status
      return status === "approved" || status === "covered"
    })
  }

  private static ids(interviewOf: string | string[] | undefined): string[] {
    return [interviewOf].flat().filter((id): id is string => typeof id === "string")
  }

  private static plain(text: SaidTextJson | undefined): string | undefined {
    return typeof text === "string" ? text : text ? Object.values(text).find(said => said) : undefined
  }

  /**
   * An interview as the event of a case lists it.
   */
  static fromEventJson(json: RR0InterviewEventJson): RR0Interview {
    const interview = new RR0Interview(json.time ? EventTime.parse(json.time) : undefined)
    interview.timeText = json.time
    interview.interviewOf = RR0Interview.ids(json.interviewOf)
    interview.by = json.by ?? []
    interview.titleText = json.title
    interview.summary = json.summary
    interview.medium = json.medium
    interview.id = json.id
    interview.url = json.url
    interview.title = RR0Interview.plain(json.title)
    return interview
  }

  /**
   * An interview as its file holds it.
   */
  static fromFileJson(json: RR0InterviewFileJson): RR0Interview {
    const interview = new RR0Interview(json.time ? EventTime.parse(json.time) : undefined)
    interview.timeText = json.time
    interview.id = json.id
    interview.language = json.language
    interview.interviewOf = RR0Interview.ids(json.interviewOf)
    interview.by = json.by ?? []
    interview.titleText = json.title
    interview.title = RR0Interview.plain(json.title)
    interview.summary = json.summary
    interview.medium = json.medium
    interview.speakers = json.speakers ?? {}
    interview.transcription = json.transcription
    interview.proofreading = json.proofreading
    interview.anonymization = json.anonymization
    interview.segments = json.segments ?? []
    return interview
  }

  /**
   * What the file says of the interview, over what the event says: the file is the whole interview, so a field it has is the interview's, and
   * the event's stays for what the file does not say. The event's `url` is where the file is, so it stays too.
   */
  withFile(file: RR0InterviewFileJson): RR0Interview {
    const merged = RR0Interview.fromFileJson(file)
    merged.id = this.id ?? merged.id
    merged.url = this.url
    merged.sources = this.sources
    Object.assign(merged, { notes: this.notes })
    if (merged.timeText === undefined && this.timeText !== undefined) {
      merged.timeText = this.timeText
      Object.assign(merged, { time: this.time })
    }
    if (merged.titleText === undefined) {
      merged.titleText = this.titleText
      merged.title = this.title
    }
    if (merged.summary === undefined) merged.summary = this.summary
    if (merged.medium === undefined) merged.medium = this.medium
    if (merged.by.length === 0) merged.by = this.by
    if (merged.interviewOf.length === 0) merged.interviewOf = this.interviewOf
    return merged
  }

  /**
   * The event of a case that lists this interview: what it is, when, by whom, with whom, what it established, and where its file is.
   */
  toEventJson(): RR0InterviewEventJson {
    return {
      type: "event",
      eventType: "interview",
      ...(this.id !== undefined ? { id: this.id } : {}),
      ...(this.interviewOf.length > 0 ? { interviewOf: this.interviewOf.length === 1 ? this.interviewOf[0] : this.interviewOf } : {}),
      ...(this.timeText !== undefined ? { time: this.timeText } : {}),
      ...(this.medium !== undefined ? { medium: this.medium } : {}),
      ...(this.by.length > 0 ? { by: this.by } : {}),
      ...(this.titleText !== undefined ? { title: this.titleText } : {}),
      ...(this.summary !== undefined ? { summary: this.summary } : {}),
      ...(this.url !== undefined ? { url: this.url } : {})
    } as RR0InterviewEventJson
  }

  /**
   * The file of this interview: the whole of it, with what was said.
   */
  toFileJson(): RR0InterviewFileJson {
    return {
      version: 1,
      ...(this.id !== undefined ? { id: this.id } : {}),
      ...(this.language !== undefined ? { language: this.language } : {}),
      ...(this.titleText !== undefined ? { title: this.titleText } : {}),
      ...(this.timeText !== undefined ? { time: this.timeText } : {}),
      ...(this.medium !== undefined ? { medium: this.medium } : {}),
      ...(this.by.length > 0 ? { by: this.by } : {}),
      ...(this.interviewOf.length > 0 ? { interviewOf: this.interviewOf.length === 1 ? this.interviewOf[0] : this.interviewOf } : {}),
      ...(this.summary !== undefined ? { summary: this.summary } : {}),
      speakers: this.speakers,
      ...(this.transcription !== undefined ? { transcription: this.transcription } : {}),
      ...(this.proofreading !== undefined ? { proofreading: this.proofreading } : {}),
      ...(this.anonymization !== undefined ? { anonymization: this.anonymization } : {}),
      segments: this.segments
    }
  }
}
