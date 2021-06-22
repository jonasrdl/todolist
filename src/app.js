'use strict';

import Eventbus from '../eventbus.js';
import { Storage } from './components/Storage.js';
import { Todolist } from './components/Todolist.js';

const todostorage = new Storage('todos');
const themestorage = new Storage('theme');
const indexstorage = new Storage('currentIndex');
const namestorage = new Storage('username');

let todoLists = [];
let currentIndex = 0;
let listView;
let inputField;
let newListInput;
let newListText;
let prevPageBtn;
let nextPageBtn;
let nameInput;
let nameSubmit;
let newListSubmit;
let todoListHeader;
let clearLocalStorageBtn;
let fromStorage = [];

const getArrayIndex = (element) =>
  [...element.parentNode.children].findIndex((child) => child === element);

const init = () => {
  listView = document.getElementById('listView');

  const root = document.querySelector('html');
  const switchDesignButton = document.querySelector('button.switch-design');
  const switchDesignIcon = document.querySelector('button.switch-design i');
  const addTodoButton = document.querySelector('button.addToDo');
  addTodoButton.classList.add('ripple');
  todoListHeader = document.querySelector('.toDoListHeader');
  prevPageBtn = document.querySelector('.prevPageBtn');
  nameInput = document.querySelector('.nameInput');
  nameSubmit = document.querySelector('.nameSubmit');
  nextPageBtn = document.querySelector('.nextPageBtn');
  newListText = document.querySelector('span.newListText');
  inputField = document.getElementById('inputField');
  newListInput = document.querySelector('input.newListInput');
  newListSubmit = document.querySelector('button.newListSubmit');
  clearLocalStorageBtn = document.querySelector('button.clearLocalStorageBtn');

  nameSubmit.addEventListener('click', sendName);
  addTodoButton.addEventListener('click', addTodo);
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

  fromStorage = !!lists
    ? JSON.parse(lists)
    : [
        {
          name: 'Default',
          todos: []
        }
      ];

  if (!fromStorage[currentIndex].name === 'Default') {
    indexstorage.set(0);
  }

  // updateListText();
  // initDragAndDrop();
  // renderName();
  // setDone();
  // checkDone();
  create();
};

window.addEventListener('DOMContentLoaded', init);

const create = () => {
  todoLists = fromStorage.map((list) => {
    const todoList = new Todolist(list.name, listView);
    list.todos.forEach(({ name, done }) => {
      todoList.addTodo({ name, done });
    });
    return todoList;
  });
  todoLists[currentIndex].create();
};

const change = () => {
  todostorage.set(todoLists.map(({name, todos}) => ({name, todos: todos.map(({name, done}) => ({name, done}))})));
};

Eventbus.on('deleteTodo', change)
Eventbus.on('change', change);

// -- OLD STUFF --

const checkDone = () => {
  const checkboxes = listView.querySelectorAll('input[type="checkbox"]');

  [...checkboxes].forEach((checkbox) => checkbox.checked = todoLists[currentIndex].todos[getArrayIndex(checkbox)].done);
};

const updateListText = () => {
  const currentList = todoLists[currentIndex].name;
  newListText.innerHTML = 'Current List: ' + currentList;
};

const setPage = (index) => {
  if (index >= todoLists.length || index < 0) {
    return;
  }

  todoLists[index].create();
  currentIndex = index;
  indexstorage.set(index);

  updateListText();
}

const changePage = (direction, index = currentIndex + direction) => {
  if (index >= 0 && index < todoLists.length) {
    setPage(index);
  }
};

const prevPage = () => changePage(-1);
const nextPage = () => changePage(1);

const enterKeyUp = (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
};

const createTodoElement = (name, done) => {
  todoLists[currentIndex].addTodo({ name, done });
};





const addTodo = () => {
  if (!inputField.value.trim().length) {

    return;
  } else {
    inputField.placeholder = 'To Do...';
    inputField.classList.remove('placeholder-color');
  }

  createTodoElement(inputField.value);
  Eventbus.emit('change');

  inputField.value = null;
};

const clearLocalStorage = () => {
  todostorage.clear();
  location.reload();
};

const saveTodos = () => {
  fromStorage[currentIndex].todos.push({
    name: inputField.value,
    done: false
  });

  todostorage.set(fromStorage);
  updateListText();
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

const endsWithS = (name) => {
  name.endsWith('s') ? todoListHeader.textContent = name + "' To Do List" : todoListHeader.textContent = name + "'s To Do List";
};

const addNewList = (event) => {
  event.preventDefault();

  if (!newListInput.value.trim().length) {
    newListInput.value = null;
    newListInput.placeholder = 'Trage erst einen Namen ein';
    newListInput.classList.add('placeholder-color');

    return;
  }

  todoLists.push(new Todolist(newListInput.value, listView));
  Eventbus.emit('change');

  newListText.innerHTML = 'Current List: ' + newListInput.value;

  setPage(todoLists.length - 1);

  newListInput.value = null;
};

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
