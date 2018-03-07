import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { browserHistory } from 'react-router';

import { ReactRpg } from 'react-rpg';
import Gallery from 'react-grid-gallery';

import { getQimList, resetRanking } from '../../actions/index';

import '../../styles/main-page.scss';

const ItemsPerPage = 28;

class DatasetPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      images: [],
      url_imgs: this.props.route.url_imgs,
      title: this.props.route.path,
      activePage: 1,
      n_pages: 0,
      qimList: this.props.qimList ? this.props.qimList : []
    };
  }

  componentWillMount() { //componentDidMount
    this.props.getQimList(this.props.route.path);
  }

  componentWillReceiveProps(newProps) {
      if((JSON.stringify(this.props.qimList) !== JSON.stringify(newProps.qimList)) ||
          (JSON.stringify(this.props.route.path) !== JSON.stringify(newProps.route.path)) ||
          (JSON.stringify(this.props.route.url_imgs) !== JSON.stringify(newProps.route.url_imgs))) {
          this.setState({
              qimList: newProps.qimList && newProps.qimList.length ? newProps.qimList : [],
              n_pages:  newProps.qimList ? Math.ceil(newProps.qimList.length / ItemsPerPage) : null,
              url_imgs: newProps.route.url_imgs,
              title: newProps.route.path,
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
                query: { dataset: this.state.title }  //TODO
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
        {/* <Gallery
          images={array[this.state.activePage - 1]}
          // onSelectImage = {this.onSelectImage.bind(this,array)}
          showLightboxThumbnails = {false}
          enableLightbox	= {false}
          // onClickThumbnail = {this.onSelectImage.bind(this,array)}
          rowHeight = {260}
          margin = {10}
        /> */}
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
          TEST IMAGES IN {this.state.title.toUpperCase()} DATASET
        </h3>
          {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  // TODO: REDUCER??
  return { qimList: state.reducerImages.qimList_dataset };
}

export default connect(mapStateToProps, { getQimList, resetRanking})(DatasetPage);
