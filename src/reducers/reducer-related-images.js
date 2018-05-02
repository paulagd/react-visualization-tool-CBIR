import * as TYPES from '../actions/types';

const INITIAL_STATE = { getRankin: {img_list:null, dataset:null, ap_system:null}, confirm:null, img_info:null ,messageError: null};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {

    case TYPES.GET_RANKIN_IMG:
      return Object.assign({}, state, {
        getRankin: {
          img_list: action.payload.request.data.json,
          ap_system:action.payload.request.data.mAP,
          dataset:action.payload.dataset,
        }
      });

    case TYPES.GET_INFO_IMG:
      return Object.assign({}, state, {
        img_info: action.payload.encoded_image
      });

    case TYPES.SEND_ANNOTATIONS:
        let accuracy = {
          initial: action.payload.request.data.initial,
          final:action.payload.request.data.final,
        }

        return Object.assign({}, state, {
          getRankin: {
            img_list: action.payload.request.data.json,
            accuracy,
            ap_system: action.payload.request.data.mAP,
            dataset:action.payload.dataset,
            confirm : action.payload.request.data.success,
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
          dataset: null,
        }
      });

    case TYPES.ERROR_MESSAGE:
    //   return { ...state, messageError: action.payload.data };
      return Object.assign({}, state, {
        messageError: action.payload.data
      });

    case TYPES.RESET_ERROR_MESSAGE:
    //   return { ...state, messageError: action.payload.data };
      return Object.assign({}, state, {
        messageError: null
      });

    default:
      return state;
  }
}
