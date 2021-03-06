import React , {Component} from 'react';
import ReactDOM from 'react-dom';
import { Route, IndexRoute, browserHistory, Link } from 'react-router';

import App from './components/common/App';
import NotFound from './components/common/NotFound';
import Store from './store';
import Home from './components/Home';
import Greeting from './components/common/Greeting';

import DatasetPage from './components/Images/DatasetPage';
import ImageWithRelateds from './components/Images/ImageWithRelateds';

import { options_NavBar } from './customize.js';
import { getQimList, resetQimList, resetErrorMessage } from './actions/index';

export default (
    <Route path="/" components={App} options={options_NavBar} history={browserHistory}>
        <IndexRoute components={Greeting}/>
        <Route path="/home" component={Home} onEnter={()=>{
            Store.dispatch(resetErrorMessage());
        }} />
        <Route path="images" >
          {options_NavBar.map((opt,i)=>{
            return(<Route key={`key-router-${i}`} path={opt.name.toLowerCase()} component={DatasetPage} onEnter={()=>{
                  Store.dispatch(resetQimList());
                  Store.dispatch(getQimList(opt.name.toLowerCase()));
                  Store.dispatch(resetErrorMessage());
               }} />);
          })}
          <Route path=":id" component={ImageWithRelateds}  />
        </Route>
        <Route path="*" component={NotFound} />
    </Route>
);
