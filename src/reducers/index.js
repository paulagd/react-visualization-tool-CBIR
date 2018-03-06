import { combineReducers } from 'redux';
// import reducerRelatedImages from './reducer-related-images';
// import reducerErrorMessage from './reducer-error-message';
import reducerImages from './reducer-images';

const rootReducer = combineReducers({
    // reducerRelatedImages,
    // reducerErrorMessage,
    reducerImages,
  });

export default rootReducer;
