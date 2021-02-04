import fs from 'fs';
import {
  DATABASE,
  LOG,
  SETTING,
  BACKUP
} from '../common/variables/commonVariables';

const initDirectory = (): void => {
  const directoryList = [
    DATABASE.DIRECTORY,
    LOG.DIRECTORY,
    SETTING.DIRECTORY,
    BACKUP.DIRECTORY
  ];
  directoryList.forEach(directory => {
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);
  });
};

export default initDirectory;
