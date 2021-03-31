'use strict';
const LOCAL_STORAGE_KEY = 'todos';
const CURRENT_LIST_KEY = 'currentlist';

let toDoList;
let inputField;
let newListInput;
let newListText;
let todoLists = [];

const getArrayIndex = (element) =>
    [...element.parentNode.children].findIndex((child) => child === element);

const init = () => {
    const addToDoButton = document.querySelector('button.addToDo');
    newListText = document.querySelector('span.newListText');
    inputField = document.getElementById('inputField');
    toDoList = document.getElementById('toDoList');
    newListInput = document.querySelector('input.newListInput');

    addToDoButton.addEventListener('click', addToDo);
    addToDoButton.classList.add('ripple');
    inputField.addEventListener('keyup', keyUp);
    getToDos();
    initDragAndDrop();

    if (!newListText.value) {
        newListText.innerHTML = 'Current list: /';
    }
};

window.addEventListener('DOMContentLoaded', init);

const keyUp = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addToDo();
    }
};

const createTodoElement = (todoLabel) => {
    const span = document.createElement('span');
    span.innerText = todoLabel;

    const li = document.createElement('li');
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

const addToDo = () => {
    if (inputField.value === '') {
        inputField.placeholder = 'Trage erst ein To Do ein';
        inputField.classList.add('placeholder-color');

        return;
    } else {
        inputField.placeholder = 'To Do...';
        inputField.classList.remove('placeholder-color');
    }

    createTodoElement(inputField.value);
    saveToDos(inputField.value);

    for (let i = 0; i < todoLists.length; i++) {
        const todos = todoLists[i].todos[i];

        for (let j = 0; j < todos.length; j++) {
            todoLists[i].todos[j].push({name: 'Hallo', done: false});
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
        }
    }

    inputField.value = '';
};

const clearLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(CURRENT_LIST_KEY);
    location.reload();
};

const changeToDo = (index, value) => {
    const toDos = checkLocalStorage();

    toDos[index] = value;

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toDos));
};

const getToDos = () => {
    const toDos = checkLocalStorage();
    const currentList = localStorage.getItem(CURRENT_LIST_KEY);

    newListText.innerHTML = 'Current List: ' + currentList;
    // toDos.forEach((toDo) => createTodoElement(toDo));
};

const removeToDo = (index) => {
    const toDos = checkLocalStorage();

    toDos.splice(index, 1);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toDos));
};

const checkLocalStorage = () =>
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));//  || todoLists;

const addNewList = () => {
    let todoListsObject = {
        name: newListInput.value,
        todos: []
    };

    todoLists.push(todoListsObject);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoListsObject));

    newListText.innerHTML = ('Current List: ' + newListInput.value);
    localStorage.setItem(CURRENT_LIST_KEY, newListInput.value);

    newListInput.value = null;
};

const saveToDos = (/*todo*/) => {
    const currentList = localStorage.getItem(CURRENT_LIST_KEY);

    for (let i = 0; i < todoLists.length; i++) {
        for (let j = 0; j < todoLists.length; j++) {
            todoLists[i].todos.push({name: inputField.value, done: false});
        }
    }

    //const todo = localStorage.getItem(LOCAL_STORAGE_KEY);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todoLists));
    newListText.innerHTML = 'Current List: ' + currentList;

    //const toDos = checkLocalStorage();

    //toDos.push(toDo);
    //localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toDos));
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

const switchDesign = () => {
    const root = document.querySelector('html');
    const switchDesignButton = document.querySelector('button.switch-design');

    root.classList.toggle('light');

    if (root.classList.contains('light')) {
        switchDesignButton.innerHTML = '<i class="far fa-moon"></i>';
    } else {
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
