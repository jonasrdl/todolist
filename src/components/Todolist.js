import { Storage } from './Storage.js';
const todostorage = new Storage('todos');
const indexstorage = new Storage('currentIndex');

export class Todolist {
  constructor() {}

  messageIfEmpty(element, text) {
    element.value = null;
    element.placeholder = text;
    element.classList.add('placeholder-color');
  }

  deleteTodo(ref) {
    const currentIndex = indexstorage.get();
    const todoLists = JSON.parse(localStorage.getItem('todos'));
    const list = document.getElementById('toDoList');

    list.removeChild(ref); // Remove it from HTML
    todoLists[Number(currentIndex)].todos.splice(ref, 1); // Removing from the reserved array
    todostorage.set(JSON.stringify(todoLists)); // Removing from Localstorage (soon => todostorage instead of localstorage)
  }
}
