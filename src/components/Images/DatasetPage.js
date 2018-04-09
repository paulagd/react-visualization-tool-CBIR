import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { browserHistory } from 'react-router';

import { ReactRpg } from 'react-rpg';
import Gallery from 'react-grid-gallery';

import { getQimList, resetRanking, getImlist, resetQimList } from '../../actions/index';

import { getIdFromPath } from '../../../utils/index';

import '../../styles/main-page.scss';

const ItemsPerPage = 28;
const ROOT_URL = 'http://localhost:5000';

class DatasetPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      images: [],
      url_imgs: `${ROOT_URL}/getImageById/`,
      title: this.props.route.path,
      activePage: 1,
      n_pages: 0,
      // qimList: this.props.qimList ? this.props.qimList.slice(0,56) : [],
      qimList: this.props.qimList ? this.props.qimList : [],
      imlist: this.props.imlist ? this.props.imlist: []
    };
  }

  componentDidMount() { //componentDidMount
    this.props.getQimList(this.props.route.path);
    this.props.getImlist('instre');
  }

  componentWillUnmount() {
    this.props.resetQimList();
  }

  componentWillReceiveProps(newProps) {
      if((JSON.stringify(this.props.qimList) !== JSON.stringify(newProps.qimList)) ||
          (JSON.stringify(this.props.route.path) !== JSON.stringify(newProps.route.path)) ||
          (JSON.stringify(this.props.imlist) !== JSON.stringify(newProps.imlist))) {

          this.setState({
              activePage:1,
              // qimList: newProps.qimList && newProps.qimList.length ? newProps.qimList.slice(0,56) : [],
              qimList: newProps.qimList && newProps.qimList.length ? newProps.qimList : [],
              imlist: newProps.imlist && newProps.imlist.length ? newProps.imlist: [],
              n_pages:  newProps.qimList ? Math.ceil(newProps.qimList.length / ItemsPerPage) : null,
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

      this.state.qimList.map((obj, j)=> {
      let id = obj.image;

      //IDEA: If it's instre we can't send the path. We need to change the id
      if(obj.image.indexOf("/") != -1){
        id = getIdFromPath(obj.image, this.state.imlist);
      } else {
        id =  id.split(".")[0];
      }

      array.push({
          url: this.state.url_imgs + id +`?dataset=${this.state.title}`,
          clickHandler: (path) => {
              this.props.resetRanking();
              // when clicked, it has to show the related images
              browserHistory.push({
                pathname: `/images/${id}`,
                query: { dataset: this.state.title}
              });
            },
          });
      });
    }
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

export default connect(mapStateToProps, { getQimList, resetRanking, getImlist, resetQimList })(DatasetPage);
