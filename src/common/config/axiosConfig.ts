import axios from 'axios';
import { BASE_API } from '../variables/api';

axios.defaults.baseURL = BASE_API;
const axiosConfig = (): void => {
  axios.defaults.baseURL = BASE_API;
};

export default axiosConfig;
