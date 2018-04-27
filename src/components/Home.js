import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import ProgressBar from 'simple-react-progress-bar';
import { connect } from 'react-redux';

import { Link, browserHistory } from 'react-router';
import Slider from 'react-slick';

import { options_NavBar } from '../customize.js';
import { getIdFromPath } from '../../utils/index';

import { postEncodedInfo, getQimList, resetRanking, resetQimList, getImlist, resetImlist } from '../actions/index';

import '../styles/home.scss';
import '../styles/loading-bar.scss';

const ROOT_URL = 'http://localhost:5000';

//IDEA: TO CROP --> https://braavos.me/react-image-cropper/

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: true,
      files: [],
      startLoading: false,
      completeLoading: false,
      drag:false,
      url:null,
      encoded_image:null,
      url_imgs: `${ROOT_URL}/getImageById/`,
      datasetChosed:{condition: false, name:""},
      qimList: this.props.qimList ? this.props.qimList : [],
      imlist: this.props.imlist ? this.props.imlist: []
    }
  }

  componentDidMount() {
    this.props.getImlist('instre');
  }

  componentWillUnmount() {
    // this.props.resetQimList();
    this.props.resetImlist();
  }

  componentWillReceiveProps(newProps) {
      if((JSON.stringify(this.props.qimList) !== JSON.stringify(newProps.qimList)) ||
          (JSON.stringify(this.props.imlist) !== JSON.stringify(newProps.imlist))) {
          this.setState({
            qimList: newProps.qimList && newProps.qimList.length ? newProps.qimList.slice(0,56) : [],
            imlist: newProps.imlist && newProps.imlist.length ? newProps.imlist: [],
          });
      }
  }

  onDrop(files) {
    this.setState({startLoading: true});
  }

  onDragOver(files) {
    this.setState({drag: true});
  }

  onDragLeave(files) {
    this.setState({drag: false});

  }
  resetLoading() {
    this.setState({
      startLoading: false,
      completeLoading: false
    });
  }
  handleChange(event) {
    this.setState({url: event.target.value});
  }

  onDropAccepted(files) {
    const scope = this;

    this.getBase64(files[0],(e)=>{
      scope.setState({ files, encoded_image:e ,completeLoading: true});
    });

  }

  getBase64(file, callback) {
     var reader = new FileReader();
     reader.readAsDataURL(file);
     reader.onload = function () {
       // console.log(reader);
       callback(reader.result);
     };
     reader.onerror = function (error) {
       console.log('-------- ERROR IN LOAD IMAGE FROM FILE: -----------', error);
       callback(error);
     };
  }

  onClickSlide(obj){
    this.props.resetRanking();

    let id = obj.image;
    if(obj.image.indexOf("/") != -1){
      id = getIdFromPath(obj.image, this.state.imlist);
    } else {
      id = id.replace(/.jpg$/,"");
    }

    browserHistory.push({
      pathname: `/images/${id}`,
      query: { dataset: this.state.datasetChosed.name}
    });
  }

  showInfo() {
    this.setState({show:!this.state.show})
  }


  handleSubmit(event) {
    //submnit url photos

    if(this.state.completeLoading){
      alert("WAIT UNTIL THE IMAGE IS LOADED")
    } else {
      if(this.state.datasetChosed.condition){
        event.preventDefault();
        this.props.resetRanking();
        if (this.state.url) {
          browserHistory.push({
            pathname: '/images/unknown_id',
            query: { url: this.state.url , encoded_image:null, dataset: this.state.datasetChosed.name}
          });
        } else {
          alert("Nothing to sumbit");
        }
      } else {
        alert("you should choose a dataset to search into")
      }
    }
  }

  // TODO: unificar
  onClickDropzone(event) {
    //submnit upload photos
    if(this.state.completeLoading){
      alert("WAIT UNTIL THE IMAGE IS LOADED")
    } else {
      if(this.state.datasetChosed.condition) {
        this.props.resetRanking();
        this.props.postEncodedInfo(this.state.encoded_image);

        if (this.state.files && this.state.files.length) {
          // console.log(this.state.files[0].preview.split("/")[this.state.files[0].preview.split("/").length - 1]);
          browserHistory.push({
            pathname: '/images/unknown_id',
            query: { url: this.state.files[0].preview,
                     // encoded_image: this.state.encoded_image,
                     dataset: this.state.datasetChosed.name
                   }
          });
        } else {
          alert("Nothing to sumbit");
        }
        this.setState({ disabled: !this.state.disabled })
      } else {
        alert("you should choose a dataset to search into")
      }
    }
  }

  renderDemos(){

    const settings = {
      infinite: false,
      className:"slider",
      speed: 3000,
      slidesToShow: 3,
      slidesToScroll: 2,
      arrows:true,
      pauseOnHover:true,
      pauseOnFocus:true,
      accessibility:true,
      // autoplay:true,
    };

    let dataset = this.state.datasetChosed.name;

    if(dataset && dataset.length){
      return(
        <div>
          <h2> {dataset.toUpperCase()} DATASET </h2>
          <Slider {...settings}>
            { this.state.qimList  ? this.state.qimList.map((obj,i)=>{

              let id = obj.image;

              //IDEA: If it's instre we can't send the path. We need to change the id
              if(obj.image.indexOf("/") != -1){
                id = getIdFromPath(obj.image, this.state.imlist);
              }
              if (!(id && id.length == 0)){
                return(<div key={`key-unique-${i}`} >
                          <img className="img-slide"
                            onClick= {this.onClickSlide.bind(this,obj)}
                          src={this.state.url_imgs+id +`?dataset=${dataset}`} />
                       </div>);
              }
            }) : null }
          </Slider>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="main-content">
        <section className="upload-content">
          <form onSubmit={this.handleSubmit.bind(this)}>
              <div>From URL: </div>
              <input className="input-url" type="text" value={this.state.url ? this.state.url : ""} onChange={this.handleChange.bind(this)} />
              <input className="button" type="submit" value="Submit" />
          </form>
          <div>
            <div>From files: </div>
            <Dropzone
              className="dropzone"
              onDrop={this.onDrop.bind(this)}
              onDropAccepted={this.onDropAccepted.bind(this)}
              onDragOver={this.onDragOver.bind(this)}
              onDragLeave={this.onDragLeave.bind(this)}
            >
            {
              this.state.files.length ? this.state.files.map((f) =>{
                return(<li key={f.name}>{f.name} - {f.size} bytes</li>);
              }) : (!this.state.drag ? <p>Drop an image here, or click to select it from files.</p> : null)
            }
            </Dropzone>

            <button className="button submit" type="button" onClick={this.onClickDropzone.bind((this))}>Find similar images!</button>
            <ProgressBar completed={this.state.completeLoading} loading={this.state.startLoading} resetLoading={this.resetLoading.bind(this)} />
          </div>
        </section>
        <section className="choose-dataset">

          <img src="../../background.png" alt="Smiley face" height="250" />
          <h5> Choose in which dataset do you want to look up for similar images: </h5>
          {options_NavBar.map((opt,i)=>{
            return(<label key={`key-home-${i}`} className="radio-inline" onClick={()=>{
                this.props.resetQimList();
                let datasetChosed = { condition: true, name:opt.name.toLowerCase()};
                this.props.getQimList(datasetChosed.name);
                this.setState({datasetChosed});
            }} ><input type="radio" name="optradio" />{opt.name}</label>);
          })}
        </section>
        <div>
          {this.renderDemos()}
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
           infoIMG: state.reducerImages.img_info,
           qimList: state.reducerImages.qimList_dataset,
           imlist: state.reducerImages.imlist
         };
}

export default connect(mapStateToProps, { postEncodedInfo, getQimList, resetRanking, resetQimList, getImlist, resetImlist})(Home);
