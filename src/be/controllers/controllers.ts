import { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MODULE } from '../../common/variables/commonVariables';
import folderRouter from './folder';

const initRouter = (app: Express): void => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(MODULE.FOLDER, folderRouter);
};

export default initRouter;
