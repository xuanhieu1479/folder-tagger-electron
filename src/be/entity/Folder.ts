import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  getRepository,
  Column,
  getManager
} from 'typeorm';
import { Category, Language, Tag } from './entity';
import {
  MESSAGE,
  STATUS_CODE,
  PAGINATION
} from '../../common/variables/commonVariables';
import { QueryResultInterface } from '../../common/interfaces/beInterfaces';
import {
  Folder as FolderInterface,
  FolderFilterParams
} from '../../common/interfaces/commonInterfaces';
import { logErrors } from '../logging';

interface FolderQueryResult extends QueryResultInterface {
  folders?: {
    foldersList: Array<Folder>;
    totalFolders: number;
  };
}

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

  @ManyToMany(() => Tag, tag => tag.Folders)
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
      console.error('GET FOLDERS ERROR: ', error);
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

  add = async (folders: Array<FolderInterface>): Promise<FolderQueryResult> => {
    const insertFolders: Array<Folder> = [];
    const manager = getManager();

    // Foreach does not support async await
    // How many times does it need for me to remember :(
    for (const folder of folders) {
      const { location, name, thumbnail } = folder;
      const folderExists = await this.isExisting(location);
      if (folderExists)
        return {
          message: MESSAGE.SPECIFIC_FOLDER_ALREADY_EXISTS(location),
          status: STATUS_CODE.DB_ERROR
        };
      else
        insertFolders.push(
          manager.create(Folder, {
            FolderLocation: location,
            FolderName: name,
            FolderThumbnail: thumbnail
          })
        );
    }

    try {
      await manager.insert(Folder, insertFolders);
      return {
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.error('ADD FOLDERS ERROR: ', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };
}
