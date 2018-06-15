import React from 'react';
import { getDialogueByID } from './../../public/content/content-Dialogue';
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

  prompt(speakingObject, dialogueID, responseIDs) {
    hideMenusAndResume();
    pauseSim();
    if (responseIDs.length === 0) responseIDs = ['286e0c082433963be53c54e50101eb41'];
    this.setState({
      speakingObject,
      dialogueID,
      optionButtons: responseIDs.map(responseID => <button key={uniqueNumber()} onClick={() => { 
        World.player.Social.speak(this.state.speakingObject, responseID); 
        hideMenusAndResume();
      }} className="action-button animate button-blue ui-border strokeme larger-text">{getDialogueByID(responseID, speakingObject)}</button>),
      selectOptionVisible: true,
    });
  }

  render() {
    return (
      <div id="select-option-id">
        {this.state.selectOptionVisible &&
          <div className="select-menu ui-border">
            <i><center><p className="strokeme larger-text">{`${this.state.speakingObject.name}: ${getDialogueByID(this.state.dialogueID, World.player)}`}</p></center></i>
            {this.state.optionButtons}
          </div>
        }
      </div>
    );
  }
}
