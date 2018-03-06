import * as TYPES from '../actions/types';

const INITIAL_STATE = { img: null , qimList_oxford:null, qimList_paris:null, qimList_instre:null};

export default function(state = INITIAL_STATE, action) {

  switch (action.type) {

    // case TYPES.GET_SINGLE_IMG:
    //   return Object.assign({}, state, {
    //     img: action.payload.data
    //   });

    case TYPES.GET_QIMLIST_OXFORD:
      return Object.assign({}, state, {
        qimList_oxford: action.payload.data
      });

    case TYPES.GET_QIMLIST_PARIS:
      return Object.assign({}, state, {
        qimList_paris: action.payload.data
      });

    case TYPES.GET_QIMLIST_INSTRE:
      return Object.assign({}, state, {
        qimList_instre: action.payload.data
      });

    default:
      return state;
  }
}
