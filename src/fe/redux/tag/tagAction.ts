import { Dispatch } from 'redux';
import axios from 'axios';
import fs from 'fs';
import {
  BreakDownTagType,
  Tag,
  ManageTagsFilterParams,
  UpdatedTag
} from '../../../common/interfaces/commonInterfaces';
import {
  TAG_API,
  MESSAGE,
  SETTING
} from '../../../common/variables/commonVariables';
import {
  COPY_TAGS,
  GET_TAGS,
  LOAD_TAG_RELATIONS,
  GET_MANAGED_TAGS
} from './tagActionType';
import { startLoading, finishLoading } from '../status/statusAction';
import { fileExists } from '../../../utilities/utilityFunctions';
import { showMessage } from '../../../utilities/feUtilities';

interface GetTagsOfOneFolder {
  tags: Tag[];
  category?: string;
  language?: string;
}
interface ModifyTags {
  selectedFolders: string[];
  existingTags: Tag[];
  newTags: Tag[];
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
    showMessage.error(error);
  }
};

const copyTags = async (
  dispatch: Dispatch,
  folderLocation: string,
  includedTagTypes: BreakDownTagType[],
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
    showMessage.error(error);
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
    showMessage.error(error);
  }
};

const calculateTagRelations = async (dispatch: Dispatch): Promise<void> => {
  try {
    startLoading(dispatch);
    const { data } = await axios.get(TAG_API.CALCULATE_RELATION);
    const { relations } = data;
    if (relations) {
      dispatch({ type: LOAD_TAG_RELATIONS, payload: { relations } });
      showMessage.success(MESSAGE.SUCCESS);
    } else showMessage.info(MESSAGE.CANNOT_CALCULATE_TAG_RELATIONS);
  } catch (error) {
    showMessage.error(error);
  } finally {
    finishLoading(dispatch);
  }
};

const loadTagRelations = (dispatch: Dispatch): void => {
  try {
    if (fileExists(SETTING.RELATION_PATH)) {
      const relations = JSON.parse(
        fs.readFileSync(SETTING.RELATION_PATH).toString()
      );
      dispatch({ type: LOAD_TAG_RELATIONS, payload: { relations } });
    }
  } catch (error) {
    showMessage.error(error);
  }
};

const clearUnusedTags = async (dispatch: Dispatch): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.get(TAG_API.CLEAR);
    showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error);
  } finally {
    finishLoading(dispatch);
  }
};

const removeAllTagsFromFolders = async (
  folderLocations: string[]
): Promise<void> => {
  try {
    await axios.get(TAG_API.REMOVE, { params: { folderLocations } });
    showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error);
  }
};

const getManagedTags = async (
  dispatch: Dispatch,
  params: ManageTagsFilterParams
): Promise<void> => {
  try {
    const { data } = await axios.get(TAG_API.MANAGE, { params });
    const { managedTags } = data;
    dispatch({ type: GET_MANAGED_TAGS, payload: { managedTags } });
  } catch (error) {
    showMessage.error(error);
  }
};

const updateTags = async (
  updatedTags: UpdatedTag[],
  onSuccess: () => void,
  onFinally: () => void
): Promise<void> => {
  try {
    await axios.post(TAG_API.UPDATE, { updatedTags });
    showMessage.success(MESSAGE.SUCCESS);
    onSuccess();
  } catch (error) {
    showMessage.error(error);
  } finally {
    onFinally();
  }
};

export {
  getTags,
  copyTags,
  modifyTagsOfFolders,
  calculateTagRelations,
  loadTagRelations,
  clearUnusedTags,
  removeAllTagsFromFolders,
  getManagedTags,
  updateTags
};
