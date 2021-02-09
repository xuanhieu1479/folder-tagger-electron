import { Dispatch } from 'redux';
import axios from 'axios';
import { Tags } from '../../../common/interfaces/commonInterfaces';
import { TAG_API, MESSAGE } from '../../../common/variables/commonVariables';
import { showMessage } from '../../../utilities/feUtilities';
import { GET_TAGS } from './tagActionType';
import { startLoading, finishLoading } from '../status/statusAction';

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
  const getTagsForFolder = folderLocation !== undefined;
  try {
    const { data } = await axios.get(TAG_API.GET, {
      params: { folderLocation }
    });
    const { tags, category, language } = data;
    if (getTagsForFolder) return { tags, category, language };
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

const calculateTagsRelation = async (dispatch: Dispatch): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.get(TAG_API.CALCULATE_RELATION);
    showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading(dispatch);
  }
};

export { getTags, modifyTagsOfFolders, calculateTagsRelation };
