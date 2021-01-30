import express, { Request, Response } from 'express';
import { Folder } from '../entity/entity';
import { Folder as FolderInterface } from '../../common/interfaces/commonInterfaces';
import {
  CONTROLLER_PATH,
  PAGINATION
} from '../../common/variables/commonVariables';
import { getFolderName, getFolderThumbnail } from '../../utility/folderUtility';

const router = express.Router();
const folder = new Folder();

router.get(CONTROLLER_PATH.GET, async (req: Request, res: Response) => {
  const params = req.query;
  const currentPage =
    typeof params.currentPage === 'string'
      ? parseInt(params.currentPage)
      : PAGINATION.DEFAULT.currentPage;
  const itemsPerPage =
    typeof params.itemsPerPage === 'string'
      ? parseInt(params.itemsPerPage)
      : PAGINATION.DEFAULT.itemsPerPage;
  const { folders, status, message } = await folder.get({
    ...params,
    currentPage,
    itemsPerPage
  });
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
