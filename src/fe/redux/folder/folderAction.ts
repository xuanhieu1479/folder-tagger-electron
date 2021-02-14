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
  TransferData
} from '../../../common/interfaces/commonInterfaces';
import { GET_FOLDERS, GET_CATEGORIES, GET_LANGUAGES } from './folderActionType';
import { showMessage } from '../../../utilities/feUtilities';
import { startLoading, finishLoading } from '../status/statusAction';

const getFolders = async (
  dispatch: Dispatch,
  params: FolderFilterParams
): Promise<void> => {
  try {
    startLoading(dispatch);
    const { data } = await axios.get(FOLDER_API.GET, { params });
    const { foldersList, totalFolders } = data.folders;
    dispatch({
      type: GET_FOLDERS,
      payload: {
        foldersList,
        totalFolders
      }
    });
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading(dispatch);
  }
};

const addFolders = async (
  dispatch: Dispatch,
  folderLocations: string[]
): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.post(FOLDER_API.ADD, { folderLocations });
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading(dispatch);
  }
};

const importFolders = async (
  dispatch: Dispatch,
  json: TransferData[]
): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.post(FOLDER_API.IMPORT, { json });
    showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading(dispatch);
  }
};

const exportFolders = async (dispatch: Dispatch): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.get(FOLDER_API.EXPORT);
    showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading(dispatch);
  }
};

const getCategories = async (dispatch: Dispatch): Promise<void> => {
  try {
    const { data } = await axios.get(CATEGORY_API.GET);
    const { categories } = data;
    dispatch({ type: GET_CATEGORIES, payload: { categories } });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

const getLanguages = async (dispatch: Dispatch): Promise<void> => {
  try {
    const { data } = await axios.get(LANGUAGE_API.GET);
    const { languages } = data;
    dispatch({ type: GET_LANGUAGES, payload: { languages } });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

const clearNonexistentFolders = async (dispatch: Dispatch): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.get(FOLDER_API.CLEAR);
    showMessage.success(MESSAGE.SUCCESS);
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading(dispatch);
  }
};

export {
  getFolders,
  addFolders,
  importFolders,
  exportFolders,
  getCategories,
  getLanguages,
  clearNonexistentFolders
};
