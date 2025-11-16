import { test, expect, request as baseRequest } from "@playwright/test";
import { Api } from "../../helpers/services/api.service.js";
import ERRORS from "../../helpers/errorMessages.js";
import todosBuilder from "../../helpers/builders/todosBuilder.js";
import config from "../../playwright.config.js";

test.describe("Challenger API", () => { 
  let api;
  let token;
  let apiContext;

  const apiProject = config.projects.find(p => p.name === "API Tests");
  const baseURL = apiProject.use.baseURL;

  test.beforeAll(async () => {
    apiContext = await baseRequest.newContext({ baseURL });
    api = new Api(apiContext, baseURL);

    const createResp = await api.challenger.createChallenger();
    token = createResp.headers()["x-challenger"];
    api.setToken(token);
  });

  test.afterAll(async () => {
    if (apiContext) {
      await apiContext.dispose();
    }
  });

  test("02. GET /challenges (200) @api @positive", async () => {
    const response = await api.challenger.getChallenges();
    expect(response.status).toBe(200);
    expect(response.data.challenges.length).toBe(59);
  });

  test("03. GET /todos (200) @api @positive", async () => {
    const response = await api.todos.getTodos();
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("todos");
  });

  test("04. GET /todo (404) not plural @api @negative", async () => {
    const response = await api.todos.getTodoInvalidEndpoint();
    expect(response.status).toBe(404);
  });

  test("05. GET /todos/{id} (200) @api @positive", async () => {
    const response = await api.todos.getTodoById(todosBuilder.existentId);
    const todo = response.data.todos[0];
    expect(response.status).toBe(200);
    expect(todo).toHaveProperty("id");
    expect(todo.id).toBe(2);
    expect(todo).toHaveProperty("title");
    expect(todo).toHaveProperty("doneStatus");
    expect(todo).toHaveProperty("description");
  });

  test("06. GET /todos/{id} (404) @api @negative", async () => {
    const randomId = todosBuilder.generateRandomNumberId();
    const response = await api.todos.getTodoById(randomId);
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

    let isTaskInList = todos.some(todo => todo.id === taskID && 
        (todo.doneStatus === true || todo.doneStatus === "true"));
    expect(isTaskInList).toBe(true);
  });
});
