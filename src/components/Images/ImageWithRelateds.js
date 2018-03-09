import { ReactRpg } from 'react-rpg';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Link, browserHistory } from 'react-router';
import NotFound from '../../common/NotFound';
import ImageGallery from 'react-image-gallery';
import Gallery from 'react-grid-gallery';
import Loader from 'halogen/FadeLoader';

const ROOT_URL = 'http://localhost:5000';

import { getIdFromPath, getPathfromId } from '../../../utils/index';

import { getRankinOfImage ,getImlist, errorMessage, resetAnnotations, resetRanking,
  sendFeedback_receiveRanking, send_Annotations } from '../../actions/index';

import '../../styles/image-with-relateds.scss';

const ItemsPerPage = 28;

class ImageWithRelateds extends Component {

    constructor(props){
        super(props);
        this.state = {
          id: this.props.params.id,
          url: this.props.location.query && this.props.location.query.url ? this.props.location.query.url : null,
          url_imgs: `${ROOT_URL}/getImageById/`,
          relatedImages:{
            list: this.props.relatedImages && this.props.relatedImages.list && this.props.relatedImages.list.length ? this.props.relatedImages.list : [],
            dataset: this.props.relatedImages && this.props.relatedImages.dataset && this.props.relatedImages.dataset.length ? this.props.relatedImages.dataset : [],
          },
          activePage: 1,
          activeMode:"e",
          images : [],
          imlist: this.props.imlist ? this.props.imlist: []
          // images :this.props.relatedImages && this.props.relatedImages.list && this.props.relatedImages.list.length ? this.display_ReactRpg_Images() : []
        };
    }
    componentDidMount() {
      this.props.getImlist('instre');
      this.callRankingAction(null);
    }

    componentWillReceiveProps(newProps) {
        if((JSON.stringify(this.props.relatedImages.list) !== JSON.stringify(newProps.relatedImages.list)) ||
           (JSON.stringify(this.props.relatedImages.dataset) !== JSON.stringify(newProps.relatedImages.dataset)) ||
           (JSON.stringify(this.props.params.id) !== JSON.stringify(newProps.params.id)) ||
           (JSON.stringify(this.props.imlist) !== JSON.stringify(newProps.imlist)) ||
           (JSON.stringify(this.props.location.query.url) !== JSON.stringify(newProps.location.query.url))) {
            this.setState({
              id: newProps.params.id,
              imlist: newProps.imlist && newProps.imlist.length ? newProps.imlist: [],
              url: newProps.location.query && newProps.location.query.url ? newProps.location.query.url : null,
              relatedImages:{
                list: newProps.relatedImages && newProps.relatedImages.list && newProps.relatedImages.list.length ? newProps.relatedImages.list : [],
                // list: newProps.relatedImages && newProps.relatedImages.list && newProps.relatedImages.list.length ? this.display_Gallery_Images(mode) : []
                dataset: newProps.relatedImages && newProps.relatedImages.dataset && newProps.relatedImages.dataset.length ? newProps.relatedImages.dataset : []
              },
              images :newProps.relatedImages && newProps.relatedImages.list && newProps.relatedImages.list.length ? this.display_ReactRpg_Images() : []
            });
        }
    }

    callRankingAction(id) {
      let dataset = this.props.location.query.dataset;
      let ide = id ? id : this.state.id;

      // if(ide == "instre_id"){
      //   path = this.props.location.query.path;
      // }

      this.state.url ? this.props.getRankinOfImage(null, this.state.url, this.props.infoIMG, dataset) :
        this.props.getRankinOfImage(ide, null, null , dataset);

      this.setState({activePage:1});
    }

    splitArray(arr, n) {
      let res = [];
      while (arr.length) {
        res.push(arr.splice(0, n));
      }

      return res;
    }

    handlePageChange(pageNumber) {
      this.setState({ activePage: pageNumber });
    }

    handleOptionChange(mode){
      this.setState({ activeMode: mode});

      if(!(mode == 'e')){
        this.setState({images: this.state.relatedImages && this.state.relatedImages.list && this.state.relatedImages.list.length ? this.display_Gallery_Images(mode) : []});
      } else {
        this.setState({images: this.state.relatedImages && this.state.relatedImages.list && this.state.relatedImages.list.length ? this.display_ReactRpg_Images() : []});
      }
      this.props.resetAnnotations();

    }

// TODO : MODE Annotation and query expansion
    display_ReactRpg_Images() {

      //display the 5000 images in order divided in pages containing 28 images (ItemsPerPage)
      let dataset = this.state.relatedImages.dataset;
      let array = [];

      this.state.relatedImages.list && this.state.relatedImages.list.length ? this.state.relatedImages.list.slice(1,4).map((obj, j)=> {
        // if (dataset == "instre"){
        //   url = `${this.state.url_imgs.instre}?path=${obj.Image}.jpg `;
        // }else{
        //   url = this.state.url_imgs[dataset] + obj.Image + '.jpg';
        // }
        // let url = this.state.url_imgs+ obj.Image +`.jpg?dataset=${dataset}`;
        //
        // if(obj.Image.indexOf("/") != -1){
        //   let id_aux = getIdFromPath(obj.Image, this.state.imlist);
        //
        //   url = this.state.url_imgs+ id_aux +`.jpg?dataset=${dataset}`;
        //
        // }

        let url = "";

        if(obj.Image.indexOf("/") != -1){
          let id_aux = getIdFromPath(obj.Image, this.state.imlist);
          url = this.state.url_imgs+ id_aux +`?dataset=${dataset}`;
        }else{
          let id_complete = (obj.Image.indexOf(".jpg") == -1) ? `${obj.Image}.jpg` : obj.Image;
          url = this.state.url_imgs+ id_complete +`?dataset=${dataset}`;
        }

        let img  = this.state.url ? this.state.url : url;

        array.push({
            url:url,
            clickHandler: (path) => {
                if(this.state.activeMode == "e"){               //Explorer

                  this.props.resetRanking();
                  let id = obj.Image;
                  if(obj.Image.indexOf("/") != -1){
                    id = getIdFromPath(obj.Image, this.state.imlist);
                  }
                  browserHistory.push({
                    pathname: `/images/${id}`,
                    query: { dataset: this.state.relatedImages.dataset}
                  });
                  this.callRankingAction(id);
                }
              },
          });
      }) :  null;
      array = this.splitArray(array, ItemsPerPage);
      return array;
    }
    positiveFeedback(i){

      let index = i - (this.state.activePage - 1)*ItemsPerPage;

      let images = this.state.images;
      images[this.state.activePage - 1][index].isPositive = true;
      images[this.state.activePage - 1][index].customOverlay.props.children[1].props.style.display = "none";
      this.setState({
          images: images
      });
    }

    negativeFeedback(i){
      let index = i - (this.state.activePage - 1)*ItemsPerPage;

      let images = this.state.images;
      images[this.state.activePage - 1][index].isPositive = false;
      images[this.state.activePage - 1][index].customOverlay.props.children[0].props.style.display = "none";
      this.setState({
          images: images
      });

    }

    onSelectThumbnail (images, index) {

        let img = images[this.state.activePage - 1][index];

          if(img.hasOwnProperty("isSelected")) {
            if(!img.isSelected) {
              img.customOverlay.props.style.opacity = 1;
              img.isSelected = !img.isSelected;
            } else {
              img.customOverlay.props.style.opacity = 0;
              img.isSelected = !img.isSelected;
              img.customOverlay.props.children[0].props.style.display = "inline-block";
              img.customOverlay.props.children[1].props.style.display = "inline-block";
            }
          } else
              img.isSelected = true;

          this.setState({
              images: images
          });
    }

    display_Gallery_Images(mode) {
      //display the 5000 images in order divided in pages containing 28 images (ItemsPerPage)
      let array = [];
      let dataset = this.state.relatedImages.dataset;

      this.state.relatedImages.list && this.state.relatedImages.list.length ? this.state.relatedImages.list.map((obj, j)=> {

        let url = this.state.url_imgs+ obj.Image +`.jpg?dataset=${dataset}`;

        if(obj.Image.indexOf("/") != -1){
          let id_aux = getIdFromPath(obj.Image, this.state.imlist);
          url = this.state.url_imgs+ id_aux +`?dataset=${dataset}`;
        }

        (mode == 'a') ?
          array.push({
              src:obj ? obj.Image : 'error',
              thumbnail: url,
              isPositive: false,
              thumbnailWidth: 650,
              thumbnailHeight: 650,
              isSelected: false,
              customOverlay: <div style={{ opacity: 0}} id = {j}>
                              <button className="left btn-success" style={{display:"inline-block"}} onClick = {this.positiveFeedback.bind(this,j)} >YES</button>
                              <button className="right btn-danger" style={{display:"inline-block"}} onClick= {this.negativeFeedback.bind(this,j)} >NO</button>
                            </div>
            }) :
             array.push({
                  src:obj.Image,
                  thumbnail: url,
                  thumbnailWidth: 650,
                  thumbnailHeight: 650,
                  isSelected: false,
                });
      }) : null;
      array = this.splitArray(array, ItemsPerPage);
      return array;
    }

    onSelectImage (images, index) {
        let img = images[this.state.activePage - 1][index];

          if(img.hasOwnProperty("isSelected"))
              img.isSelected = !img.isSelected;
          else
              img.isSelected = true;

          this.setState({
              images: images
          });
    }

    getSelectedImages () {
      let selected = (this.state.activeMode == 'a') ? { positive:[], negative:[] } : [];
      const n_pages =  Math.ceil(this.state.relatedImages && this.state.relatedImages.list ? this.state.relatedImages.list.length/ ItemsPerPage : 0 );
      let images = this.state.images;
      // let images = this.state.images[this.state.activePage - 1];
      if(images && images.length) {
         for(var j = 0; j < n_pages ; j++){
          for(var i = 0; i < images[j].length; i++){
            if(images[j][i].isSelected == true){
              if(!(images[j][i].isPositive)){
                //if the images are negative ( or nothing --> mode = q)
                (this.state.activeMode == 'a') ?  selected.negative.push(' '+images[j][i].src + '.jpg')
                : selected.push(' '+images[j][i].src + '.jpg');
              } else {
                //if the images are positive is because they are in mode a
                selected.positive.push(' '+images[j][i].src + '.jpg')
              }
            }
          }
        }
      }
      return selected;
    }

    renderSentence(array){
      return (
        this.state.activeMode == 'q' ? <div>
        <div style={{
          padding: "2px",
          color: "#666"
        }}> Feel free to experiment through multi queries search selecting different images :
        {this.getSelectedImages().toString()}
      </div>
        <Gallery
          images={array[this.state.activePage - 1]}
          onSelectImage = {this.onSelectImage.bind(this,array)}
          showLightboxThumbnails = {true}
          enableLightbox	= {false}
          onClickThumbnail = {this.onSelectImage.bind(this,array)}
          rowHeight = {260}
          margin = {10}
          // tagStyle = {}
        />
      </div> :
      <div className = "annotations">
        <div className="alert alert-danger">
          <strong>Danger!</strong> All the annotations will be saved to improve the system. To just experiment, use the query expansion mode.
        </div>
        <div style={{
            padding: "2px",
            color: "#666"
          }}> Please, select an image and annotate if it is similar to thw query or not. When you finish, press SUBMIT : </div>
          <Gallery
            images={array[this.state.activePage - 1]}
            onClickThumbnail = {this.onSelectThumbnail.bind(this,array)}
            enableImageSelection = {true}
            showLightboxThumbnails = {true}
            enableLightbox	= {false}
            rowHeight = {260}
            margin = {10}
          />
      </div>);
    }

    renderContent() {

      let dataset = this.state.relatedImages.dataset && this.state.relatedImages.dataset.length ?
                    this.state.relatedImages.dataset.toLowerCase() : null;
      dataset = dataset ? dataset : this.props.location.query.dataset;
      if(dataset){

        // IDEA: SOMETIMES DOES NOT WORK --> FIXED THEORETICALLY
        let array = (this.state.activeMode == 'e') ?
              (this.state.images && this.state.images.length ? this.state.images :
                    (this.props.relatedImages && this.props.relatedImages.list &&
                      this.props.relatedImages.list.length ? this.display_ReactRpg_Images() : []))
              : (this.state.images && this.state.images.length ? this.state.images :
                    (this.props.relatedImages && this.props.relatedImages.list &&
                      this.props.relatedImages.list.length ? this.display_Gallery_Images() : []));


        const n_pages =  Math.ceil(this.state.relatedImages && this.state.relatedImages.list ? this.state.relatedImages.list.length/ ItemsPerPage : 0 );

        //SET PROPERTIES MAIN IMAGE
        let url = "";

        if(this.state.id.indexOf("/") != -1){
          let id_aux = getIdFromPath(this.state.id, this.state.imlist);
          url = this.state.url_imgs+ id_aux +`?dataset=${dataset}`;
        }else{
          let id_complete = (this.state.id.indexOf(".jpg") == -1) ? `${this.state.id}.jpg` : this.state.id;
          url = this.state.url_imgs+ id_complete +`?dataset=${dataset}`;
        }

        let img  = this.state.url ? this.state.url : url;

        const image = [{
          original: img,
          originalClass: 'portrait-slide',
        }];

        return (
          <div className = "wrap-content" >
              <div className="top-content">
                <ImageGallery
                  items={image}
                  slideInterval={2000}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  showThumbnails={false}/>
                  {/* <div className="text-portrait-slide">
                      {this.renderAccuracy()}
                      {this.renderAnnotationsSent()}
                      <label className="first" >  Choose the mode you want to be in: </label>
                      <label className="radio" >
                        <input type="radio" name="optradio"  checked = {this.state.activeMode === 'e'}
                           onChange={this.handleOptionChange.bind(this,'e')} />Explorer mode</label>

                      <label className="radio">
                        <input type="radio" name="optradio" checked = {this.state.activeMode === 'a'}
                        onChange={this.handleOptionChange.bind(this,'a')} />Annotation mode</label>

                      <label className="radio"><input type="radio" name="optradio" checked = {this.state.activeMode === 'q'}
                         onChange={this.handleOptionChange.bind(this,'q')} />Query expansion mode</label>

                  </div>
                  <div className="button-section">
                      { !(this.state.activeMode == 'e') ?
                          <button className="button submit" type="button" onClick={this.submitAnnotations.bind((this))}>
                            Submit annotations</button> : null
                      }
                  </div> */}
              </div>
              <div className = "images-content" >
                {((array.length< 1) || !(this.state.relatedImages.list && this.state.relatedImages.list.length)) ?
                  <Loader className="loader" color="green" size="20px" margin="0px"/> :
                  (  !(this.state.activeMode == 'e') ?
                      <div>
                          {this.renderSentence(array)}
                          <div style={{
                              display: "block",
                              minHeight: "1px",
                              width: "100%",
                              border: "1px solid #ddd",
                              overflow: "auto"}} />
                    </div> :
                    <div>
                        <div style={{
                            padding: "2px",
                            color: "#666"
                          }}> Feel free of exploring the dataset for ever: </div>
                        <div style={{
                            display: "block",
                            minHeight: "1px",
                            width: "100%",
                            border: "1px solid #ddd",
                            overflow: "auto"}}> </div>
                      <ReactRpg imagesArray={array[this.state.activePage - 1]} columns={[1, 2, 4]} padding={10} />
                  </div>
                )}
              </div>
              <div className="footer-content">

                  <Pagination
                   activePage={this.state.activePage}
                   itemsCountPerPage={ItemsPerPage}
                   totalItemsCount={this.state.relatedImages.list && this.state.relatedImages.list ? this.state.relatedImages.list.length : 0}
                   pageRangeDisplayed={5} //maxim n_pagines
                   onChange={this.handlePageChange.bind(this)}
                  />
              </div>
         </div>
        );
      } else {
        console.log("NO DATASET");
      }
    }


    submitAnnotations(){
      // QUITAR EL PATH
      let similar_list = this.getSelectedImages();
      let dataset = this.state.relatedImages.dataset;
      let path =  null;
      if(this.props.params.id == "instre_id"){
        path = this.props.location.query.path;
      }
      if(similar_list.positive || similar_list.negative ) {
        // MODE FEEDBACK
        console.log(this.state.activeMode);
        this.state.url ? this.props.send_Annotations(null, this.state.url , this.props.infoIMG , dataset, path, similar_list, this.state.activeMode)
             : this.props.send_Annotations(this.state.id, null , null, dataset, path, similar_list, this.state.activeMode);

        //TODO: esperar propietat de confirma de sent annotations i reload
        this.props.resetRanking();
        // window.location.reload();

      } else {
        //MODE QE : COMENTO LO DE LA URL I FROM FILE
        this.props.sendFeedback_receiveRanking(this.state.id, null , null, dataset, path, similar_list, this.state.activeMode);
        // window.location.reload();
        this.props.resetRanking();

      }
    }

    renderAccuracy(){
      if(this.props.accuracy){
        if(this.props.accuracy.initial > this.props.accuracy.final) {
          return(<div className="alert alert-danger">
                  <strong>Oh oh...</strong> Accuracy decreased from {this.props.accuracy.initial} to {this.props.accuracy.final}.
                </div>);
        } else if (this.props.accuracy.initial < this.props.accuracy.final){
          return(<div className="alert alert-success">
                  <strong>Oh yes!</strong> Accuracy increased from {this.props.accuracy.initial} to {this.props.accuracy.final}.
                </div>);
        } else {
          return(<div className="alert alert-info">
                  <strong>INFO</strong> Accuracy stayed the same: {this.props.accuracy.final}.
                </div>);
        }
      }
    }

    renderAnnotationsSent(){

      if (this.props.annotations_sent ==  true){
        return(<div className="alert alert-success">
                <strong>Thank you!</strong> Your annotations have been submited to improve the system.
              </div>);
      } else if (this.props.annotations_sent == false) {
        return(<div className="alert alert-danger">
                <strong>Oh oh...</strong> Something went wrong. Sorry, try again.
              </div>);
      }
    }



    render() {
      const { messageError } = this.props;
      if(messageError){
          return(<div>
                    <NotFound ErrorMsg={messageError} />
                </div>);
      } else {
          return (
            <div className="content-image-related">
              <h3>
                IMAGES SIMILARS TO {this.state.id.toUpperCase()}.JPG
              </h3>
              {this.renderContent()}
            </div>
          );
      }
    }

}

function mapStateToProps(state) {
  // console.log("statee",state);
  return { relatedImages: { list: state.reducerRelatedImages.getRankin.img_list, dataset: state.reducerRelatedImages.getRankin.dataset} ,
           accuracy: state.reducerRelatedImages.getRankin.accuracy ,
           infoIMG: state.reducerRelatedImages.img_info ,
           messageError: state.reducerErrorMessage.messageError,
           annotations_sent: state.reducerRelatedImages.getRankin.confirm,
           imlist: state.reducerImages.imlist
         };
}


export default connect(mapStateToProps, { getRankinOfImage, getImlist, errorMessage, resetRanking, resetAnnotations, sendFeedback_receiveRanking, send_Annotations })(ImageWithRelateds);
