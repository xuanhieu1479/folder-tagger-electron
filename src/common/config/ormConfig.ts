import { ConnectionOptions } from 'typeorm';
import { DATABASE_PATH } from '../variables/data';
import { Category, Folder, Language } from '../../be/entity/entity';

const ormConfig: ConnectionOptions = {
  type: 'better-sqlite3',
  database: DATABASE_PATH,
  entities: [Category, Folder, Language]
};

export default ormConfig;
