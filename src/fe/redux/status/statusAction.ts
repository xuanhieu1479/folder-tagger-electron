import { Dispatch } from 'redux';
import {
  START_LOADING,
  FINISH_LOADING,
  OPEN_DIALOG,
  CLOSE_DIALOG
} from './statusActionType';

const startLoading = (dispatch: Dispatch): void => {
  dispatch({ type: START_LOADING });
};
const finishLoading = (dispatch: Dispatch): void => {
  dispatch({ type: FINISH_LOADING });
};

const onOpenDialog = (dispatch: Dispatch): void => {
  dispatch({ type: OPEN_DIALOG });
};
const onCloseDialog = (dispatch: Dispatch): void => {
  dispatch({ type: CLOSE_DIALOG });
};

export { startLoading, finishLoading, onOpenDialog, onCloseDialog };
