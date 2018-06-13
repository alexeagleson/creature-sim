import React from 'react';

import { uniqueNumber } from './../../public/main/general-utility';
import { pauseSim } from './../../public/main/world-utility';

import { hideMenusAndResume } from './../components/WorldUI.jsx';

export default class SelectOption extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.SelectOption = this;

    this.hide = this.hide.bind(this);
    this.prompt = this.prompt.bind(this);

    this.state = {
      selectOptionVisible: false,
    };
  }

  hide() {
    this.setState({
      selectOptionVisible: false,
    });
  }

  prompt(optionsToPrompt) {
    hideMenusAndResume();
    pauseSim();
    this.setState({
      optionButtons: optionsToPrompt.map(option => <button key={uniqueNumber()} onClick={alert} className="action-button animate button-blue ui-border strokeme larger-text">{option}</button>),
      selectOptionVisible: true,
    });
  }

  render() {
    return (
      <div id="select-option-id">
        {this.state.selectOptionVisible &&
          <div className="select-menu ui-border">
            <i><center><p className="strokeme larger-text">The President is also considered the leader of our country. The judicial branch interprets the laws. This branch consists of the courts and the trials held in them. Here a judge and jury determine from evidence presented by lawyers whether someone is guilty of breaking a law</p></center></i>
            {this.state.optionButtons}
          </div>
        }
      </div>
    );
  }
}
