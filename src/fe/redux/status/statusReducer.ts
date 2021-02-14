import {
  START_LOADING,
  FINISH_LOADING,
  OPEN_DIALOG,
  CLOSE_DIALOG,
  SET_RANDOM,
  UNSET_RANDOM
} from './statusActionType';
import {
  ReducerAction,
  StatusReducer
} from '../../../common/interfaces/feInterfaces';

export const statusInitState: StatusReducer = {
  isLoading: false,
  isDialogOpen: false,
  isRandom: false
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
    case SET_RANDOM:
      return { ...state, isRandom: true };
    case UNSET_RANDOM:
      return { ...state, isRandom: false };
    default:
      return state;
  }
};

export default statusReducer;
