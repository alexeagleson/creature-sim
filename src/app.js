import React from 'react';
import ReactDOM from 'react-dom';

import startApp from './../public/main/app';

import './styles/styles.scss';

window.onload = () => {
  startApp();
};

class Header extends React.Component {
  render() {
    return <p>This is from header.</p>;
  }
};

class Action extends React.Component {
  render() {
    return (
            <button>What should I poodoo?</button>
    );
  }
};

const jsx = (
  <div>
    <h1>Title</h1>
    <Header />
    <Action />
  </div>
);

const appRoot = document.getElementById('app');

ReactDOM.render(jsx, appRoot);
