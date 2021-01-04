import axios from 'axios';
import { ADD_ONE_FOLDER_API } from '../common/variables/api';

const addOneFolder = async (folderLocation: string): Promise<void> => {
  const { data } = await axios.post(ADD_ONE_FOLDER_API, { folderLocation });
  console.log(data);
};

export { addOneFolder };
