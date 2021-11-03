import React, { useState, useEffect } from 'react'
import './App.css'
import TodoForm from './components/TodoForm/TodoForm'
import TodoList from './components/TodoList/TodoList'
import Navbar from './components/Navbar/Navbar'
import WelcomeHeading from './components/WelcomeHeading/WelcomeHeading'

const LOCAL_STORAGE_KEY = 'todos'

const App = () => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    // Get todos from Storage
    const storageTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))

    if (storageTodos) {
      setTodos(storageTodos)
    }
  }, [])

  useEffect(() => {
    // Save todos to Storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = (todo) => {
    setTodos([todo, ...todos])
  }

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            complete: !todo.complete
          }
        }
        return todo
      })
    )
  }

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <>
      <Navbar />
      <WelcomeHeading />
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleComplete={toggleComplete} removeTodo={removeTodo} />
    </>
  )
}

export default App
