import express, { Request, Response } from 'express';
import { Folder } from '../entity/entity';
import { Folder as FolderInterface } from '../../common/interfaces/commonInterfaces';
import {
  CONTROLLER_PATH,
  PAGINATION
} from '../../common/variables/commonVariables';
import {
  getFolderName,
  getFolderThumbnail
} from '../../utilities/utilityFunctions';

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
  const isRandom = params.isRandom === 'true';
  const { folders, status, message } = await folder.get({
    ...params,
    currentPage,
    itemsPerPage,
    isRandom
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

router.post(CONTROLLER_PATH.IMPORT, async (req: Request, res: Response) => {
  const { json } = req.body;
  const { status, message } = await folder.import(json);
  res.status(status).json({ message });
});

router.get(CONTROLLER_PATH.EXPORT, async (_req: Request, res: Response) => {
  const { status, message } = await folder.export();
  res.status(status).json({ message });
});

export default router;
