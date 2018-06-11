import React from 'react';

import { pauseSim } from './../../public/main/world-utility';

import { hideMenusAndResume } from './../components/WorldUI.jsx';

export default class SelectObject extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.SelectObject = this;

    this.hide = this.hide.bind(this);
    this.prompt = this.prompt.bind(this);

    this.state = {
      selectObjectVisible: false,
    };
  }

  hide() {
    this.setState({
      selectObjectVisible: false,
    });
  }

  prompt(objectsToPrompt) {
    hideMenusAndResume();
    pauseSim();
    this.setState({
      objectButtons: objectsToPrompt.map(object => <button key={object.uniqueID} onClick={object.promptAction} className="action-button animate button-blue ui-border strokeme">{object.name}</button>),
      selectObjectVisible: true,
    });
  }

  render() {
    return (
      <div id="select-object-id">
        {this.state.selectObjectVisible &&
          <div className="select-menu ui-border">
            <p className="strokeme">Select object:</p>
            {this.state.objectButtons}
          </div>
        }
      </div>
    );
  }
}
