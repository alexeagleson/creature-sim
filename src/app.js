import React from 'react';
import ReactDOM from 'react-dom';

import startApp from './../public/main/app';

import IndecisionApp from './components/IndecisionApp';

import './styles/styles.scss';

window.onload = () => {
  startApp();
};

ReactDOM.render(<IndecisionApp />, document.getElementById('app'));
