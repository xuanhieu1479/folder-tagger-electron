import express, { Request, Response } from 'express';
import { Folder } from '../entity/entity';
import { CONTROLLER_PATH } from '../../common/variables/commonVariables';
import { Folder as FolderInterface } from '../../common/interfaces/commonInterfaces';
import { getFolderName, getFolderThumbnail } from '../../utility/folderUtility';

const router = express.Router();
const folder = new Folder();

router.get(CONTROLLER_PATH.GET, async (req: Request, res: Response) => {
  const params = req.query;
  const { folders, status, message } = await folder.get(params);
  res.status(status).json({ folders, message });
});

router.post(CONTROLLER_PATH.ADD, async (req: Request, res: Response) => {
  const { folderLocations } = req.body;
  const params: Array<FolderInterface> = [];
  for (const folderLocation of folderLocations) {
    params.push({
      location: folderLocation,
      name: getFolderName(folderLocation),
      thumbnail: getFolderThumbnail(folderLocation)
    });
  }

  const { status, message } = await folder.add(params);
  res.status(status).json({ message });
});

export default router;
