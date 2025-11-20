import dotenv from "dotenv";
dotenv.config();

import { expect } from "@playwright/test";
import { test } from "../../helpers/fixtures/index.js";

test.describe("Работа со статьями", () => {

  test("Успешный логин с валидными данными @ui @positive", async ({ app, validCredentials }) => {
    await app.login.goto();
    await app.login.login(validCredentials.email, validCredentials.password);

    await expect(app.page).toHaveURL(/#\/$/);
    await expect(app.login.getUserName(validCredentials.name)).toBeVisible();
  });

  test("Создание новой статьи @ui @positive", async ({ registeredApp, articleData }) => {
    const app = registeredApp;

    await app.articles.goto();
    await app.articles.clickCreateArticle();
    await app.articleForm.createArticle(articleData);

    await expect(app.articleView.title).toHaveText(articleData.title);
    await expect(app.articleView.body).toContainText(articleData.body);
    const tagTexts = await app.articleView.tags.allTextContents(); 
    const uiTagsArray = tagTexts.map(t => t.trim()).sort();

    const dataTagsArray = articleData.tags.split(" ").map(t => t.trim()).sort();

    expect(uiTagsArray).toEqual(dataTagsArray);

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

    const cleanTag = (tag) =>
      tag
        .trim()
        .replace(/[.,]/g, "") // Удаляем все точки/запятые
        .toLowerCase();

    const expectedTagsArray = updatedArticleData.tags
      .split(",")
      .map(cleanTag)
      .filter(Boolean); // убираем пустые

    const uiValue = await app.articleView.tagsInput.inputValue();

    const uiTagsArray = uiValue
      .split(",")
      .map(cleanTag)
      .filter(Boolean);

    expect(uiTagsArray.sort()).toEqual(expectedTagsArray.sort());

  });
});
