import React from 'react';
import ProgressBar from './Bar.jsx';

import { millisecondsToHHMMSS } from './../../public/constructors/Time';

export default class Hud extends React.Component {
  constructor(props) {
    super(props);

    this.updateState = this.updateState.bind(this);

    this.targetObject = props.targetObject;

    if (this.targetObject === World.player) {
      World.ReactUI.HudPlayer = this;
    } else {
      World.ReactUI.HudTarget = this;
    }

    this.state = {};
  }

  componentWillMount() {
    this.updateState();
  }

  updateState() {
    if (!this.targetObject) { return; }
    this.setState({
      name: this.targetObject.name,
      condition: this.targetObject.Destructible ? Math.round(this.targetObject.Destructible.condition) : null,
      stamina: this.targetObject.Living ? Math.round(this.targetObject.Living.stamina) : null,
      hunger: this.targetObject.Consumer ? Math.round(this.targetObject.Consumer.hunger) : null,
      thirst: this.targetObject.Consumer ? Math.round(this.targetObject.Consumer.thirst) : null,
      social: this.targetObject.Social ? Math.round(this.targetObject.Social.socialLevel) : null,
      temperature: this.targetObject.Temperature ? Math.round(this.targetObject.Temperature.temp) : null,
      environmentTemp: this.targetObject.Temperature && this.targetObject.WorldMap ? Math.round(this.targetObject.WorldMap.mapTemp) : null,
      equipped: this.targetObject.Equipper ? this.targetObject.Equipper.currentEquipment : null,
      time: World.Time.millisecondsSinceDayStart ? millisecondsToHHMMSS(World.Time.millisecondsSinceDayStart()) : null,
    });
  }

  render() {
    return (
      <div>
        <p>{this.state.name}</p>
        {Number.isInteger(this.state.condition) && <ProgressBar name="Condition:" value={this.state.condition} percentage={this.state.condition <= 100 ? this.state.condition : 100} barClass="red" />}
        {Number.isInteger(this.state.stamina) && <ProgressBar name="Stamina:" value={this.state.stamina} percentage={this.state.stamina <= 100 ? this.state.stamina : 100} barClass="green" />}
        {Number.isInteger(this.state.hunger) && <ProgressBar name="Hunger:" value={this.state.hunger} percentage={this.state.hunger <= 100 ? this.state.hunger : 100} barClass="blue" />}
        {Number.isInteger(this.state.thirst) && <ProgressBar name="Thirst:" value={this.state.thirst} percentage={this.state.thirst <= 100 ? this.state.thirst : 100} barClass="blue" />}
        {Number.isInteger(this.state.social) && <ProgressBar name="Social:" value={this.state.social} percentage={this.state.social <= 100 ? this.state.social : 100} barClass="blue" />}
        {this.state.equipped && <p>Equipped: {this.state.equipped}</p>}
        {Number.isInteger(this.state.temperature) && <ProgressBar name="My Temp(C):" value={this.state.temperature} percentage="100" barClass={
          this.state.temperature > 35
            ? 'red'
            : this.state.temperature < 5
              ? 'blue'
              : 'green'
          }
        />}
        {Number.isInteger(this.state.environmentTemp) && <ProgressBar name="Environment Temp(C):" value={this.state.environmentTemp} percentage="100" barClass={
          this.state.environmentTemp > 35
            ? 'red'
            : this.state.environmentTemp < 5
              ? 'blue'
              : 'green'
          }
        />}
        {this.targetObject === World.player && <p>Time: {this.state.time}</p>}
      </div>
    );
  }
}
