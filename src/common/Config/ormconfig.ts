import { ConnectionOptions } from 'typeorm';
import { DATABASE_PATH } from '../Variables/data';
import entities from '../../Data/entity/';

const ormConfig: ConnectionOptions = {
  type: 'better-sqlite3',
  database: DATABASE_PATH,
  synchronize: true,
  logging: false,
  entities
};

export default ormConfig;
