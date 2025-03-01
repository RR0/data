import { Occupation } from "./Occupation.js"
import { Gender } from "@rr0/common"
import { Level2Date as EdtfDate, Level2Duration as Duration } from "@rr0/time"
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
    readonly id = lastName + firstNames.join(""),
    readonly dirName: string = "",
    public image?: string,
    readonly url?: string,
    readonly events: RR0Event[] = [],
    readonly qualifier?: string
  ) {
    super()
    this.lastAndFirstName = this.getLastAndFirstName()
    this.title = this.firstAndLastName
    this.name = this.lastName
  }

  get birthTime(): EdtfDate {
    return this.events.find(event => event.eventType === "birth")?.time
  }

  get deathTime(): EdtfDate {
    return this.events.find(event => event.eventType === "death")?.time
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
    return this.deathTime ? true : this.birthTime ? this.isProbablyDeceased(this.birthTime, from) : false
  }

  getAge(from?: EdtfDate): number | undefined {
    if (this.birthTime) {
      let timeDelta: Duration
      if (this.deathTime) {
        timeDelta = Duration.between(this.birthTime, this.deathTime)
      } else if (!this.isProbablyDeceased(this.birthTime)) {
        const now = from ?? new EdtfDate()
        timeDelta = Duration.between(this.birthTime, now)
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
    const lastNameStr = StringUtil.camelToText(this.lastName)
    const firstNameStr = this.firstNames.length > 0 ? this.firstNames.join(" ") : ""
    return {lastNameStr, firstNameStr}
  }
}
