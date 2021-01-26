'use strict';

const init = () => {
  const addToDoButton = document.getElementById('addToDo');
  const inputField = document.getElementById('inputField');

  addToDoButton.addEventListener('click', addToDo);
  inputField.addEventListener('keyup', keyUp);
};

window.addEventListener('DOMContentLoaded', init);

const keyUp = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addToDo();
  }
};

const addToDo = () => {
  if (inputField.value === '') {
    alert('Bitte ein To Do eintragen.');
    return;
  }

  const ulToDo = document.getElementById('ulToDo');

  const span = document.createElement('span');
  span.innerText = inputField.value;

  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('checkbox');

  const editToDoButton = document.createElement('button');
  editToDoButton.addEventListener('click', editToDo);
  editToDoButton.classList.add('editToDoButton');
  editToDoButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';

  const deleteToDoButton = document.createElement('button');
  deleteToDoButton.addEventListener('click', deleteToDo);
  deleteToDoButton.classList.add('deleteToDoButton');
  deleteToDoButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

  const inputEdit = document.createElement('input');
  inputEdit.type = 'text';
  inputEdit.addEventListener('keyup', editKeyUp);

  li.appendChild(checkbox);
  li.appendChild(inputEdit);
  li.appendChild(span);
  li.appendChild(editToDoButton);
  li.appendChild(deleteToDoButton);
  ulToDo.appendChild(li);

  inputField.value = '';
};

const editToDo = (event) => {
  const toDo = event.target.parentElement;
  const toDoText = toDo.querySelector('span');
  const inputEdit = toDo.querySelector('input[type="text"]');

  toDo.classList.add('edit');
  inputEdit.value = toDoText.textContent;
};

const deleteToDo = (event) => {
  event.target.parentElement?.remove?.();
};

const editKeyUp = (event) => {
  if (event.key === 'Enter') {
    const toDo = event.target.parentElement;
    const toDoText = toDo.querySelector('span');
    const inputEdit = toDo.querySelector('input[type="text"]');

    if (inputEdit.value === '') {
      alert('Bitte ein To Do eintragen.');
    } else {
      toDo.classList.remove('edit');
      toDoText.textContent = inputEdit.value;
    }
  }
};
