import React from 'react';
import Header from './Header.jsx';
import Hud from './Hud.jsx';

export default class WorldUI extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.Hud = this;

    this.updateState = this.updateState.bind(this);
    this.toggleHud = this.toggleHud.bind(this);

    this.targetObject = props.targetObject;
    this.state = {
      hudVisible: false,
    };
  }

  componentWillMount() {
    this.updateState();
  }

  updateState() {
    this.setState({
      name: this.targetObject.name,
      condition: Math.round(this.targetObject.Destructible.condition),
      stamina: Math.round(this.targetObject.Living.stamina),
      hunger: Math.round(this.targetObject.Consumer.hunger),
      thirst: Math.round(this.targetObject.Consumer.thirst),
      social: Math.round(this.targetObject.Social.socialLevel),
      temperature: Math.round(this.targetObject.Temperature.temp),
      equipped: this.targetObject.Equipper.currentEquipment,
    });
  }

  toggleHud() {
    this.setState((prevState) => {
      return { hudVisible: !prevState.hudVisible };
    });
  }

  render() {
    return (
      <div>
        <Header subtitle="MoonWhale Engine" />
        <div id="canvas-wrapper-id" className="canvas-wrapper">
          {this.state.hudVisible &&
            <div className="ui-wrapper top-left strokeme">
              <Hud
                name={this.state.name}
                condition={this.state.condition}
                stamina={this.state.stamina}
                hunger={this.state.hunger}
                thirst={this.state.thirst}
                social={this.state.social}
                temperature={this.state.temperature}
                equipped={this.state.equipped}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}
