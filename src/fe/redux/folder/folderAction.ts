import { Dispatch } from 'redux';
import axios from 'axios';
import {
  FOLDER_API,
  CATEGORY_API,
  LANGUAGE_API,
  MESSAGE
} from '../../../common/variables/commonVariables';
import {
  FolderFilterParams,
  TransferData,
  RenameFolderParams
} from '../../../common/interfaces/commonInterfaces';
import {
  GET_FOLDERS,
  GET_CATEGORIES,
  GET_LANGUAGES,
  RENAME_FOLDER,
  REMOVE_FOLDER
} from './folderActionType';
import { SET_RANDOM, UNSET_RANDOM } from '../status/statusActionType';
import { showMessage } from '../../../utilities/feUtilities';
import { startLoading, finishLoading } from '../status/statusAction';

const getFolders = async (
  dispatch: Dispatch,
  params: FolderFilterParams
): Promise<void> => {
  try {
    startLoading(dispatch);
    const { isRandom } = params;
    const { data } = await axios.get(FOLDER_API.GET, { params });
    const { foldersList, totalFolders } = data.folders;
    dispatch({
      type: GET_FOLDERS,
      payload: {
        foldersList,
        totalFolders
      }
    });
    if (isRandom) dispatch({ type: SET_RANDOM, payload: { isRandom } });
    else dispatch({ type: UNSET_RANDOM, payload: { isRandom } });
  } catch (error) {
    showMessage.error(error);
  } finally {
    finishLoading(dispatch);
  }
};

const addFolders = async (
  dispatch: Dispatch,
  folderLocations: string[],
  refreshFolders: () => void
): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.post(FOLDER_API.ADD, { folderLocations });
    refreshFolders();
  } catch (error) {
    showMessage.error(error);
  } finally {
    finishLoading(dispatch);
  }
};

const importFolders = async (
  dispatch: Dispatch,
  json: TransferData[],
  isOverwrite: boolean | undefined,
  refreshFolders: () => void
): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.post(FOLDER_API.IMPORT, { json, isOverwrite });
    showMessage.success(MESSAGE.SUCCESS);
    refreshFolders();
  } catch (error) {
    showMessage.error(error);
  } finally {
    finishLoading(dispatch);
  }
};

/**
 * Do not pass dispatch to hide loading/success effect.
 */
const exportFolders = async (dispatch?: Dispatch): Promise<void> => {
  try {
    if (dispatch) startLoading(dispatch);
    await axios.get(FOLDER_API.EXPORT);
    if (dispatch) showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error);
  } finally {
    if (dispatch) finishLoading(dispatch);
  }
};

const getCategories = async (dispatch: Dispatch): Promise<void> => {
  try {
    const { data } = await axios.get(CATEGORY_API.GET);
    const { categories } = data;
    dispatch({ type: GET_CATEGORIES, payload: { categories } });
  } catch (error) {
    showMessage.error(error);
  }
};

const getLanguages = async (dispatch: Dispatch): Promise<void> => {
  try {
    const { data } = await axios.get(LANGUAGE_API.GET);
    const { languages } = data;
    dispatch({ type: GET_LANGUAGES, payload: { languages } });
  } catch (error) {
    showMessage.error(error);
  }
};

const clearFoldersUpdateThumbnails = async (
  dispatch: Dispatch,
  refreshFolders: () => void
): Promise<void> => {
  try {
    startLoading(dispatch);
    await exportFolders();
    await axios.delete(FOLDER_API.CLEAR);
    showMessage.success(MESSAGE.SUCCESS);
    refreshFolders();
  } catch (error) {
    showMessage.error(error);
  } finally {
    finishLoading(dispatch);
  }
};

const renameFolder = async (
  dispatch: Dispatch,
  params: RenameFolderParams
): Promise<void> => {
  try {
    const { data } = await axios.put(FOLDER_API.RENAME, { ...params });
    const { newLocation, newName, newThumbnail } = data;
    if (newLocation)
      dispatch({
        type: RENAME_FOLDER,
        payload: {
          oldLocation: params.oldLocation,
          newLocation,
          newName,
          newThumbnail
        }
      });
    showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error);
  }
};

const removeFolders = async (
  dispatch: Dispatch,
  removedFolders: string[]
): Promise<void> => {
  try {
    await axios.delete(FOLDER_API.REMOVE, { data: removedFolders });
    dispatch({ type: REMOVE_FOLDER, payload: { removedFolders } });
    showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error);
  }
};

export {
  getFolders,
  addFolders,
  importFolders,
  exportFolders,
  getCategories,
  getLanguages,
  clearFoldersUpdateThumbnails,
  renameFolder,
  removeFolders
};
