import Eventbus from '../../eventbus.js';
import {Todo} from "./Todo.js";

export class Todolist {
  constructor(name, ref) {
    this.todos = [];
    this.name = name;
    this.ref = ref;

    Eventbus.on('deleteTodo', (todo) => {
      this.deleteTodo(todo);
    });
  }

  addTodo({ name, done } = { name: 'no_name', done: false }) {
    const todo = new Todo(name, done);

    this.todos.push(todo);
    this.ref.appendChild(todo.ref);
  }

  create() {
    this.ref.innerHTML = '';
    this.todos.forEach((todo) => {
      this.ref.append(todo.ref);
    });
  }

  deleteTodo(todo) {
    const i = this.todos.findIndex((t) => t === todo);

    if (i === -1) {
      return;
    }

    this.todos.splice(i, 1);
    todo.ref.remove();
    Eventbus.emit('change');
  }
}
