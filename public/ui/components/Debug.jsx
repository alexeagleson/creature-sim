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
    const tasks = debugObject.DecisionAI.taskQueue.filter(task => task.taskType !== 'path').map(task => <p key={task.uniqueID}>{`${task.taskType} (${task.target.name}) ${task.priorityVsDistance}`}</p>);
    tasks.sort((a, b) => a.priorityVsDistance - b.priorityVsDistance);
    this.setState({
      debugObject,
      tasks,
      debugVisible: true,
      biggestPriority: debugObject.DecisionAI.OverallPlan.biggestPriority,
    });
  }

  render() {
    return (
      <div id="debug-id">
        {this.state.debugVisible &&
          <div className="select-menu ui-border strokeme">
            <center>{this.state.debugObject.name}</center>
            {this.state.tasks}
            {this.state.biggestPriority}
          </div>
        }
      </div>
    );
  }
}
