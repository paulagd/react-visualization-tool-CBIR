import React, { Component } from 'react';

import '../../styles/app.scss';

  class Greeting extends Component {

      constructor(props){
          super(props);
      }

      render(){
          return (
              <div className="content greeting">
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
                  <div className="paragraf">
                    <button type="button" className="btn btn-info" data-toggle="collapse"
                       data-target="#demo">Explorer mode</button>
                    <div id="demo" className="collapse text-justify">
                      The user can explore the dataset through `clickable` images which become new
                      queries in order to display its ranking.
                    </div>
                    <button type="button" className="btn btn-info" data-toggle="collapse"
                       data-target="#demo">Annotation mode</button>
                    <div id="demo" className="collapse text-justify">
                       The user can annotate the images which are similar and the ones which are
                       not, so that a complete feedback is given to the system. After some computations
                       in the current image retrieval engine system, the new and updated ranking
                       can be resent and updated.
                    </div>
                    <button type="button" className="btn btn-info" data-toggle="collapse"
                       data-target="#demo">Query expansion mode</button>
                    <div id="demo" className="collapse text-justify">
                      The user can use this mode to experiment with different queries and see how
                      the accuracy of the system and of each singular image improves or not
                      depending on which images are selected to compute the `multi query`.
                    </div>
                  </div>

                </div>
              </div>
          );
      }
  }

  export default Greeting;
