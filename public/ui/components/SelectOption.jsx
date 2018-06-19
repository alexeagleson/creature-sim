import React from 'react';
import { getDialogueByID } from './../../content/content-Dialogue';
import { uniqueNumber } from './../../main/general-utility';
import { pauseSim } from './../../main/world-utility';
import { hideMenusAndResume } from './WorldUI.jsx';

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
    pauseSim();
    if (responseIDs.length === 0) responseIDs = ['286e0c082433963be53c54e50101eb41'];
    this.setState({
      speakingObject,
      dialogueID,
      optionButtons: responseIDs.map(responseID => <button key={uniqueNumber()} onClick={() => { 
        hideMenusAndResume();
        World.player.Social.speak(this.state.speakingObject, responseID); 
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
