import { Dispatch } from 'redux';
import axios from 'axios';
import { TAG_API } from '../../../common/variables/commonVariables';
import { GET_TAGS } from './tagActionType';
import { showMessage } from '../../../utility/showMessage';

const getTags = async (dispatch: Dispatch): Promise<void> => {
  try {
    const { data } = await axios.get(TAG_API.GET);
    const { tags } = data;
    dispatch({
      type: GET_TAGS,
      payload: { ...tags }
    });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

export { getTags };
