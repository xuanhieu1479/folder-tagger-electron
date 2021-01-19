import { GET_TAGS } from './tagActionType';
import {
  ReducerAction,
  TagReducerInterface
} from '../../../common/interfaces/feInterfaces';

const initState = {
  artist: [],
  group: [],
  parody: [],
  character: [],
  genre: []
};

const statusReducer = (
  state: TagReducerInterface = initState,
  action: ReducerAction
): TagReducerInterface => {
  const data = action.payload || {};
  const { artist, group, parody, character, genre } = data;
  switch (action.type) {
    case GET_TAGS:
      return { ...state, artist, group, parody, character, genre };
    default:
      return state;
  }
};

export default statusReducer;
