import { Article } from "./Article.js"
import { RR0EventFactory } from "../event/index.js"
import { TypedDataFactory } from "../TypedDataFactory"
import { RR0Data } from "../RR0Data"

export class ArticleFactory extends TypedDataFactory<Article> {

  constructor(eventFactory: RR0EventFactory) {
    super(eventFactory, "article", ["index", "article"])
  }

  createFromData(data: RR0Data): Article {
    const article: Article = {...data, type: "article", previousSourceRefs: []}
    Object.assign(article, data)
    return article
  }
}
