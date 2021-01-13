import fs from 'fs';
import Database from 'better-sqlite3';
import { createConnection } from 'typeorm';
import { DATABASE } from '../../common/variables/commonVariables';
import ormConfig from '../../common/config/ormConfig';
import { Category, Language } from '../entity/entity';
import CategorySeed from './CategorySeed';
import LanguageSeed from './LanguageSeed';

const initDatabase = async (): Promise<void> => {
  if (!fs.existsSync(DATABASE.PATH)) {
    // Generate database
    new Database(DATABASE.PATH);

    // Generate tables
    const connection = await createConnection(ormConfig);
    await connection.synchronize();

    // Seeding data
    const queryBuilder = connection.createQueryBuilder();
    await queryBuilder.insert().into(Category).values(CategorySeed).execute();
    await queryBuilder.insert().into(Language).values(LanguageSeed).execute();
  } else {
    // createConnection will create new database by DATABASE.PATH
    // therefore putting it before checking if DATABASE.PATH existing is meaningless
    await createConnection(ormConfig);
  }
};

export default initDatabase;
