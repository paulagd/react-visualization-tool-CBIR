import axios from 'axios';
import * as TYPES from './types';

const ROOT_URL = 'http://localhost:5000';

//GET SORTED RANKING OF ID IMAGE
export function getRankinOfImage(id, url, encoded_image, dataset, path) {
    const query = id ? `${ROOT_URL}/getRankinById/${id}.json` : `${ROOT_URL}/getRankinById/unknown_id`;
    return function(dispatch) {
        axios.post(query, { dataset, url, encoded_image, path})
        .then(request => {
            dispatch({
                type: TYPES.GET_RANKIN_IMG,
                payload: {request, dataset}
            });
        }).catch((response) => {
            dispatch(errorMessage(`${response} in action getRankinOfImage`));
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
            dispatch(errorMessage(`${response} in action getQimListDataset`));
        });
    };
}
// export function getIdFromPath(dataset,path) {
//     let data = {dataset, path};
//     return function(dispatch) {
//         axios.post(`${ROOT_URL}/getIdFromPath`, data)
//         .then(request => {
//             dispatch({
//                 type: TYPES.GET_ID_FROM_PATH,
//                 payload: request
//             });
//         }).catch((response) => {
//             dispatch(errorMessage(`${response} in action getQimListDataset`));
//         });
//     };
// }
//
// export function getPathfromId(dataset,id) {
//
//     return function(dispatch) {
//         axios.post(`${ROOT_URL}/getPathfromId/${id}`, {dataset})
//         .then(request => {
//             dispatch({
//                 type: TYPES.GET_PATH_FROM_ID,
//                 payload: request
//             });
//         }).catch((response) => {
//             dispatch(errorMessage(`${response} in action getQimListDataset`));
//         });
//     };
// }

//MODE QE
export function sendFeedback_receiveRanking(id, url, encoded_image, dataset, path, similar_list, mode) {
    const query = id ? `${ROOT_URL}/sendFeedback_receiveRanking/${id}.json` : `${ROOT_URL}/sendFeedback_receiveRanking/unknown_id`;
    return function(dispatch) {
        axios.post(query, { dataset,url,encoded_image, path, similar_list, mode})
        .then(request => {
            dispatch({
                type: TYPES.UPDATED_RANKING_FEEDBACK,
                payload: {request, dataset}
            });
        }).catch((response) => {
            // dispatch(errorMessage(`${response} in action sendFeedback_receiveRanking`));
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

        }).catch((response) => {
            dispatch(errorMessage(`${response} in action sendFeedback_receiveRanking`));
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

//RESET_annotations
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

export function errorMessage(data) {
    return({
        type: TYPES.ERROR_MESSAGE,
        payload: {
            data
        }
    });
}
