import express, { Request, Response } from 'express';
import { Tag } from '../entity/entity';
import { CONTROLLER_PATH } from '../../common/variables/commonVariables';

const router = express.Router();
const tag = new Tag();

router.get(CONTROLLER_PATH.GET, async (_req: Request, res: Response) => {
  const { tags, status, message } = await tag.get();
  res.status(status).json({ tags, message });
});

router.post(
  CONTROLLER_PATH.CREATE_MANY,
  async (req: Request, res: Response) => {
    const params = req.body;
    const { status, message } = await tag.create(params);
    res.status(status).json({ message });
  }
);

router.post(CONTROLLER_PATH.ADD_MANY, async (req: Request, res: Response) => {
  const params = req.body;
  const { status, message } = await tag.addToFolders(params);
  res.status(status).json({ message });
});

export default router;
