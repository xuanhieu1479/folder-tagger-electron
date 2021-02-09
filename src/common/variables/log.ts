import moment from 'moment';
import { DATE_TIME } from '../enums/commonEnums';

const DIRECTORY = 'Log';

const seperator = '-'.repeat(100);
const NAME = `${moment().format(DATE_TIME.DATE_FILE_FORMAT)}.log`;
const PATH = `${DIRECTORY}/${NAME}`;

const LOG = {
  DIRECTORY,
  NAME,
  PATH,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ERROR_MESSAGE: (error: Error | any, origin: Promise<any> | string): string =>
    `${moment().format(
      DATE_TIME.TIME_LOG_FORMAT
    )}\n\nError: ${error}\n\nOrigin: ${origin}\n\n${seperator}\n`
};

export default LOG;
