import BACK_END_CONFIG from '../config/beConfig';

const BASE_API = `http://localhost:${BACK_END_CONFIG.PORT}`;

const MODULE = {
  FOLDER: '/folder',
  CATEGORY: '/category',
  LANGUAGE: '/language'
};

const CONTROLLER_PATH = {
  GET: '/',
  ADD_ONE: '/add-one',
  ADD_MANY: '/add-many'
};

const FOLDER_API = {
  GET: `${MODULE.FOLDER}${CONTROLLER_PATH.GET}`,
  ADD_ONE: `${MODULE.FOLDER}${CONTROLLER_PATH.ADD_ONE}`,
  ADD_MANY: `${MODULE.FOLDER}${CONTROLLER_PATH.ADD_MANY}`
};

const CATEGORY_API = {
  GET: `${MODULE.CATEGORY}${CONTROLLER_PATH.GET}`
};

const LANGUAGE_API = {
  GET: `${MODULE.LANGUAGE}${CONTROLLER_PATH.GET}`
};

export {
  BASE_API,
  MODULE,
  CONTROLLER_PATH,
  FOLDER_API,
  CATEGORY_API,
  LANGUAGE_API
};
