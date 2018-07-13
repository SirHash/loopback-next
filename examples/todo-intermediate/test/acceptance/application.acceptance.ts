// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/example-todo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {createClientForHandler, expect, supertest} from '@loopback/testlab';
import {TodoListApplication} from '../../src/application';
import {Todo, TodoList} from '../../src/models/';
import {TodoRepository, TodoListRepository} from '../../src/repositories/';
import {givenTodo, givenTodoList} from '../helpers';

describe('Application', () => {
  let app: TodoListApplication;
  let client: supertest.SuperTest<supertest.Test>;
  let todoRepo: TodoRepository;
  let todoListRepo: TodoListRepository;

  before(givenRunningApplicationWithCustomConfiguration);
  after(() => app.stop());

  before(givenTodoRepository);
  before(givenTodoListRepository);
  before(() => {
    client = createClientForHandler(app.requestHandler);
  });

  // TODO: refactor into multiple files
  beforeEach(async () => {
    await todoRepo.deleteAll();
    await todoListRepo.deleteAll();
  });

  it('creates a todo', async function() {
    const todo = givenTodo();
    const response = await client
      .post('/todos')
      .send(todo)
      .expect(200);
    expect(response.body).to.containDeep(todo);
    const result = await todoRepo.findById(response.body.id);
    expect(result).to.containDeep(todo);
  });

  it('rejects requests to create a todo with no title', async () => {
    const todo = givenTodo();
    delete todo.title;
    await client
      .post('/todos')
      .send(todo)
      .expect(422);
  });

  it('gets a todo by ID', async () => {
    const todo = await givenTodoInstance();
    const result = await client
      .get(`/todos/${todo.id}`)
      .send()
      .expect(200);
    // Remove any undefined properties that cannot be represented in JSON/REST
    const expected = JSON.parse(JSON.stringify(todo));
    expect(result.body).to.deepEqual(expected);
  });

  it('replaces the todo by ID', async () => {
    const todo = await givenTodoInstance();
    const updatedTodo = givenTodo({
      title: 'DO SOMETHING AWESOME',
      desc: 'It has to be something ridiculous',
      isComplete: true,
    });
    await client
      .put(`/todos/${todo.id}`)
      .send(updatedTodo)
      .expect(200);
    const result = await todoRepo.findById(todo.id);
    expect(result).to.containEql(updatedTodo);
  });

  it('updates the todo by ID ', async () => {
    const todo = await givenTodoInstance();
    const updatedTodo = givenTodo({
      title: 'DO SOMETHING AWESOME',
      isComplete: true,
    });
    await client
      .patch(`/todos/${todo.id}`)
      .send(updatedTodo)
      .expect(200);
    const result = await todoRepo.findById(todo.id);
    expect(result).to.containEql(updatedTodo);
  });

  it('deletes the todo', async () => {
    const todo = await givenTodoInstance();
    await client
      .del(`/todos/${todo.id}`)
      .send()
      .expect(200);
    try {
      await todoRepo.findById(todo.id);
    } catch (err) {
      expect(err).to.match(/No Todo found with id/);
      return;
    }
    throw new Error('No error was thrown!');
  });

  it('creates a todoList', async () => {
    const todoList = givenTodoList();
    const response = await client
      .post('/todo-lists')
      .send(todoList)
      .expect(200);
    expect(response.body).to.containDeep(todoList);
    const result = await todoListRepo.findById(response.body.id);
    expect(result).to.containDeep(todoList);
  });

  it('counts todoLists', async () => {
    const todoLists = [];
    todoLists.push(await givenTodoListInstance());
    todoLists.push(
      await givenTodoListInstance({title: 'so many things to do wow'}),
    );
    const response = await client
      .get('/todo-lists/count')
      .send()
      .expect(200);
    expect(response.body).to.eql(todoLists.length);
  });

  it('finds all todoLists', async () => {
    const todoLists = [];
    todoLists.push(await givenTodoListInstance());
    todoLists.push(
      await givenTodoListInstance({title: 'so many things to do wow'}),
    );
    const response = await client
      .get('/todo-lists')
      .send()
      .expect(200);
    expect(response.body).to.containDeep(todoLists);
  });

  it.skip('updates all todoLists', async () => {
    await givenTodoListInstance();
    await givenTodoListInstance({title: 'so many things to do wow'});
    const patchLastModified = {lastModified: '2018-01-07'};
    const response = await client
      .patch('/todo-lists')
      .send(patchLastModified)
      .expect(422);
    console.log(response.error);
    console.log(response.body);
    for (const todoList of response.body) {
      expect(todoList.lastModified).to.eql(patchLastModified.lastModified);
    }
  });

  it('deletes all todoLists', async () => {
    await givenTodoListInstance();
    await givenTodoListInstance({title: 'so many things to do wow'});
    const response = await client
      .del('/todo-lists')
      .send()
      .expect(200);
    expect(await todoListRepo.find()).to.be.empty();
  });

  it('gets a todoList by ID', async () => {
    const todoList = await givenTodoListInstance();
    const result = await client
      .get(`/todo-lists/${todoList.id}`)
      .send()
      .expect(200);
    // Remove any undefined properties that cannot be represented in JSON/REST
    const expected = JSON.parse(JSON.stringify(todoList));
    expect(result.body).to.deepEqual(expected);
  });

  it('updates a todoList by ID ', async () => {
    const todoList = await givenTodoListInstance();
    const updatedTodoList = givenTodoList({
      title: 'A different title to the todo list',
    });
    await client
      .patch(`/todo-lists/${todoList.id}`)
      .send(updatedTodoList)
      .expect(200);
    const result = await todoListRepo.findById(todoList.id);
    expect(result).to.containEql(updatedTodoList);
  });

  it('deletes a todoList by ID', async () => {
    const todoList = await givenTodoListInstance();
    await client
      .del(`/todo-lists/${todoList.id}`)
      .send()
      .expect(200);
    await expect(todoListRepo.findById(todoList.id)).to.be.rejectedWith(
      /no TodoList found with id/,
    );
  });

  /*
   ============================================================================
   TEST HELPERS
   These functions help simplify setup of your test fixtures so that your tests
   can:
   - operate on a "clean" environment each time (a fresh in-memory database)
   - avoid polluting the test with large quantities of setup logic to keep
   them clear and easy to read
   - keep them DRY (who wants to write the same stuff over and over?)
   ============================================================================
   */

  async function givenRunningApplicationWithCustomConfiguration() {
    app = new TodoListApplication({
      rest: {
        port: 0,
      },
    });

    await app.boot();

    /**
     * Override default config for DataSource for testing so we don't write
     * test data to file when using the memory connector.
     */
    app.bind('datasources.config.db').to({
      name: 'db',
      connector: 'memory',
    });

    // Start Application
    await app.start();
  }

  async function givenTodoRepository() {
    todoRepo = await app.getRepository(TodoRepository);
  }

  async function givenTodoListRepository() {
    todoListRepo = await app.getRepository(TodoListRepository);
  }

  async function givenTodoInstance(todo?: Partial<Todo>) {
    return await todoRepo.create(givenTodo(todo));
  }

  async function givenTodoListInstance(todoList?: Partial<TodoList>) {
    return await todoListRepo.create(givenTodoList(todoList));
  }
});
