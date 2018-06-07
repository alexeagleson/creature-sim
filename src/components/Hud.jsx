import React from 'react';
import ProgressBar from './subcomponents/Bar.jsx';

export default class Hud extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.Hud = this;

    this.updateState = this.updateState.bind(this);
    this.toggle = this.toggle.bind(this);

    this.targetObject = World.player;
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

  toggle() {
    this.setState((prevState) => {
      return { hudVisible: !prevState.hudVisible };
    });
  }

  render() {
    return (
      <div>
        <p>{this.state.name}</p>
        <ProgressBar name="Condition:" value={this.state.condition} percentage={this.state.condition <= 100 ? this.state.condition : 100} barClass="red" />
        <ProgressBar name="Stamina:" value={this.state.stamina} percentage={this.state.stamina <= 100 ? this.state.stamina : 100} barClass="green" />
        <ProgressBar name="Hunger:" value={this.state.hunger} percentage={this.state.hunger <= 100 ? this.state.hunger : 100} barClass="blue" />
        <ProgressBar name="Thirst:" value={this.state.thirst} percentage={this.state.thirst <= 100 ? this.state.thirst : 100} barClass="blue" />
        <ProgressBar name="Social:" value={this.state.social} percentage={this.state.social <= 100 ? this.state.social : 100} barClass="blue" />
        <p>Temperature: {this.state.temperature}C</p>
        <p>Equipped: {this.state.equipped}</p>
      </div>
    );
  }
}
