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
  const { folders, status, message } = await new Folder().get({
    ...params,
    currentPage,
    itemsPerPage,
    isRandom
  });
  res.status(status).json({ folders, message });
});

router.post(CONTROLLER_PATH.ADD, async (req: Request, res: Response) => {
  const { folderLocations } = req.body;
  const params: FolderInterface[] = [];
  for (const folderLocation of folderLocations) {
    params.push({
      location: folderLocation,
      name: getFolderName(folderLocation),
      thumbnail: getFolderThumbnail(folderLocation)
    });
  }

  const { status, message } = await new Folder().add(params);
  res.status(status).json({ message });
});

router.post(CONTROLLER_PATH.IMPORT, async (req: Request, res: Response) => {
  const { json, isOverwrite } = req.body;
  const { status, message } = await new Folder().import(json, isOverwrite);
  res.status(status).json({ message });
});

router.get(CONTROLLER_PATH.EXPORT, async (_req: Request, res: Response) => {
  const { status, message } = await new Folder().export();
  res.status(status).json({ message });
});

router.delete(CONTROLLER_PATH.CLEAR, async (_req: Request, res: Response) => {
  const { status, message } = await new Folder().clear();
  res.status(status).json({ message });
});

router.put(CONTROLLER_PATH.RENAME, async (req: Request, res: Response) => {
  const {
    newLocation,
    newName,
    newThumbnail,
    status,
    message
  } = await new Folder().rename({
    oldLocation: req.body.oldLocation,
    newLocation: req.body.newLocation
  });
  res.status(status).json({ newLocation, newName, newThumbnail, message });
});

router.delete(CONTROLLER_PATH.REMOVE, async (req: Request, res: Response) => {
  const removedFolders = req.body;
  const { message, status } = await new Folder().remove(removedFolders);
  res.status(status).json({ message });
});

export default router;
