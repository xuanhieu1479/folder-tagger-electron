import { ConnectionOptions } from 'typeorm';
import entities from '../../Data/entity/';

const ormConfig: ConnectionOptions = {
  type: 'better-sqlite3',
  database: './test.db',
  synchronize: true,
  logging: false,
  entities
};

export default ormConfig;
