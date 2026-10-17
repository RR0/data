import { describe, expect, test } from "vitest"
import { RR0Interview } from "./RR0Interview.js"
import { RR0InterviewEventJson, RR0InterviewFileJson } from "./RR0InterviewJson.js"
import { RR0EventFactory } from "../RR0EventFactory.js"

/**
 * An interview is an event of a case and a file of its own, which hold the same fields: what is read from one is what is written back to it.
 */
describe("RR0Interview", () => {

  const event: RR0InterviewEventJson = {
    type: "event",
    eventType: "interview",
    id: "interview-qb-1",
    interviewOf: "qb",
    time: "2026-10-13 21:27",
    medium: "video",
    by: [{ people: "BeauJerome" }],
    title: { fr: "Entretien en visioconférence avec Q. B.", en: "Video interview with Q. B." },
    summary: { fr: "Précisions sur le compte rendu.", en: "Details of the account." },
    url: "interview-saint-lo-2026-10-13.json"
  }

  const file: RR0InterviewFileJson = {
    version: 1,
    id: "interview-qb-1",
    language: "fr",
    title: { fr: "Entretien en visioconférence avec Q. B.", en: "Video interview with Q. B." },
    time: "2026-10-13 21:27",
    medium: "video",
    by: [{ people: "BeauJerome" }],
    interviewOf: "qb",
    summary: { fr: "Précisions sur le compte rendu.", en: "Details of the account." },
    speakers: {
      interviewer: { role: "interviewer", by: { people: "BeauJerome" } },
      witness: { role: "witness", title: "Q. B.", of: "qb" }
    },
    transcription: { method: "automatic", engine: "whisper.cpp large-v3-turbo", proofread: false },
    anonymization: { replaced: ["first names"], marker: "[prénom]" },
    segments: [
      { speaker: "interviewer", start: 0, end: 27.6, text: "Ok. Donc là, tu vois…" },
      { speaker: "witness", start: 30, end: 53, text: "Bien sûr." }
    ]
  }

  test("is read from the event of a case with what it holds, and written back as it was", () => {
    const interview = RR0Interview.fromEventJson(event)
    expect(interview.eventType).toBe("interview")
    expect(interview.interviewOf).toEqual(["qb"])
    expect(interview.by).toEqual([{ people: "BeauJerome" }])
    expect(interview.title).toBe("Entretien en visioconférence avec Q. B.")
    expect(interview.titleText).toEqual(event.title)
    expect(interview.medium).toBe("video")
    expect(interview.time).toBeDefined()
    expect(interview.toEventJson()).toEqual(event)
  })

  test("is read from its file, and written back as it was, transcript included", () => {
    const interview = RR0Interview.fromFileJson(file)
    expect(interview.segments).toHaveLength(2)
    expect(interview.speakers.witness.of).toBe("qb")
    expect(interview.toFileJson()).toEqual(file)
  })

  test("holds in its file everything its event does, and the other way round: the event and the file say the same thing", () => {
    const fromEvent = RR0Interview.fromEventJson(event)
    const fromFile = RR0Interview.fromFileJson(file)
    for (const field of ["interviewOf", "by", "titleText", "summary", "timeText", "medium", "id"] as const) {
      expect(fromEvent[field], field).toEqual(fromFile[field])
    }
    const { type: _type, eventType: _eventType, url: _url, ...listed } = fromFile.toEventJson() as Record<string, unknown>
    const { type: _t, eventType: _e, url: _u, ...kept } = event as Record<string, unknown>
    expect(listed).toEqual(kept)
  })

  test("keeps several witnesses as a list, and one as the id alone", () => {
    expect(RR0Interview.fromEventJson({ ...event, interviewOf: ["a", "b"] }).toEventJson().interviewOf).toEqual(["a", "b"])
    expect(RR0Interview.fromEventJson({ ...event, interviewOf: ["a"] }).toEventJson().interviewOf).toBe("a")
  })

  test("takes from its file what the file says, and keeps of its event what the file does not", () => {
    const sparse = RR0Interview.fromEventJson({ ...event, summary: "From the case" })
    const merged = sparse.withFile({ ...file, summary: undefined, title: undefined, by: undefined, medium: undefined })
    expect(merged.medium).toBe("video")
    expect(merged.segments).toHaveLength(2)
    expect(merged.summary).toBe("From the case")
    expect(merged.titleText).toEqual(event.title)
    expect(merged.by).toEqual([{ people: "BeauJerome" }])
    expect(merged.url).toBe(event.url)
    const overridden = sparse.withFile({ ...file, summary: "From the file" })
    expect(overridden.summary).toBe("From the file")
  })

  test("is what the event factory makes of an event of the type interview, and keeps its fields", () => {
    const parsed = new RR0EventFactory().parse(event as never)
    expect(parsed).toBeInstanceOf(RR0Interview)
    const interview = parsed as RR0Interview
    expect(interview.interviewOf).toEqual(["qb"])
    expect(interview.summary).toEqual(event.summary)
    expect(interview.title).toBe("Entretien en visioconférence avec Q. B.")
    expect(interview.url).toBe(event.url)
    expect(interview.toEventJson()).toEqual(event)
  })

  test("is no interview for another event", () => {
    expect(new RR0EventFactory().parse({ type: "event", eventType: "sighting", time: "1952-07-19" } as never)).not.toBeInstanceOf(RR0Interview)
  })
})
