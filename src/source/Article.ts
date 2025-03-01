import { Source } from "./Source.js"

export class Article extends Source<"article"> {

  constructor() {
    super("article")
  }
}
