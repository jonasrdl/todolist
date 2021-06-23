'use strict';

import Eventbus from '../eventbus.js';
import { Storage } from './components/Storage.js';
import { Todolist } from './components/Todolist.js';
import { Pagination } from "./components/Pagination.js";

const todostorage = new Storage('todos');
const themestorage = new Storage('theme');
const indexstorage = new Storage('currentIndex');
const namestorage = new Storage('username');

let todolistPagination;
let todoLists = [];
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
let fromStorage = [];

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

  nameSubmit.addEventListener('click', sendName);
  addTodoButton.addEventListener('click', addTodo);
  inputField.addEventListener('keyup', enterKeyUp);
  switchDesignButton.addEventListener('click', switchDesign);
  prevPageBtn.addEventListener('click', () => {
    todolistPagination.prevPage();
  })
  nextPageBtn.addEventListener('click', () => {
    todolistPagination.nextPage();
  })
  newListSubmit.addEventListener('click', addNewList);

  if (!indexstorage.get()) {
    indexstorage.set(0);
    newListText.innerHTML = 'Current List: Default';
  }

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

  const lists = todostorage.get();

  fromStorage = !!lists
    ? JSON.parse(lists)
    : [
        {
          name: 'Default',
          todos: []
        }
      ];

  todolistPagination = new Pagination(0, +indexstorage.get());

  if (fromStorage[todolistPagination.currentPage].name !== 'Default') {
    indexstorage.set(0);
    updateListText();
  }

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

  todolistPagination.addMaxPage(todoLists.length - 1);
  todoLists[todolistPagination.currentPage].create();
};

const change = () => {
  todostorage.set(todoLists.map(({name, todos}) => ({name, todos: todos.map(({name, done}) => ({name, done}))})));
};

Eventbus.on('change', change);
Eventbus.on('pageChange', (index) => {
  todoLists[index].create();
  indexstorage.set(index);

  updateListText();
})

const updateListText = () => {
  const currentList = todoLists[todolistPagination.currentPage].name;
  newListText.innerHTML = 'Current List: ' + currentList;
};

const enterKeyUp = (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
};

const createTodoElement = (name, done) => {
  todoLists[todolistPagination.currentPage].addTodo({ name, done });
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

  todolistPagination.addMaxPage();
  todolistPagination.setPage(todoLists.length - 1);

  newListText.innerHTML = 'Current List: ' + newListInput.value;
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
