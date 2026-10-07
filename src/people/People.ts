import { Occupation } from "./Occupation.js"
import { Gender } from "@rr0/common"
import { Level2Date as EdtfDate, Level2Duration as Duration } from "@rr0/time"
import { EventTime, EventTimeValue } from "../event/EventTime.js"
import { RR0Data } from "../RR0Data.js"
import { CountryCode } from "../org/country/CountryCode.js"
import { RR0Event } from "../event/RR0Event.js"
import { StringUtil } from "../util/string/StringUtil.js"

export class People extends RR0Data {
  readonly type = "people"

  /**
   * The people actually doesn't exist.
   */
  hoax = false

  lastAndFirstName: string

  /**
   * The name to display instead of the one deduced from first and last names, as stated by the JSON's "title".
   */
  titleOverride?: string

  constructor(
    public firstNames: string[] = [],
    public lastName = "",
    readonly pseudonyms: string[] = [],
    /**
     * @deprecated
     */
    readonly occupations: Occupation[] = [],
    /**
     * @deprecated
     */
    readonly countries: CountryCode[] = [],
    /**
     * The people has been caught lying or has confessed a hoax.
     */
    readonly discredited = false,
    /**
     * @deprecated Use a "birth"-typed sub-data instead.
     */
    readonly gender = Gender.male,
    id = StringUtil.textToCamel(lastName) + firstNames.join(""),
    dirName: string = "",
    image?: string,
    url?: string,
    events: RR0Event[] = [],
    readonly qualifier = "",
    surname: string | string[] | undefined = undefined
  ) {
    super()
    this.lastAndFirstName = this.getLastAndFirstName()
    this.title = this.firstAndLastName
    this.name = this.lastName
    this.id = id
    this.dirName = dirName
    this.image = image
    this.events = events
    this.url = url
    this.surname = surname
  }

  /**
   * When this person was born: a date, or an interval when it is only known to be within bounds.
   */
  get birthTime(): EventTimeValue {
    return this.events.find(event => event.eventType === "birth")?.time
  }

  /**
   * When this person died: a date, or an interval when it is only known to be within bounds.
   */
  get deathTime(): EventTimeValue {
    return this.events.find(event => event.eventType === "death")?.time
  }

  /**
   * The unofficial name(s), always as a list: the JSON's "surname" holds either one or several of them.
   */
  get surnames(): string[] {
    const surname = this.surname
    return !surname ? [] : Array.isArray(surname) ? surname : [surname]
  }

  get firstAndLastName(): string {
    const {lastNameStr, firstNameStr} = this.getLastAndFirstNames()
    return lastNameStr && firstNameStr ? firstNameStr + " " + lastNameStr : lastNameStr || firstNameStr
  }

  getLastAndFirstName(): string {
    const {lastNameStr, firstNameStr} = this.getLastAndFirstNames()
    return lastNameStr && firstNameStr ? lastNameStr + ", " + firstNameStr : lastNameStr || firstNameStr
  }

  isDeceased(from?: EdtfDate): boolean {
    return this.deathTime ? true : this.birthTime ? this.isProbablyDeceased(EventTime.start(this.birthTime), from) : false
  }

  /**
   * @param from The date to compute the age at (now by default).
   * @return The age, from the start of the birth time to the start of the death time (that is, the first date they could be).
   */
  getAge(from?: EdtfDate): number | undefined {
    const birthTime = EventTime.start(this.birthTime)
    if (birthTime) {
      let timeDelta: Duration
      if (this.deathTime) {
        timeDelta = Duration.between(birthTime, EventTime.start(this.deathTime))
      } else if (!this.isProbablyDeceased(birthTime)) {
        const now = from ?? new EdtfDate()
        timeDelta = Duration.between(birthTime, now)
      } else {
        return undefined
      }
      return timeDelta.toSpec().years.value
    }
  }

  isProbablyDeceased(birth: EdtfDate, at?: EdtfDate): boolean {
    const now = at ?? new EdtfDate()
    const timeDelta = Duration.between(birth, now)
    return timeDelta.toSpec().years.value > 120
  }

  clone(): People {
    return new People(this.firstNames, this.lastName, this.pseudonyms, this.occupations, this.countries,
      this.discredited, this.gender, this.id, this.dirName, this.image, this.url, this.events)
  }

  protected getLastAndFirstNames() {
    /*
     * No camelToText here: whether the last name was stated by the JSON or deduced by PeopleFactory (which camels it
     * itself), it is already text. Splitting it again would break the names that legitimately carry an inner capital,
     * such as "McKinnon" or "MacArthur".
     */
    const lastNameStr = this.lastName.trim()
    const firstNameStr = this.firstNames.length > 0 ? this.firstNames.join(" ") : ""
    return {lastNameStr, firstNameStr}
  }
}
