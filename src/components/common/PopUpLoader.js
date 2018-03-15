import React, { Component } from 'react';
import Loader from 'halogen/FadeLoader';

import '../../styles/PopUpLoader.scss';


class PopUpLoader extends Component {

    constructor(props){
        super(props);
    }
    closeProp() {
        this.props.closePopUp();
    }

    render() {
        return (
            <section className="full-container" >
                <div className="popup-body">
                    <span className="text-container">{this.props.title}</span>
                    <div className="loader-container">
                      <Loader className="loader" color="green" size="20px" margin="0px"/>
                    </div>
                </div>
            </section>
        );
    }
};


export default PopUpLoader;
