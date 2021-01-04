import { Express } from 'express';
import { FOLDER_API } from '../../common/variables/api';
import folderRouter from './folder';

const initRouter = (app: Express): void => {
  app.use(FOLDER_API, folderRouter);
};

export default initRouter;
