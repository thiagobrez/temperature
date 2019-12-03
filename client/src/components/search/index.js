import React, {PureComponent} from 'react'
import './styles.css'

export default class Search extends PureComponent {
  
  formatTimezone = timezone => {
    return new Date(timezone).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  render() {
    
    const {
      expression,
      created_at,
      temperature,
      formatted_address,
    } = this.props;
    
    return (
      <div className="card-wrapper">
        <div className="created-at">
          <span className="created-at-text">
            "{expression}" - {this.formatTimezone(created_at)}
          </span>
        </div>
        <div className="card">
          <div className="card-temperature">
            <span className="card-temperature-text">
              {temperature}° F
            </span>
          </div>
          <div className="card-separator"/>
          <div className="card-address">
            <div className="card-formatted-address">
              <span className="card-formatted-address-text">
                {formatted_address}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
    
  }
}
