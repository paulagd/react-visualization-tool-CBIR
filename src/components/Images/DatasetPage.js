import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { browserHistory } from 'react-router';

import { ReactRpg } from 'react-rpg';
import Gallery from 'react-grid-gallery';

import { getQimList, resetRanking, getImlist } from '../../actions/index';

import { getIdFromPath, getPathfromId } from '../../../utils/index';

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
      qimList: this.props.qimList ? this.props.qimList : [],
      imlist: this.props.imlist ? this.props.imlist: []
    };
  }

  componentWillMount() { //componentDidMount
    this.props.getQimList(this.props.route.path);
    this.props.getImlist('instre');

    // this.props.getIdFromPath('instre','INSTRE-S1/01a_canada_book/035.jpg');
    // this.props.getPathfromId('instre','33');
  }

  componentWillReceiveProps(newProps) {
      if((JSON.stringify(this.props.qimList) !== JSON.stringify(newProps.qimList)) ||
          (JSON.stringify(this.props.route.path) !== JSON.stringify(newProps.route.path)) ||
          (JSON.stringify(this.props.imlist) !== JSON.stringify(newProps.imlist)) ||
          (JSON.stringify(this.props.route.url_imgs) !== JSON.stringify(newProps.route.url_imgs))) {
          this.setState({
              qimList: newProps.qimList && newProps.qimList.length ? newProps.qimList : [],
              imlist: newProps.imlist && newProps.imlist.length ? newProps.imlist: [],
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

    if(this.state.imlist && this.state.imlist.length){
      console.log("¿¿¿¿¿¿¿ imlist no es undefined ??????");
      const id = getIdFromPath('INSTRE-S1/01a_canada_book/002.jpg', this.state.imlist);
      console.log('id',id);
      const path = getPathfromId('3', this.state.imlist);
      console.log('path',path);

    }

    // this.state.qimList.map((obj, j)=> {
    //
    //  // if(obj.image.indexOf("/") != -1){
    // if((this.state.imlist && this.state.imlist.length) &&
    //     obj.image.indexOf("/") != -1 && this.state.imlist){
    //     // this.props.getIdFromPath(this.state.title,obj.image);
    //
    //   }
    //   // console.log("IMLIST", this.state.imlist);
    //   array.push({
    //       url: this.state.url_imgs + obj.image,
    //       clickHandler: (path) => {
    //           this.props.resetRanking();
    //           // when clicked, it has to show the related images
    //           browserHistory.push({
    //             pathname: `/images/${obj.image.replace(/.jpg$/,"")}`,
    //             query: { dataset: this.state.title }
    //           });
    //         },
    //
    //         // url: `${this.state.url_imgs}?path=${obj.image} `,
    //         // clickHandler: (path) => {
    //         //     // when clicked, it has to show the related images
    //         //     this.props.resetRanking();
    //         //     browserHistory.push({
    //         //       pathname: `/images/instre_id`,
    //         //       query: { dataset: 'instre', path: obj.image }
    //         //     });
    //         //   },
    //     });
    // });
    // array = this.splitArray(array, ItemsPerPage);
    // return array;
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
  }

  renderContent() {
     // this.displayImages();
    const array = this.displayImages();

    console.log("--------array-------",array);

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
        <ReactRpg imagesArray={array ? array[this.state.activePage - 1] : []} columns={[2, 4]} padding={10} />
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
  return { qimList: state.reducerImages.qimList_dataset,
           imlist: state.reducerImages.imlist
         };
}

export default connect(mapStateToProps, { getQimList, resetRanking, getImlist })(DatasetPage);
