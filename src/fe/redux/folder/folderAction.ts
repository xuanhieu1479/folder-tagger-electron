import { Dispatch } from 'redux';
import axios from 'axios';
import { API } from '../../../common/variables/commonVariables';
import { FolderFilterParams } from '../../../common/interfaces/folderInterfaces';
import { UPDATE_FOLDERS } from './folderActionType';
import { showMessage } from '../../../utility/showMessage';
import { startLoading, finishLoading } from '../status/statusAction';

const getFolders = async (
  dispatch: Dispatch,
  params: FolderFilterParams
): Promise<void> => {
  try {
    startLoading(dispatch);
    const { data } = await axios.get(API.GET, { params });
    const { foldersList, totalFolders } = data.folders;
    dispatch({
      type: UPDATE_FOLDERS,
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
