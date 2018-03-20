import axios from 'axios';
import * as TYPES from './types';
import { getPathfromId } from '../../utils/index';

const ROOT_URL = 'http://localhost:5000';

/**
* @api {post} /getRankinById/:id  getRankinOfImage
* @apiName getRankinOfImage
* @apiGroup Actions
* @apiDescription Gets the ranking of a query given sorted in relevance order.
*
*
* @apiParam {String} id Id of the query
* @apiParam {String} [url] Url of the image introduced to the system.
* @apiParam {String} [encoded_image] Encoded image uploaded to the system.
* @apiParam {String} dataset Dataset given
*
* @apiSuccess {string} Image Contains the name of the image or path associated.
* @apiSuccess {Number} IdSequence Contains the unique id that identifies the image.
*
*
*
* @apiExample {json} Request
*      {
*          "dataset":"oxford",
*      }
*
* @apiExample {json} Success 200
* [
*  {
*        "IdSequence": "0",
*        "Image": "all_souls_000001"
*    },
*    {
*        "IdSequence": "1",
*        "Image": "oxford_000709"
*    },
*
*    ...
*
*    {
*        "IdSequence": "5011",
*        "Image": "radcliffe_camera_000529"
*    }
* ]
*/
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
          });
      }).catch((response) => {
          dispatch(errorMessage(`${response} in action getRankinOfImage`));
      });
  };

}

/**
* @api {post} /getQimListDataset getQimList
* @apiName getQimList
* @apiGroup Actions
*
* @apiDescription Gets the list of query examples given a dataset.
*
* @apiParam {String} dataset Dataset given
*
* @apiSuccess {string} image Contains the name of the image or path associated.
* @apiSuccess {Number} id Contains the id of the query in QimList. However it is
* just an identifier. It is not the unique id corresponding to the image. The unique
* id can be found in in the 'imlist' call.
*
*
* @apiExample {json} Request
*      {
*          "dataset":"oxford",
*      }
*
* @apiExample {json} Success 200
* [
*  {
*        "image": "oxford_002985.jpg",
*        "id": "0"
*    },
*    {
*        "image": "keble_000028.jpg",
*        "id": "1"
*    },
*
*    ...
*
*    {
*        "image": "christ_church_001020.jpg",
*        "id": "54"
*    }
* ]
*
*
*
*/

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

/**
* @api {post} /getImlist getImlist
* @apiName getImlist
* @apiGroup Actions
*
* @apiDescription Gets the list of all the queries in a dataset.
* @apiParam {String} dataset Dataset given
*
** @apiSuccess {string} image Contains the name of the image or path associated.
* @apiSuccess {Number} id Contains the unique id corresponding to the image.
*
* @apiExample {json} Request
*      {
*          "dataset":"oxford",
*      }
*
* @apiExample {json} Success 200
* [
*  {
*        "image": "INSTRE-S1/01a_canada_book/001.jpg",
         "id": 1
*    },
*    {
*        "image": "INSTRE-S1/01a_canada_book/002.jpg",
         "id": 2
*    },
*
*    ...
*
*    {
*        "image": "INSTRE-M/50/107.jpg",
         "id": 28543
*    }
* ]
*
*/
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


/**
* @api {post} /sendFeedback_receiveRanking/:id sendFeedback_QE
* @apiName sendFeedback_QE
* @apiGroup Actions
*
* @apiDescription Send the feedback of the 'QE' mode and receive the new ranking with the accuracy.
*
* @apiParam {String} id Id of the query
* @apiParam {String} [url] Url of the image introduced to the system.
* @apiParam {String} [encoded_image] Encoded image uploaded to the system.
* @apiParam {String} dataset Dataset given
* @apiParam {String} [path] Path given in the case of 'complicated' datasets as 'instre'.
* @apiParam {String} similar_list List of the queries selected for the query expansion.
* @apiParam {String} mode Mode selected to be in use.
*
*
* @apiSuccess {array} json It has an array with the new ranking computed.
* @apiSuccess {Number} initial Contains the accuracy that the image had BEFORE the feedback was sent.
* @apiSuccess {Number} final Contains the accuracy that the image has AFTER the feedback has been sent.
*
*
* @apiExample {json} Request
*      {
*          "similar_list": [" paris_general_001620.jpg", " paris_general_002391.jpg", " paris_eiffel_000128.jpg"],
*          "dataset":"paris",
*          "mode": "q"
*      }
*
*
* @apiExample {json} Success 200
* {
*    "json": [{
*            "IdSequence": "0",
*            "Image": "paris_general_002391"
*        },
*        {
*            "IdSequence": "1",
*            "Image": "paris_eiffel_000128"
*        },
*             ...
*
*        {
*            "IdSequence": "5011",
*            "Image": "paris_invalides_000541"
*        }
*    ],
*    "initial": 0.700725,
*    "final": 0.639502
* }
*
*
*/
export function sendFeedback_QE(id, url, encoded_image, dataset, path, similar_list, mode) {
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
/**
* @api {post} /sendFeedback_receiveRanking/:id send_Annotations
* @apiName send_Annotations
* @apiGroup Actions
*
* @apiDescription Send the feedback collected by user aqnnotations in 'a' mode
* update/receive the new ranking.
*
* @apiParam {String} id Id of the query
* @apiParam {String} [url] Url of the image introduced to the system.
* @apiParam {String} [encoded_image] Encoded image uploaded to the system.
* @apiParam {String} dataset Dataset given
* @apiParam {String} [path] Path given in the case of 'complicated' datasets as 'instre'.
* @apiParam {String} similar_list List of the queries selected for the query expansion.
* @apiParam {String} mode Mode selected to be in use.
*
* @apiSuccess {array} json It has an array with the new ranking computed.
* @apiSuccess {bool} success Indicates if the state of the request has been succesful AFTER
* dealing with the annotations.
*
*
* @apiExample {json} Request
*      {
*         "similar_list": {
*                           "positive": ["paris_general_001620.jpg", "paris_eiffel_000128.jpg"],
*                           "negative": ["paris_general_000144.jpg", "paris_general_002444.jpg"]
*			},
*          "dataset": "paris",
*          "mode": "a"
*      }
*
*
* @apiExample {json} Success 200
* {
*    "json": [{
*            "IdSequence": "0",
*            "Image": "paris_general_002391"
*        },
*        {
*            "IdSequence": "1",
*            "Image": "paris_eiffel_000128"
*        },
*             ...
*
*        {
*            "IdSequence": "5011",
*            "Image": "paris_invalides_000541"
*        }
*    ],
*    "success": true
* }
*
*/
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

export function errorMessage(data) {
    return({
        type: TYPES.ERROR_MESSAGE,
        payload: {
            data
        }
    });
}
