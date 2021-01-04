import { ConnectionOptions } from 'typeorm';
import { DATABASE_PATH } from '../variables/data';
import entities from '../../be/entity';

const ormConfig: ConnectionOptions = {
  type: 'better-sqlite3',
  database: DATABASE_PATH,
  entities
};

export default ormConfig;
