import React from 'react';
import ReactDOM from 'react-dom';

// Required for Redux store setup
import { Provider } from 'react-redux'
import configureStore from './store';

import './index.css';
import App from './App2';
import {register} from './serviceWorker';

const Root = () => (
  <Provider store={configureStore()}>
    <App />
  </Provider>
);

const root = document.getElementById('root');

ReactDOM.render(<Root />, root);

register();
