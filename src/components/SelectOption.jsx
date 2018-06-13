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

  prompt(speakingObject, menuText, optionsToPrompt) {
    hideMenusAndResume();
    pauseSim();
    this.setState({
      speakingObject,
      menuText,
      optionButtons: optionsToPrompt.map(option => <button key={uniqueNumber()} onClick={() => { World.player.Social.speak(this.state.speakingObject, option); hideMenusAndResume(); }} className="action-button animate button-blue ui-border strokeme larger-text">{option}</button>),
      selectOptionVisible: true,
    });
  }

  render() {
    return (
      <div id="select-option-id">
        {this.state.selectOptionVisible &&
          <div className="select-menu ui-border">
            <i><center><p className="strokeme larger-text">{`${this.state.speakingObject.name}: ${this.state.menuText}`}</p></center></i>
            {this.state.optionButtons}
          </div>
        }
      </div>
    );
  }
}
