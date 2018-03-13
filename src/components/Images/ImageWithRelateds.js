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
          imgsSelected: [],
          imlist: this.props.imlist ? this.props.imlist: [],
          accuracy: this.props.accuracy ? this.props.accuracy : null
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
           (JSON.stringify(this.props.accuracy) !== JSON.stringify(newProps.accuracy)) ||
           (JSON.stringify(this.props.location.query.url) !== JSON.stringify(newProps.location.query.url))) {

            this.setState({
              id: newProps.params.id,
              accuracy: newProps.accuracy ? newProps.accuracy : null,
              imlist: newProps.imlist && newProps.imlist.length ? newProps.imlist: [],
              url: newProps.location.query && newProps.location.query.url ? newProps.location.query.url : null,
              relatedImages:{
                list: newProps.relatedImages && newProps.relatedImages.list && newProps.relatedImages.list.length ? newProps.relatedImages.list : [],
                dataset: newProps.relatedImages && newProps.relatedImages.dataset && newProps.relatedImages.dataset.length ? newProps.relatedImages.dataset : []
              },
              images :newProps.relatedImages && newProps.relatedImages.list && newProps.relatedImages.list.length ? this.display_ReactRpg_Images() : []
            });
        }
    }

    callRankingAction(id) {
      let dataset = this.props.location.query.dataset;
      let ide = id ? id : this.state.id;
      this.state.url ? this.props.getRankinOfImage(null, this.state.url, this.props.infoIMG, dataset) :
        this.props.getRankinOfImage(ide, null, null , dataset);

      this.setState({activePage:1});
    }

    splitArray(arr, n) {
      let res = [];
      while (arr.length) {
        res = (arr.splice(0, n));
      }
      return res;
    }

    handlePageChange(pageNumber) {
      this.setState({ activePage: pageNumber, images: [] });
      (this.state.activeMode == 'e') ? this.display_ReactRpg_Images(pageNumber):
          this.display_Gallery_Images(this.state.activeMode, pageNumber);
    }

    handleOptionChange(mode){
      this.setState({ activeMode: mode, imgsSelected: []});

      if(!(mode == 'e')){
        this.setState({ accuracy:null ,images: this.state.relatedImages && this.state.relatedImages.list
          && this.state.relatedImages.list.length ? this.display_Gallery_Images(mode) : []});
      } else {
        this.setState({accuracy:null, images: this.state.relatedImages && this.state.relatedImages.list
          && this.state.relatedImages.list.length ? this.display_ReactRpg_Images() : []});
      }
      this.props.resetAnnotations();

    }

    display_Gallery_Images(mode, pageNumber) {
      //display the 5000 images in order divided in pages containing 28 images (ItemsPerPage)
      let array = [];
      let dataset = this.state.relatedImages.dataset;
      let page = pageNumber ? pageNumber : this.state.activePage;
      let offset = (page-1) * ItemsPerPage;

      if(this.state.relatedImages && this.state.relatedImages.list && this.state.relatedImages.list.length) {

        for (var j = offset; j < (offset+ItemsPerPage); j++) {

          let obj = this.state.relatedImages.list[j];
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
                customOverlay: <div id = {j} style={{ opacity: '0' }}>
                                <button className="left btn-success" style={{display:"inline-block"}}
                                  onClick = {this.positiveFeedback.bind(this,j)} >YES</button>
                                <button className="right btn-danger" style={{display:"inline-block"}}
                                  onClick= {this.negativeFeedback.bind(this,j)} >NO</button>
                              </div>
              }) : array.push({
                    src:obj.Image,
                    thumbnail: url,
                    thumbnailWidth: 650,
                    thumbnailHeight: 650,
                    isSelected: false,
              });
         }
      }

      array = this.splitArray(array, ItemsPerPage);
      this.setState({images: this.state.relatedImages && this.state.relatedImages.list
        && this.state.relatedImages.list.length ? array : []});

      return array;
    }

    display_ReactRpg_Images(pageNumber) {
      //display the 5000 images in order divided in pages containing 28 images (ItemsPerPage)
      let dataset = this.state.relatedImages.dataset;
      let array = [];
      let page = pageNumber ? pageNumber : this.state.activePage;
      let offset = (page-1) * ItemsPerPage;

      if(this.state.relatedImages && this.state.relatedImages.list && this.state.relatedImages.list.length) {

        for (var j = offset; j < (offset+ItemsPerPage); j++) {

          let obj = this.state.relatedImages.list[j];
          let url = "";

          if(obj.Image.indexOf("/") != -1){
            let id_aux = getIdFromPath(obj.Image, this.state.imlist);
            url = this.state.url_imgs+ id_aux +`?dataset=${dataset}`;
          }else{
            let id_complete = (obj.Image.indexOf(".jpg") == -1) ? `${obj.Image}.jpg` : obj.Image;
            url = this.state.url_imgs+ id_complete +`?dataset=${dataset}`;
          }
          array.push({                                           // MODE Explorer
              url:url,
              clickHandler: (path) => {
                  if(this.state.activeMode == "e"){

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
         }
      }
      array = this.splitArray(array, ItemsPerPage);
      return array;
    }

    onSelectThumbnail (images, index) {
        let img = images[index];
        // TODO: annotacio recursiva ?

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

    onSelectImage (images, index) {

      let img = images[index];
      let imgsSelected = this.state.imgsSelected;

      const res = this.state.relatedImages.list.find((obj)=>{
         if(obj.Image === img.src){
           return obj;
         }
      });

      if(img.hasOwnProperty("isSelected") && img.isSelected == true){
        img.isSelected = !img.isSelected;
        img.idSelected = null;
        imgsSelected.push(img);
      } else {
        img.isSelected = true;
        img.idSelected = res.IdSequence;
        imgsSelected.push(img);
      }

      var hash = {};
      imgsSelected = imgsSelected.filter(function(current) {

        var exists = !hash[current.src] || false;
        hash[current.src] = true;
        return exists;
      });

      this.setState({
          images: images,
          imgsSelected
      });
    }

    getSelectedImages () {
      let selected = (this.state.activeMode == 'a') ? { positive:[], negative:[] } : [];
      const n_pages =  Math.ceil(this.state.relatedImages && this.state.relatedImages.list
        ? this.state.relatedImages.list.length/ ItemsPerPage : 0 );

      let res = this.state.imgsSelected.map((obj)=>{
         if(obj.isSelected){
           return obj;
         }
      });

      let images = res.filter(function(n){ return n != undefined });

      for(var i=0; i<images.length; i++){
        if(!(images[i].isPositive)){
          //if the images are negative ( or nothing --> mode = q)
          (this.state.activeMode == 'a') ?  selected.negative.push(' '+images[i].src + '.jpg')
          : selected.push(' '+images[i].src + '.jpg');
        } else {
          //if the images are positive is because they are in mode 'a'
          selected.positive.push(' '+images[i].src + '.jpg')
        }
      }
      return selected;
    }

    positiveFeedback(i){

      let images = this.state.images;
      const res = this.state.relatedImages.list[i];
      const index_imgs = (i-ItemsPerPage*(this.state.activePage-1));
      let imgsSelected = this.state.imgsSelected;

      images[index_imgs].isPositive = true;
      images[index_imgs].idSelected = res.IdSequence;
      images[index_imgs].customOverlay.props.children[1].props.style.display = "none";
      imgsSelected.push(images[index_imgs]);

      this.setState({
          images,
          imgsSelected
      });
    }

    negativeFeedback(i){

      let images = this.state.images;
      const res = this.state.relatedImages.list[i];
      const index_imgs = (i-ItemsPerPage*(this.state.activePage-1));
      let imgsSelected = this.state.imgsSelected;

      images[index_imgs].isPositive = false;
      images[index_imgs].idSelected = res.IdSequence;
      images[index_imgs].customOverlay.props.children[0].props.style.display = "none";
      imgsSelected.push(images[index_imgs]);

      this.setState({
          images,
          imgsSelected
      });
    }

    renderAccuracy(){
      if(this.state.accuracy){
        if(this.state.accuracy.initial > this.state.accuracy.final) {
          return(<div className="alert alert-danger">
                  <strong>Oh oh...</strong> Accuracy decreased from {this.state.accuracy.initial} to {this.state.accuracy.final}.
                </div>);
        } else if (this.state.accuracy.initial < this.state.accuracy.final){
          return(<div className="alert alert-success">
                  <strong>Oh yes!</strong> Accuracy increased from {this.state.accuracy.initial} to {this.state.accuracy.final}.
                </div>);
        } else if(this.state.accuracy.initial && (this.state.accuracy.initial == this.state.accuracy.final)){
          return(<div className="alert alert-info">
                  <strong>INFO</strong> Accuracy stayed the same: {this.state.accuracy.final}.
                </div>);
        } else {
          return(<div className="alert alert-danger">
                  <strong>ERROR</strong> No accuracy recived {this.state.accuracy.final}.
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
          images={array}
          // onSelectImage = {this.onSelectImage.bind(this,array)}
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
          <strong>Danger!</strong> All the annotations will be saved to improve the system.
           To just experiment, use the query expansion mode.
        </div>
        <div style={{
            padding: "2px",
            color: "#666"
          }}> Please, select an image and annotate if it is similar to thw query or not.
           When you finish, press SUBMIT : </div>
          <Gallery
            images={array}
            onClickThumbnail = {this.onSelectThumbnail.bind(this,array)}
            enableImageSelection = {true}
            showLightboxThumbnails = {true}
            enableLightbox	= {false}
            rowHeight = {260}
            margin = {10}
          />
      </div>);
    }

    submitAnnotations(){
      // TODO: revisar
      // QUITAR EL PATH
      let similar_list = this.getSelectedImages();
      let dataset = this.state.relatedImages.dataset;
      let path =  null;

      if(this.props.params.id  && parseInt(this.props.params.id)){
        path = this.props.location.query.path;
      }

      console.log("similar_list",similar_list);
      // if(similar_list.positive || similar_list.negative ) {
      //   // MODE FEEDBACK
      //   // console.log(this.state.activeMode);
      //   this.state.url ? this.props.send_Annotations(null, this.state.url , this.props.infoIMG , dataset, path, similar_list, this.state.activeMode)
      //        : this.props.send_Annotations(this.state.id, null , null, dataset, path, similar_list, this.state.activeMode);
      //
      //   //TODO: esperar propietat de confirma de sent annotations i reload
      //   this.props.resetRanking();
      // } else {
      //   //MODE QE : COMENTO LO DE LA URL I FROM FILE
      //   this.props.sendFeedback_receiveRanking(this.state.id, null , null, dataset, path, similar_list, this.state.activeMode);
      //   this.props.resetRanking();
      //
      // }
    }

    renderContent() {
       let dataset = this.state.relatedImages.dataset && this.state.relatedImages.dataset.length ?
                    this.state.relatedImages.dataset.toLowerCase() : null;
       dataset = dataset ? dataset : this.props.location.query.dataset;
       if(dataset){

        // IDEA: SOMETIMES DOES NOT WORK --> FIXED THEORETICALLY
       // let array = (this.state.activeMode == 'e') ?
       //      (this.state.images && this.state.images.length ? this.state.images :
       //            (this.props.relatedImages && this.props.relatedImages.list &&
       //              this.props.relatedImages.list.length ? this.display_ReactRpg_Images() : []))
       //      : (this.state.images && this.state.images.length ? this.state.images :
       //            (this.props.relatedImages && this.props.relatedImages.list &&
       //              this.props.relatedImages.list.length ? this.display_Gallery_Images() : []));

       // let array = (this.state.activeMode == 'e') ? this.display_ReactRpg_Images() :
       //                this.display_Gallery_Images();
       let array = (this.state.activeMode == 'e') ?
              (this.state.images && this.state.images.length ? this.state.images :
                    this.display_ReactRpg_Images())
              : (this.state.images && this.state.images.length ? this.state.images :
                   this.display_Gallery_Images());

       const n_pages =  Math.ceil(this.state.relatedImages && this.state.relatedImages.list
           ? this.state.relatedImages.list.length/ ItemsPerPage : 0 );

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
                  <div className="text-portrait-slide">
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
                  </div>
              </div>
              <div className = "images-content" >
                {((array.length< 1) || !(this.state.relatedImages.list && (this.state.relatedImages.list.length >0))) ?
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
                      <ReactRpg imagesArray={array} columns={[1, 2, 4]} padding={10} />
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
  // console.log('statee',state.reducerRelatedImages.getRankin.img_list);
  return { relatedImages: { list: state.reducerRelatedImages.getRankin.img_list, dataset: state.reducerRelatedImages.getRankin.dataset} ,
           accuracy: state.reducerRelatedImages.getRankin.accuracy ,
           infoIMG: state.reducerRelatedImages.img_info ,
           messageError: state.reducerErrorMessage.messageError,
           annotations_sent: state.reducerRelatedImages.getRankin.confirm,
           imlist: state.reducerImages.imlist
         };
}

export default connect(mapStateToProps, { getRankinOfImage, getImlist, errorMessage, resetRanking, resetAnnotations, sendFeedback_receiveRanking, send_Annotations })(ImageWithRelateds);
