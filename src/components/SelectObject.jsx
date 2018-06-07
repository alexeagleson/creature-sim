import React from 'react';

export default class SelectObject extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.SelectObject = this;

    this.prompt = this.prompt.bind(this);

    this.objectsToSelect = [];
    this.state = {
      selectObjectVisible: true,
    };
  }

  prompt(objectsToPrompt) {
    this.setState({
      objectButtons: objectsToPrompt.map(object => <button key={object.uniqueID} className="action-button animate button-yellow">{object.name}</button>),
      selectObjectVisible: true,
    });
  }

  render() {
    return (
      <div>
        {this.state.selectObjectVisible && this.state.objectButtons}
      </div>
    );
  }
}
