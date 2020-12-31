import fs from 'fs';
import Database from 'better-sqlite3';
import { createConnection } from 'typeorm';
import ormConfig from '../../common/Config/ormconfig';
import { DATABASE_DIRECTORY, DATABASE_PATH } from '../../common/Variables/data';
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
  }
};

export default initDatabase;
