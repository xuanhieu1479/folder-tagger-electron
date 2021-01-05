import fs from 'fs';
import moment from 'moment';
import { LOG_DIRECTORY } from '../common/variables/log';
import { DATE_LOG_FORMAT, TIME_LOG_FORMAT } from '../common/variables/dateTime';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logErrors = (error: Error | any, origin: Promise<any> | string): void => {
  if (!fs.existsSync(LOG_DIRECTORY)) fs.mkdirSync(LOG_DIRECTORY);
  const seperator = '-'.repeat(150);
  const logFileName = `${moment().format(DATE_LOG_FORMAT)}.txt`;
  const logFilePath = `${LOG_DIRECTORY}/${logFileName}`;
  const errorMessage = `${moment().format(
    TIME_LOG_FORMAT
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
    console.log('UNCAUGHT EXCEPTION: ', origin);
    logErrors(err, origin);
  });

  // Promise unhandle exception
  process.on('unhandledRejection', (reason, promise) => {
    console.log('UNHANLED REJECTION: ', promise);
    promise.catch(async error => {
      logErrors(reason, error.stack);
    });
  });
};

export default initLogging;
export { logErrors };
