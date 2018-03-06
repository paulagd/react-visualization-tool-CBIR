import React, { Component } from 'react';

import '../styles/not-found.scss';

  class Welcome extends Component {

      constructor(props){
          super(props);
      }

      render(){
          return (
              <div className="content">
                WELCOME COMPONENT
              </div>
          );
      }
  }

  export default Welcome;

  // import React, { Component } from 'react';
  // import Dropzone from 'react-dropzone';
  // import ProgressBar from 'simple-react-progress-bar';
  // import { connect } from 'react-redux';
  //
  // import { Link, browserHistory } from 'react-router';
  // import Slider from 'react-slick';
  //
  // import { postEncodedInfo, getQimListOxford, getQimListParis, getQimListInstre, resetRanking } from '../actions/index';
  //
  // import './styles/welcome.scss';
  // import './styles/loading-bar.scss';
  //
  // //IDEA: TO CROP --> https://braavos.me/react-image-cropper/
  //
  // class Welcome extends Component {
  //   constructor(props) {
  //     super(props)
  //     this.state = {
  //       disabled: true,
  //       files: [],
  //       startLoading: false,
  //       completeLoading: false,
  //       drag:false,
  //       url:null,
  //       encoded_image:null,
  //       url_imgs: {
  //         oxford: 'http://localhost:5000/getImageOxfordById/',
  //         paris: 'http://localhost:5000/getImageParisById/',
  //         instre: 'http://localhost:5000/getImageInstreById'
  //       },
  //       datasetChosed:{condition: false, name:""},
  //       qimList_oxford: props.qimList_oxford,
  //       qimList_paris: props.qimList_paris,
  //       qimList_instre: props.qimList_instre,
  //     }
  //   }
  //
  //   componentWillReceiveProps(newProps) {
  //       if((JSON.stringify(this.props.qimList_oxford) !== JSON.stringify(newProps.qimList_oxford)) ||
  //         (JSON.stringify(this.props.qimList_paris) !== JSON.stringify(newProps.qimList_paris))  ||
  //         (JSON.stringify(this.props.qimList_instre) !== JSON.stringify(newProps.qimList_instre))) {
  //           this.setState({
  //               qimList_oxford: newProps.qimList_oxford && newProps.qimList_oxford.length ? newProps.qimList_oxford : [],
  //               qimList_paris: newProps.qimList_paris && newProps.qimList_paris.length ? newProps.qimList_paris : [],
  //               qimList_instre: newProps.qimList_instre && newProps.qimList_instre.length ? newProps.qimList_instre.slice(0,56) : [],
  //           });
  //       }
  //   }
  //
  //   onDrop(files) {
  //     this.setState({startLoading: true});
  //   }
  //
  //   onDragOver(files) {
  //     this.setState({drag: true});
  //   }
  //
  //   onDragLeave(files) {
  //     this.setState({drag: false});
  //
  //   }
  //   resetLoading() {
  //     this.setState({
  //       startLoading: false,
  //       completeLoading: false
  //     });
  //   }
  //   handleChange(event) {
  //     this.setState({url: event.target.value});
  //   }
  //
  //   readFile(file, onLoadCallback){
  //       var reader = new FileReader();
  //       reader.onload = onLoadCallback;
  //       reader.readAsDataURL(file);
  //   }
  //
  //   onDropAccepted(files) {
  //     const scope = this;
  //
  //     this.readFile(files[0], function(e) {
  //       scope.setState({ files, encoded_image:e.target.result ,completeLoading: true});
  //     });
  //   }
  //
  //   onClickSlide(obj){
  //     this.props.resetRanking();
  //     let url = `/images/${obj.image.replace(/.jpg$/,"")}`;
  //     let path = null;
  //     if(this.state.datasetChosed.name == "instre"){
  //       url = '/images/instre_id';
  //       path = obj.image;
  //     }
  //     browserHistory.push({
  //       pathname: url,
  //       query: { dataset: this.state.datasetChosed.name , path: path}
  //     });
  //   }
  //
  //   showInfo() {
  //     this.setState({show:!this.state.show})
  //   }
  //
  //   handleSubmit(event) {
  //     //submnit url photos
  //
  //     if(this.state.completeLoading){
  //       alert("WAIT UNTIL THE IMAGE IS LOADED")
  //     } else {
  //       if(this.state.datasetChosed.condition){
  //         event.preventDefault();
  //         this.props.resetRanking();
  //         if (this.state.url) {
  //           // alert('A url was submitted: ' + this.state.url);
  //           alert('FINE!!');
  //           browserHistory.push({
  //             pathname: '/images/unknown_id',
  //             query: { url: this.state.url , encoded_image:null, dataset: this.state.datasetChosed.name}
  //           });
  //         } else {
  //           alert("Nothing to sumbit");
  //         }
  //       } else {
  //         alert("you should choose a dataset to search into")
  //       }
  //     }
  //   }
  //
  //   onClickDropzone(event) {
  //     //submnit upload photos
  //     if(this.state.completeLoading){
  //       alert("WAIT UNTIL THE IMAGE IS LOADED")
  //     } else {
  //       if(this.state.datasetChosed.condition) {
  //         this.props.resetRanking();
  //         this.props.postEncodedInfo(this.state.encoded_image);
  //         if (this.state.files.length) {
  //           // alert('A file was submitted: ' + this.state.files[0].name);
  //           alert('FINE!!');
  //           browserHistory.push({
  //             pathname: '/images/unknown_id',
  //             query: { url: this.state.files[0].preview, dataset: this.state.datasetChosed.name}
  //           });
  //         } else {
  //           alert("Nothing to sumbit");
  //         }
  //         this.setState({ disabled: !this.state.disabled })
  //       } else {
  //         alert("you should choose a dataset to search into")
  //       }
  //     }
  //   }
  //
  //   renderDemos(){
  //
  //     const settings = {
  //       infinite: false,
  //       className:"slider",
  //       speed: 3000,
  //       slidesToShow: 3,
  //       slidesToScroll: 1,
  //       arrows:true,
  //       pauseOnHover:true,
  //       pauseOnFocus:true,
  //       accessibility:true,
  //       autoplay:true,
  //     };
  //
  //     if (this.state.datasetChosed.name == "oxford") {
  //       return(
  //         <div>
  //           <h2> OXFORD DATASET </h2>
  //           <Slider {...settings}>
  //             { this.state.qimList_oxford  ? this.state.qimList_oxford.map((obj)=>{
  //               if (!(obj.image.length == 0)){
  //                 return(<div key={obj.image} ><img className="img-slide" onClick= {this.onClickSlide.bind(this,obj)}
  //                         src={this.state.url_imgs.oxford+obj.image} /></div>);
  //               }
  //             }) : null }
  //           </Slider>
  //         </div>
  //       );
  //     } else if (this.state.datasetChosed.name == 'paris') {
  //       return(
  //         <div>
  //           <h2> PARIS DATASET </h2>
  //           <Slider {...settings}>
  //             { this.state.qimList_paris  ? this.state.qimList_paris.map((obj)=>{
  //               if (!(obj.image.length == 0)){
  //                 return(<div key={obj.image} ><img className="img-slide" onClick= {this.onClickSlide.bind(this,obj)}
  //                         src={this.state.url_imgs.paris+obj.image} /></div>);
  //               }
  //             }) : null }
  //           </Slider>
  //         </div>
  //       );
  //     } else if (this.state.datasetChosed.name == 'instre') {
  //       return(
  //         <div>
  //           <h2> INSTRE DATASET </h2>
  //           <Slider {...settings}>
  //             { this.state.qimList_instre  ? this.state.qimList_instre.map((obj)=>{
  //               if (!(obj.image.length == 0)){
  //                 return(<div key={obj.image} ><img className="img-slide" onClick= {this.onClickSlide.bind(this,obj)}
  //                         src={`${this.state.url_imgs.instre}?path=${obj.image} `} /></div>);
  //               }
  //             }) : null }
  //           </Slider>
  //         </div>
  //       );
  //     }
  //   }
  //
  //   render() {
  //     return (
  //       <div className="main-content">
  //         <section className="upload-content">
  //           <form onSubmit={this.handleSubmit.bind(this)}>
  //               <div>From URL: </div>
  //               <input className="input-url" type="text" value={this.state.url ? this.state.url : ""} onChange={this.handleChange.bind(this)} />
  //               <input className="button" type="submit" value="Submit" />
  //           </form>
  //           <div>
  //             <div>From files: </div>
  //             <Dropzone
  //               className="dropzone"
  //               onDrop={this.onDrop.bind(this)}
  //               onDropAccepted={this.onDropAccepted.bind(this)}
  //               onDragOver={this.onDragOver.bind(this)}
  //               onDragLeave={this.onDragLeave.bind(this)}
  //             >
  //             {
  //               this.state.files.length ? this.state.files.map((f) =>{
  //                 return(<li key={f.name}>{f.name} - {f.size} bytes</li>);
  //               }) : (!this.state.drag ? <p>Drop an image here, or click to select it from files.</p> : null)
  //             }
  //             </Dropzone>
  //
  //             <button className="button submit" type="button" onClick={this.onClickDropzone.bind((this))}>Find similar images!</button>
  //             <ProgressBar completed={this.state.completeLoading} loading={this.state.startLoading} resetLoading={this.resetLoading.bind(this)} />
  //           </div>
  //         </section>
  //         <section className="choose-dataset">
  //
  //           <img src="../../background.png" alt="Smiley face" height="250" />
  //           <h5> Choose in which dataset do you want to look up for similar images: </h5>
  //
  //           <label className="radio-inline" onClick={()=>{
  //               this.props.getQimListOxford();
  //               let datasetChosed = { condition: true, name:"oxford"};
  //               this.setState({datasetChosed});
  //           }} ><input type="radio" name="optradio" />OXFORD</label>
  //
  //           <label className="radio-inline" onClick={()=>{
  //             this.props.getQimListParis();
  //             let datasetChosed = { condition: true, name:"paris"};
  //             this.setState({datasetChosed});
  //           }} ><input type="radio" name="optradio" />PARIS</label>
  //
  //           <label className="radio-inline" onClick={()=>{
  //             this.props.getQimListInstre();
  //             let datasetChosed = { condition: true, name:"instre"};
  //             this.setState({datasetChosed});
  //           }} ><input type="radio" name="optradio" />INSTRE</label>
  //
  //         </section>
  //         <div>
  //           {this.renderDemos()}
  //         </div>
  //
  //       </div>
  //     );
  //   }
  // }
  //
  // function mapStateToProps(state) {
  //   return {
  //            infoIMG: state.reducerRelatedImages.img_info,
  //            qimList_oxford: state.reducerImages.qimList_oxford,
  //            qimList_paris: state.reducerImages.qimList_paris,
  //            qimList_instre: state.reducerImages.qimList_instre
  //          };
  // }
  //
  // export default connect(mapStateToProps, { postEncodedInfo, getQimListOxford, getQimListInstre, getQimListParis, resetRanking })(Welcome);
