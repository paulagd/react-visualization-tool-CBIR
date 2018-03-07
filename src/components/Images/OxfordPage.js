import { ReactRpg } from 'react-rpg';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { browserHistory } from 'react-router';

import { getQimListOxford, resetRanking } from '../../actions/index';

// import qimList from '../../../qimList.json'; //28 RANDOM IMAGENES

import '../styles/main-page.scss';

const ItemsPerPage = 28;

class OxfordPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      url_imgs: 'http://localhost:5000/getImageOxfordById/',
      activePage: 1,
      n_pages: 0,
      qimList: this.props.qimList ? this.props.qimList : []

    };
  }

  componentWillMount() {
    this.props.getQimListOxford();
  }

  componentWillReceiveProps(newProps) {
      if((JSON.stringify(this.props.qimList) !== JSON.stringify(newProps.qimList))) {
          this.setState({
              qimList: newProps.qimList && newProps.qimList.length ? newProps.qimList : [],
              n_pages:  Math.ceil(newProps.qimList.length / ItemsPerPage),
          });
      }
  }

  splitArray(arr, n) {
    //split the main array into diferents (diferents pages)
    let res = [];
    while (arr.length) {
      res.push(arr.splice(0, n));
    }

    //fill array with 28 positions
    res.map((el, i)=>{
      if(i == (res.length-1)) {
        let aux = [];
        for(var i=0; i < (ItemsPerPage - el.length)%4; i++){
          aux.push({url:""});
        }
        res[res.length-1]= el.concat(aux);
      }
    })
    return res;
  }

  displayImages() {
    //display the 55 principal images in pages containing 28 images
    let array = [];
    this.state.qimList.map((obj, j)=> {
      array.push({
          url: this.state.url_imgs + obj.image,
          clickHandler: (path) => {
              this.props.resetRanking();
              // when clicked, it has to show the related images
              browserHistory.push({
                pathname: `/images/${obj.image.replace(/.jpg$/,"")}`,
                query: { dataset: 'oxford' }
              });
            },
        });
    });
    array = this.splitArray(array, ItemsPerPage);
    return array;
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  renderContent() {
    const array = this.displayImages();


    return (
      <div className = "dataset-content" >
        <ReactRpg imagesArray={array[this.state.activePage - 1]} columns={[2, 4]} padding={10} />
        <Pagination
         activePage={this.state.activePage}
         itemsCountPerPage={ItemsPerPage}
         totalItemsCount={this.state.qimList.length}
         pageRangeDisplayed={5}
         onChange={this.handlePageChange.bind(this)}
        />
     </div>
    );
  }

  render() {
    return (
      <div className="content-main">
        <h3>
          TEST IMAGES IN OXFORD DATASET
        </h3>
          {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { qimList: state.reducerImages.qimList_oxford };
}

export default connect(mapStateToProps, { getQimListOxford, resetRanking })(OxfordPage);