import { Article } from "./Article.js"
import { RR0EventFactory } from "../event/RR0EventFactory.js"
import { TypedDataFactory } from "../TypedDataFactory.js"
import { RR0DataJson } from "../RR0DataJson"

export type ArticleDataJson = RR0DataJson

export class ArticleFactory extends TypedDataFactory<Article, ArticleDataJson> {

  constructor(eventFactory: RR0EventFactory) {
    super(eventFactory, "article", ["index", "article"])
  }

  parse(dataJson: ArticleDataJson): Article {
    const base = super.parse(dataJson)
    return {...base, type: "article", previousSourceRefs: []} as Article
  }
}
