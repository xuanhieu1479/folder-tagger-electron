import axios from 'axios';
import { API } from '../../common/variables/commonVariables';
import {
  Folder,
  FolderFilterParams
} from '../../common/interfaces/folderInterfaces';
import { showMessage } from '../../utility/utility';

const getFolders = async (
  startLoading: () => void,
  finishLoading: () => void,
  params?: FolderFilterParams
): Promise<Array<Folder>> => {
  try {
    startLoading();
    const { data } = await axios.get(API.GET, { params });
    return data.folders;
  } catch (error) {
    showMessage.error(error.response.data.message);
    return [];
  } finally {
    finishLoading();
  }
};

const addOneFolder = async (
  folderLocation: string,
  startLoading: () => void,
  finishLoading: () => void
): Promise<void> => {
  try {
    startLoading();
    await axios.post(API.ADD_ONE, { folderLocation });
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading();
  }
};

const addParentFolder = async (
  folderLocations: string[],
  startLoading: () => void,
  finishLoading: () => void
): Promise<void> => {
  try {
    startLoading();
    await axios.post(API.ADD_MANY, { folderLocations });
  } catch (error) {
    showMessage.error(error.response.data.message);
  } finally {
    finishLoading();
  }
};

export { getFolders, addOneFolder, addParentFolder };
