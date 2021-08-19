'use strict'

import Eventbus from '../eventbus.js'
import { Storage } from './components/Storage.js'
import { Todolist } from './components/Todolist.js'
import { Pagination } from './components/Pagination.js'
import { Theme } from "./components/Theme.js"

let theme = new Theme()

const store = {
    todo: new Storage('todos'),
    index: new Storage('currentIndex'),
    name: new Storage('username')
}

/* const page = {
    prev: document.querySelector('.prevPageBtn'),
    next: document.querySelector('.nextPageBtn')
} */

const list = {
    newListInput: document.querySelector('input.newListInput'),
    listView: document.getElementById('listView'),
    newListText: document.querySelector('span.newListText')
}

const nameText = document.querySelector('span.welcome-name')
let nameInput = document.querySelector('input.name-input')
let todolistPagination
let todoLists = []
let fromStorage = []
let newTodoInput
let heading

const init = () => {
    const root = document.querySelector('html')

    nameInput.classList.add('hidden')
    heading = document.querySelector('.heading')
    newTodoInput = document.querySelector('input.new-todo-input')
    newTodoInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addTodo()
        }
    })

    list.newListInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addNewList(event)
        }
    })

    if (!store.index.get()) {
        store.index.set(0)
    }

    if (theme.get() === 'white') {
        document.querySelector('[type=checkbox]').checked = true
        theme.set('white')
        root.classList.add('white')
    } else {
        document.querySelector('[type=checkbox]').checked = false
        theme.set('dark')
        root.classList.remove('white')
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
    }

    create()
    countTodos()
    countLists()
    createListElements()
    renderLists()
    renderName()
}

window.addEventListener('DOMContentLoaded', init)

document.querySelector("[type=checkbox]").addEventListener("click", () => {
    document.querySelector('html').classList.toggle('white')
    
    if (document.querySelector('html').classList.contains('white')) {
        theme.set('white')
    } else {
        theme.set('dark')
    }
})

nameText.addEventListener('click', () => {
    nameText.classList.add('hidden')
    nameInput.classList.remove('hidden')

    nameInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            nameText.classList.remove('hidden')
            nameInput.classList.add('hidden')
            nameText.innerHTML = nameInput.value

            store.name.set(nameInput.value)
        }
    })
})

const renderName = () => {
    nameText.innerHTML = JSON.parse(store.name.get())
}

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
})

const createListElements = () => {
    const listContainer = document.getElementById('list-container')

    todoLists.forEach(lists => {
        const list = document.createElement('li')
        list.innerHTML = lists.name

        listContainer.appendChild(list)
    })
}

const renderLists = () => {
    const listContainer = document.getElementById('list-container')
}

const countTodos = () => {
    const todoCountText = document.querySelector('span.marked-todo-text')

    fromStorage.forEach(todos => {
        todoCountText.innerHTML = `${todos.todos.length} todos.`
    })
}

const countLists = () => {
    const listCountText = document.querySelector('span.marked-list-text')

    fromStorage.forEach(() => {
        if (fromStorage.length === 1) {
            listCountText.innerHTML = `${fromStorage.length} List`
        } else {
            listCountText.innerHTML = `${fromStorage.length} Lists`
        }
    })
}

const createTodoElement = (name, done) => {
    todoLists[todolistPagination.currentPage].addTodo({name, done})
}

const addTodo = () => {
    if (!newTodoInput.value.trim().length) {

        return
    }

    newTodoInput.placeholder = 'To Do...'
    newTodoInput.classList.remove('placeholder-color')

    createTodoElement(newTodoInput.value)
    Eventbus.emit('change')

    newTodoInput.value = null

    countTodos()
    countLists()
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

    createListElements()
    list.newListInput.value = null
}