import express, { Request, Response } from 'express';
import { Category } from '../entity/entity';
import { CONTROLLER_PATH } from '../../common/variables/commonVariables';

const router = express.Router();

router.get(CONTROLLER_PATH.GET, async (_req: Request, res: Response) => {
  const { categories, status, message } = await new Category().get();
  res.status(status).json({ categories, message });
});

export default router;
