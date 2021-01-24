import { Dispatch } from 'redux';
import axios from 'axios';
import { Tags } from '../../../common/interfaces/commonInterfaces';
import { TAG_API } from '../../../common/variables/commonVariables';
import { GET_TAGS } from './tagActionType';
import { showMessage } from '../../../utility/showMessage';

const getTags = async (dispatch: Dispatch): Promise<void> => {
  try {
    const { data } = await axios.get(TAG_API.GET);
    const { allTags } = data.tags;
    dispatch({
      type: GET_TAGS,
      payload: { allTags }
    });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

const createTags = async (params: Array<Tags>): Promise<void> => {
  try {
    await axios.post(TAG_API.CREATE_MANY, params);
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

const addTags = async (
  selectedFolders: Array<string>,
  tags: Array<Tags>,
  category: string | undefined,
  language: string | undefined
): Promise<void> => {
  try {
    await axios.post(TAG_API.ADD_MANY, {
      folderLocations: selectedFolders,
      tags,
      category,
      language
    });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

export { getTags, createTags, addTags };
