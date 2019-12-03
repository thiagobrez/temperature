import * as types from '../utils/actionTypes';
import {
  CREATE_SEARCH,
  READ_SEARCHES
} from '../utils/endpoints';

export const readSearches = () => dispatch => {
  dispatch({type: types.REQUEST_READ_SEARCHES});
  
  fetch(READ_SEARCHES, {
    method: 'GET',
    headers: {
      Accept: 'application/json; version=1.0'
    }
  })
    .then(async response => {
      dispatch({
        type: types.SUCCESS_READ_SEARCHES,
        payload: {success: await response.json()}
      })
    })
    .catch(error => {
      dispatch({
        type: types.FAILURE_READ_SEARCHES,
        payload: {error}
      });
    });
};

export const createSearch = expression => dispatch => {
  dispatch({type: types.REQUEST_CREATE_SEARCH});
  
  fetch(CREATE_SEARCH, {
    method: 'POST',
    headers: {
      Accept: 'application/json; version=1.0',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      expression
    })
  })
    .then(async response => {
      let data = await response.json();
      
      dispatch(data.error ? {
          type: types.FAILURE_CREATE_SEARCH,
          payload: {error: data.error}
        } : {
          type: types.SUCCESS_CREATE_SEARCH,
          payload: {success: data}
        }
      );
    })
    .catch(error => {
      dispatch({
        type: types.FAILURE_CREATE_SEARCH,
        payload: {error}
      });
    });
};
