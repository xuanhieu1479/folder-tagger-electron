import fs from 'fs';
import Database from 'better-sqlite3';
import { createConnection } from 'typeorm';
import { DATABASE_DIRECTORY, DATABASE_PATH } from '../../common/variables/data';
import ormConfig from '../../common/config/ormConfig';
import Category from '../entity/Category';
import Language from '../entity/Language';
import CategorySeed from './CategorySeed';
import LanguageSeed from './LanguageSeed';

const initDatabase = async (): Promise<void> => {
  if (!fs.existsSync(DATABASE_PATH)) {
    if (!fs.existsSync(DATABASE_DIRECTORY)) fs.mkdirSync(DATABASE_DIRECTORY);
    // Generate database
    new Database(DATABASE_PATH, { verbose: console.log });

    // Generate tables
    const connection = await createConnection(ormConfig);
    await connection.synchronize();

    // Seeding data
    const queryBuilder = connection.createQueryBuilder();
    await queryBuilder.insert().into(Category).values(CategorySeed).execute();
    await queryBuilder.insert().into(Language).values(LanguageSeed).execute();
  } else {
    // createConnection will create new database by DATABASE_PATH
    // therefore putting it before checking condition is meaningless
    await createConnection(ormConfig);
  }
};

export default initDatabase;
