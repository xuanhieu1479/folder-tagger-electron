import express from 'express';
import './logging';

const app = express();
const PORT = 8000;

app.get('/', (_req: any, res: any) => res.send('Express + TypeScript Server'));

app.listen(PORT, () => {});
