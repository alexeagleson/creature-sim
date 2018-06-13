import React from 'react';
import Hud from './Hud.jsx';
import Logo from './Logo.jsx';
import SelectAction from './SelectAction.jsx';
import SelectObject from './SelectObject.jsx';
import SelectOption from './SelectOption.jsx';
import EventLog from './EventLog.jsx';

import { resumeSim } from './../../public/main/world-utility';

export default class WorldUI extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.WorldUI = this;
    this.state = {};
  }

  handleClearSelectedOption() {
    this.setState(() => ({ selectedOption: undefined }));
  }

  render() {
    return (
      <div className="main-wrapper no-select">
        <header className="logo ui-border">
          <Logo />
        </header>
        <div id="canvas-wrapper-id" className="canvas-wrapper ui-border">
          <SelectAction />
          <SelectObject />
          <SelectOption />
        </div>
        <aside className="hud hud-player ui-border strokeme">
          <Hud targetObject={World.player} />
        </aside>
        <aside className="hud hud-target ui-border strokeme">
          <Hud targetObject={null} />
        </aside>
        <footer className="event-log strokeme ui-border">
          <EventLog />
        </footer>
      </div>
    );
  }
}

export function hideMenusAndResume() {
  World.ReactUI.SelectObject.hide();
  World.ReactUI.SelectAction.hide();
  World.ReactUI.SelectOption.hide();
  resumeSim();
}
