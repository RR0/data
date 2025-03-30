export class StringUtil {

  static capitalizeFirstLetter(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  static withoutDots(str: string): string {
    return str.replace(".", "")
  }

  static withoutPunctuation(str: string): string {
    return str.replace(/[ .:;,()\-+=*/#°@$€£%!&?"'’]/g, "")
  }

  static withoutAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  static textToCamel(text: string): string {
    return StringUtil.withoutAccents(StringUtil.withoutPunctuation(text.trim()
      .replace(/ [^ ]+/g,
        (substring: string, args: string[]) => substring.charAt(1).toUpperCase() + substring.substring(2)))
    )
  }

  static camelToText(camel: string): string {
    const text = camel.trim()
      .replace(/([A-Z]+)/g, " $1")
      .replace(/([0-9]+)/g, " $1")
      .replace(/( [A-Z] )/g, " $1. ")
      .replace(/( [A-Z]$)/g, " $1.")
      //    .replace(/([A-Z])([A-Z])/g, " $1. $2.")
      .replace(/ {2}/g, " ")
    return StringUtil.capitalizeFirstLetter(text).trim()
  }
}
