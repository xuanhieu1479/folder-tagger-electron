import { START_LOADING, FINISH_LOADING } from './statusActionType';
import { reducerAction } from '../../../common/interfaces/feInterfaces';

interface statusReducerInterface {
  isLoading: boolean;
}
const initState = {
  isLoading: false
};

const statusReducer = (
  state: statusReducerInterface = initState,
  action: reducerAction
): statusReducerInterface => {
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
