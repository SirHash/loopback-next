# @loopback/example-todo-list

This is an extended tutorial from `@loopback/example-todo`.

## Overview

This tutorial demonstrates how to create a set of APIs for models that are
related to another.

![todo-tutorial-overview](REVISED VERSION OF THE DIAGRAM)

## Setup

You'll need to make sure you have some things installed:

- [Node.js](https://nodejs.org/en/) at v8.x or greater

Additionally, this tutorial assumes that you are comfortable with certain
technologies, languages and concepts.

- JavaScript (ES6)
- [REST](http://www.restapitutorial.com/lessons/whatisrest.html)

Lastly, you'll need to install the LoopBack 4 CLI toolkit:

```sh
npm i -g @loopback/cli
```

If you're not following from the
[todo tutorial](http://loopback.io/doc/en/lb4/todo-tutorial.html), you can use
the LoopBack 4 CLI tool to catch up to where this tutorial will continue from:

```sh
lb4 example todo
```

It should be noted that this tutorial does not assume the
[optional geo-coding step](https://loopback.io/doc/en/lb4/todo-tutorial-geocoding-service.html)
has been completed. Whether the step has been completed or not, the content and
the steps listed in this tutorial remains the same.

## Tutorial

To follow this tutorial, begin with the
[Add TodoList model](http://loopback.io/doc/en/lb4/todo-list-tutorial-model.html)
section.

### Steps

1.  [Add TodoList Model](http://loopback.io/doc/en/lb4/todo-list-tutorial-model.html)
2.  [Add TodoList Repository](http://loopback.io/doc/en/lb4/todo-list-tutorial-repository.html)
3.  [Add TodoList and TodoList's Todo Controller](http://loopback.io/doc/en/lb4/todo-list-tutorial-controller.html)

## Try it out

If you'd like to see the final results of this tutorial as an example
application, follow these steps:

1.  Run the `lb4 example` command to select and clone the todo repository:

```sh
$ lb4 example
? What example would you like to clone? (Use arrow keys)
❯ todo: Tutorial example on how to build an application with LoopBack 4..
  hello-world: A simple hello-world Application using LoopBack 4
  log-extension: An example extension project for LoopBack 4
  rpc-server: A basic RPC server using a made-up protocol.
```

2.  Jump into the directory and then install the required dependencies:

```sh
cd loopback4-example-todo && npm i
```

3.  Finally, start the application!

    ```sh
    $ npm start

    Server is running on port 3000
    ```

Feel free to look around in the application's code to get a feel for how it
works, or if you're still interested in learning how to build it step-by-step,
then continue with this tutorial!

### Stuck?

Check out our [Gitter channel](https://gitter.im/strongloop/loopback) and ask
for help with this tutorial!

### Bugs/Feedback

Open an issue in [loopback-next](https://github.com/strongloop/loopback-next)
and we'll take a look!

## Contributions

- [Guidelines](https://github.com/strongloop/loopback-next/blob/master/docs/CONTRIBUTING.md)
- [Join the team](https://github.com/strongloop/loopback-next/issues/110)

## Tests

Run `npm test` from the root folder.

## Contributors

See
[all contributors](https://github.com/strongloop/loopback-next/graphs/contributors).

## License

MIT
