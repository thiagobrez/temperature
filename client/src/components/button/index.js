import React, {PureComponent} from 'react'
import './styles.css'

export default class Button extends PureComponent {
  
  render() {
    
    const {type, disabled, onClick, children} = this.props;
    
    let className = `button `;
    if(disabled) className += 'disabled';
    
    return (
      <div className="button-wrapper">
        <button type={type}
                onClick={onClick}
                className={className}
                disabled={disabled}
        >
          {children}
        </button>
      </div>
    )
    
  }
}
