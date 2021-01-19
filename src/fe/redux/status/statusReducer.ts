import { START_LOADING, FINISH_LOADING } from './statusActionType';
import {
  ReducerAction,
  StatusReducerInterface
} from '../../../common/interfaces/feInterfaces';

const initState = {
  isLoading: false
};

const statusReducer = (
  state: StatusReducerInterface = initState,
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
