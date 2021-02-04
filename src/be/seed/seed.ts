import Database from 'better-sqlite3';
import { createConnection } from 'typeorm';
import { DATABASE, SEED_DATA } from '../../common/variables/commonVariables';
import ormConfig from '../config/ormConfig';
import { Category, Language, TagType } from '../entity/entity';
import { fileExists, initDirectory } from '../../utilities/utilityFunctions';

const initDatabase = async (): Promise<void> => {
  if (!fileExists(DATABASE.PATH)) {
    initDirectory(DATABASE.DIRECTORY);
    // Generate database
    new Database(DATABASE.PATH);

    // Generate tables
    const connection = await createConnection(ormConfig);
    await connection.synchronize();

    // Seeding data
    const queryBuilder = connection.createQueryBuilder();
    await queryBuilder
      .insert()
      .into(Category)
      .values(SEED_DATA.CATEGORY)
      .execute();
    await queryBuilder
      .insert()
      .into(Language)
      .values(SEED_DATA.LANGUAGE)
      .execute();
    await queryBuilder
      .insert()
      .into(TagType)
      .values(SEED_DATA.TAG_TYPE)
      .execute();
  } else {
    // createConnection will create new database by DATABASE.PATH
    // therefore putting it before checking if DATABASE.PATH existing is meaningless
    await createConnection(ormConfig);
  }
};

export default initDatabase;
