import React, {PureComponent} from 'react'
import './styles.css'

export default class TextInput extends PureComponent {
  
  render() {
    
    const {type, onChange, placeholder, value} = this.props;
    
    return (
      <div className="text-input-wrapper">
        <input className="text-input"
               type={type}
               onChange={onChange}
               placeholder={placeholder}
               value={value}
        />
      </div>
    )
    
  }
}
