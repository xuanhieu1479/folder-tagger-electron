import moment from 'moment';
import { DateTime } from '../enums/commonEnums';

const DIRECTORY = 'Backup';

const NAME_FAILED_IMPORT = `${moment().format(
  DateTime.DateTimeFileFormat
)}-FAILED.json`;
const PATH_FAILED_IMPORT = `${DIRECTORY}/${NAME_FAILED_IMPORT}`;
const NAME_EXPORT = `${moment().format(
  DateTime.DateTimeFileFormat
)}-BACKUP.json`;
const PATH_EXPORT = `${DIRECTORY}/${NAME_EXPORT}`;

const BACKUP = {
  DIRECTORY,
  NAME_FAILED_IMPORT,
  PATH_FAILED_IMPORT,
  NAME_EXPORT,
  PATH_EXPORT
};

export default BACKUP;
