import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  getRepository
} from 'typeorm';
import { Category, Language, Tag } from './entity';
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

  @ManyToOne(() => Category, category => category.Folders)
  Category!: Category;

  @ManyToOne(() => Language, language => language.Folders)
  Language!: Language;

  @ManyToMany(() => Tag, tag => tag.TagId)
  @JoinTable()
  Tags!: Tag[];

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

  addMany = async (folderLocations: string[]): Promise<folderQueryResult> => {
    interface validFolder {
      FolderLocation: string;
    }
    const validFolders: validFolder[] = [];

    // Foreach does not support async await
    // How many times does it need for me to remember :(
    for (const folderLocation of folderLocations) {
      const folderExists = await this.isExisting(folderLocation);
      if (folderExists)
        return {
          message: MESSAGE.SPECIFIC_FOLDER_ALREADY_EXISTS(folderLocation),
          status: STATUS_CODE.DB_ERROR
        };
      else validFolders.push({ FolderLocation: folderLocation });
    }

    try {
      await getRepository(Folder)
        .createQueryBuilder()
        .insert()
        .values(validFolders)
        .execute();
    } catch (error) {
      console.log('ADD MANY FOLDERS ERROR: ', error);
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
