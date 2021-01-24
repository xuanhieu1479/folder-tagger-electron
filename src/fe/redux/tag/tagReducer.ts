import { GET_TAGS } from './tagActionType';
import {
  ReducerAction,
  TagReducerInterface
} from '../../../common/interfaces/feInterfaces';

export const tagInitState = {
  allTags: []
};

const statusReducer = (
  state: TagReducerInterface = tagInitState,
  action: ReducerAction
): TagReducerInterface => {
  const data = action.payload || {};
  const { allTags } = data;
  switch (action.type) {
    case GET_TAGS:
      return { ...state, allTags };
    default:
      return state;
  }
};

export default statusReducer;
