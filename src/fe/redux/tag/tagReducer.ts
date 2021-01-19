import { GET_TAGS } from './tagActionType';
import { ReducerAction } from '../../../common/interfaces/feInterfaces';

interface TagReducerInterface {
  artist: Array<string>;
  group: Array<string>;
  parody: Array<string>;
  character: Array<string>;
  genre: Array<string>;
}
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
