import React from 'react';

import { getValidContextActions, pauseSim } from './../../public/main/world-utility';

export default class SelectAction extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.SelectAction = this;

    this.hide = this.hide.bind(this);
    this.prompt = this.prompt.bind(this);

    this.state = {
      selectActionVisible: false,
    };
  }

  hide() {
    this.setState({
      selectActionVisible: false,
    });
  }

  prompt(objectToPrompt) {
    World.ReactUI.SelectObject.hide();
    const validActions = getValidContextActions(World.player, objectToPrompt);
    this.setState({
      consume: validActions.consume || null,
      pickUp: validActions.pickUp || null,
      speak: validActions.speak || null,
      attack: validActions.attack || null,
      examine: validActions.examine || null,
      equip: validActions.equip || null,
      unequip: validActions.unequip || null,
      drop: validActions.drop || null,
      activate: validActions.activate || null,
      selectActionVisible: true,
    });
  }

  render() {
    return (
      <div id="select-action-id">
        {this.state.selectActionVisible &&
          <div className="select-menu ui-border">
            <center><p className="strokeme">Select action:</p></center>
            {!!this.state.pickUp && <button className="action-button animate button-green ui-border strokeme" onClick={this.state.pickUp}>Pick Up</button>}
            {!!this.state.consume && <button className="action-button animate button-green ui-border strokeme" onClick={this.state.consume}>Consume</button>}
            {!!this.state.examine && <button className="action-button animate button-green ui-border strokeme" onClick={this.state.examine}>Examine</button>}
            {!!this.state.speak && <button className="action-button animate button-green ui-border strokeme" onClick={this.state.speak}>Speak</button>}
            {!!this.state.attack && <button className="action-button animate button-green ui-border strokeme" onClick={this.state.attack}>Attack</button>}
            {!!this.state.equip && <button className="action-button animate button-green ui-border strokeme" onClick={this.state.equip}>Equip</button>}
            {!!this.state.unequip && <button className="action-button animate button-green ui-border strokeme" onClick={this.state.unequip}>Unequip</button>}
            {!!this.state.drop && <button className="action-button animate button-green ui-border strokeme" onClick={this.state.drop}>Drop</button>}
            {!!this.state.activate && <button className="action-button animate button-green ui-border strokeme" onClick={this.state.activate}>Activate</button>}
          </div>
        }
      </div>
    );
  }
}
