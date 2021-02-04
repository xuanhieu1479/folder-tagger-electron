import moment from 'moment';
import { ConnectionOptions, FileLogger } from 'typeorm';
import {
  DATABASE,
  LOG,
  DATE_TIME
} from '../../common/variables/commonVariables';
import { Folder, Category, Language, Tag, TagType } from '../entity/entity';
import { initDirectory } from '../../utilities/utilityFunctions';

/**
 * Since typeorm logger base path is where
 * main process is running and the Log folder
 * is outside at program directory, backtrack is
 * necessary to get desired location.
 */
const getLogPath = (): string => {
  initDirectory(LOG.DIRECTORY);
  const programDirectory = process.cwd();
  const mainProcessPath = __dirname;
  const needToBeRemovedPath = mainProcessPath.replace(programDirectory, '');
  const backtrackCount = (needToBeRemovedPath.match(/\\/g) || []).length;
  const backtrackString = '../'.repeat(backtrackCount);
  const result = `${backtrackString}/${LOG.DIRECTORY}/${moment().format(
    DATE_TIME.DATE_LOG_FORMAT
  )}-QUERY.log`;
  return result;
};

const ormConfig: ConnectionOptions = {
  type: 'better-sqlite3',
  database: DATABASE.PATH,
  entities: [Folder, Category, Language, Tag, TagType],
  logger: new FileLogger('all', { logPath: getLogPath() })
};

export default ormConfig;
