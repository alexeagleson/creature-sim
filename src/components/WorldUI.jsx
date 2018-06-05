import React from 'react';
import Header from './Header.jsx';
import Hud from './Hud.jsx';

export default class WorldUI extends React.Component {
  state = {
    condition: World.player.Destructible.condition,
    stamina: World.player.Living.stamina,
  };

  // componentDidMount = () => {
  //   this.updateState();
  // }

  updateState = () => {
     this.setState({
      condition: 50,
      stamina: 50,
     })
   }

  render = () => (
    <div>
      <Header subtitle={ 'MoonWhale Engine' } />
      <div id="canvas-wrapper-id" className="canvas-wrapper">
        <div className="ui-wrapper top-left">
          <Hud condition={this.state.condition} stamina={this.state.stamina} />
          <button onClick={this.updateState}>hellooooo</button>
        </div>
      </div>
    </div>
  );
}
