import express, { Request, Response } from 'express';
import { BACK_END_PORT } from '../common/config/beConfig';
import initDatabase from './seed/';
import initLogging from './logging';

const app = express();
app.get('/', (_req: Request, res: Response) =>
  res.send('Express + TypeScript Server')
);
app.listen(BACK_END_PORT);

initDatabase();
initLogging();
