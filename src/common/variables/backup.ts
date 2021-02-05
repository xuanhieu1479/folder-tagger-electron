import moment from 'moment';
import { DATE_TIME } from './commonVariables';

const BACKUP_DIRECTORY = 'Backup';

const failedDataName = `${moment().format(
  DATE_TIME.DATE_TIME_FILE_FORMAT
)}-FAILED.json`;
const failedDataPath = `${BACKUP_DIRECTORY}/${failedDataName}`;
const exportDataName = `${moment().format(
  DATE_TIME.DATE_TIME_FILE_FORMAT
)}-BACKUP.json`;
const exportDataPath = `${BACKUP_DIRECTORY}/${exportDataName}`;

const BACKUP = {
  DIRECTORY: BACKUP_DIRECTORY,
  NAME: failedDataName,
  PATH_FAILED_IMPORT: failedDataPath,
  PATH_EXPORT: exportDataPath
};

export default BACKUP;
