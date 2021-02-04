import moment from 'moment';
import { DATE_TIME } from './commonVariables';

const LOG_DIRECTORY = 'Log';

const seperator = '-'.repeat(100);
const logFileName = `${moment().format(DATE_TIME.DATE_FILE_FORMAT)}.log`;
const logFilePath = `${LOG_DIRECTORY}/${logFileName}`;

const LOG = {
  DIRECTORY: LOG_DIRECTORY,
  NAME: logFileName,
  PATH: logFilePath,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ERROR_MESSAGE: (error: Error | any, origin: Promise<any> | string): string =>
    `${moment().format(
      DATE_TIME.TIME_LOG_FORMAT
    )}\n\nError: ${error}\n\nOrigin: ${origin}\n\n${seperator}\n`
};

export default LOG;
