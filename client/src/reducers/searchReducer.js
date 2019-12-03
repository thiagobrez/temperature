import * as types from '../utils/actionTypes';
import * as constants from '../utils/constants';

const INITIAL_STATE = {
  data: [],
  loading: {},
  error: {}
};

export default (state = INITIAL_STATE, action) => {
  
  switch (action.type) {
    case types.REQUEST_READ_SEARCHES:
      return {
        ...state,
        loading: {
          ...state.loading,
          [constants.READ_SEARCHES]: true
        }
      };
    
    case types.SUCCESS_READ_SEARCHES:
      return {
        data: action.payload.success,
        loading: {
          ...state.loading,
          [constants.READ_SEARCHES]: false
        },
        error: {
          ...state.error,
          [constants.READ_SEARCHES]: false
        }
      };
    
    case types.FAILURE_READ_SEARCHES:
      return {
        ...state,
        loading: {
          ...state.loading,
          [constants.READ_SEARCHES]: false
        },
        error: {
          ...state.error,
          [constants.READ_SEARCHES]: action.payload.error
        }
      };
    
    case types.REQUEST_CREATE_SEARCH:
      return {
        ...state,
        loading: {
          ...state.loading,
          [constants.CREATE_SEARCH]: true
        }
      };
    
    case types.SUCCESS_CREATE_SEARCH:
      return {
        data: [
          action.payload.success,
          ...state.data
        ],
        loading: {
          ...state.loading,
          [constants.CREATE_SEARCH]: false
        },
        error: {
          ...state.error,
          [constants.CREATE_SEARCH]: false
        }
      };
    
    case types.FAILURE_CREATE_SEARCH:
      return {
        ...state,
        loading: {
          ...state.loading,
          [constants.CREATE_SEARCH]: false
        },
        error: {
          ...state.error,
          [constants.CREATE_SEARCH]: action.payload.error
        }
      };
      
    default:
      return state;
  }
}
