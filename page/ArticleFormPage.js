export class ArticleFormPage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.locator("input[name=\"title\"]");
    this.descriptionInput = page.locator("input[name=\"description\"]");
    this.bodyTextarea = page.locator("textarea[name=\"body\"]");
    this.tagsInput = page.locator("input[name=\"tags\"]");
    this.publishButton = page.locator("button.btn.btn-lg.pull-xs-right.btn-primary[type=\"submit\"]");
  }
  async createArticle(articleData) {
    await this.titleInput.fill(articleData.title);
    await this.descriptionInput.fill(articleData.about);
    await this.bodyTextarea.fill(articleData.body);
    await this.tagsInput.fill(articleData.tags);
    await this.publishButton.click();
  }

  async updateArticle(articleData) {
    await this.titleInput.fill("");
    await this.titleInput.fill(articleData.title);

    await this.descriptionInput.fill("");
    await this.descriptionInput.fill(articleData.about);

    await this.bodyTextarea.fill("");
    await this.bodyTextarea.fill(articleData.body);

    await this.tagsInput.fill("");
    await this.tagsInput.fill(articleData.tags);

    await this.publishButton.click(); 
  }

  async goto() {
    await this.page.goto("/editor");
  }
}
