'use strict';

// Wo bin ich?
const getArrayIndex = (element) => {
  let i = 0;
  while (element.previousElementSibling) {
    element = element.previousElementSibling;
    i++;
  }
  return i;
};

const init = () => {
  const addToDoButton = document.getElementById('addToDo');
  const inputField = document.getElementById('inputField');

  addToDoButton.addEventListener('click', addToDo);
  inputField.addEventListener('keyup', keyUp);
  getToDos();
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
    //TODO Message
    return;
  }

  const toDoElement = document.getElementById('toDoElement');

  const span = document.createElement('span');
  span.innerText = inputField.value;

  const li = document.createElement('li');
  li.draggable = 'true';

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
  toDoElement.appendChild(li);

  // Add Todo to Localstorage
  saveToDos(inputField.value);

  inputField.value = '';
};

const checkLocalStorage = () => JSON.parse(localStorage.getItem('toDos')) || [];

const saveToDos = (toDo) => {
  const toDos = checkLocalStorage();

  toDos.push(toDo);
  localStorage.setItem('toDos', JSON.stringify(toDos));
};

const changeToDo = (index, value) => {
  const toDos = checkLocalStorage();

  toDos[index] = value;

  localStorage.setItem('toDos', JSON.stringify(toDos));
};

const getToDos = () => {
  const toDos = checkLocalStorage();

  toDos.forEach((toDo) => createToDoElement(toDo));
};

const removeToDo = (index) => {
  let toDos = checkLocalStorage();

  toDos.splice(index, 1);

  localStorage.setItem('toDos', JSON.stringify(toDos));
};

const createToDoElement = (toDo) => {
  const toDoElement = document.getElementById('toDoElement');

  const span = document.createElement('span');
  span.innerText = toDo;

  const li = document.createElement('li');
  li.draggable = 'true';

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
  toDoElement.appendChild(li);
};

const clearLocalStorage = () => {
  localStorage.removeItem('toDos');
  location.reload();
};

const editToDo = (event) => {
  const toDo = event.target.parentElement;
  const toDoText = toDo.querySelector('span');
  const inputEdit = toDo.querySelector('input[type="text"]');

  toDo.classList.add('edit');
  inputEdit.value = toDoText.textContent;
};

const deleteToDo = (event) => {
  removeToDo(getArrayIndex(event.target.parentElement));
  event.target.parentElement?.remove?.();
};

const editKeyUp = (event) => {
  if (event.key === 'Enter') {
    const toDo = event.target.parentElement;
    const toDoText = toDo.querySelector('span');
    const inputEdit = toDo.querySelector('input[type="text"]');

    if (inputEdit.value === '') {
      //TODO Message
    } else {
      toDo.classList.remove('edit');
    }

    toDoText.textContent = inputEdit.value;

    changeToDo(getArrayIndex(event.target.parentElement), inputEdit.value);
  }
};

let dragging = null;

document.addEventListener('dragstart', function (event) {
  const target = getToDoElement(event.target);
  dragging = target;

  event.dataTransfer.setData('text/plain', null);
  event.dataTransfer.setDragImage(self.dragging, 0, 0);
});

document.addEventListener('dragover', function (event) {
  event.preventDefault();

  const target = getToDoElement(event.target);
  const bounding = target.getBoundingClientRect();
  const offset = bounding.y + bounding.height / 2;

  if (event.clientY - offset > 0) {
    target.style['border-bottom'] = 'solid 4px blue';
    target.style['border-top'] = '';
  } else {
    target.style['border-top'] = 'solid 4px blue';
    target.style['border-bottom'] = '';
  }
});

document.addEventListener('dragleave', function (event) {
  const target = getToDoElement(event.target);

  target.style['border-bottom'] = '';
  target.style['border-top'] = '';
});

document.addEventListener('drop', function (event) {
  event.preventDefault();

  const target = getToDoElement(event.target);

  if (target.style['border-bottom'] !== '') {
    target.style['border-bottom'] = '';
    target.parentNode.insertBefore(dragging, event.target.nextSibling);
  } else {
    target.style['border-top'] = '';
    target.parentNode.insertBefore(dragging, event.target);
  }
});

const getToDoElement = (target) => {
  while (
    target.nodeName.toLowerCase() != 'li' &&
    target.nodeName.toLowerCase() != 'body'
  ) {
    target = target.parentNode;
  }

  if (target.nodeName.toLowerCase() == 'body') {
    return false;
  } else {
    return target;
  }
};
