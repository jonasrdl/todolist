import Eventbus from '../../eventbus.js';

export class Todo {
  constructor(name, done) {
    this.name = name;
    this.done = !!done;
    this.create(name, done);
  }

  create(name, done) {
    const todoText = document.createElement('span');
    todoText.innerText = name;
    todoText.addEventListener('click', () => {
      this.edit();
    });

    const li = document.createElement('li');
    li.classList.add('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('click', () => this.check());
    checkbox.checked = !!done;
    checkbox.classList.add('checkbox');

    const deleteTodoButton = document.createElement('button');
    deleteTodoButton.addEventListener('click', () => {
      Eventbus.emit('deleteTodo', this);
    });
    deleteTodoButton.classList.add('deleteToDoButton');
    deleteTodoButton.classList.add('btn');
    deleteTodoButton.classList.add('ripple');
    deleteTodoButton.innerHTML = '<i class="fas fa-times"></i>';

    const inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    inputEdit.addEventListener('keyup', () => this.saveEdit(event));

    li.appendChild(checkbox);
    li.appendChild(inputEdit);
    li.appendChild(todoText);
    li.appendChild(deleteTodoButton);

    this.ref = li;
  }

  emptyInput(element, msg) {
    element.classList.add('placeholder-color');
    element.placeholder = msg;
  }

  edit() {
    const todoText = this.ref.querySelector('span');
    const inputEdit = this.ref.querySelector('input[type="text"]');

    this.ref.classList.add('edit');
    inputEdit.value = todoText.textContent;
    inputEdit.focus();
  }

  saveEdit(event) {
    if (event.key === 'Enter') {
      const todoText = this.ref.querySelector('span');
      const inputEdit = this.ref.querySelector('input[type="text"]');

      if (inputEdit.value === '' || !inputEdit.value.trim().length) {
        inputEdit.value = null;
        this.emptyInput(inputEdit, 'Trage etwas ein!')

        return;
      }

      this.ref.classList.remove('edit');

      todoText.textContent = inputEdit.value;
      this.name = inputEdit.value;

      Eventbus.emit('change');
    }
  }

  check() {
    const checkbox = this.ref.querySelector('input[type="checkbox"]');

    this.ref.style.textDecoration = 'line-through';

    this.done = !!checkbox.checked;
    Eventbus.emit('change');
  }
}
