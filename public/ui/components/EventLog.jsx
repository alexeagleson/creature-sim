import React from 'react';

export default class EventLog extends React.Component {
  constructor(props) {
    super(props);
    World.ReactUI.EventLog = this;
    this.updateState = this.updateState.bind(this);
    this.state = {};
  }

  componentWillMount() {
    this.updateState();
  }

  updateState() {
    this.setState({
      listOfEvents: World.allEvents.map(event => <div key={event.uniqueID} className={`colour-${event.colour}`}>{event.text}</div>).reverse(),
    });
  }

  render() {
    return (
      this.state.listOfEvents
    );
  }
}
