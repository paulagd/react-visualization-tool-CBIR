import React from 'react';
import ReactDOM from 'react-dom';
import { Route, IndexRoute, browserHistory, Link } from 'react-router';

import App from './common/App';
import NotFound from './common/NotFound';
// import OxfordPage from './components/Images/OxfordPage';
// import ParisPage from './components/Images/ParisPage';
// import InstrePage from './components/Images/InstrePage';
// import ImageWithRelateds from './components/Images/ImageWithRelateds';
import Welcome from './components/Welcome';
import Car from './car/car_component';
import Home_car from './car/home_component';

import { options_NavBar } from './customize.js'

const Test = ()=>{
  return(<h2 style={{"paddingLeft":"35%"}} >W E L C O M E !</h2>)
};

export default (
    <Route path="/" components={App} options={options_NavBar} history={browserHistory}>
        <IndexRoute components={Test}/>
        <Route path="/home" component={Welcome} />
        <Route path="images" >
          <Route path="oxford" component={Car}/>
          <Route path="paris" component={Home_car}/>
        </Route>
        {/* <Route path="images" >
            <Route path="oxford" component={OxfordPage} />
            <Route path="paris" component={ParisPage} />
            <Route path="instre" component={InstrePage} />
            <Route path=":id" component={ImageWithRelateds} />
        </Route> */}
        <Route path="*" component={NotFound} />
    </Route>
);
