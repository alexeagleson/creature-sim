import React from 'react';

class ProgressBar extends React.Component {
  render() {
    return (
      <div className={`bar-container ${this.props.barClass}` }>
        <div>{ this.props.name }</div>
        <div className="bar-indicator-container">
          <div className="bar-indicator">{ this.props.value }</div>
          <div className="bar" style={{ transition: '0.5s width ease-in', width: `${this.props.percentage}%`}}></div>
        </div>
      </div>
    );
  }
}

export default ProgressBar;
