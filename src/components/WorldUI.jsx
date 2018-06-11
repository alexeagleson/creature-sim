import React from 'react';
import Hud from './Hud.jsx';
import Logo from './Logo.jsx';
import SelectAction from './SelectAction.jsx';
import SelectObject from './SelectObject.jsx';
import EventLog from './EventLog.jsx';

import { resumeSim } from './../../public/main/world-utility';

const WorldUI = props => (
  <div className="main-wrapper no-select">
    <header className="logo ui-border">
      <Logo />
    </header>
    <div id="canvas-wrapper-id" className="canvas-wrapper ui-border">
      <SelectAction />
      <SelectObject />
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

export default WorldUI;

export function hideMenusAndResume() {
  World.ReactUI.SelectObject.hide();
  World.ReactUI.SelectAction.hide();
  resumeSim();
}
