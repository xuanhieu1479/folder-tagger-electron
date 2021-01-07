import { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { FOLDER_API } from '../../common/variables/api';
import folderRouter from './folder';

const initRouter = (app: Express): void => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(FOLDER_API, folderRouter);
};

export default initRouter;
