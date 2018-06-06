import React from 'react';
import ReactDOM from 'react-dom';
import startApp from './../public/main/app';

import WorldUI from './components/WorldUI.jsx';

import 'normalize.css/normalize.css';
import './styles/styles.scss';

window.onload = () => {
  startApp();
};

export default function buildUI() { ReactDOM.render(<WorldUI targetObject={World.player} />, document.getElementById('app')); }
