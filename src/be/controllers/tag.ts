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
  const { status, message, relations } = await tag.calculateRelation();
  res.status(status).json({ relations, message });
});

router.get(CONTROLLER_PATH.CLEAR, async (_req: Request, res: Response) => {
  const { status, message } = await tag.clear();
  res.status(status).json({ message });
});

router.get(CONTROLLER_PATH.REMOVE, async (req: Request, res: Response) => {
  const params = req.query;
  const { status, message } = await tag.removeAllTagsFromFolders(params);
  res.status(status).json({ message });
});

router.get(CONTROLLER_PATH.MANAGE, async (req: Request, res: Response) => {
  const params = req.query;
  const { managedTags, status, message } = await tag.getManagedTags(params);
  res.status(status).json({ managedTags, message });
});

router.post(CONTROLLER_PATH.UPDATE, async (req: Request, res: Response) => {
  const updatedTags = req.body.updatedTags || [];
  const { status, message } = await tag.updateTags(updatedTags);
  res.status(status).json({ message });
});

export default router;
