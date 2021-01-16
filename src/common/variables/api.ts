import BACK_END_CONFIG from '../config/beConfig';

const MODULE = {
  FOLDER: '/folder'
};

const CONTROLLER_PATH = {
  GET: '/',
  ADD_ONE: '/add-one',
  ADD_MANY: '/add-many'
};

const API = {
  BASE: `http://localhost:${BACK_END_CONFIG.PORT}`,
  GET: `${MODULE.FOLDER}${CONTROLLER_PATH.GET}`,
  ADD_ONE: `${MODULE.FOLDER}${CONTROLLER_PATH.ADD_ONE}`,
  ADD_MANY: `${MODULE.FOLDER}${CONTROLLER_PATH.ADD_MANY}`
};

export { MODULE, CONTROLLER_PATH, API };
