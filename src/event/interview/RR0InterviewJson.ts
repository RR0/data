import { RR0EventJson } from "../RR0EventJson.js"

/**
 * Text said in one language or in several: a plain string, or one string per language tag ("fr", "en", "pt-BR").
 * A reader whose languages are none of those present reads what is there rather than nothing.
 */
export type SaidTextJson = string | Readonly<Record<string, string>>

/**
 * Who did something: a person or an organization of RR0 (by its identifier), or anyone by the name they are given.
 */
export type AgentJson = { people: string } | { org: string } | { title: string }

/**
 * What an interview was held through: face to face (`in-person`), by `phone`, in a `video` call, by `chat`, by `email`, by `letter`, or `other`.
 */
export type RR0InterviewMedium = "in-person" | "phone" | "video" | "chat" | "email" | "letter" | "other"

/**
 * Who speaks in an interview.
 */
export interface RR0InterviewSpeakerJson {
  /**
   * What they are in the interview: "interviewer", "witness", or any other.
   */
  role: "interviewer" | "witness" | string

  /**
   * The interviewer, as RR0 names an agent.
   */
  by?: AgentJson

  /**
   * What the witness is called: their initials where they are not named.
   */
  title?: SaidTextJson

  /**
   * The id of the sighting event of the case this witness is the observer of.
   */
  of?: string
}

/**
 * A place in the interview that points at a moment of the observation it is about.
 */
export interface RR0InterviewSightingRefJson {

  /**
   * The id of the sighting event of the case; the interview's own `interviewOf` when omitted.
   */
  sighting?: string

  /**
   * Seconds since the beginning of the observation.
   */
  at: number

  /**
   * The part of the segment's text it is about, as [from, to) character offsets; the whole segment when omitted.
   */
  range?: [number, number]
}

/**
 * Why a passage was taken out of a published interview.
 */
export interface RR0InterviewRedactionJson {
  reason: SaidTextJson
}

/**
 * Whether a participant has approved the transcript as it is published: pending, approved, or covered (approved through a fuller version,
 * since a file holding less than one they approved needs no new approval).
 */
export interface RR0InterviewProofreadingJson {
  status: "pending" | "approved" | "covered"
  date?: string

  /**
   * For covered: the id of the fuller version they approved.
   */
  coveredBy?: string
}

/**
 * One turn of speech: one speaker, from `start` to `end` seconds after the beginning of the recording, and what was said. A passage taken out of
 * the published file keeps its place but loses its text, and says why in `redacted`.
 */
export interface RR0InterviewSegmentJson {
  speaker: string
  start: number
  end: number
  text?: string
  redacted?: RR0InterviewRedactionJson
  refs?: RR0InterviewSightingRefJson[]
}

/**
 * The file of an interview, the one the `url` of its event points at: the whole of the interview, so that what a page shows of it (its title, its
 * time, who held it, with whom, what it established) and what was said (its transcript) are in the same file and say the same thing.
 *
 * The same format as UFO@home's `InterviewJson` (src/engine/persistence/interviewJson.ts), which edits it.
 */
export interface RR0InterviewFileJson {
  version: 1
  id?: string
  language?: string
  title?: SaidTextJson

  /**
   * When it was held, as RR0 writes a time.
   */
  time?: string

  /**
   * What it was held through.
   */
  medium?: RR0InterviewMedium

  /**
   * Who held it.
   */
  by?: AgentJson[]

  /**
   * The id, or the ids, of the sighting events of the case it was held with.
   */
  interviewOf?: string | string[]

  /**
   * What it established.
   */
  summary?: SaidTextJson
  speakers: Record<string, RR0InterviewSpeakerJson>
  transcription?: { method?: "automatic" | "manual", engine?: string, note?: string }

  /**
   * Who approved the transcript, by speaker id. It is proofread when every speaker has.
   */
  proofreading?: Record<string, RR0InterviewProofreadingJson>

  /**
   * What was taken out to anonymise it, and what stands in its place.
   */
  anonymization?: { replaced?: string[], marker?: string }
  segments: RR0InterviewSegmentJson[]
}

/**
 * An interview as an event of a case (`"eventType": "interview"`), which points at its file by `url` when it has one.
 */
export type RR0InterviewEventJson = Omit<RR0EventJson, "title" | "eventType"> & {
  eventType: "interview"
  title?: SaidTextJson
  medium?: RR0InterviewMedium
  by?: AgentJson[]
  interviewOf?: string | string[]
  summary?: SaidTextJson
}
