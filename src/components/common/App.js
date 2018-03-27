import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';

import '../../styles/app.scss';

class App extends Component {

  //NOTE: props --> options atribute that will be with the shape of:
 //  ** THE FIRST OPTION HOME MUST BE ALSO THERE

  // options = [{
  //     name: 'HOME',
  //     link: '/home'
  //   },
  //   {
  //     name: 'OXFORD',
  //     link: '/images/oxford',
  //   }, {
  //     name: 'PARIS',
  //     link: '/images/paris',
  //   },{
  //     name: 'INSTRE',
  //     link: '/images/instre',
  //   }];

  constructor(props){
      super(props);
      this.options = this.props.route.data;
  }

  renderContent(){
    if(this.props.route.options) {
      return(<div className="navbar-header nav">
           <a className="navbar-brand" id="title" href="/" >
              CBIR SVISUALIZATION TOOL
          </a>
          <li className="nav-item" key={`key-9999`}>
            <IndexLink to='/home' className="nav-link active" href="#">HOME</IndexLink>
          </li>
          {this.props.route.options.map((opt,i)=>{
            return this.returnOptions(opt,i);
          })}
         </div>
       );
    }
  }

  checkLoadingState(e){
      // console.log(' esta loading?? ',this.props.isLoading);

    if (this.props.isLoading)
      e.preventDefault()
    else
      this.props.isLoadingList();
  }

  returnOptions(opt,i){

    return(<li className="nav-item" key={`key-${i}`} >
      <IndexLink to={opt.link} className="nav-link active"
        // onClick = {this.checkLoadingState.bind(this)}
        href="#">{opt.name}</IndexLink>
    </li>);
  }

  render() {
    // console.log('esta loading?? ',this.props.isLoading);

    return (
      <div className="main-app-page">
        <nav className="navbar navbar-default color-navbar fixed">
          <div className="container-fluid">
            {this.renderContent()}
          </div>
        </nav>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
//
// export function mapStateToProps(state){
//     return {
//         isLoading: state.reducerRelatedImages.isLoadingList
//     };
// }
//
// export default connect(mapStateToProps, { isLoadingList })(App);

export default App;
