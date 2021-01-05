import fs from 'fs';
import express, { Request, Response } from 'express';
import Folder from '../entity/Folder';
import { ADD_ONE_FOLDER } from '../../common/variables/api';
import MESSAGE from '../../common/variables/message';
import STATUS_CODE from '../../common/variables/statusCode';

const router = express.Router();
const folder = new Folder();

router.post(ADD_ONE_FOLDER, async (req: Request, res: Response) => {
  const { folderLocation } = req.body;
  if (!fs.existsSync(folderLocation)) {
    res
      .status(STATUS_CODE.INVALID_DATA)
      .json({ message: MESSAGE.FOLDER_NOT_FOUND });
    return;
  }

  const { status, message } = await folder.addFolder(folderLocation);
  res.status(status).json({ message });
});

export default router;
