import { Dispatch } from 'redux';
import axios from 'axios';
import { Tags } from '../../../common/interfaces/commonInterfaces';
import { TAG_API } from '../../../common/variables/commonVariables';
import { GET_TAGS } from './tagActionType';
import { showMessage } from '../../../utilities/feUtilities';

interface GetTagsOfOneFolderInterface {
  tags: Array<Tags>;
  category: string | undefined;
  language: string | undefined;
}
interface ModifyTagsInterface {
  selectedFolders: Array<string>;
  existingTags: Array<Tags>;
  newTags: Array<Tags>;
  category?: string | undefined;
  language?: string | undefined;
  action: string;
  onSuccess: () => void;
}

const getTags = async (
  dispatch: Dispatch,
  folderLocation?: string
): Promise<void | GetTagsOfOneFolderInterface> => {
  try {
    const { data } = await axios.get(TAG_API.GET, {
      params: { folderLocation }
    });
    const { tags, category, language } = data;
    if (folderLocation) return { tags, category, language };
    dispatch({
      type: GET_TAGS,
      payload: { allTags: tags }
    });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

const modifyTagsOfFolders = async ({
  selectedFolders,
  existingTags,
  newTags,
  category,
  language,
  action,
  onSuccess
}: ModifyTagsInterface): Promise<void> => {
  try {
    await axios.post(TAG_API.MODIFY, {
      folderLocations: selectedFolders,
      existingTags,
      newTags,
      category,
      language,
      action
    });
    onSuccess();
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

export { getTags, modifyTagsOfFolders };
