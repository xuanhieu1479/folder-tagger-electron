import { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MODULE } from '../../common/variables/commonVariables';
import folderRouter from './folder';
import categoryRouter from './category';
import languageRouter from './language';

const initRouter = (app: Express): void => {
  app.use(cors());
  app.use(bodyParser.json());
  app.get('/', (_req: Request, res: Response) => {
    res.send('Server is running!');
  });
  app.use(MODULE.FOLDER, folderRouter);
  app.use(MODULE.CATEGORY, categoryRouter);
  app.use(MODULE.LANGUAGE, languageRouter);
};

export default initRouter;
