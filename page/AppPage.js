import { ArticleFormPage, ArticleViewPage, LoginPage, ArticlesPage, BasePage } from "./index";

export class App {
  constructor(page) {
    this.page = page;
    this.base = new BasePage(page);
    this.articleForm = new ArticleFormPage(page);
    this.articles = new ArticlesPage(page);
    this.articleView = new ArticleViewPage(page);
    this.login = new LoginPage(page);
  }
}