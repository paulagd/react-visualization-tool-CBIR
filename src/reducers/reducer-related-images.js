import * as TYPES from '../actions/types';

const INITIAL_STATE = { getRankin: {img_list:null, dataset:null}, img_info:null };

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {

    case TYPES.GET_RANKIN_IMG:
      return Object.assign({}, state, {
        getRankin: {
          img_list: action.payload.request.data,
          dataset:action.payload.dataset
        }
      });

    case TYPES.UPDATED_RANKING_FEEDBACK:
      let accuracy = {initial: action.payload.request.data.initial, final:action.payload.request.data.final }

      return Object.assign({}, state, {
        getRankin: {
          img_list: action.payload.request.data.json,
          accuracy,
          dataset:action.payload.dataset
        }
      });

    case TYPES.SEND_ANNOTATIONS:
      // console.log(action.payload.request.data.json);
      return Object.assign({}, state, {
        getRankin: {
          img_list: action.payload.request.data.json,
          dataset:action.payload.dataset,
          confirm : action.payload.request.data.success
        }
      });

    case TYPES.RESET_ANNOTATIONS:
      return Object.assign({}, state, {
        confirm: null
      });
    case TYPES.RESET_RANKIN_IMG:
      return Object.assign({}, state, {
        getRankin: {
          img_list: null,
          dataset: null
        }
      });

    default:
      return state;
  }
}
