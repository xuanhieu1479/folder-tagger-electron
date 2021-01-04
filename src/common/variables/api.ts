import { BACK_END_PORT } from '../config/beConfig';

const BASE_API = `http://localhost:${BACK_END_PORT}`;
const FOLDER_API = '/folder';

const ADD_ONE_FOLDER = '/add-one';
const ADD_ONE_FOLDER_API = `${FOLDER_API}${ADD_ONE_FOLDER}`;

export { BASE_API, FOLDER_API, ADD_ONE_FOLDER, ADD_ONE_FOLDER_API };
