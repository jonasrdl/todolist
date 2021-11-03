import React, { useState } from 'react'
import './TodoForm.css'
const uuid = require('uuid')

const TodoForm = ({ addTodo }) => {
  const [todo, setTodo] = useState({
    id: '',
    task: '',
    completed: false
  })

  const handleInputChange = (e) => {
    setTodo({ ...todo, task: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (todo.task.trim()) {
      addTodo({ ...todo, id: uuid.v4() })

      setTodo({ ...todo, task: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleInputChange}
        value={todo.task}
        name="task"
        type="text"
        className={'todo-input'}
      />
      <button className={'todo-add-button'} type="submit">
        +
      </button>
    </form>
  )
}

export default TodoForm
