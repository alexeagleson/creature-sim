import React from 'react';

import ProgressBar from './subcomponents/Bar.jsx';

const Hud = props => (
  <div>
    <ProgressBar name="Condition:" value={props.condition} percentage={props.condition <= 100 ? props.condition : 100} barClass="condition" />
    <ProgressBar name="Stamina:" value={props.stamina} percentage={props.stamina <= 100 ? props.stamina : 100} barClass="stamina" />
  </div>
);

Hud.defaultProps = {
  title: 'Hud',
};

export default Hud;
