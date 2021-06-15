'use strict';

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

import Eventbus from '../eventbus.js';
import { Storage } from './components/Storage.js';
import { Todo } from './components/Todo.js';
import { Todolist } from './components/Todolist.js';

const todostorage = new Storage('todos');
const themestorage = new Storage('theme');
const indexstorage = new Storage('currentIndex');
const namestorage = new Storage('username');

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
  // redraw();
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
  todoLists[0].create();
};

const change = () => {
  todostorage.set(todoLists.map(({name, todos}) => ({name, todos: todos.map(({name, done}) => ({name, done}))})));
};

Eventbus.on('change', change);

// -- OLD STUFF --

const checkDone = () => {
  const checkboxes = listView.querySelectorAll('input[type="checkbox"]');

  [...checkboxes].forEach((checkbox) => checkbox.checked = fromStorage[currentIndex].todos[getArrayIndex(checkbox)].done);
};

const changePage = (direction) => {
  if (
    currentIndex + direction >= 0 &&
    currentIndex + direction < fromStorage.length
  ) {
    currentIndex += direction;
  }

  listView.innerHTML = '';

  indexstorage.set(currentIndex);
  redraw();
  checkDone();
};

const enterKeyUp = (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
};

const createTodoText = (todos) => {
    todos.forEach((todo) => createTodoElement(todo.name));
}

const createTodoElement = (name, done) => {
  todoLists[0].addTodo({ name, done });
};

const prevPage = () => {
  changePage(-1);
  updateListText();
};

const nextPage = () => {
  changePage(1);
  updateListText();
};

const redraw = () => createTodoText(fromStorage[currentIndex].todos);

const addTodo = () => {
  if (!inputField.value.trim().length) {

    return;
  } else {
    inputField.placeholder = 'To Do...';
    inputField.classList.remove('placeholder-color');
  }

  createTodoElement(inputField.value);
  saveTodos();

  inputField.value = null;
};

const setDone = () => {
  const checkboxes = listView.querySelectorAll('input[type="checkbox"]');

  if (!checkboxes.length) {
    return;
  }

  [...checkboxes].forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
      if (checkbox.checked) {
        fromStorage[currentIndex].todos[
          getArrayIndex(checkbox.parentElement)
        ].done = true;
        todostorage.set(JSON.stringify(fromStorage));
      } else {
        fromStorage[currentIndex].todos[
          getArrayIndex(checkbox.parentElement)
        ].done = false;
        todostorage.set(JSON.stringify(fromStorage));
      }
    });
  });
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

const updateListText = () => {
  const currentList = fromStorage[currentIndex].name;
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
    todoListHeader.textContent = name + "' To Do List";
  } else {
    todoListHeader.textContent = name + "'s To Do List";
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

  fromStorage.push(todoListsObject);

  todostorage.set(fromStorage);
  newListText.innerHTML = 'Current List: ' + newListInput.value;

  nextPage();
  redraw();

  newListInput.value = null;
};

export const deleteTodoMessage = () => {
  inputField.placeholder = 'To Do gelöscht';
  inputField.classList.add('placeholder-color');

  setTimeout(() => {
    inputField.placeholder = 'To Do...';
    inputField.classList.remove('placeholder-color');
  }, 3000);
};

export const removeTodo = (event) => {
  const li = event.target.parentElement;

  fromStorage[currentIndex].todos.splice(getArrayIndex(li), 1);

  todostorage.set(fromStorage);
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

const initDragAndDrop = () => {
  listView.addEventListener('drop', (event) => {
    event.preventDefault();
    const target = getTodoElement(event.target);

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
    const target = getTodoElement(event.target);
    window.dragging = target;

    event.dataTransfer.setData('text/plain', null);
    event.dataTransfer.setDragImage(target, 0, 0);
  });

  document.addEventListener('dragover', (event) => {
    event.preventDefault();

    const target = getTodoElement(event.target);

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
    const target = getTodoElement(event.target);

    if (!target) {
      return;
    }
    target.style['border-bottom'] = '';
    target.style['border-top'] = '';
    target.classList.remove('dragover-if');
    target.classList.remove('dragover-else');
    target.classList.add('dragleave');
  });

  const getTodoElement = (target) => {
    if (!target) {
      return false;
    }

    while (!(target.nodeName === 'LI' || target.nodeName === 'HTML')) {
      target = target.parentNode;
    }

    return target.nodeName === 'HTML' ? false : target;
  };
};
