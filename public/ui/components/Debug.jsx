import React from 'react';

import { pauseSim } from './../../main/world-utility';
import { hideMenusAndResume } from './../components/WorldUI.jsx';

export default class Debug extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.Debug = this;

    this.hide = this.hide.bind(this);
    this.prompt = this.prompt.bind(this);

    this.state = {
      debugVisible: false,
    };
  }

  hide() {
    this.setState({
      debugVisible: false,
    });
  }

  prompt(debugObject) {
    World.ReactUI.HudTarget.targetObject = debugObject;
    hideMenusAndResume();
    pauseSim();

    const knownObjectsSet = new Set();
    if (debugObject.Memory) debugObject.Memory.knownObjects.forEach(object => knownObjectsSet.add(`${object.name}, `));
    const knownObjectsArray = Array.from(knownObjectsSet).sort();

    this.setState({
      debugObject,
      task: debugObject.Task,
      knownObjects: knownObjectsArray,
      debugVisible: true,
    });
  }

  render() {
    return (
      <div id="debug-id">
        {this.state.debugVisible &&
          <div className="select-menu ui-border strokeme">
            <center>{this.state.debugObject.name}</center>
            <p>Known objects: {this.state.knownObjects}</p>
          </div>
        }
      </div>
    );
  }
}
