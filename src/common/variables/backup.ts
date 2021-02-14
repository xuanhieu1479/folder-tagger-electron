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

const NAME_DELETED = `${moment().format(
  DateTime.DateTimeFileFormat
)}-DELETED.json`;
const PATH_DELETE = `${DIRECTORY}/${NAME_DELETED}`;

const BACKUP = {
  DIRECTORY,
  PATH_FAILED_IMPORT,
  PATH_EXPORT,
  PATH_DELETE
};

export default BACKUP;
