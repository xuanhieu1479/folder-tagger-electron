import express, { Request, Response } from 'express';
import { Tag } from '../entity/entity';
import { CONTROLLER_PATH } from '../../common/variables/commonVariables';

const router = express.Router();
const tag = new Tag();

router.get(CONTROLLER_PATH.GET, async (req: Request, res: Response) => {
  const params = req.query;
  const { tags, category, language, status, message } = await tag.get(params);
  res.status(status).json({ tags, category, language, message });
});

router.post(CONTROLLER_PATH.MODIFY, async (req: Request, res: Response) => {
  const params = req.body;
  const { status, message } = await tag.modifyTagsOfFolders(params);
  res.status(status).json({ message });
});

router.get(CONTROLLER_PATH.CALCULATE, async (_req: Request, res: Response) => {
  const { status, message } = await tag.calculateRelation();
  res.status(status).json({ message });
});

export default router;
