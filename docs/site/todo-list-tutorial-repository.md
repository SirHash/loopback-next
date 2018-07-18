---
lang: en
title: 'Add TodoList Repository'
keywords: LoopBack 4.0, LoopBack 4
tags:
sidebar: lb4_sidebar
permalink: /doc/en/lb4/todo-list-tutorial-repository.html
summary: LoopBack 4 TodoList Application Tutorial - Add TodoList Repository
---

### Repositories with related models

The repository of a model with relations can make constrained version of the
related model's repository from the source repository's instance itself. In this
section, we'll create `TodoListRepository` which also has the capability of
building a constrained version of `TodoRepository`.

### Create your repository

In the `src/repositories` directory:

- create `todo-list.repository.ts`
- update `index.ts` to export the newly created repository

Like `TodoRepository`, we'll use `DefaultCrudRepository` to extend our TodoList
repository and inject the same datasource. From there we'll need to make two
more additions:

- define `todos` property; we'll use this property to build a constrained
  `TodoRepository`
- inject `TodoRepository` instance

Once the call signature of `todos` have been defined, use
`this._createHasManyRepositoryFactoryFor` to assign it a repository contraining
factory function. Note that it takes in the name of the relationship (`todos`)
and the repository to constrain.

#### src/repositories/todo-list.repository.ts

```ts
import {
  DefaultCrudRepository,
  juggler,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {TodoList, Todo} from '../models';
import {inject} from '@loopback/core';
import {TodoRepository} from './todo.repository';

export class TodoListRepository extends DefaultCrudRepository<
  TodoList,
  typeof TodoList.prototype.id
> {
  public todos: HasManyRepositoryFactory<Todo, typeof TodoList.prototype.id>;

  constructor(
    @inject('datasources.db') protected datasource: juggler.DataSource,
    @repository(TodoRepository) protected todoRepository: TodoRepository,
  ) {
    super(TodoList, datasource);
    this.todos = this._createHasManyRepositoryFactoryFor(
      'todos',
      todoRepository,
    );
  }
}
```

We're now ready to expose `TodoList` and its related `Todo` API through the
[controller](todo-list-tutorial-controller.md).

### Navigation

Previous step: [Add TodoList model](todo-list-tutorial-model.md)

Last step: [Add TodoList controller](todo-list-tutorial-controller.md)
