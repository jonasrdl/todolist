'use strict';

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
export let todoLists = [];

import { Storage } from './components/storage.js';
import { Todo } from './components/todo.js';
import { Todolist } from './components/Todolist.js';

const todostorage = new Storage('todos');
const themestorage = new Storage('theme');
const indexstorage = new Storage('currentIndex');
const namestorage = new Storage('username');
const todolist = new Todolist();
const todos = [];

export const getArrayIndex = (element) =>
  [...element.parentNode.children].findIndex((child) => child === element);

const init = () => {
  const root = document.querySelector('html');
  const switchDesignButton = document.querySelector('button.switch-design');
  const switchDesignIcon = document.querySelector('button.switch-design i');
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

  const theme = themestorage.get();

  if (theme === 'white') {
    themestorage.set('white');
    root.classList.add('white');
    switchDesignIcon.classList.remove('fa-moon');
    switchDesignIcon.classList.add('fa-sun');
  } else {
    themestorage.set('dark');
    root.classList.remove('white');
    switchDesignIcon.classList.remove('fa-sun');
    switchDesignIcon.classList.add('fa-moon');
  }

  currentIndex = +indexstorage.get() || 0;

  const lists = todostorage.get();

  todoLists = !!lists
    ? JSON.parse(lists)
    : [
        {
          name: 'Default',
          todos: []
        }
      ];

  if (todoLists[currentIndex].name === 'Default') {
    indexstorage.set(0);
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

  indexstorage.set(currentIndex);
  redraw();
  checkDone();
};

const enterKeyUp = (event) => {
  if (event.key === 'Enter') {
    addToDo();
  }
};

const createTodoText = (todos) =>
  todos.forEach((todo) => createTodoElement(todo.name));

const createTodoElement = (text) => {
  const todo = new Todo(text);

  toDoList?.appendChild(todo.ref);
  todos.push(todo);
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
    todolist.messageIfEmpty(inputField, 'Trage erst ein Todo ein!');

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
        todostorage.set(JSON.stringify(todoLists));
      } else {
        todoLists[currentIndex].todos[
          getArrayIndex(checkbox.parentElement)
        ].done = false;
        todostorage.set(JSON.stringify(todoLists));
      }
    });
  });
};

const clearLocalStorage = () => {
  todostorage.clear();
  location.reload();
};

const saveToDos = () => {
  todoLists[currentIndex].todos.push({
    name: inputField.value,
    done: false
  });

  todostorage.set(JSON.stringify(todoLists));
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
    todolist.messageIfEmpty(nameInput, 'Trage erst einen Namen ein!');

    return;
  } else {
    endsWithS(name);
  }

  namestorage.set(name);
  nameInput.value = null;
};

const renderName = () => {
  const currentName = namestorage.get();

  if (currentName) {
    endsWithS(currentName);
  }
};

const endsWithS = (name) => {
  if (name.endsWith('s')) {
    toDoListHeader.textContent = name + "' To Do List";
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

  todostorage.set(JSON.stringify(todoLists));
  newListText.innerHTML = 'Current List: ' + newListInput.value;

  nextPage();
  redraw();

  newListInput.value = null;
};

export const deleteToDoMessage = () => {
  inputField.placeholder = 'To Do gelöscht';
  inputField.classList.add('placeholder-color');

  setTimeout(() => {
    inputField.placeholder = 'To Do...';
    inputField.classList.remove('placeholder-color');
  }, 3000);
};

export const removeToDo = (event) => {
  const li = event.target.parentElement;

  todoLists[currentIndex].todos.splice(getArrayIndex(li), 1);

  todostorage.set(JSON.stringify(todoLists));
};

const editKeyUp = (event) => {};

const switchDesign = () => {
  const root = document.querySelector('html');
  const switchDesignIcon = document.querySelector('button.switch-design i');

  root.classList.toggle('white');

  if (root.classList.contains('white')) {
    themestorage.set('white');

    switchDesignIcon.classList.remove('fa-moon');
    switchDesignIcon.classList.add('fa-sun');
  } else {
    themestorage.set('dark');

    switchDesignIcon.classList.remove('fa-sun');
    switchDesignIcon.classList.add('fa-moon');
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
