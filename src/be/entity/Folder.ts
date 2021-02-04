import fs from 'fs';
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
import { Category, Language, Tag, TagType } from './entity';
import {
  Folder as FolderInterface,
  FolderFilterParams,
  TransferDataInterface
} from '../../common/interfaces/commonInterfaces';
import { QueryResultInterface } from '../../common/interfaces/beInterfaces';
import {
  MESSAGE,
  STATUS_CODE,
  SEARCH,
  BACKUP
} from '../../common/variables/commonVariables';
import { logErrors } from '../logging';
import {
  getFolderName,
  getFolderThumbnail,
  initDirectory
} from '../../utilities/utilityFunctions';

interface FolderQueryResult extends QueryResultInterface {
  folders?: {
    foldersList: Array<Folder>;
    totalFolders: number;
  };
}

const getTagId = (tagType: string, tagName: string) => `${tagType}-${tagName}`;

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
    if (isRandom) query.addOrderBy('RANDOM()');
    if (category) query.andWhere('folder.Category = :category', { category });
    if (language) query.andWhere('folder.Language = :language', { language });

    const querySpecialTags = (tag: string) => {
      query.andWhere(q => {
        const subQuery = q
          .subQuery()
          .select('folder.FolderLocation')
          .from(Folder, 'folder')
          .leftJoin('folder.Tags', 'tag');
        switch (tag) {
          case SEARCH.SPECIAL_TAGS.NO_ARTIST:
            subQuery.where('tag.TagType = :artist', { artist: 'artist' });
            break;
          case SEARCH.SPECIAL_TAGS.NO_GROUP:
            subQuery.where('tag.TagType = :group', { group: 'group' });
            break;
          case SEARCH.SPECIAL_TAGS.NO_TAG:
            subQuery.where(
              'tag.TagType = :parody OR tag.TagType = :character OR tag.TagType = :genre',
              { parody: 'parody', character: 'character', genre: 'genre' }
            );
            break;
        }
        return 'folder.FolderLocation NOT IN ' + subQuery.getQuery();
      });
    };

    // Get records that match all conditions.
    // REFERENCE: https://stackoverflow.com/a/4768499/12183494
    const createDynamicQueriesForTags = (
      tagsArray: Array<string>,
      tagKey: string,
      isWildcard: boolean
    ) => {
      tagsArray.forEach((tagValue: string, tagPosition: number) => {
        if (Object.values(SEARCH.SPECIAL_TAGS).includes(tagValue)) {
          querySpecialTags(tagValue);
          return;
        }
        const isTagIncluded = tagValue[0] !== SEARCH.EXCLUDE_TAGS_CHARACTER;
        const tagName = isTagIncluded ? tagValue : tagValue.substring(1);
        const isTagAboveMinimumLetters =
          tagName.length >= SEARCH.MINIMUM_LETTERS;
        const parameterKey = (index: number) =>
          `${tagKey}_${tagPosition}_${index}`;
        const folderQueryString = (index: number) =>
          `folder.FolderName ${isTagIncluded ? '' : 'NOT '}LIKE :${parameterKey(
            index
          )}`;
        const tagQueryString = (index: number) => {
          if (isTagIncluded) return `tag.TagName LIKE :${parameterKey(index)}`;
          else
            return `(tag.TagName IS NULL OR tag.TagName NOT LIKE :${parameterKey(
              index
            )})`;
        };
        query.andWhere(q => {
          const subQuery = q
            .subQuery()
            .select('folder.FolderLocation')
            .from(Folder, 'folder');
          if (isWildcard) {
            subQuery.leftJoin('folder.Tags', 'tag');
            if (isTagAboveMinimumLetters && isTagIncluded) {
              subQuery.where(folderQueryString(0));
              subQuery.orWhere(tagQueryString(0));
            }
            if (isTagAboveMinimumLetters && !isTagIncluded) {
              subQuery.where(folderQueryString(0));
              subQuery.andWhere(tagQueryString(0));
            }
            if (!isTagAboveMinimumLetters && isTagIncluded) {
              subQuery.where(
                new Brackets(sq => {
                  sq.orWhere(folderQueryString(1));
                  sq.orWhere(folderQueryString(2));
                  sq.orWhere(folderQueryString(3));
                })
              );
              subQuery.orWhere(
                new Brackets(sq => {
                  sq.orWhere(tagQueryString(1));
                  sq.orWhere(tagQueryString(2));
                  sq.orWhere(tagQueryString(3));
                })
              );
            }
            if (!isTagAboveMinimumLetters && !isTagIncluded) {
              subQuery.where(
                new Brackets(sq => {
                  sq.andWhere(folderQueryString(1));
                  sq.andWhere(folderQueryString(2));
                  sq.andWhere(folderQueryString(3));
                })
              );
              subQuery.andWhere(
                new Brackets(sq => {
                  sq.andWhere(tagQueryString(1));
                  sq.andWhere(tagQueryString(2));
                  sq.andWhere(tagQueryString(3));
                })
              );
            }
          } else {
            subQuery.innerJoin('folder.Tags', 'tag');
            subQuery.where(`tag.TagType = :${tagKey}`, {
              [tagKey]: tagKey
            });
            if (isTagAboveMinimumLetters) {
              subQuery.andWhere(tagQueryString(0));
            }
            if (!isTagAboveMinimumLetters && isTagIncluded) {
              subQuery.orWhere(
                new Brackets(sq => {
                  sq.orWhere(tagQueryString(1));
                  sq.orWhere(tagQueryString(2));
                  sq.orWhere(tagQueryString(3));
                })
              );
            }
            if (!isTagAboveMinimumLetters && !isTagIncluded) {
              subQuery.andWhere(
                new Brackets(sq => {
                  sq.andWhere(tagQueryString(1));
                  sq.andWhere(tagQueryString(2));
                  sq.andWhere(tagQueryString(3));
                })
              );
            }
          }
          subQuery.setParameters({
            [parameterKey(0)]: `%${tagName}%`,
            [parameterKey(1)]: `%${tagName} %`,
            [parameterKey(2)]: `% ${tagName}%`,
            [parameterKey(3)]: `% ${tagName} %`
          });
          return 'folder.FolderLocation IN ' + subQuery.getQuery();
        });
      });
    };

    _.forEach(tags, async (value, key) => {
      switch (key) {
        case 'name':
          value.forEach((tagValue: string, tagPosition: number) => {
            const isTagIncluded = tagValue[0] !== SEARCH.EXCLUDE_TAGS_CHARACTER;
            const tagName = isTagIncluded ? tagValue : tagValue.substring(1);
            const isTagAboveMinimumLetters =
              tagName.length >= SEARCH.MINIMUM_LETTERS;
            const parameterKey = (index: number) =>
              `${key}_${tagPosition}_${index}`;
            const queryString = (index: number) =>
              `folder.FolderName ${
                isTagIncluded ? '' : 'NOT '
              }LIKE :${parameterKey(index)}`;

            if (isTagAboveMinimumLetters) query.andWhere(queryString(0));
            if (!isTagAboveMinimumLetters && isTagIncluded)
              query.andWhere(
                new Brackets(q => {
                  q.orWhere(queryString(1));
                  q.orWhere(queryString(2));
                  q.orWhere(queryString(3));
                })
              );
            if (!isTagAboveMinimumLetters && !isTagIncluded)
              query.andWhere(
                new Brackets(q => {
                  q.andWhere(queryString(1));
                  q.andWhere(queryString(2));
                  q.andWhere(queryString(3));
                })
              );
            query.setParameters({
              [parameterKey(0)]: `%${tagName}%`,
              [parameterKey(1)]: `%${tagName} %`,
              [parameterKey(2)]: `% ${tagName}%`,
              [parameterKey(3)]: `% ${tagName} %`
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

  /**
   * Using folderName instead of folderLocation for checking
   * due to folders might be moved.
   * There is an edge case that folderName will be duplicate
   * but since it's kinda complicated we need to handle it manually.
   */
  import = async (
    json: Array<TransferDataInterface>
  ): Promise<QueryResultInterface> => {
    const manager = getManager();
    const folderRepository = getRepository(Folder);
    const tagRepository = getRepository(Tag);
    const allCategories = await getRepository(Category).find();
    const allLanguages = await getRepository(Language).find();
    const allTagTypes = await getRepository(TagType).find();
    const upsertFolders: Array<Folder> = [];
    const failedFolders: Array<TransferDataInterface> = [];
    const insertTags: Array<Tag> = [];

    const getFolderInDB = async (folderName: string) => {
      return await folderRepository
        .createQueryBuilder('folder')
        .where('folder.FolderName = :folderName', { folderName })
        .getOne();
    };
    const checkFolderHasTags = async (folderName: string) => {
      return (
        (await folderRepository
          .createQueryBuilder('folder')
          .where('folder.FolderName = :folderName', { folderName })
          .innerJoin('folder.Tags', 'tag')
          .getOne()) !== undefined
      );
    };
    const getTagInDB = async (tagType: string, tagName: string) => {
      return await tagRepository.findOne(getTagId(tagType, tagName));
    };

    for (const folder of json) {
      const { FolderLocation, FolderName, Category, Language, Tags } = folder;
      const folderInDatabase = await getFolderInDB(FolderName);
      const categoryInDatabase = allCategories.find(
        category => category.Category === Category
      );
      const languageInDatabase = allLanguages.find(
        language => language.Language === Language
      );
      const updateOrCreateFolders = async (folder: Folder) => {
        const folderTags: Array<Tag> = [];
        const transferTags: Record<string, Array<string>> = { ...Tags };
        const getFolderTags = async () => {
          for (const tagType of Object.keys(transferTags)) {
            const tagTypeInDatabase = allTagTypes.find(
              t => t.TagType === tagType
            );
            for (const tagName of transferTags[tagType]) {
              const tag = await getTagInDB(tagType, tagName);
              if (tag !== undefined) folderTags.push(tag);
              else {
                const newTag = manager.create(Tag, {
                  TagId: getTagId(tagType, tagName),
                  TagName: tagName,
                  TagType: tagTypeInDatabase
                });
                const isNewTagDuplicate =
                  insertTags.find(
                    upsertTag => upsertTag.TagId === newTag.TagId
                  ) !== undefined;
                if (!isNewTagDuplicate) insertTags.push(newTag);
                folderTags.push(newTag);
              }
            }
          }
        };
        await getFolderTags();

        if (categoryInDatabase !== undefined)
          folder.Category = categoryInDatabase;
        if (languageInDatabase !== undefined)
          folder.Language = languageInDatabase;
        folder.Tags = [...folderTags];
        upsertFolders.push(folder);
      };

      if (folderInDatabase !== undefined) {
        const folderHasTags = await checkFolderHasTags(FolderName);
        if (folderHasTags) failedFolders.push(folder);
        else await updateOrCreateFolders(folderInDatabase);
      } else {
        if (!fs.existsSync(FolderLocation)) failedFolders.push(folder);
        else {
          const newFolder = manager.create(Folder, {
            FolderLocation,
            FolderName: getFolderName(FolderLocation),
            FolderThumbnail: getFolderThumbnail(FolderLocation)
          });
          await updateOrCreateFolders(newFolder);
        }
      }
    }

    try {
      await manager.transaction(async transactionManager => {
        if (!_.isEmpty(insertTags))
          await transactionManager.insert(Tag, insertTags);
        // Sqlite maximum depth is 1000
        await transactionManager.save(upsertFolders, { chunk: 500 });
        const failedDataName = `${new Date().getTime()}-FAILED-DATA.json`;
        const failedDataPath = `${BACKUP.DIRECTORY}/${failedDataName}`;
        initDirectory(BACKUP.DIRECTORY);
        fs.appendFileSync(failedDataPath, JSON.stringify(failedFolders));
      });
      return {
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.error('IMPORT FOLDERS ERROR: ', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };
}
