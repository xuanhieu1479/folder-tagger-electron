import moment from 'moment';
import { DateTime } from '../enums/commonEnums';

const DIRECTORY = 'Backup';

const BACKUP = {
  DIRECTORY,
  PATH_FAILED_IMPORT: (momentObj: moment.Moment): string =>
    `${DIRECTORY}/${momentObj.format(DateTime.DateTimeFileFormat)}-FAILED.json`,
  PATH_EXPORT: (momentObj: moment.Moment): string =>
    `${DIRECTORY}/${momentObj.format(DateTime.DateTimeFileFormat)}-BACKUP.json`,
  PATH_DELETE: (momentObj: moment.Moment): string =>
    `${DIRECTORY}/${momentObj.format(DateTime.DateTimeFileFormat)}-DELETED.json`
};

export default BACKUP;
