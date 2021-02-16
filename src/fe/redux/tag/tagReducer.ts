import {
  GET_TAGS,
  LOAD_TAG_RELATIONS,
  COPY_TAGS,
  GET_MANAGED_TAGS
} from './tagActionType';
import {
  ReducerAction,
  TagReducer
} from '../../../common/interfaces/feInterfaces';

export const tagInitState: TagReducer = {
  allTags: [],
  managedTags: [],
  clipboard: [],
  relations: { author_genre: {}, author_parody: {}, parody_character: {} }
};

const statusReducer = (
  state: TagReducer = tagInitState,
  action: ReducerAction
): TagReducer => {
  const data = action.payload || {};
  const { allTags, relations, clipboard, managedTags } = data;
  switch (action.type) {
    case GET_TAGS:
      return { ...state, allTags };
    case LOAD_TAG_RELATIONS:
      return { ...state, relations };
    case COPY_TAGS:
      return { ...state, clipboard };
    case GET_MANAGED_TAGS:
      return { ...state, managedTags };
    default:
      return state;
  }
};

export default statusReducer;
