import axios from 'axios';
import * as TYPES from './types';
import { getPathfromId } from '../../utils/index';

const ROOT_URL = 'http://localhost:5000';


export function getRankinOfImage(id, url, encoded_image, dataset) {
  let path = null;

  return function(dispatch) {
      axios.post(`${ROOT_URL}/getIimlist`, {dataset})
      .then(req => {

          if(id  && parseInt(id)){
            path = getPathfromId(id, req.data);
            id = 'unknown_id';
          } else if (id){
            id = id.indexOf('.jpg') ? id.replace(/.jpg$/,"") : id;
          } else {  // si es una url ?
            id = 'unknown_id';
          }

          axios.post(`${ROOT_URL}/getRankinById/${id}.json`, { dataset, url, encoded_image, path})
          .then(request => {
              dispatch({
                  type: TYPES.GET_RANKIN_IMG,
                  payload: {request, dataset}
              });
              dispatch({
                  type: TYPES.GET_IMLIST,
                  payload: req
              });
          }).catch((error) => {
              console.log('error',error);
              dispatch(errorMessage(`${Object.assign({}, error).response.data.messageError} `));
          });
      }).catch((response) => {
          dispatch(errorMessage(`${response} in action getIimlist`));
      });
  };

}

export function getQimList(dataset) {

    return function(dispatch) {
        axios.post(`${ROOT_URL}/getQimListDataset`,{dataset})
        .then(request => {
            dispatch({
                type: TYPES.GET_QIMLIST,
                payload: request
            });
        }).catch((response) => {
            dispatch(errorMessage(`${response} in action getQimListDataset`));
        });
    };
}

export function getImlist(dataset) {
    return function(dispatch) {
        axios.post(`${ROOT_URL}/getIimlist`, {dataset})
        .then(request => {
            dispatch({
                type: TYPES.GET_IMLIST,
                payload: request
            });
        }).catch((response) => {
            dispatch(errorMessage(`${response} in action getImlist`));
        });
    };
}



export function sendFeedback_QE(id, url, encoded_image, dataset, path, similar_list, mode) {
    const query = id ? `${ROOT_URL}/sendFeedback_receiveRanking/${id}.json` : `${ROOT_URL}/sendFeedback_receiveRanking/unknown_id`;
    return function(dispatch) {
        axios.post(query, { dataset,url,encoded_image, path, similar_list, mode})
        .then(request => {
            dispatch({
                type: TYPES.UPDATED_RANKING_FEEDBACK,
                payload: {request, dataset}
            });
        }).catch((error) => {
            console.log('error in action sendFeedback_QE ', error);
            dispatch(errorMessage(`${Object.assign({}, error).response.data.messageError}`));
        });
    };
}

//MODE ANNOTACIONS
export function send_Annotations(id, url, encoded_image, dataset, path, similar_list, mode) {
    const query = id ? `${ROOT_URL}/sendFeedback_receiveRanking/${id}.json` : `${ROOT_URL}/sendFeedback_receiveRanking/unknown_id`;
    return function(dispatch) {
        axios.post(query, { dataset,url,encoded_image, path, similar_list, mode})
        .then(request => {
            dispatch({
                type: TYPES.SEND_ANNOTATIONS,
                payload: {request, dataset}
            });

            console.log('FEEDBACK SENT. THANKS');

        }).catch((error) => {

            dispatch(errorMessage(`${Object.assign({}, error).response.data.messageError}`));
        });
    };
}


//SEND ENCODED IMAGE TO SERVER
export function postEncodedInfo(encoded_image) {
    return function(dispatch) {
          dispatch({
              type: TYPES.GET_INFO_IMG,
              payload: { encoded_image }
          });
        // }.catch((response) => {
        //     dispatch(errorMessage(`${response} in action getRankinOfImage`));
        // });
    };
}

//RESET_RANKIN_IMG
export function resetRanking() {
    return function(dispatch) {
          dispatch({
              type: TYPES.RESET_RANKIN_IMG
          });
        // }.catch((response) => {
        //     dispatch(errorMessage(`${response} in action getRankinOfImage`));
        // });
    };
}

export function resetQimList() {
    return function(dispatch) {
          dispatch({
              type: TYPES.RESET_QIMLIST
          });
        // }.catch((response) => {
        //     dispatch(errorMessage(`${response} in action getRankinOfImage`));
        // });
    };
}

export function resetImlist() {
    return function(dispatch) {
          dispatch({
              type: TYPES.RESET_IMLIST
          });
        // }.catch((response) => {
        //     dispatch(errorMessage(`${response} in action getRankinOfImage`));
        // });
    };
}

//RESET_annotations
export function resetAnnotations() {
    return function(dispatch) {
          dispatch({
              type: TYPES.RESET_ANNOTATIONS
          });
        // }.catch((response) => {
        //     dispatch(errorMessage(`${response} in action getRankinOfImage`));
        // });
    };
}

//RESET_ERROR_MESSAGE
export function resetErrorMessage() {
    return function(dispatch) {
          dispatch({
              type: TYPES.RESET_ERROR_MESSAGE
          });
        // }.catch((response) => {
        //     dispatch(errorMessage(`${response} in action getRankinOfImage`));
        // });
    };
}

export function errorMessage(data) {
    return({
        type: TYPES.ERROR_MESSAGE,
        payload: {
            data
        }
    });
}
