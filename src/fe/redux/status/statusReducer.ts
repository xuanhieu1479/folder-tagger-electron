import { START_LOADING, FINISH_LOADING } from './statusActionType';
import {
  ReducerAction,
  StatusReducerInterface
} from '../../../common/interfaces/feInterfaces';

export const statusInitState = {
  isLoading: false
};

const statusReducer = (
  state: StatusReducerInterface = statusInitState,
  action: ReducerAction
): StatusReducerInterface => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case FINISH_LOADING:
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export default statusReducer;
