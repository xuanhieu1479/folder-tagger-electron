import fs from 'fs';
import moment from 'moment';
import { LOG_DIRECTORY } from '../common/Variables/log';
import { DATE_LOG_FORMAT, TIME_LOG_FORMAT } from '../common/Variables/dateTime';

if (!fs.existsSync(LOG_DIRECTORY)) fs.mkdirSync(LOG_DIRECTORY);

const logErrors = (error: Error | any, origin: Promise<any> | string) => {
  const seperator = '-'.repeat(150);
  const logFileName = `${moment().format(DATE_LOG_FORMAT)}.txt`;
  const logFilePath = `${LOG_DIRECTORY}/${logFileName}`;
  const errorMessage = `${moment().format(
    TIME_LOG_FORMAT
  )}\n\nError: ${error}\n\nOrigin: ${origin}\n\n${seperator}\n`;
  fs.appendFileSync(logFilePath, errorMessage);
};

// General unhandled exception
process.on('uncaughtExceptionMonitor', (err: Error, origin: string) => {
  logErrors(err, origin);
});

// Promise unhandle exception
process.on('unhandledRejection', (reason, promise) => {
  promise.catch(async error => {
    logErrors(reason, error.stack);
  });
});
