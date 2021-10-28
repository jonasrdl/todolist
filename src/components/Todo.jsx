import React from 'react'

const Todo = ({ todo, toggleComplete, removeTodo }) => {
  const handleRemoveClick = () => {
    removeTodo(todo.id)
  }

  const handleCheckboxClick = () => {
    toggleComplete(todo.id)
  }

  return (
    <div style={{ display: 'flex' }}>
      <input type="checkbox" onClick={handleCheckboxClick} />
      <li style={{ textDecoration: todo.completed ? 'line-through' : null, marginLeft: 15 }}>
        {todo.task}
      </li>
      <button onClick={handleRemoveClick}>X</button>
    </div>
  )
}

export default Todo
