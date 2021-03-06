import { ReactRpg } from 'react-rpg';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Pagination from 'react-js-pagination';
import { Link, browserHistory } from 'react-router';
import NotFound from '../common/NotFound';
import ImageGallery from 'react-image-gallery';
import Gallery from 'react-grid-gallery';
import PopUpLoader from '../common/PopUpLoader';


const ROOT_URL = 'http://localhost:5000';

import { getIdFromPath, getPathfromId } from '../../../utils/index';

import { getRankinOfImage ,getImlist, errorMessage, resetAnnotations, resetRanking,
  sendFeedback_QE, send_Annotations } from '../../actions/index';

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
          messageError: this.props.messageError,
          imlist: this.props.imlist ? this.props.imlist: [],
          accuracy: this.props.accuracy ? this.props.accuracy : null,
          ap_system: this.props.ap_system,
          images :this.props.relatedImages && this.props.relatedImages.list && this.props.relatedImages.list.length ? this.display_ReactRpg_Images() : []
        };
        isLoading:false;
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
           (JSON.stringify(this.props.messageError) !== JSON.stringify(newProps.messageError)) ||
           (JSON.stringify(this.props.location.query.url) !== JSON.stringify(newProps.location.query.url))) {

            this.setState({
              id: newProps.params.id,
              messageError: newProps.messageError,
              accuracy: newProps.accuracy ? newProps.accuracy : null,
              ap_system: newProps.ap_system,
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
      this.state.url ? this.props.getRankinOfImage(null, this.state.url, this.props.encoded_image, dataset) :
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
      this.setState({ activeMode: mode, imgsSelected: []}); // activePage:1

      if(!(mode == 'e')){
        this.setState({ accuracy:null ,images: this.state.relatedImages && this.state.relatedImages.list
          && this.state.relatedImages.list.length ? this.display_Gallery_Images(mode, null) : []});
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
          if(obj){
            let url = this.state.url_imgs+ obj.Image +`.jpg?dataset=${dataset}`;
            if(obj.Image.indexOf("/") != -1){
              let id_aux = getIdFromPath(obj.Image, this.state.imlist);
              url = this.state.url_imgs+ id_aux +`?dataset=${dataset}`;
            }

            (mode == 'a') ?
              array.push({
                  src: obj ? obj.Image : 'error',
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
      }

      array = this.splitArray(array, ItemsPerPage);

      // IDEA
      // this.setState({images: this.state.relatedImages && this.state.relatedImages.list
      //   && this.state.relatedImages.list.length ? array : []});

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

          if(obj && obj.Image){
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
      }
      array = this.splitArray(array, ItemsPerPage);
      return array;
    }

    onSelectThumbnail (images, index) {
        let img = images[index];

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

      images = images.filter((val, id, array) => {
         return array.indexOf(val) == id;
      });

      for(var i=0; i<images.length; i++){
        if(!(images[i].isPositive)){
          //if the images are negative ( or nothing --> mode = q)
          (this.state.activeMode == 'a') ?  selected.negative.push(images[i].src + '.jpg')
          : selected.push(images[i].src + '.jpg');
        } else {
          //if the images are positive is because they are in mode 'a'
          selected.positive.push(images[i].src + '.jpg')
        }
      }
      return selected;
    }

    positiveFeedback(i){

      let images = this.state.images;
      const res = this.state.relatedImages.list[i];
      const index_imgs = (i-ItemsPerPage*(this.state.activePage-1));
      let imgsSelected = this.state.imgsSelected;

      if(images[index_imgs].hasOwnProperty("isSelected") && images[index_imgs].isSelected == true){
        images[index_imgs].isPositive = true;
        images[index_imgs].idSelected = res.IdSequence;
        images[index_imgs].customOverlay.props.children[1].props.style.display = "none";
        imgsSelected.push(images[index_imgs]);

        this.setState({
            images,
            imgsSelected
        });
      }
    }

    negativeFeedback(i){

      let images = this.state.images;
      const res = this.state.relatedImages.list[i];
      const index_imgs = (i-ItemsPerPage*(this.state.activePage-1));
      let imgsSelected = this.state.imgsSelected;

      if(images[index_imgs].hasOwnProperty("isSelected") && images[index_imgs].isSelected == true){
        images[index_imgs].isPositive = false;
        images[index_imgs].idSelected = res.IdSequence;
        images[index_imgs].customOverlay.props.children[0].props.style.display = "none";
        imgsSelected.push(images[index_imgs]);

        this.setState({
            images,
            imgsSelected
        });
      }
    }

    renderSystemAccuracy(){
      let new_mAP = this.state.ap_system ? this.state.ap_system : '-';
      if(new_mAP < 0.5){
        return(<div className="alert alert-danger system-ap">
                <strong>System mean AP : </strong> {new_mAP}
              </div>);
      } else {
        return(<div className="alert alert-success system-ap">
                <strong>System mean AP : </strong> {new_mAP}
              </div>);
      }
    }

    renderAccuracy(){
      if(this.state.accuracy){
        if(this.props.annotations_sent ==  true){
            if(this.state.accuracy.initial && this.state.accuracy.final){
              if(this.state.accuracy.initial == -1 || this.state.accuracy.final == -1){
                return(<div className="alert alert-info">
                        <strong>INFO</strong> This image can not be evaluated because is not annotated as a main query.
                      </div>);
              }else if(this.state.accuracy.initial > this.state.accuracy.final) {
                return(<div className="alert alert-danger">
                        <strong>Oh no...</strong> The average precision of this query decreased from {this.state.accuracy.initial} to {this.state.accuracy.final}.
                      </div>);
              } else if (this.state.accuracy.initial < this.state.accuracy.final){
                return(<div className="alert alert-success">
                        <strong>Oh yes!</strong> The average precision of this query increased from {this.state.accuracy.initial} to {this.state.accuracy.final}.
                      </div>);
              } else if(this.state.accuracy.initial && (this.state.accuracy.initial == this.state.accuracy.final)){
                return(<div className="alert alert-info">
                        <strong>INFO</strong> Accuracy stayed the same: {this.state.accuracy.final}
                      </div>);
              }
            } else {
              return(<div className="alert alert-danger">
                      <strong>OPS!</strong> Accuracy recived is not in the complete format.
                    </div>);
            }
        } else {
          return(<div className="alert alert-danger">
                  <strong>Oh oh...</strong> Something went wrong. Be sure that the "evaluate" module is enabled in your CBIR.
                </div>);
        }
      }
    }


    renderSentence(array){
      return (
        this.state.activeMode == 'q' ? <div>
          <div className="alert alert-info"><strong>INFO OF THE MODE:</strong> Feel free to
          experiment through multi queries by selecting different images in order to
          improve the ranking of the query:
          {this.getSelectedImages().toString()}
      </div>
      <div style={{
          display: "block",
          minHeight: "1px",
          width: "100%",
          border: "1px solid #ddd",
          overflow: "auto"}}> </div>
        <Gallery
          images={array}
          showLightboxThumbnails = {true}
          enableLightbox	= {false}
          onClickThumbnail = {this.onSelectImage.bind(this,array)}
          rowHeight = {260}
          margin = {10}
        />
      </div> :
      <div className = "annotations">
        {/* <div className="alert alert-danger">
          <strong>Danger!</strong> All the annotations will be saved to improve the system.
           To just experiment, use the query expansion mode.
        </div> */}
        <div className="alert alert-info"><strong> INFO OF THE MODE: </strong>You can select an image
          and annotate whether it is similar to the query or not. When you finish,
          please press SUBMIT: </div>
           <div style={{
               display: "block",
               minHeight: "1px",
               width: "100%",
               border: "1px solid #ddd",
               overflow: "auto"}}> </div>
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
      // TODO: QUITAR EL path
      let similar_list = this.getSelectedImages();
      let dataset = this.state.relatedImages.dataset;
      let path =  null;

      if(this.props.params.id  && parseInt(this.props.params.id)){
        path = this.props.location.query.path;
      }

      console.log("similar_list",similar_list);
      if(similar_list.positive || similar_list.negative ) {

        if(similar_list.negative.length == 0){
          alert("If you don't want to do any negative annotation, please select query expansion mode.")
        } else {
          // MODE FEEDBACK
          this.state.url ? this.props.send_Annotations(null, this.state.url , this.props.encoded_image , dataset, path, similar_list, this.state.activeMode)
               : this.props.send_Annotations(this.state.id, null , null, dataset, path, similar_list, this.state.activeMode);

          //TODO: esperar propietat de confirma de sent annotations i reload
          this.props.resetRanking();
        }
      } else {
        //MODE QE : COMENTO LO DE LA URL I FROM FILE
        this.props.sendFeedback_QE(this.state.id, null , null, dataset, path, similar_list, this.state.activeMode);
        this.props.resetRanking();

      }
    }

    renderContent() {
       let dataset = this.state.relatedImages.dataset && this.state.relatedImages.dataset.length ?
                    this.state.relatedImages.dataset.toLowerCase() : null;
       dataset = dataset ? dataset : this.props.location.query.dataset;
       if(dataset){

        // BUG:FIXED THEORETICALLY
       let array = (this.state.activeMode == 'e') ?
            (this.state.images && this.state.images.length ? this.state.images :
                  (this.props.relatedImages && this.props.relatedImages.list &&
                    this.props.relatedImages.list.length ? this.display_ReactRpg_Images() : []))
            : (this.state.images && this.state.images.length ? this.state.images :
                  (this.props.relatedImages && this.props.relatedImages.list &&
                    this.props.relatedImages.list.length ? this.display_Gallery_Images(this.state.activeMode,null) : []));

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
                            Submit annotations</button> : <button className="button submit" type="button"
                              style={{visibility:"hidden"}}></button>
                      }
                      {this.renderSystemAccuracy()}
                  </div>
              </div>
              {this.state.messageError ?
                <div>
                  {this.loading(false)}
                  <NotFound ErrorMsg={this.state.messageError} />
                </div> :
                (<div className = "images-content" >
                  {((array.length< 1) || !(this.state.relatedImages.list && (this.state.relatedImages.list.length >0))) ?
                    (<div>
                      { this.loading(true) }
                     </div>
                    ):(
                      !(this.state.activeMode == 'e') ?
                        <div>
                            {this.loading(false)}
                            {this.renderSentence(array)}
                            <div style={{
                                display: "block",
                                minHeight: "1px",
                                width: "100%",
                                border: "1px solid #ddd",
                                overflow: "auto"}} />
                      </div> :
                      <div>
                          {this.loading(false)}
                          <div className="alert alert-info"><strong> INFO OF THE MODE: </strong>
                          Feel free of exploring the dataset for ever... to infinity and beyond! </div>
                          <div style={{
                              display: "block",
                              minHeight: "1px",
                              width: "100%",
                              border: "1px solid #ddd",
                              overflow: "auto"}}> </div>
                        <ReactRpg imagesArray={array} columns={[1, 2, 4]} padding={10} />
                    </div>
                  )}
                </div>)}
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
        alert("NO DATASET");
      }
    }

    loading(isLoading) {
        this.isLoading = isLoading;
    }

    renderPopUp(){
      return (<PopUpLoader title = "Please, wait until the images are loaded." />);
    }

    render() {
      return (
        <div className="content-image-related" >
          <h3>
            IMAGES SIMILARS TO {this.state.id.toUpperCase()}.JPG
          </h3>
          {this.renderContent()}
          {this.isLoading ? this.renderPopUp() : null}
        </div>
      );
    }

}

function mapStateToProps(state) {
  return { relatedImages: { list: state.reducerRelatedImages.getRankin.img_list, dataset: state.reducerRelatedImages.getRankin.dataset} ,
           accuracy: state.reducerRelatedImages.getRankin.accuracy ,
           encoded_image: state.reducerRelatedImages.img_info ,
           messageError: state.reducerRelatedImages.messageError,
           annotations_sent: state.reducerRelatedImages.getRankin.confirm,
           imlist: state.reducerImages.imlist,
           ap_system: state.reducerRelatedImages.getRankin.ap_system
         };
}

export default connect(mapStateToProps, { getRankinOfImage, getImlist, errorMessage, resetRanking, resetAnnotations, sendFeedback_QE, send_Annotations })(ImageWithRelateds);
