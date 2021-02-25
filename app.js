'use strict';

const getArrayIndex = (element) =>
  [...element.parentNode.children].findIndex((child) => child === element);

const init = () => {
  const addToDoButton = document.querySelector('button.addToDo');
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
    inputField.placeholder = 'Trage erst ein To Do ein';
    inputField.classList.add('placeholder-color');
    return;
  } else {
    inputField.placeholder = 'To Do...';
    inputField.classList.remove('placeholder-color');
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
  editToDoButton.classList.add('btn');
  editToDoButton.classList.add('ripple');
  editToDoButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';

  const deleteToDoButton = document.createElement('button');
  deleteToDoButton.addEventListener('click', deleteToDo);
  deleteToDoButton.classList.add('deleteToDoButton');
  deleteToDoButton.classList.add('btn');
  deleteToDoButton.classList.add('ripple');
  deleteToDoButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

  const inputEdit = document.createElement('input');
  inputEdit.type = 'text';
  inputEdit.addEventListener('keyup', editKeyUp);

  li.appendChild(checkbox);
  li.appendChild(inputEdit);
  li.appendChild(span);
  li.appendChild(editToDoButton);
  li.appendChild(deleteToDoButton);
  toDoElement?.appendChild(li);

  saveToDos(inputField.value);

  inputField.value = '';
};

const localStorageKey = 'toDos';

const checkLocalStorage = () =>
  JSON.parse(localStorage.getItem(localStorageKey)) || [];

const saveToDos = (toDo) => {
  const toDos = checkLocalStorage();

  toDos.push(toDo);
  localStorage.setItem(localStorageKey, JSON.stringify(toDos));
};

const clearLocalStorage = () => {
  localStorage.removeItem(localStorageKey);
  location.reload();
};

const changeToDo = (index, value) => {
  const toDos = checkLocalStorage();

  toDos[index] = value;

  localStorage.setItem(localStorageKey, JSON.stringify(toDos));
};

const getToDos = () => {
  const toDos = checkLocalStorage();

  toDos.forEach((toDo) => createToDoElement(toDo));
};

const removeToDo = (index) => {
  const toDos = checkLocalStorage();

  toDos.splice(index, 1);

  localStorage.setItem(localStorageKey, JSON.stringify(toDos));
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
  editToDoButton.classList.add('btn');
  editToDoButton.classList.add('ripple');
  editToDoButton.innerHTML = '<i class="fas fa-pen"></i>';

  const deleteToDoButton = document.createElement('button');
  deleteToDoButton.addEventListener('click', deleteToDo);
  deleteToDoButton.classList.add('deleteToDoButton');
  deleteToDoButton.classList.add('btn');
  deleteToDoButton.classList.add('ripple');
  deleteToDoButton.innerHTML = '<i class="fas fa-trash"></i>';

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

const editToDo = (event) => {
  const toDo = event.target.parentElement;
  const toDoText = toDo.querySelector('span');
  const inputEdit = toDo.querySelector('input[type="text"]');

  toDo.classList.add('edit');
  inputEdit.value = toDoText.textContent;
};

const deleteToDo = (event) => {
  removeToDo(getArrayIndex(event.target?.parentElement));
  event.target.parentElement?.remove();
};

const editKeyUp = (event) => {
  if (event.key === 'Enter') {
    const toDo = event.target.parentElement;
    const toDoText = toDo.querySelector('span');
    const inputEdit = toDo.querySelector('input[type="text"]');

    if (inputEdit.value === '') {
      inputEdit.placeholder = 'Trage erst ein To Do ein';
      inputEdit.classList.add('.placeholder-color');
    } else {
      toDo.classList.remove('edit');
    }

    toDoText.textContent = inputEdit.value;

    changeToDo(getArrayIndex(event.target.parentElement), inputEdit.value);
  }
};

//TODO Klassen setzen für Drag & Drop
//TODO Klassen setzen für Drag & Drop
//TODO Klassen setzen für Drag & Drop
//TODO Klassen setzen für Drag & Drop
//TODO Klassen setzen für Drag & Drop

let dragging = null;

document.addEventListener('dragstart', (event) => {
  const target = getToDoElement(event.target);
  dragging = target;

  event.dataTransfer.setData('text/plain', null);
  event.dataTransfer.setDragImage(self.dragging, 0, 0);
});

document.addEventListener('dragover', (event) => {
  event.preventDefault();

  const target = getToDoElement(event.target);
  const bounding = target.getBoundingClientRect();
  const offset = bounding.y + bounding.height / 2;

  if (event.clientY - offset > 0) {
    // target.style['border-bottom'] = 'solid 4px blue';
    // target.style['border-top'] = '';
    target.classList.toggle('dragover-if');
  } else {
    // target.style['border-top'] = 'solid 4px blue';
    // target.style['border-bottom'] = '';

    target.classList.toggle('dragover-else');
  }
});

document.addEventListener('dragleave', (event) => {
  const target = getToDoElement(event.target);

  // target.style['border-bottom'] = '';
  // target.style['border-top'] = '';

  target.classList.toggle('dragleave');
});

document.addEventListener('drop', (event) => {
  event.preventDefault();

  const target = getToDoElement(event.target);

  if (target.style['border-bottom'] !== '') {
    // target.style['border-bottom'] = '';

    target.classList.toggle('drop-if');

    target.parentNode.insertBefore(dragging, event.target.nextSibling);
  } else {
    // target.style['border-top'] = '';

    target.classList.toggle('drop-else');

    target.parentNode.insertBefore(dragging, event.target);
  }
});

const getToDoElement = (target) => {
  while (target.nodeName.toLowerCase() !== 'li' && target.nodeName === 'BODY') {
    target = target.parentNode;
  }

  if (target.nodeName.toLowerCase() == 'body') {
    return false;
  } else {
    return target;
  }
};
