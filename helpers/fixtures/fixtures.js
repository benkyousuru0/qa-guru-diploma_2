import { test as base } from "@playwright/test";
import { App } from "../../page/AppPage.js";
import { ArticleBuilder } from "../builders/articleBuilder.js";
import { faker } from "@faker-js/faker";

export const test = base.extend({
  app: async ({ page }, use) => {
    const app = new App(page);
    await app.base.open();
    await use(app);
  },

  registeredApp: async ({ app }, use) => {
    await app.login.goto();
    await app.login.login(process.env.LOGIN_EMAIL, process.env.LOGIN_PASSWORD);
    await use(app);
  },

  articleData: async ({}, use) => {
    const article = new ArticleBuilder()
      .addTitle(faker.lorem.sentence(3))
      .addAbout(faker.lorem.sentence(5))
      .addBody(faker.lorem.paragraphs(3))
      .addTags(faker.lorem.sentence(3))
      .generate();
    await use(article);
  },

  updatedArticleData: async ({}, use) => {
    const updated = {
      title: faker.lorem.sentence(4),
      about: faker.lorem.sentence(6),
      body: faker.lorem.paragraphs(2),
      tags: faker.lorem.sentence(2)
    };
    await use(updated);
  },

  createdArticle: async ({ registeredApp, articleData }, use) => {
    const app = registeredApp;

    await app.articles.goto();
    await app.articles.clickCreateArticle();
    await app.articleForm.createArticle(articleData);

    await use(articleData);
  }
});
