import { ConnectionOptions } from 'typeorm';
import { DATABASE } from '../variables/commonVariables';
import { Category, Folder, Language } from '../../be/entity/entity';

const ormConfig: ConnectionOptions = {
  type: 'better-sqlite3',
  database: DATABASE.PATH,
  entities: [Category, Folder, Language]
};

export default ormConfig;
