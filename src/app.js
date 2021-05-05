'use strict';
const LOCAL_STORAGE_KEY = 'todos';
const NAME_KEY = 'username';
const CURRENT_INDEX_KEY = 'currentIndex';
const THEME_KEY = 'theme';

let currentIndex = 0;
let toDoList;
let inputField;
let newListInput;
let newListText;
let prevPageBtn;
let nextPageBtn;
let nameInput;
let nameSubmit;
let newListSubmit;
let toDoListHeader;
let clearLocalStorageBtn;
let todoLists = [];

const getArrayIndex = (element) =>
  [...element.parentNode.children].findIndex((child) => child === element);

const init = () => {
  const root = document.querySelector('html');
  const switchDesignButton = document.querySelector('button.switch-design');
  const addToDoButton = document.querySelector('button.addToDo');
  addToDoButton.classList.add('ripple');
  toDoListHeader = document.querySelector('.toDoListHeader');
  prevPageBtn = document.querySelector('.prevPageBtn');
  nameInput = document.querySelector('.nameInput');
  nameSubmit = document.querySelector('.nameSubmit');
  nextPageBtn = document.querySelector('.nextPageBtn');
  newListText = document.querySelector('span.newListText');
  inputField = document.getElementById('inputField');
  toDoList = document.getElementById('toDoList');
  newListInput = document.querySelector('input.newListInput');
  newListSubmit = document.querySelector('button.newListSubmit');
  clearLocalStorageBtn = document.querySelector('button.clearLocalStorageBtn');

  nameSubmit.addEventListener('click', sendName);
  addToDoButton.addEventListener('click', addToDo);
  inputField.addEventListener('keyup', enterKeyUp);
  switchDesignButton.addEventListener('click', switchDesign);
  prevPageBtn.addEventListener('click', prevPage);
  nextPageBtn.addEventListener('click', nextPage);
  newListSubmit.addEventListener('click', addNewList);
  clearLocalStorageBtn.addEventListener('click', clearLocalStorage);

  const theme = localStorage.getItem(THEME_KEY);

  if (theme === 'white') {
    localStorage.setItem(THEME_KEY, 'white');
    root.classList.add('white');
    switchDesignButton.innerHTML = '<i class="far fa-moon"></i>';
  } else {
    localStorage.setItem(THEME_KEY, 'dark');
    root.classList.remove('white');
    switchDesignButton.innerHTML = '<i class="fas fa-sun"></i>';
  }

  currentIndex = +localStorage.getItem(CURRENT_INDEX_KEY) || 0;

  const lists = localStorage.getItem(LOCAL_STORAGE_KEY);

  todoLists = !!lists
    ? JSON.parse(lists)
    : [
        {
          name: 'Default',
          todos: []
        }
      ];

  if (todoLists[currentIndex].name === 'Default') {
    localStorage.setItem(CURRENT_INDEX_KEY, 0);
  }

  updateListText();
  initDragAndDrop();
  renderName();
  redraw();
  setDone();
  checkDone();
};

window.addEventListener('DOMContentLoaded', init);

const checkDone = () => {
  const checkboxes = toDoList.querySelectorAll('input[type="checkbox"]');

  [...checkboxes].forEach((checkbox) => {
    if (todoLists[currentIndex].todos[getArrayIndex(checkbox)].done == true) {
      checkbox.checked = true;
    } else if (
      todoLists[currentIndex].todos[getArrayIndex(checkbox)].done == false
    ) {
      checkbox.checked = false;
    }
  });
};

const changePage = (direction) => {
  if (
    currentIndex + direction >= 0 &&
    currentIndex + direction < todoLists.length
  ) {
    currentIndex += direction;
  }

  toDoList.innerHTML = '';

  localStorage.setItem(CURRENT_INDEX_KEY, currentIndex);
  redraw();
  checkDone();
};

const enterKeyUp = (event) => {
  if (event.key === 'Enter') {
    addToDo();
  }
};

const createTodoText = (todos) => {
  for (let i = 0; i < todos.length; i++) {
    createTodoElement(todos[i].name);
  }
};

const createTodoElement = (text) => {
  const todoText = document.createElement('span');
  todoText.innerText = text;

  const li = document.createElement('li');
  li.classList.add('li');
  li.draggable = true;

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
  li.appendChild(todoText);
  li.appendChild(editToDoButton);
  li.appendChild(deleteToDoButton);
  toDoList?.appendChild(li);
};

const prevPage = () => {
  changePage(-1);
  updateListText();
};

const nextPage = () => {
  changePage(1);
  updateListText();
};

const redraw = () => createTodoText(todoLists[currentIndex].todos);

const addToDo = () => {
  if (!inputField.value.trim().length) {
    inputField.value = null;
    inputField.placeholder = 'Trage erst ein To Do ein';
    inputField.classList.add('placeholder-color');

    return;
  } else {
    inputField.placeholder = 'To Do...';
    inputField.classList.remove('placeholder-color');
  }

  createTodoElement(inputField.value);
  saveToDos();

  inputField.value = null;
};

const setDone = () => {
  const checkboxes = toDoList.querySelectorAll('input[type="checkbox"]');

  if (!checkboxes.length) {
    return;
  }

  [...checkboxes].forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
      if (checkbox.checked) {
        todoLists[currentIndex].todos[
          getArrayIndex(checkbox.parentElement)
        ].done = true;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
      } else {
        todoLists[currentIndex].todos[
          getArrayIndex(checkbox.parentElement)
        ].done = false;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
      }
    });
  });
};

const clearLocalStorage = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(CURRENT_INDEX_KEY);
  location.reload();
};

const saveToDos = () => {
  todoLists[currentIndex].todos.push({
    name: inputField.value,
    done: false
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
  updateListText();
};

const updateListText = () => {
  const currentList = todoLists[currentIndex].name;
  newListText.innerHTML = 'Current List: ' + currentList;
};

const sendName = (event) => {
  event.preventDefault();
  const name = nameInput.value;

  if (!nameInput.value.trim().length) {
    nameInput.value = null;
    nameInput.placeholder = 'Trage erst einen Namen ein';
    nameInput.classList.add('placeholder-color');

    return;
  } else {
    endsWithS(name);
  }

  localStorage.setItem(NAME_KEY, name);
  nameInput.value = null;
};

const renderName = () => {
  const currentName = localStorage.getItem(NAME_KEY);

  if (currentName) {
    endsWithS(currentName);
  }
};

const endsWithS = (name) => {
  if (name.endsWith('s')) {
    toDoListHeader.textContent = name + ' To Do List';
  } else {
    toDoListHeader.textContent = name + "'s To Do List";
  }
};

const addNewList = (event) => {
  event.preventDefault();

  let todoListsObject = {
    name: newListInput.value,
    todos: []
  };

  if (!newListInput.value.trim().length) {
    newListInput.value = null;
    newListInput.placeholder = 'Trage erst einen Namen ein';
    newListInput.classList.add('placeholder-color');

    return;
  }

  todoLists.push(todoListsObject);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
  newListText.innerHTML = 'Current List: ' + newListInput.value;

  nextPage();
  redraw();

  newListInput.value = null;
};

const changeToDo = (event) => {
  const li = event.target.parentElement;
  const inputEdit = toDoList.querySelector('input[type="text"]');

  if (!inputEdit.value.trim().length) {
    inputEdit.placeholder = 'Trage erst ein To Do ein';
    inputEdit.classList.add('placeholder-color');

    return;
  }

  todoLists[currentIndex].todos[getArrayIndex(li)].name = inputEdit.value;

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
};

const editToDo = (event) => {
  const toDo = event.target.parentElement;
  const toDoText = toDo.querySelector('span');
  const inputEdit = toDo.querySelector('input[type="text"]');

  toDo.classList.add('edit');
  inputEdit.value = toDoText.textContent;
};

const deleteToDo = (event) => {
  removeToDo(event);
  event.target.parentElement?.remove();
  deleteToDoMessage();
};

const deleteToDoMessage = () => {
  inputField.placeholder = 'To Do gelöscht';
  inputField.classList.add('placeholder-color');

  setTimeout(() => {
    inputField.placeholder = 'To Do...';
    inputField.classList.remove('placeholder-color');
  }, 3000);
};

const removeToDo = (event) => {
  const li = event.target.parentElement;

  todoLists[currentIndex].todos.splice(getArrayIndex(li), 1);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
};

const editKeyUp = (event) => {
  if (event.key === 'Enter') {
    const toDo = event.target.parentElement;
    const toDoText = toDo.querySelector('span');
    const inputEdit = toDo.querySelector('input[type="text"]');

    if (inputEdit.value === '') {
      inputEdit.placeholder = 'Trage erst ein To Do ein';
      inputEdit.classList.add('placeholder-color');
    } else {
      toDo.classList.remove('edit');
    }

    toDoText.textContent = inputEdit.value;
    changeToDo(event);
  }
};

const switchDesign = () => {
  const root = document.querySelector('html');
  const switchDesignButton = document.querySelector('button.switch-design');

  root.classList.toggle('white');

  if (root.classList.contains('white')) {
    localStorage.setItem(THEME_KEY, 'white');
    switchDesignButton.innerHTML = '<i class="far fa-moon"></i>';
  } else {
    localStorage.setItem(THEME_KEY, 'dark');
    switchDesignButton.innerHTML = '<i class="fas fa-sun"></i>';
  }
};

const initDragAndDrop = () => {
  toDoList.addEventListener('drop', (event) => {
    event.preventDefault();
    const target = getToDoElement(event.target);

    if (!target) {
      return;
    }

    if (target.style['border-bottom'] !== '') {
      target.style['border-bottom'] = '';
      target.classList.remove('dragover-if');
      target.classList.remove('drop-else');
      target.classList.remove('dragover-else');
      target.classList.add('drop-if');

      target.parentNode.insertBefore(window.dragging, event.target.nextSibling);
    } else {
      target.style['border-top'] = '';
      target.classList.remove('dragover-if');
      target.classList.remove('drop-if');
      target.classList.remove('dragover-else');
      target.classList.add('drop-else');

      target.parentNode.insertBefore(window.dragging, event.target);
    }
  });

  window.dragging = null;

  document.addEventListener('dragstart', (event) => {
    const target = getToDoElement(event.target);
    window.dragging = target;

    event.dataTransfer.setData('text/plain', null);
    event.dataTransfer.setDragImage(target, 0, 0);
  });

  document.addEventListener('dragover', (event) => {
    event.preventDefault();

    const target = getToDoElement(event.target);

    if (!target) {
      return;
    }

    const bounding = target.getBoundingClientRect();
    const offset = bounding.y + bounding.height / 2;

    if (event.clientY - offset > 0) {
      target.style['border-bottom'] = 'solid 4px blue';
      target.style['border-top'] = '';
      target.classList.add('dragover-if');
      target.classList.remove('dragover-else');
    } else {
      target.style['border-top'] = 'solid 4px blue';
      target.style['border-bottom'] = '';
      target.classList.remove('dragover-if');
      target.classList.add('dragover-else');
    }
  });

  document.addEventListener('dragleave', (event) => {
    const target = getToDoElement(event.target);

    if (!target) {
      return;
    }
    target.style['border-bottom'] = '';
    target.style['border-top'] = '';
    target.classList.remove('dragover-if');
    target.classList.remove('dragover-else');
    target.classList.add('dragleave');
  });

  const getToDoElement = (target) => {
    if (!target) {
      return false;
    }

    while (!(target.nodeName === 'LI' || target.nodeName === 'HTML')) {
      target = target.parentNode;
    }

    return target.nodeName === 'HTML' ? false : target;
  };
};
