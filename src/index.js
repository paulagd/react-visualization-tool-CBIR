import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import Store from './store';
import routes from './routes';

ReactDOM.render(
    <Provider store={Store}>
      <Router history={browserHistory} routes={routes} />
    </Provider>, document.querySelector('#main-container')
);
