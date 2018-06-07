import React from 'react';
import Hud from './Hud.jsx';
import SelectAction from './SelectAction.jsx';
import SelectObject from './SelectObject.jsx';
import EventLog from './EventLog.jsx';

const WorldUI = props => (
  <div>
    <div id="canvas-wrapper-id" className="canvas-wrapper ui-border">
    </div>
    <div className="ui-wrapper ui-border ui-left strokeme">
      <Hud />
    </div>
    <div className="ui-wrapper ui-border ui-right strokeme no-select">
      <SelectAction />
    </div>
    <div className="ui-wrapper ui-border ui-top strokeme no-select">
      <SelectObject />
    </div>
    <div className="ui-wrapper ui-border ui-bottom strokeme no-select">
      <EventLog />
    </div>
  </div>
);

export default WorldUI;
