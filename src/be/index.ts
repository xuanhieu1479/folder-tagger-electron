import express from 'express';
import { BACK_END_PORT } from '../common/config/beConfig';
import initDatabase from './seed/';
import initLogging from './logging';
import initRouter from './controllers/';

const initBE = async (): Promise<void> => {
  await initDatabase();
  initLogging();

  const app = express();
  app.listen(BACK_END_PORT);
  initRouter(app);
};

export default initBE;
