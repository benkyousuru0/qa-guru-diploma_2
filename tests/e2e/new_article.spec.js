import dotenv from "dotenv";
dotenv.config();

import { expect } from "@playwright/test";
import { test } from "../../helpers/fixtures/index.js";

test.describe("Работа со статьями", () => {
  test("Создание новой статьи @ui @positive", async ({ registeredApp, articleData }) => {
    const app = registeredApp;

    await app.articles.goto();
    await app.articles.clickCreateArticle();
    await app.articleForm.createArticle(articleData);
    await expect(app.articleView.title).toHaveText(articleData.title);
    await expect(app.articleView.body).toContainText(articleData.body);
  });

  test("Проверка появления статьи в списке и просмотр @ui @positive", async ({ registeredApp, createdArticle }) => {
    const app = registeredApp;

    await app.articles.goto();
    await app.articles.clickGlobalFeedTab();

    await expect(app.articles.articleLinkByTitle(createdArticle.title).first()).toBeVisible();

    await app.articles.openArticleByTitle(createdArticle.title);

    await expect(app.articleView.title).toHaveText(createdArticle.title);
    await expect(app.articleView.body).toContainText(createdArticle.body);
  });

  test("Добавление и удаление статьи из избранного @ui @positive", async ({ registeredApp, createdArticle }) => {
    const app = registeredApp;

    await app.articles.goto();
    await app.articles.clickGlobalFeedTab();

    await app.articles.toggleFavorite(createdArticle.title);
    expect(await app.articles.isArticleFavorited(createdArticle.title)).toBe(true);

    await app.articles.toggleFavorite(createdArticle.title);
    expect(await app.articles.isArticleFavorited(createdArticle.title)).toBe(false);
  });

  test("Редактирование статьи @ui @positive", async ({ registeredApp, createdArticle, updatedArticleData }) => {
    const app = registeredApp;

    await app.articles.goto();
    await app.articles.clickGlobalFeedTab();

    await app.articles.openArticleByTitle(createdArticle.title);
    await app.articleView.clickEdit();

    await app.articleForm.createArticle(updatedArticleData);

    await expect(app.articleView.title).toHaveText(updatedArticleData.title);
    await expect(app.articleView.body).toContainText(updatedArticleData.body);
  });

  test("Удаление статьи @ui @positive", async ({ registeredApp, createdArticle, updatedArticleData }) => {
    const app = registeredApp;

    const titleToDelete = updatedArticleData.title || createdArticle.title;

    await app.articles.goto();
    await app.articles.openArticleByTitle(titleToDelete);

    await app.articleView.clickDelete();

    await expect(app.page).toHaveURL(/#\/$/);

    await app.articles.assertTitleNotExist(titleToDelete);
  });

  test.afterEach(async ({ registeredApp, createdArticle, updatedArticleData }) => {
    const app = registeredApp;
    const title = updatedArticleData.title || createdArticle.title;

    const count = await app.articles.countArticlesByTitle(title);
    if (count !== 0) {throw new Error(`Статья "${title}" всё ещё существует`);}
  });
});
