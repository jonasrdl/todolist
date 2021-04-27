'use strict';
const LOCAL_STORAGE_KEY = 'todos';
const CURRENT_LIST_KEY = 'currentlist';
const NAME_KEY = 'username';
const CURRENT_INDEX_KEY = 'currentIndex';
const THEME_KEY = 'theme';

let currentIndex = 0;
let currentList = null;
let toDoList;
let inputField;
let newListInput;
let newListText;
let prevPageBtn;
let nextPageBtn;
let nameInput;
let nameSubmit;
let toDoListHeader;
let todoLists = [];

const getArrayIndex = (element) =>
  [...element.parentNode.children].findIndex((child) => child === element);

const init = () => {
  // Init function, loads everytime when page gets loaded
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

  nameSubmit.addEventListener('click', sendName);
  addToDoButton.addEventListener('click', addToDo);
  inputField.addEventListener('keyup', enterKeyUp);

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
          todos: [],
        },
      ];

  if (todoLists[currentIndex].name === 'Default') {
    localStorage.setItem(CURRENT_INDEX_KEY, 0);
  }

  updateListText();
  initDragAndDrop();
  renderName();
  redraw();
  // isCheckboxChecked();
};

window.addEventListener('DOMContentLoaded', init);

const changePage = (direction) => {
  if (
    currentIndex + direction >= 0 &&
    currentIndex + direction < todoLists.length
  ) {
    currentIndex += direction;
  }

  toDoList.innerHTML = '';

  currentList = todoLists[currentIndex];
  localStorage.setItem(CURRENT_INDEX_KEY, currentIndex);
  redraw();
};

const enterKeyUp = (event) => {
  // Press enter instead of the + button
  if (event.key === 'Enter') {
    addToDo();
  }
};

const createSpanFromLS = (todos) => {
  for (let i = 0; i < todos.length; i++) {
    createTodoElement(todos[i].name);
  }
};

const createTodoElement = (text) => {
  // Creates all necessary HTML Elements for a todo
  //TODO span => todoText
  const span = document.createElement('span');
  span.innerText = text;

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
  li.appendChild(span);
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

const redraw = () => createSpanFromLS(todoLists[currentIndex].todos);

const addToDo = () => {
  // Adds a todo to the list
  if (inputField.value === '') {
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

/* const isCheckboxChecked = (checkbox) => {
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      console.log(true);
      console.log(todoLists);
      return true;
    } else {
      console.log(false);
      console.log(todoLists);
      return false;
    }
  });
}; */

const clearLocalStorage = () => {
  // Remove all keys from the localStorage
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem(CURRENT_LIST_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(CURRENT_INDEX_KEY);
  location.reload();
};

const saveToDos = () => {
  todoLists[currentIndex].todos.push({
    name: inputField.value,
    done: true,
  });

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
  // newListText.innerHTML = 'Current List: ' + currentList;
  updateListText();
};

const updateListText = () => {
  const cl = todoLists[currentIndex].name;
  newListText.innerHTML = 'Current List: ' + cl;
};

const sendName = (event) => {
  event.preventDefault();
  const name = nameInput.value;

  if (!nameInput.value === '') {
    endsWithS(name);
  } else {
    nameInput.placeholder = 'Trage erst einen Namen ein';
    nameInput.classList.add('placeholder-color');

    setTimeout(function () {
      nameInput.placeholder = 'Your Name...';
      nameInput.classList.remove('placeholder-color');
    }, 3000);
  }

  localStorage.setItem(NAME_KEY, name);
  nameInput.value = null;
};

const renderName = () => {
  // Load Name of User every reload / start
  const currentName = localStorage.getItem(NAME_KEY);

  if (currentName) {
    endsWithS(currentName);
  }
};

const endsWithS = (name) => {
  // Check if username ends with "S"
  if (name.endsWith('s')) {
    toDoListHeader.textContent = name + ' To Do List';
  } else {
    toDoListHeader.textContent = name + "'s To Do List";
  }
};

const addNewList = () => {
  //TODO REFACTOR
  let todoListsObject = {
    name: newListInput.value,
    todos: [],
  };

  todoLists.push(todoListsObject);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
  newListText.innerHTML = 'Current List: ' + newListInput.value;
  localStorage.setItem(CURRENT_LIST_KEY, newListInput.value);

  nextPage();
  redraw();

  newListInput.value = null;
};

const changeToDo = (event) => {
  const li = event.target.parentElement; // LI
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

  setTimeout(function () {
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
  // Init drag and drop function
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
