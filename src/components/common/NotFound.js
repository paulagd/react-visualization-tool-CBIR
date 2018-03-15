import React, { Component } from 'react';

import '../../styles/not-found.scss';

  class NotFound extends Component {

      constructor(props){
          super(props);
      }

      render(){
          return (
              <div className="content">
                <div className="alert alert-danger">
                  <strong>Code 404</strong> {this.props.ErrorMsg}
                </div>
              </div>
          );
      }
  }

  export default NotFound;
