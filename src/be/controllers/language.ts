import express, { Request, Response } from 'express';
import { Language } from '../entity/entity';
import { CONTROLLER_PATH } from '../../common/variables/commonVariables';

const router = express.Router();

router.get(CONTROLLER_PATH.GET, async (_req: Request, res: Response) => {
  const { languages, status, message } = await new Language().get();
  res.status(status).json({ languages, message });
});

export default router;
