'use strict'

import Eventbus from '../eventbus.js'
import { Storage } from './components/Storage.js'
import { Todolist } from './components/Todolist.js'
import { Pagination } from './components/Pagination.js'
import { Theme } from "./components/Theme.js";

let theme = new Theme();

const store = {
    todo: new Storage('todos'),
    //theme: new Storage('theme'),
    index: new Storage('currentIndex'),
    name: new Storage('username')
}

const page = {
    prev: document.querySelector('.prevPageBtn'),
    next: document.querySelector('.nextPageBtn')
}

const list = {
    newListInput: document.querySelector('input.newListInput'),
    newListSubmit: document.querySelector('button.newListSubmit'),
    listView: document.getElementById('listView'),
    newListText: document.querySelector('span.newListText')
}

const design = {
    switchDesignButton: document.querySelector('button.switch-design'),
    switchDesignIcon: document.querySelector('button.switch-design i')
}

const name = {
    nameInput: document.querySelector('.nameInput'),
    nameSubmit: document.querySelector('.nameSubmit')
}

let todolistPagination
let todoLists = []
let fromStorage = []

let inputField
let heading

const init = () => {
    const root = document.querySelector('html')
    const addTodoButton = document.querySelector('button.addToDo')

    addTodoButton.classList.add('ripple')
    heading = document.querySelector('.heading')
    inputField = document.getElementById('inputField')
    //name.nameSubmit.addEventListener('click', sendName)
    addTodoButton.addEventListener('click', addTodo)
    inputField.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addTodo()
        }
    })
    //design.switchDesignButton.addEventListener('click', switchDesign)
    //page.prev.addEventListener('click', () => {
    //    todolistPagination.prevPage()
    //})
    //page.next.addEventListener('click', () => {
    //    todolistPagination.nextPage()
    //})
    list.newListSubmit.addEventListener('click', addNewList)

    if (!store.index.get()) {
        store.index.set(0)
        //list.newListText.innerHTML = 'Current List: Default'
    }

    if (theme.get() === 'white') {
        theme.set('white')
        root.classList.add('white')
        //design.switchDesignIcon.classList.remove('fa-moon')
        //design.switchDesignIcon.classList.add('fa-sun')
    } else {
        theme.set('dark')
        root.classList.remove('white')
        //design.switchDesignIcon.classList.remove('fa-sun')
        //design.switchDesignIcon.classList.add('fa-moon')
    }

    const lists = store.todo.get()

    fromStorage = !!lists
        ? JSON.parse(lists)
        : [
            {
                name: 'Default',
                todos: []
            }
        ]

    todolistPagination = new Pagination(0, +store.index.get())

    if (fromStorage[todolistPagination.currentPage].name !== 'Default') {
        store.index.set(0)
        //updateListText()
    }

    create()
    countTodos()
    countLists()
}

window.addEventListener('DOMContentLoaded', init)

const create = () => {
    todoLists = fromStorage.map((storageList) => {
        const todoList = new Todolist(storageList.name, list.listView)
        storageList.todos.forEach(({name, done}) => {
            todoList.addTodo({name, done})
        })
        return todoList
    })

    todolistPagination.addMaxPage(todoLists.length - 1)
    todoLists[todolistPagination.currentPage].create()
}

const change = () => {
    store.todo.set(todoLists.map(({name, todos}) => ({name, todos: todos.map(({name, done}) => ({name, done}))})))
}

Eventbus.on('change', change)
Eventbus.on('pageChange', (index) => {
    todoLists[index].create()
    store.index.set(index)

    //updateListText()
})

const countTodos = () => {
    const todoCountText = document.querySelector('span.marked-todo-text');

    fromStorage.forEach(todos => {
        todoCountText.innerHTML = `${todos.todos.length} Todos.`;
    });
}

const countLists = () => {
    const listCountText = document.querySelector('span.marked-list-text');

    fromStorage.forEach(lists => {
        if (fromStorage.length === 1) {
            listCountText.innerHTML = `${fromStorage.length} Liste`;
        } else {
            listCountText.innerHTML = `${fromStorage.length} Listen`;
        }
    })
}

/* const updateListText = () => {
    const currentList = todoLists[todolistPagination.currentPage].name
    list.newListText.innerHTML = 'Current List: ' + currentList
} */

const createTodoElement = (name, done) => {
    todoLists[todolistPagination.currentPage].addTodo({name, done})
}

const addTodo = () => {
    if (!inputField.value.trim().length) {

        return
    }

    inputField.placeholder = 'To Do...'
    inputField.classList.remove('placeholder-color')

    createTodoElement(inputField.value)
    Eventbus.emit('change')

    inputField.value = null

    countTodos()
    countLists()
}

const sendName = (event) => {
    event.preventDefault()
    const name = name.nameInput.value

    if (!name.nameInput.value.trim().length) {
        name.nameInput.value = null
        name.nameInput.placeholder = 'Trage erst einen Namen ein'
        name.nameInput.classList.add('placeholder-color')

        return
    }

    setListNameWithS(name)

    store.name.set(name)
    name.nameInput.value = null
}

const setListNameWithS = (name) => {
    name.endsWith('s') ? heading.textContent = name + '\' To Do List' : heading.textContent = name + '\'s To Do List'
}

const addNewList = (event) => {
    event.preventDefault()

    if (!list.newListInput.value.trim().length) {
        list.newListInput.value = null
        list.newListInput.placeholder = 'Trage erst einen Namen ein'
        list.newListInput.classList.add('placeholder-color')

        return
    }

    todoLists.push(new Todolist(list.newListInput.value, list.listView))
    Eventbus.emit('change')

    todolistPagination.addMaxPage()
    todolistPagination.setPage(todoLists.length - 1)

    list.newListText.innerHTML = 'Current List: ' + list.newListInput.value
    list.newListInput.value = null
}

const switchDesign = () => {
    const root = document.querySelector('html')
    const switchDesignIcon = document.querySelector('button.switch-design i')

    root.classList.toggle('white')

    if (root.classList.contains('white')) {
        theme.set('white')

        switchDesignIcon.classList.remove('fa-moon')
        switchDesignIcon.classList.add('fa-sun')
    } else {
        theme.set('dark')

        switchDesignIcon.classList.remove('fa-sun')
        switchDesignIcon.classList.add('fa-moon')
    }
}
