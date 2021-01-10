import BACK_END_CONFIG from '../config/beConfig';

const MODULE = {
  FOLDER: '/folder'
};

const CONTROLLER_PATH = {
  ADD_ONE: '/add-one'
};

const API = {
  BASE: `http://localhost:${BACK_END_CONFIG.PORT}`,
  ADD_ONE: `${MODULE.FOLDER}${CONTROLLER_PATH.ADD_ONE}`
};

export { MODULE, CONTROLLER_PATH, API };
