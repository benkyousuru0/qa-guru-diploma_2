import { test } from "@playwright/test";

export class ChallengerService {
  constructor(request, baseURL) {
    this.request = request;
    this.baseURL = baseURL;
    this.token = null;
  }

  _headers(extra = {}) {
    return {
      "Content-Type": "application/json",
      ...(this.token ? { "x-challenger": this.token } : {}),
      ...extra,
    };
  }

  setToken(token) {
    this.token = token;
  }
  
  async createChallenger() {
    return test.step("POST /challenger", async () => {
      const response = await this.request.post("/challenger", {
        headers: this._headers(),
      });
      this.token = response.headers()["x-challenger"];
      return response;
    });
  }

  async getChallenges(options = {}) {
    return test.step("GET /challenges", async () => {
      const response = await this.request.get("/challenges", {
        headers: this._headers(options.headers),
      });
      const body = await response.json();
      return {
        status: response.status(),
        data: body,
        headers: response.headers(),
      };
    });
  }

}
