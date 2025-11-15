import { test, expect, request as pwRequest } from "@playwright/test";
import { parseStringPromise } from "xml2js";
import config from "../playwright.config.js";

import { Api } from "../helpers/services/api.service.js";

import ERRORS from "../helpers/errorMessages.js";
import todosBuilder from "../helpers/builders/todosBuilder.js";

test.describe("Challenger API", () => { 

  let api;
  let token;

  let apiContext;

  test.beforeAll(async () => {
    apiContext = await pwRequest.newContext({ baseURL: config.use.baseURL });
    api = new Api(apiContext, config.use.baseURL);

    const createResp = await api.challenger.createChallenger();
    token = createResp.headers()["x-challenger"];

    api.setToken(token);
  });

  test("02. GET /challenges (200) @api @positive", async () => {
    const response = await api.challenger.getChallenges();
    expect(response.status).toBe(200);

    const body = response.data;
    expect(body.challenges.length).toBe(59);
  });

  test("03. GET /todos (200) @api @positive", async () => {
    const response = await api.todos.getTodos();
    expect(response.status).toBe(200);

    const body = response.data;
    expect(body).toHaveProperty("todos");
  });

  test("04. GET /todo (404) not plural @api @negative", async () => {
    const response = await api.todos.getTodoInvalidEndpoint(); 
    expect(response.status).toBe(404);
  });

  test("05. GET /todos/{id} (200) @api @positive", async () => {
    const response = await api.todos.getTodoById(todosBuilder.existentId);
    expect(response.status).toBe(200);

    const body = response.data;
    expect(body.todos[0]).toHaveProperty("id");
    expect(body.todos[0].id).toBe(2);
    expect(body.todos[0]).toHaveProperty("title");
    expect(body.todos[0]).toHaveProperty("doneStatus");
    expect(body.todos[0]).toHaveProperty("title");
    expect(body.todos[0]).toHaveProperty("description");
  });

  test("06. GET /todos/{id} (404) @api @negative", async () => {
    const randomId = todosBuilder.generateRandomNumberId();
    const response = await api.todos.getTodoById(randomId);;
    expect(response.status).toBe(404);
    expect(response.data.errorMessages).toContain(ERRORS.NOT_FOUND_INSTANCE(randomId));
  });
  
  test("07. GET /todos (200) ?filter @api @positive", async () => {
    const todoData = todosBuilder.createRandomTodo({ doneStatus: true });
    const createResp = await api.todos.createTodo(todoData);
    expect(createResp.status).toBe(201);
    expect(createResp.data.doneStatus).toBe(true);
    const taskID = createResp.data.id;

    const filterParams = todosBuilder.createFilterDone();
    const listResp = await api.todos.getTodos({ params: filterParams });
    expect(listResp.status).toBe(200);
    const todos = listResp.data.todos;
    expect(todos.length).toBeGreaterThan(0);

    let isTaskInList = false;
    for (const todo of todos) {
      expect(todo.doneStatus === true || todo.doneStatus === "true").toBe(true);
      if (todo.id === taskID) {
        isTaskInList = true;
      }
    }
    expect(isTaskInList).toBe(true);
  });
});