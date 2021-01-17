import { Dispatch } from 'redux';
import { START_LOADING, FINISH_LOADING } from './statusActionType';

const startLoading = (dispatch: Dispatch): void => {
  dispatch({ type: START_LOADING });
};

const finishLoading = (dispatch: Dispatch): void => {
  dispatch({ type: FINISH_LOADING });
};

export { startLoading, finishLoading };
