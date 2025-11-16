import { ChallengerService, TodosService } from "./index.js";

export class Api {
  constructor(request, baseURL) {
    this.request = request;
    this.challenger = new ChallengerService(request, baseURL);
    this.todos = new TodosService(request, baseURL);
  }

  setToken(token) {
    this.token = token;
    this.challenger.setToken(token);
    this.todos.setToken(token);
  }
}
