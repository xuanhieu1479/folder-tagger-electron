import axios from 'axios';
import { API } from '../variables/commonVariables';

const axiosConfig = (): void => {
  axios.defaults.baseURL = API.BASE;
};

export default axiosConfig;
