import React from 'react'
import './Todo.css'

const Todo = ({ todo, toggleComplete, removeTodo }) => {
  const handleRemoveClick = () => {
    removeTodo(todo.id)
  }

  const handleCheckboxClick = () => {
    toggleComplete(todo.id)
  }

  return (
    <div className={'todo-wrapper'}>
      <input type="checkbox" onClick={handleCheckboxClick} />
      <li
        className={'todo-item'}
        style={{ textDecoration: todo.completed ? 'line-through' : null, marginLeft: 15 }}
      >
        {todo.task}
      </li>
      <button className={'todo-remove-button'} onClick={handleRemoveClick}>
        <i className="fas fa-times" />
      </button>
    </div>
  )
}

export default Todo
