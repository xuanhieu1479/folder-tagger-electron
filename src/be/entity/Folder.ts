import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  getRepository,
  Column,
  getManager,
  Brackets
} from 'typeorm';
import _ from 'lodash';
import { Category, Language, Tag } from './entity';
import {
  MESSAGE,
  STATUS_CODE,
  SEARCH
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
    const { currentPage, itemsPerPage, isRandom, category } = params;
    const tags =
      typeof params.tags === 'string' ? JSON.parse(params.tags) : undefined;
    const skipQuantity = (currentPage - 1) * itemsPerPage;

    const query = getRepository(Folder)
      .createQueryBuilder('folder')
      .select('folder.FolderLocation', 'location')
      .addSelect('folder.FolderName', 'name')
      .addSelect('folder.FolderThumbnail', 'thumbnail')
      .distinct();
    if (category) query.andWhere('folder.Category = :category', { category });
    if (tags?.character || tags?.genre || tags?.parody || tags?.wildcard)
      query.innerJoin('folder.Tags', 'tag');
    _.forEach(tags, (value, key) => {
      const wildcardValue = typeof value === 'string' ? `%${value}%` : '';
      switch (key) {
        case 'language':
          query.andWhere('folder.Language LIKE :language', {
            language: wildcardValue
          });
          break;
        case 'name':
          value.map((v: string, index: number) => {
            const queryString = `folder.FolderName LIKE :${key}_${index}`;
            if (v.length === SEARCH.MINIMUM_LETTERS)
              query.andWhere(queryString, { [`${key}_${index}`]: `% ${v} %` });
            else query.andWhere(queryString, { [`${key}_${index}`]: `%${v}%` });
          });
          break;
        case 'wildcard':
          break;
        default:
          query.andWhere(`tag.TagType = :${key}`, { [key]: key });
          query.andWhere(
            new Brackets(q => {
              value.map((v: string, index: number) => {
                const query = `tag.TagName LIKE :${key}_${index}`;
                const normalParameters = { [`${key}_${index}`]: `%${v}%` };
                const minimumLettersParameters = {
                  [`${key}_${index}`]: `% ${v} %`
                };
                if (v.length === SEARCH.MINIMUM_LETTERS) {
                  if (index === 0) q.andWhere(query, minimumLettersParameters);
                  else q.orWhere(query, minimumLettersParameters);
                } else {
                  if (index === 0) q.andWhere(query, normalParameters);
                  else q.orWhere(query, normalParameters);
                }
              });
            })
          );
          break;
      }
    });

    try {
      const totalFolders = await query.getCount();
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
      const result = await query
        .offset(skipQuantity)
        .limit(itemsPerPage)
        .getRawMany();
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
    const isAddingMultipleFoldesr = folders.length > 1;
    const insertFolders: Array<Folder> = [];
    const manager = getManager();

    // Foreach does not support async await
    // How many times does it need for me to remember :(
    for (const folder of folders) {
      const { location, name, thumbnail } = folder;
      const folderExists = await this.isExisting(location);
      if (folderExists) {
        if (!isAddingMultipleFoldesr)
          return {
            message: MESSAGE.SPECIFIC_FOLDER_ALREADY_EXISTS(location),
            status: STATUS_CODE.DB_ERROR
          };
        else continue;
      } else
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
