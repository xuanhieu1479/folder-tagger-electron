import fs from 'fs';
import express, { Request, Response } from 'express';
import { Folder } from '../entity/entity';
import {
  CONTROLLER_PATH,
  MESSAGE,
  STATUS_CODE
} from '../../common/variables/commonVariables';

const router = express.Router();
const folder = new Folder();

router.post(CONTROLLER_PATH.ADD_ONE, async (req: Request, res: Response) => {
  const { folderLocation } = req.body;
  if (!fs.existsSync(folderLocation)) {
    res
      .status(STATUS_CODE.INVALID_DATA)
      .json({ message: MESSAGE.FOLDER_NOT_FOUND });
    return;
  }

  const { status, message } = await folder.addOne(folderLocation);
  res.status(status).json({ message });
});

router.post(CONTROLLER_PATH.ADD_MANY, async (req: Request, res: Response) => {
  const { folderLocations } = req.body;
  folderLocations.forEach((folderLocation: string) => {
    if (!fs.existsSync(folderLocation)) {
      res
        .status(STATUS_CODE.INVALID_DATA)
        .json({ message: MESSAGE.FOLDER_NOT_FOUND });
      return;
    }
  });

  const { status, message } = await folder.addMany(folderLocations);
  res.status(status).json({ message });
});

export default router;
