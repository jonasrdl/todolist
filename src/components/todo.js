import { Storage } from './storage.js';
import { Todolist } from './Todolist.js';
import { getArrayIndex } from '../app.js';

const todolist = new Todolist();
const indexstorage = new Storage('currentIndex');
const todostorage = new Storage('todos');

export class Todo {
  constructor(text) {
    this.create(text);
  }

  create(text) {
    const todoText = document.createElement('span');
    todoText.innerText = text;

    const li = document.createElement('li');
    li.classList.add('li');
    li.draggable = true;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');

    const editToDoButton = document.createElement('button');
    editToDoButton.addEventListener('click', () => this.edit());
    editToDoButton.classList.add('editToDoButton');
    editToDoButton.classList.add('btn');
    editToDoButton.classList.add('ripple');
    editToDoButton.innerHTML = '<i class="fas fa-pen"></i>';

    const deleteToDoButton = document.createElement('button');
    deleteToDoButton.addEventListener('click', () =>
      todolist.deleteTodo(this.ref)
    );
    deleteToDoButton.classList.add('deleteToDoButton');
    deleteToDoButton.classList.add('btn');
    deleteToDoButton.classList.add('ripple');
    deleteToDoButton.innerHTML = '<i class="fas fa-trash"></i>';

    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.addEventListener('keyup', () => this.saveEdit(event));

    li.appendChild(checkbox);
    li.appendChild(inputEdit);
    li.appendChild(todoText);
    li.appendChild(editToDoButton);
    li.appendChild(deleteToDoButton);

    this.ref = li;
  }

  edit() {
    console.log(this.ref);
    const toDoText = this.ref.querySelector('span');
    const inputEdit = this.ref.querySelector('input[type="text"]');

    this.ref.classList.add('edit');
    inputEdit.value = toDoText.textContent;
  }

  saveEdit(event) {
    const currentIndex = indexstorage.get();
    const todoLists = JSON.parse(localStorage.getItem('todos'));

    if (event.key === 'Enter') {
      const toDoText = this.ref.querySelector('span');
      const inputEdit = this.ref.querySelector('input[type="text"]');

      if (inputEdit.value === '') {
        todolist.messageIfEmpty(inputEdit, 'Feld darf nicht leer sein!');

        return;
      }

      this.ref.classList.remove('edit');

      toDoText.textContent = inputEdit.value;

      todoLists[Number(currentIndex)].todos[getArrayIndex(this.ref)].name =
        inputEdit.value;

      console.log(todoLists);

      todostorage.set(JSON.stringify(todoLists));
    }
  }
}
