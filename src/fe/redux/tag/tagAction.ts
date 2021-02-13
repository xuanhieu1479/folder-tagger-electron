import { Dispatch } from 'redux';
import axios from 'axios';
import fs from 'fs';
import {
  BreakDownTagsType,
  Tags
} from '../../../common/interfaces/commonInterfaces';
import {
  TAG_API,
  MESSAGE,
  SETTING
} from '../../../common/variables/commonVariables';
import { showMessage } from '../../../utilities/feUtilities';
import { COPY_TAGS, GET_TAGS, LOAD_TAG_RELATIONS } from './tagActionType';
import { startLoading, finishLoading } from '../status/statusAction';

interface GetTagsOfOneFolder {
  tags: Array<Tags>;
  category?: string;
  language?: string;
}
interface ModifyTags {
  selectedFolders: Array<string>;
  existingTags: Array<Tags>;
  newTags: Array<Tags>;
  category?: string;
  language?: string;
  action: string;
  onSuccess: () => void;
}

const getTags = async (
  dispatch: Dispatch,
  folderLocation?: string
): Promise<void | GetTagsOfOneFolder> => {
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

const copyTags = async (
  dispatch: Dispatch,
  folderLocation: string,
  includedTagTypes: Array<BreakDownTagsType>,
  onSuccess: () => void
): Promise<void> => {
  try {
    const { data } = await axios.get(TAG_API.GET, {
      params: { folderLocation, includedTagTypes }
    });
    const { tags } = data;
    dispatch({
      type: COPY_TAGS,
      payload: { clipboard: tags }
    });
    showMessage.info(MESSAGE.COPY_FOLDER_TAGS_TO_CLIPBOARD(includedTagTypes));
    onSuccess();
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
}: ModifyTags): Promise<void> => {
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

const calculateTagRelations = async (dispatch: Dispatch): Promise<void> => {
  try {
    startLoading(dispatch);
    const { data } = await axios.get(TAG_API.CALCULATE_RELATION);
    const { relations } = data;
    if (relations)
      dispatch({ type: LOAD_TAG_RELATIONS, payload: { relations } });
    showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading(dispatch);
  }
};

const loadTagRelations = (dispatch: Dispatch): void => {
  try {
    if (fs.existsSync(SETTING.RELATION_PATH)) {
      const relations = JSON.parse(
        fs.readFileSync(SETTING.RELATION_PATH).toString()
      );
      dispatch({ type: LOAD_TAG_RELATIONS, payload: { relations } });
    }
  } catch (error) {
    showMessage.error(error);
  }
};

export {
  getTags,
  copyTags,
  modifyTagsOfFolders,
  calculateTagRelations,
  loadTagRelations
};
