import React from 'react';

import ProgressBar from './subcomponents/Bar.jsx';

const Hud = props => (
  <div>
    <p>{props.name}</p>
    <ProgressBar name="Condition:" value={props.condition} percentage={props.condition <= 100 ? props.condition : 100} barClass="red" />
    <ProgressBar name="Stamina:" value={props.stamina} percentage={props.stamina <= 100 ? props.stamina : 100} barClass="green" />
    <ProgressBar name="Hunger:" value={props.hunger} percentage={props.hunger <= 100 ? props.hunger : 100} barClass="blue" />
    <ProgressBar name="Thirst:" value={props.thirst} percentage={props.thirst <= 100 ? props.thirst : 100} barClass="blue" />
    <ProgressBar name="Social:" value={props.social} percentage={props.social <= 100 ? props.social : 100} barClass="blue" />
    <p>Temperature: {props.temperature}C</p>
    <p>Equipped: {props.equipped}</p>
  </div>
);

Hud.defaultProps = {
  title: 'Hud',
};

export default Hud;
