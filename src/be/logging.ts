import { LOG } from '../common/variables/commonVariables';
import { writeToFile } from '../utilities/utilityFunctions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logErrors = (error: Error | any, origin: Promise<any> | string): void => {
  writeToFile(LOG.DIRECTORY, LOG.PATH, LOG.ERROR_MESSAGE(error, origin), true);
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
