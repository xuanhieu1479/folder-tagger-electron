import express, { Request, Response } from 'express';
import { Category } from '../entity/entity';
import { CONTROLLER_PATH } from '../../common/variables/commonVariables';

const router = express.Router();
const category = new Category();

router.get(CONTROLLER_PATH.GET, async (_req: Request, res: Response) => {
  const { categories, status, message } = await category.get();
  res.status(status).json({ categories, message });
});

export default router;
