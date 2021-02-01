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
    const { currentPage, itemsPerPage, isRandom, category, language } = params;
    const tags =
      typeof params.tags === 'string' ? JSON.parse(params.tags) : undefined;
    const skipQuantity = (currentPage - 1) * itemsPerPage;

    const query = getRepository(Folder)
      .createQueryBuilder('folder')
      .select('folder.FolderLocation', 'location')
      .addSelect('folder.FolderName', 'name')
      .addSelect('folder.FolderThumbnail', 'thumbnail');
    if (category) query.andWhere('folder.Category = :category', { category });
    if (language) query.andWhere('folder.Language = :language', { language });

    // Get records that all match conditions.
    // REFERENCE: https://stackoverflow.com/a/4768499/12183494
    const createDynamicQueriesForTags = (
      tagsArray: Array<string>,
      tagKey: string,
      isWildcard: boolean
    ) => {
      tagsArray.forEach((v: string, index: number) => {
        query.andWhere(q => {
          const subQuery = q
            .subQuery()
            .select('folder.FolderLocation')
            .from(Folder, 'folder');
          if (isWildcard) {
            subQuery.leftJoin('folder.Tags', 'tag');
            if (v.length >= SEARCH.MINIMUM_LETTERS) {
              subQuery.where(`folder.FolderName LIKE :${tagKey}_${index}_0`);
              subQuery.orWhere(`tag.TagName LIKE :${tagKey}_${index}_0`);
            } else {
              subQuery.where(
                new Brackets(sq => {
                  sq.orWhere(`folder.FolderName LIKE :${tagKey}_${index}_1`);
                  sq.orWhere(`folder.FolderName LIKE :${tagKey}_${index}_2`);
                  sq.orWhere(`folder.FolderName LIKE :${tagKey}_${index}_3`);
                })
              );
              subQuery.orWhere(
                new Brackets(sq => {
                  sq.orWhere(`tag.TagName LIKE :${tagKey}_${index}_1`);
                  sq.orWhere(`tag.TagName LIKE :${tagKey}_${index}_2`);
                  sq.orWhere(`tag.TagName LIKE :${tagKey}_${index}_3`);
                })
              );
            }
          } else {
            subQuery.innerJoin('folder.Tags', 'tag');
            subQuery.where(`tag.TagType = :${tagKey}`, {
              [tagKey]: tagKey
            });
            if (v.length >= SEARCH.MINIMUM_LETTERS) {
              subQuery.andWhere(`tag.TagName LIKE :${tagKey}_${index}_0`);
            } else {
              subQuery.andWhere(
                new Brackets(sq => {
                  sq.orWhere(`tag.TagName LIKE :${tagKey}_${index}_1`);
                  sq.orWhere(`tag.TagName LIKE :${tagKey}_${index}_2`);
                  sq.orWhere(`tag.TagName LIKE :${tagKey}_${index}_3`);
                })
              );
            }
          }
          subQuery.setParameters({
            [`${tagKey}_${index}_0`]: `%${v}%`,
            [`${tagKey}_${index}_1`]: `%${v} %`,
            [`${tagKey}_${index}_2`]: `% ${v}%`,
            [`${tagKey}_${index}_3`]: `% ${v} %`
          });
          return 'folder.FolderLocation IN ' + subQuery.getQuery();
        });
      });
    };

    _.forEach(tags, async (value, key) => {
      switch (key) {
        case 'name':
          value.forEach((v: string, index: number) => {
            const queryString = (tagKey: string) =>
              `folder.FolderName LIKE :${tagKey}`;
            if (v.length >= SEARCH.MINIMUM_LETTERS) {
              query.andWhere(queryString(`${key}_${index}_0`));
            } else {
              query.andWhere(
                new Brackets(q => {
                  q.orWhere(queryString(`${key}_${index}_1`));
                  q.orWhere(queryString(`${key}_${index}_2`));
                  q.orWhere(queryString(`${key}_${index}_3`));
                })
              );
            }
            query.setParameters({
              [`${key}_${index}_0`]: `%${v}%`,
              [`${key}_${index}_1`]: `%${v} %`,
              [`${key}_${index}_2`]: `% ${v}%`,
              [`${key}_${index}_3`]: `% ${v} %`
            });
          });
          break;
        case 'wildcard':
          createDynamicQueriesForTags(value, key, true);
          break;
        default:
          createDynamicQueriesForTags(value, key, false);
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
