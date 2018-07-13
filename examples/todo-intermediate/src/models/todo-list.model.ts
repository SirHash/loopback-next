import {model, Entity, property, hasMany} from '@loopback/repository';
import {Todo} from './todo.model';

@model()
export class TodoList extends Entity {
  @property({id: true})
  id?: number;
  @property({required: true})
  title: string;
  @property({required: true})
  lastModified: string;
  @hasMany(Todo) todos?: Todo[];
}
