import React from 'react';

import { getValidContextActions } from './../../public/main/world-utility';

export default class SelectAction extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.SelectAction = this;

    this.updateState = this.updateState.bind(this);
    this.toggle = this.toggle.bind(this);

    this.validActions = getValidContextActions({}, {});
    this.state = {
      selectActionVisible: true,
    };
  }

  componentWillMount() {
    this.updateState();
  }

  updateState() {
    this.setState({
      consume: this.validActions.consume || null,
      pickUp: this.validActions.pickUp || null,
      speak: this.validActions.speak || null,
      attack: this.validActions.attack || null,
      examine: this.validActions.examine || null,
      equip: this.validActions.equip || null,
      activate: this.validActions.activate || null,
    });
  }

  toggle() {
    this.setState((prevState) => {
      return { selectActionVisible: !prevState.selectActionVisible };
    });
  }

  render() {
    return (
      <div>
        {this.state.selectActionVisible &&
          <div>
            {!!this.state.consume && <button className="action-button animate button-green" onClick={this.state.consume}>Consume</button>}
            {!!this.state.pickUp && <button className="action-button animate button-green" onClick={this.state.pickUp}>Pick Up</button>}
            {!!this.state.speak && <button className="action-button animate button-green" onClick={this.state.speak}>Speak</button>}
            {!!this.state.attack && <button className="action-button animate button-green" onClick={this.state.attack}>Attack</button>}
            {!!this.state.examine && <button className="action-button animate button-green" onClick={this.state.examine}>Examine</button>}
            {!!this.state.equip && <button className="action-button animate button-green" onClick={this.state.equip}>Equip</button>}
            {!!this.state.activate && <button className="action-button animate button-green" onClick={this.state.activate}>Activate</button>}
          </div>
        }
      </div>
    );
  }
}
