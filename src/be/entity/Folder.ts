import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  getRepository,
  Column
} from 'typeorm';
import { Category, Language, Tag } from './entity';
import {
  MESSAGE,
  STATUS_CODE,
  PAGINATION
} from '../../common/variables/commonVariables';
import {
  Folder as FolderInterface,
  FolderFilterParams,
  FolderQueryResult
} from '../../common/interfaces/folderInterfaces';
import { logErrors } from '../logging';

@Entity({ name: 'Folders' })
export default class Folder {
  // In development if no name was decided better-sqlite3 will
  // create table with the same name as its equivalent class.
  // However in production new table will be given random or gibberish name
  // therefore deciding table's name beforehand is a must.
  @PrimaryColumn()
  FolderLocation!: string;

  @Column()
  FolderName!: string;

  @Column({ nullable: true })
  FolderThumbnail!: string;

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

  get = async (params: FolderFilterParams): Promise<FolderQueryResult> => {
    const {
      currentPage = 1,
      itemsPerPage = PAGINATION.ITEMS_PER_PAGE[0],
      category,
      language,
      name,
      tag
    } = params;
    const skipQuantity = (currentPage - 1) * itemsPerPage;

    const totalFolders = await getRepository(Folder).count();
    if (skipQuantity > totalFolders) {
      return {
        folders: {
          foldersList: [],
          totalFolders: 0
        },
        message: MESSAGE.INVALID_PARAMS,
        status: STATUS_CODE.INVALID_DATA
      };
    }

    const query = getRepository(Folder)
      .createQueryBuilder('folder')
      .select('folder.FolderLocation', 'location')
      .addSelect('folder.FolderName', 'name')
      .addSelect('folder.FolderThumbnail', 'thumbnail')
      .offset(skipQuantity)
      .limit(itemsPerPage);
    if (category) query.andWhere('folder.Category = :category', { category });
    if (language) query.andWhere('folder.Language = :language', { language });
    if (name) query.andWhere('folder.FolderName = :name', { name });

    try {
      const result = await query.getRawMany();
      return {
        folders: {
          foldersList: result,
          totalFolders
        },
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.log('GET FOLDERS: ', error);
      logErrors(error.message, error.stack);
      return {
        folders: {
          foldersList: [],
          totalFolders: 0
        },
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };

  addOne = async (params: FolderInterface): Promise<FolderQueryResult> => {
    const { location, name, thumbnail } = params;
    const folderExists = await this.isExisting(location);
    if (folderExists)
      return {
        message: MESSAGE.FOLDER_ALREADY_EXISTS,
        status: STATUS_CODE.DB_ERROR
      };

    try {
      await getRepository(Folder)
        .createQueryBuilder()
        .insert()
        .values([
          {
            FolderLocation: location,
            FolderName: name,
            FolderThumbnail: thumbnail
          }
        ])
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

  addMany = async (
    params: Array<FolderInterface>
  ): Promise<FolderQueryResult> => {
    interface ValidFolder {
      FolderLocation: string;
      FolderName: string;
      FolderThumbnail?: string | undefined;
    }
    const validFolders: ValidFolder[] = [];

    // Foreach does not support async await
    // How many times does it need for me to remember :(
    for (const folder of params) {
      const { location, name, thumbnail } = folder;
      const folderExists = await this.isExisting(location);
      if (folderExists)
        return {
          message: MESSAGE.SPECIFIC_FOLDER_ALREADY_EXISTS(location),
          status: STATUS_CODE.DB_ERROR
        };
      else
        validFolders.push({
          FolderLocation: location,
          FolderName: name,
          FolderThumbnail: thumbnail
        });
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
