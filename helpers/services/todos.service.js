import { test } from "@playwright/test";

export class TodosService {
  constructor(request, baseURL, token = null) {
    this.request = request;
    this.baseURL = baseURL;
    this.token = token;
  }

  _headers(extraHeaders = {}) {
    return {
      "Content-Type": "application/json",
      ...(this.token ? { "x-challenger": this.token } : {}),
      ...extraHeaders,
    };
  }

  setToken(token) {
    this.token = token;
  }

  async createTodo(todoData, extraHeaders = {}) {
    const response = await this.request.post(`${this.baseURL}/todos`, {
      headers: this._headers(extraHeaders),
      data: todoData,
    });

    let body = null;

    try {
      body = await response.json();
    } catch {
      body = await response.text();
    }

    return {
      status: response.status(),
      data: body,
      headers: response.headers(),
    };
  }

  async getTodos(options = {}) {
    return test.step("GET /todos", async () => {
      const response = await this.request.get(`${this.baseURL}/todos`, {
        headers: this._headers(options.headers),
        params: options.params,
      });

      let body = null;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }

      return {
        status: response.status(),
        data: body,
        headers: response.headers(),
      };
    });
  }

  async getTodoById(id) {
    return test.step(`GET /todos/${id}`, async () => {
      const response = await this.request.get(`${this.baseURL}/todos/${id}`, {
        headers: this._headers(),
      });

      let body = null;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }

      return {
        status: response.status(),
        data: body,
      };
    });
  }

  async getTodoInvalidEndpoint() {
    return test.step("GET /todo/", async () => {
      const response = await this.request.get(`${this.baseURL}/todo/`, {
        headers: this._headers(),
      });

      let body = null;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }

      return {
        status: response.status(),
        data: body,
      };
    });
  }
}
