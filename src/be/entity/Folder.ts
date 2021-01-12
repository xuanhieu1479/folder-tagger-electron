import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  getRepository
} from 'typeorm';
import Category from './Category';
import Language from './Language';
import { MESSAGE, STATUS_CODE } from '../../common/variables/commonVariables';
import { folderQueryResult } from '../interfaces/queryInterfaces';
import { logErrors } from '../logging';

@Entity({ name: 'Folders' })
export default class Folder {
  // In development if no name was decided better-sqlite3 will
  // create table with the same name as its equivalent class.
  // However in production new table will be given random or gibberish name
  // therefore deciding table's name beforehand is a must.
  @PrimaryColumn()
  FolderLocation!: string;

  @Column({ nullable: true })
  CategoryId!: number;

  @Column({ nullable: true })
  LanguageId!: number;

  @ManyToOne(() => Category, category => category.folders)
  category!: Category;

  @ManyToOne(() => Language, language => language.folders)
  language!: Language;

  isExisting = async (folderLocation: string): Promise<boolean> => {
    const folder = await getRepository(Folder).findOne(folderLocation);
    return folder !== undefined;
  };

  addOne = async (folderLocation: string): Promise<folderQueryResult> => {
    const folderExists = await this.isExisting(folderLocation);
    if (folderExists)
      return {
        message: MESSAGE.FOLDER_ALREADY_EXISTS,
        status: STATUS_CODE.DB_ERROR
      };

    try {
      await getRepository(Folder)
        .createQueryBuilder()
        .insert()
        .values([{ FolderLocation: folderLocation }])
        .execute();
    } catch (error) {
      console.log('ADD ONE FOLDER ERROR: ', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }

    return {
      message: MESSAGE.SUCCESS,
      status: STATUS_CODE.SUCCESS
    };
  };
}
