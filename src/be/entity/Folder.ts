import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  getConnection
} from 'typeorm';
import Category from './Category';
import Language from './Language';
import MESSAGE from '../../common/variables/message';
import STATUS_CODE from '../../common/variables/statusCode';
import { folderQueryResult } from '../../common/variables/interface';
import { logErrors } from '../logging';

// const connection = getConnection();
// const queryBuilder = connection.createQueryBuilder();

@Entity()
export default class Folder {
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

  findFolder = async (folderLocation: string): Promise<folderQueryResult> => {
    try {
      const folder = await getConnection()
        .createQueryBuilder()
        .select()
        .from(Folder, 'folder')
        .where('folder.FolderLocation = :folderLocation', { folderLocation })
        .getOneOrFail();
      return {
        data: folder,
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.log('FIND FOLDER ERROR: ', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };

  addFolder = async (folderLocation: string): Promise<folderQueryResult> => {
    const folderExists = !(await this.findFolder(folderLocation)).data;
    if (folderExists)
      return {
        message: MESSAGE.FOLDER_ALREADY_EXISTS,
        status: STATUS_CODE.DB_ERROR
      };

    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Folder)
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
