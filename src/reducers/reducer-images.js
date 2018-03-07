import * as TYPES from '../actions/types';

const INITIAL_STATE = { img: null , imlist:null, qimList_dataset:null};

export default function(state = INITIAL_STATE, action) {

  switch (action.type) {

    case TYPES.GET_QIMLIST:
      return Object.assign({}, state, {
        qimList_dataset: action.payload.data
      });

    case TYPES.RESET_QIMLIST:
      return Object.assign({}, state, {
        qimList_dataset: null,
        // imlist: null
      });

    // case TYPES.GET_ID_FROM_PATH:
    //   return Object.assign({}, state, {
    //     id_mapped: null
    //   });

    case TYPES.GET_IMLIST:
      return Object.assign({}, state, {
        imlist: action.payload.data.slice(1,4)
      });

    default:
      return state;
  }
}
