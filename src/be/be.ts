import express from 'express';
import BACK_END_CONFIG from '../common/config/beConfig';
import initDatabase from './seed/seed';
import initLogging from './logging';
import initRouter from './controllers/controllers';

const initBE = async (): Promise<void> => {
  initLogging();
  await initDatabase();

  const app = express();
  app.listen(BACK_END_CONFIG.PORT);
  initRouter(app);
};

export default initBE;
