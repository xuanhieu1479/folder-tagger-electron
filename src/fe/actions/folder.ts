import axios from 'axios';
import { ADD_ONE_FOLDER_API } from '../../common/variables/api';
import { showMessage } from '../../utility/';

const addOneFolder = async (folderLocation: string): Promise<void> => {
  try {
    await axios.post(ADD_ONE_FOLDER_API, { folderLocation });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

export { addOneFolder };
