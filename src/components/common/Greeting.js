import React, { Component } from 'react';

import '../../styles/app.scss';

  class Greeting extends Component {

      constructor(props){
          super(props);
      }

      render(){
          return (
              <div className="container content greeting">
                <h2>W E L C O M E !</h2>
                <div>
                  <p className="text-justify paragraf">
                    The aim of this user interface is to provide a tool in order
                    to visualize the results of a content-based image retrieval
                    (CBIR) system and be able to, eventually, improve them by
                    capturing the user's relevance feedback.
                  </p>
                  <p className="text-justify paragraf">
                    The system has been built in order to make it easy for the users
                     to plug in their own image retrieval system. Also the code has been
                    adapted with this purpose and thus, some elements as the datasets
                    or some other functionalities can be customized following the steps given
                    in the <a id="mylink" href="../../../documentation/index.html">
                    documentation</a>.</p>
                  <p className="text-justify paragraf">The main functionalities offered in this system are:</p>
                  <div className="panel-group paragraf" id="accordion">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title" style={{border: 0}}>
                        Explorer mode
                      </h4>
                    </div>
                    <div className="panel-collapse collapse in">
                      <div className="panel-body">The user can explore the dataset through
                        <strong>clickable</strong> images which become new queries in order
                         to display its ranking.</div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">
                        Annotation mode
                      </h4>
                    </div>
                    <div  className="panel-collapse collapse">
                      <div className="panel-body">The user can annotate the images which are
                      similar and the ones which are not, so that a complete feedback is given
                      to the system. After some computations in the current image retrieval
                      engine system, the new and updated ranking can be resent and updated.</div>
                    </div>
                  </div>
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <h4 className="panel-title">
                        Query expansion mode
                      </h4>
                    </div>
                    <div className="panel-collapse collapse">
                      <div className="panel-body">  The user can use this mode to experiment with different queries
                        and see how the accuracy of the system and of each singular image improves or not
                        depending on which images are selected to compute the <strong>multi query</strong>.</div>
                    </div>
                  </div>
                </div>
               </div>
              </div>
          );
      }
  }

  export default Greeting;
