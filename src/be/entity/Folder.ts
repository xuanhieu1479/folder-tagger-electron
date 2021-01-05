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
import { queryResult } from '../../common/variables/interface';
import { logErrors } from '../logging';

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

  addFolder = async (folderLocation: string): Promise<queryResult> => {
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
