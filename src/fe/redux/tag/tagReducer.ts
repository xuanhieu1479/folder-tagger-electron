import { GET_TAGS, LOAD_TAG_RELATIONS, COPY_TAGS } from './tagActionType';
import {
  ReducerAction,
  TagReducer
} from '../../../common/interfaces/feInterfaces';

export const tagInitState: TagReducer = {
  allTags: [],
  relations: { author_genre: {}, author_parody: {}, parody_character: {} },
  clipboard: []
};

const statusReducer = (
  state: TagReducer = tagInitState,
  action: ReducerAction
): TagReducer => {
  const data = action.payload || {};
  const { allTags, relations, clipboard } = data;
  switch (action.type) {
    case GET_TAGS:
      return { ...state, allTags };
    case LOAD_TAG_RELATIONS:
      return { ...state, relations };
    case COPY_TAGS:
      return { ...state, clipboard };
    default:
      return state;
  }
};

export default statusReducer;
