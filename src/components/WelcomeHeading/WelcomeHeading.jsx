import React from 'react'
import './WelcomeHeading.css'

const WelcomeHeading = () => {
  return (
    <>
      <h2 className={'welcome-heading'}>
        Hey <span className="welcome-name">[USERNAME]!</span>
      </h2>
      <span className={'welcome-heading-text'}>
        You currently have <span className="marked-list-text">0 lists</span> with a total of{' '}
        <span className="marked-todo-text">0 todos.</span>
      </span>
    </>
  )
}

export default WelcomeHeading
