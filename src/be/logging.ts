import fs from 'fs';
import moment from 'moment';
import { LOG, DATE_TIME } from '../common/variables/commonVariables';
import { initDirectory } from '../utilities/utilityFunctions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logErrors = (error: Error | any, origin: Promise<any> | string): void => {
  initDirectory(LOG.DIRECTORY);
  const seperator = '-'.repeat(100);
  const logFileName = `${moment().format(DATE_TIME.DATE_LOG_FORMAT)}.log`;
  const logFilePath = `${LOG.DIRECTORY}/${logFileName}`;
  const errorMessage = `${moment().format(
    DATE_TIME.TIME_LOG_FORMAT
  )}\n\nError: ${error}\n\nOrigin: ${origin}\n\n${seperator}\n`;

  if (!fs.existsSync(logFilePath)) {
    fs.appendFileSync(logFilePath, errorMessage);
  } else {
    const existingLogs = fs.readFileSync(logFilePath);
    fs.writeFileSync(logFilePath, errorMessage + existingLogs);
  }
};

const initLogging = (): void => {
  // General unhandled exception
  process.on('uncaughtExceptionMonitor', (err: Error, origin: string) => {
    console.error('UNCAUGHT EXCEPTION: ', origin);
    logErrors(err, origin);
  });

  // Unhandled promise exception
  process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANLED REJECTION: ', promise);
    promise.catch(async error => {
      logErrors(reason, error.stack);
    });
  });
};

export default initLogging;
export { logErrors };
