import express, { Request, Response } from 'express';
import { ADD_ONE_FOLDER } from '../../common/variables/api';

const router = express.Router();

router.post(ADD_ONE_FOLDER, (req: Request, res: Response) => {
  res.send('alabama');
});

export default router;
