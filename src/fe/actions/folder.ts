import axios from 'axios';
import { API } from '../../common/variables/commonVariables';
import {
  folder,
  folderFilterParams
} from '../../common/interfaces/folderInterfaces';
import { showMessage } from '../../utility/utility';

const getFolders = async (
  params?: folderFilterParams
): Promise<Array<folder>> => {
  try {
    const { data } = await axios.get(API.GET, { params });
    return data.folders;
  } catch (error) {
    showMessage.error(error.response.data.message);
    return [];
  }
};

const addOneFolder = async (folderLocation: string): Promise<void> => {
  try {
    await axios.post(API.ADD_ONE, { folderLocation });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

const addParentFolder = async (folderLocations: string[]): Promise<void> => {
  try {
    await axios.post(API.ADD_MANY, { folderLocations });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

export { getFolders, addOneFolder, addParentFolder };
