import React from 'react';

import { uniqueNumber } from './../../public/main/general-utility';

export default class EventLog extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.EventLog = this;

    this.updateState = this.updateState.bind(this);
    this.toggle = this.toggle.bind(this);

    this.state = {
      eventLogVisible: false,
    };
  }

  componentWillMount() {
    this.updateState();
  }

  updateState() {
    this.setState({
      listOfEvents: World.allEvents.map(event => <div key={uniqueNumber()}>{event.text}</div>).reverse(),
    });
  }

  toggle() {
    this.setState(prevState => ({ eventLogVisible: !prevState.eventLogVisible }));
  }

  render() {
    return (
      this.state.listOfEvents
    );
  }
}
