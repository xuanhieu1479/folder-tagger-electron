import moment from 'moment';
import { ConnectionOptions, FileLogger } from 'typeorm';
import { DATABASE, LOG, DATE_TIME } from '../variables/commonVariables';
import { Category, Folder, Language } from '../../be/entity/entity';

const ormConfig: ConnectionOptions = {
  type: 'better-sqlite3',
  database: DATABASE.PATH,
  entities: [Category, Folder, Language],
  logger: new FileLogger('all', {
    logPath: `${LOG.DIRECTORY}/${moment().format(
      DATE_TIME.DATE_LOG_FORMAT
    )}-QUERY.log`
  })
};

export default ormConfig;
