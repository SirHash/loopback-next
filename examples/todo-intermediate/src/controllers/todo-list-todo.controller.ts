import {repository} from '@loopback/repository';
import {post, get, del, patch, param, requestBody} from '@loopback/rest';
import {Todo} from '../models';
import {TodoListRepository} from '../repositories';

export class TodoListTodoController {
  constructor(
    @repository(TodoListRepository) protected todoListRepo: TodoListRepository,
  ) {}

  @post('/todo-lists/{id}/todos')
  async create(@param.path.number('id') id: number, @requestBody() todo: Todo) {
    return await this.todoListRepo.todos(id).create(todo);
  }

  @get('/todo-lists/{id}/todos')
  async find(@param.path.number('id') id: number) {
    return await this.todoListRepo.todos(id).find();
  }

  @del('/todo-lists/{id}/todos')
  async delete(@param.path.number('id') id: number) {
    return await this.todoListRepo.todos(id).delete();
  }

  @patch('/todo-lists/{id}/todos')
  async patch(@param.path.number('id') id: number, @requestBody() todo: Todo) {
    return await this.todoListRepo.todos(id).patch(todo);
  }
}
