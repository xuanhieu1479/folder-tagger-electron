import {
  START_LOADING,
  FINISH_LOADING,
  OPEN_DIALOG,
  CLOSE_DIALOG
} from './statusActionType';
import {
  ReducerAction,
  StatusReducer
} from '../../../common/interfaces/feInterfaces';

export const statusInitState: StatusReducer = {
  isLoading: false,
  isDialogOpen: false
};

const statusReducer = (
  state: StatusReducer = statusInitState,
  action: ReducerAction
): StatusReducer => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case FINISH_LOADING:
      return { ...state, isLoading: false };
    case OPEN_DIALOG:
      return { ...state, isDialogOpen: true };
    case CLOSE_DIALOG:
      return { ...state, isDialogOpen: false };
    default:
      return state;
  }
};

export default statusReducer;
