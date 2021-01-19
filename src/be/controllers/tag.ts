import express, { Request, Response } from 'express';
import { Tag } from '../entity/entity';
import { CONTROLLER_PATH } from '../../common/variables/commonVariables';

const router = express.Router();
const tag = new Tag();

router.get(CONTROLLER_PATH.GET, async (_req: Request, res: Response) => {
  const { tags, status, message } = await tag.get();
  res.status(status).json({ tags, message });
});

export default router;
