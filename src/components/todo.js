import { getArrayIndex, deleteToDoMessage, removeToDo } from '../app.js';
export class Todo {
  constructor() {}

  edit() {
    console.log('edit');
    const toDo = event.target.parentElement;
    const toDoText = toDo.querySelector('span');
    const inputEdit = toDo.querySelector('input[type="text"]');

    toDo.classList.add('edit');
    inputEdit.value = toDoText.textContent;
  }

  change(todoLists, currentIndex) {
    console.log('change');
    const li = event.target.parentElement;
    const inputEdit = toDoList.querySelector('input[type="text"]');

    if (!inputEdit.value.trim().length) {
      messageIfEmpty(inputEdit, 'Trage erst ein To Do ein');

      return;
    }

    todoLists[currentIndex].todos[getArrayIndex(li)].name = inputEdit.value;

    localStorage.setItem('todos', JSON.stringify(todoLists));
  }

  delete() {
    removeToDo(event);
    event.target.parentElement?.remove();
    deleteToDoMessage();
  }
}
