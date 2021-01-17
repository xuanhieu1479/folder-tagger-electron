import { Dispatch } from 'redux';
import axios from 'axios';
import { API } from '../../common/variables/commonVariables';
import {
  Folder,
  FolderFilterParams
} from '../../common/interfaces/folderInterfaces';
import { showMessage } from '../../utility/showMessage';
import { startLoading, finishLoading } from '../../utility/showLoadingOverlay';

const getFolders = async (
  dispatch: Dispatch,
  params?: FolderFilterParams
): Promise<Array<Folder>> => {
  try {
    startLoading(dispatch);
    const { data } = await axios.get(API.GET, { params });
    return data.folders;
  } catch (error) {
    showMessage.error(error.response.data.message);
    return [];
  } finally {
    finishLoading(dispatch);
  }
};

const addOneFolder = async (
  dispatch: Dispatch,
  folderLocation: string
): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.post(API.ADD_ONE, { folderLocation });
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading(dispatch);
  }
};

const addParentFolder = async (
  dispatch: Dispatch,
  folderLocations: string[]
): Promise<void> => {
  try {
    startLoading(dispatch);
    await axios.post(API.ADD_MANY, { folderLocations });
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading(dispatch);
  }
};

export { getFolders, addOneFolder, addParentFolder };
