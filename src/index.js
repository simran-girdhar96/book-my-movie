import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Controller from '../src/screens/controller/Controller';

ReactDOM.render(<Controller />, document.getElementById('root'));
registerServiceWorker();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
