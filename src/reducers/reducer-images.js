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
      });

    case TYPES.RESET_IMLIST:
      return Object.assign({}, state, {
        imlist: null,
      });

    case TYPES.GET_IMLIST:
      return Object.assign({}, state, {
        imlist: action.payload.data
      });

    case TYPES.GET_INFO_IMG:
      return Object.assign({}, state, {
        img_info: action.payload.encoded_image
      });

    default:
      return state;
  }
}
