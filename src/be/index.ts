import express, { Request, Response } from 'express';
import initDatabase from './seed/';
import initLogging from './logging';

const app = express();
const PORT = 8000;
app.get('/', (_req: Request, res: Response) =>
  res.send('Express + TypeScript Server')
);
app.listen(PORT);

initDatabase();
initLogging();
