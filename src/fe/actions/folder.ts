import axios from 'axios';
import { API } from '../../common/variables/commonVariables';
import { showMessage } from '../../utility/utility';

const addOneFolder = async (folderLocation: string): Promise<void> => {
  try {
    await axios.post(API.ADD_ONE, { folderLocation });
  } catch (error) {
    showMessage.error(error.response.data.message);
  }
};

export { addOneFolder };
