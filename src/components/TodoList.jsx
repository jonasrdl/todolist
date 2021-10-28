import React from 'react'
import Todo from './Todo'

const TodoList = ({ todos, toggleComplete, removeTodo }) => {
  return (
    <ul>
      {todos.map((todo) => (
        <Todo todo={todo} key={todo.id} toggleComplete={toggleComplete} removeTodo={removeTodo} />
      ))}
    </ul>
  )
}

export default TodoList
