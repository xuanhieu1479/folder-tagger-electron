import fs from 'fs';
import express, { Request, Response } from 'express';
import { Folder } from '../entity/entity';
import {
  CONTROLLER_PATH,
  MESSAGE,
  STATUS_CODE
} from '../../common/variables/commonVariables';
import { Folder as FolderInterface } from '../../common/interfaces/folderInterfaces';
import { getFolderName, getFolderThumbnail } from '../../utility/folderUtility';

const router = express.Router();
const folder = new Folder();

router.get(CONTROLLER_PATH.GET, async (req: Request, res: Response) => {
  const params = req.body;
  const { folders, status, message } = await folder.get(params);
  res.status(status).json({ folders, message });
});

router.post(CONTROLLER_PATH.ADD_ONE, async (req: Request, res: Response) => {
  const { folderLocation } = req.body;
  if (!fs.existsSync(folderLocation)) {
    res
      .status(STATUS_CODE.INVALID_DATA)
      .json({ message: MESSAGE.FOLDER_NOT_FOUND });
    return;
  }

  const params: FolderInterface = {
    location: folderLocation,
    name: getFolderName(folderLocation),
    thumbnail: getFolderThumbnail(folderLocation)
  };
  const { status, message } = await folder.addOne(params);
  res.status(status).json({ message });
});

router.post(CONTROLLER_PATH.ADD_MANY, async (req: Request, res: Response) => {
  const { folderLocations } = req.body;
  const params: FolderInterface[] = [];
  for (const folderLocation of folderLocations) {
    if (!fs.existsSync(folderLocation)) {
      res
        .status(STATUS_CODE.INVALID_DATA)
        .json({ message: MESSAGE.FOLDER_NOT_FOUND });
      return;
    }

    params.push({
      location: folderLocation,
      name: getFolderName(folderLocation),
      thumbnail: getFolderThumbnail(folderLocation)
    });
  }

  const { status, message } = await folder.addMany(params);
  res.status(status).json({ message });
});

export default router;
