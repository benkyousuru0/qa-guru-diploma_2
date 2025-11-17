import { faker } from "@faker-js/faker";

const todosBuilder = {
  createFilterDone: () => ({
    doneStatus: true,
  }),
  createRandomTodo: (overrides = {}) => ({
    title: faker.lorem.words(3),
    description: faker.lorem.sentences(2),
    doneStatus: faker.datatype.boolean(),
    ...overrides,
  }),
  getTodos: (params = {}) => apiClient.get("/todos", { params }),
  getTodoById: (id) => apiClient.get(`/todos/${id}`), 
  generateRandomUuid: () => faker.string.uuid(),
  generateRandomNumberId: () => faker.number.int({ min: 1000, max: 9999 }),
  generateLongString: (min) => {
    let a = "";
    while (a.length < min) {
      a += "a";
    }
    return a.trim();
  },
  updatePartialTodo: () => ({
    title: faker.lorem.words(3)
  }),
  updateTodoWithoutTitle: () => ({
    doneStatus: faker.datatype.boolean(),
    description: faker.lorem.sentences(2)
  }),
  "defaultDoneStatus": false,
  "defaultDescription": "",
  "existentId": 2,

};

export default todosBuilder;
