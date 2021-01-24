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

const addTags = async (
  selectedFolders: Array<string>,
  existingTags: Array<Tags>,
  newTags: Array<Tags>,
  category: string | undefined,
  language: string | undefined,
  onSuccess: () => void
): Promise<void> => {
  try {
    await axios.post(TAG_API.ADD, {
      folderLocations: selectedFolders,
      existingTags,
      newTags,
      category,
      language
    });
    onSuccess();
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

export { getTags, addTags };
