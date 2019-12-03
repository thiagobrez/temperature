import React, {PureComponent} from 'react'
import './styles.css'

export default class Navbar extends PureComponent {
  
  render() {
    
    return (
      <header className="header">
        <span className='header-text'>
          Loadsmart Weather
        </span>
      </header>
    )
    
  }
}
