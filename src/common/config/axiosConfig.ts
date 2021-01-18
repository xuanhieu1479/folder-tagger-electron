import axios from 'axios';
import { BASE_API } from '../variables/commonVariables';

const axiosConfig = (): void => {
  axios.defaults.baseURL = BASE_API;
};

export default axiosConfig;
