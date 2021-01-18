import express, { Request, Response } from 'express';
import { Language } from '../entity/entity';
import { CONTROLLER_PATH } from '../../common/variables/commonVariables';

const router = express.Router();
const language = new Language();

router.get(CONTROLLER_PATH.GET, async (_req: Request, res: Response) => {
  const { languages, status, message } = await language.get();
  res.status(status).json({ languages, message });
});

export default router;
