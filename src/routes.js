import React from 'react';
import ReactDOM from 'react-dom';
import { Route, IndexRoute, browserHistory, Link } from 'react-router';

import App from './common/App';
import NotFound from './common/NotFound';
import Store from './store';
import Home from './components/Home';

import DatasetPage from './components/Images/DatasetPage';
// import ImageWithRelateds from './components/Images/ImageWithRelateds';

import { options_NavBar, oxford, paris, instre } from './customize.js';
import { getQimList, resetQimList} from './actions/index';

const Test = ()=>{
  return(<h2 style={{"paddingLeft":"35%"}} >W E L C O M E !</h2>)
};

export default (
    <Route path="/" components={App} options={options_NavBar} history={browserHistory}>
        <IndexRoute components={Test}/>
        <Route path="/home" component={Home} />
        <Route path="images" >
          <Route path="oxford" component={DatasetPage} url_imgs={oxford.url_imgs}
            onEnter={()=>{
                Store.dispatch(resetQimList());
                Store.dispatch(getQimList('oxford'));
             }} />
          <Route path="paris" component={DatasetPage} url_imgs={paris.url_imgs}
            onEnter={()=>{
                Store.dispatch(resetQimList());
                Store.dispatch(getQimList('paris'));
             }} />
          {/* <Route path="instre" component={DatasetPage} url_imgs={instre.url_imgs} /> */}
          {/* <Route path=":id" component={ImageWithRelateds} /> */}
        </Route>

        <Route path="*" component={NotFound} />
    </Route>
);
