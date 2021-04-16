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
import moment from 'moment';
import { Category, Language, Tag, TagType } from './entity';
import {
  Folder as FolderInterface,
  FolderFilterParams,
  TransferData,
  BreakDownTagType,
  RenameFolderParams
} from '../../common/interfaces/commonInterfaces';
import { QueryResult } from '../../common/interfaces/beInterfaces';
import {
  MESSAGE,
  SEARCH,
  BACKUP,
  PAGINATION
} from '../../common/variables/commonVariables';
import { StatusCode } from '../../common/enums/commonEnums';
import { logErrors } from '../logging';
import {
  fileExists,
  getFolderName,
  getFolderThumbnail,
  writeToFile,
  renameFolder
} from '../../utilities/utilityFunctions';

interface FolderQueryResult extends QueryResult {
  folders?: {
    foldersList: Folder[];
    totalFolders: number;
  };
}
interface RenameQueryResult extends QueryResult {
  newLocation?: string;
  newName?: string;
  newThumbnail?: string;
}

const getTagId = (tagType: string, tagName: string) => `${tagType}-${tagName}`;

@Entity()
export default class Folder {
  @PrimaryColumn()
  FolderLocation!: string;

  @Column()
  FolderName!: string;

  @Column({ nullable: true })
  FolderThumbnail!: string;

  @ManyToOne(() => Category, category => category.Folders, { nullable: true })
  Category!: Category | null;

  @ManyToOne(() => Language, language => language.Folders, { nullable: true })
  Language!: Language | null;

  @ManyToMany(() => Tag, tag => tag.Folders)
  @JoinTable()
  Tags!: Tag[];

  @Column({ nullable: true })
  CreatedAt!: number;

  @Column({ nullable: true })
  UpdatedAt!: number;

  isExisting = async (folderLocation: string): Promise<boolean> => {
    const folder = await getRepository(Folder).findOne(folderLocation);
    return folder !== undefined;
  };

  clear!: () => Promise<QueryResult>;
  export!: () => Promise<QueryResult>;
  import!: (
    json: TransferData[],
    isOverwrite?: boolean
  ) => Promise<QueryResult>;
  add!: (folders: FolderInterface[]) => Promise<FolderQueryResult>;
  get!: (params: FolderFilterParams) => Promise<FolderQueryResult>;
  rename!: (params: RenameFolderParams) => Promise<RenameQueryResult>;
  remove!: (removedFolders: string[]) => Promise<QueryResult>;
}

Folder.prototype.get = async (
  params: FolderFilterParams
): Promise<FolderQueryResult> => {
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
  if (category === 'none') query.andWhere('folder.Category IS NULL');
  else if (category)
    query.andWhere('folder.Category = :category', { category });
  if (language === 'none') query.andWhere('folder.Language IS NULL');
  else if (language)
    query.andWhere('folder.Language = :language', { language });

  const querySpecialTags = (tag: string, id: number) => {
    // Normally this should be inside a separate sort function,
    // but I don't really need a sort that much.
    // Just use this to check whether new update info is correct or not.
    switch (tag) {
      case SEARCH.SPECIAL_TAGS.NEWLY_ADDED:
        query.addOrderBy('folder.CreatedAt', 'DESC');
        return;
      case SEARCH.SPECIAL_TAGS.NEWLY_UPDATED:
        query.addOrderBy('folder.UpdatedAt', 'DESC');
        return;
    }

    query.andWhere(q => {
      const tagKey = `special_tag_${id}`;
      let preQuery = 'folder.FolderLocation IN ';
      const subQuery = q
        .subQuery()
        .select('folder.FolderLocation')
        .from(Folder, 'folder')
        .leftJoin('folder.Tags', 'tag');
      if (tag.includes(SEARCH.SPECIAL_TAGS.NO)) {
        preQuery = 'folder.FolderLocation NOT IN ';
        const tagType = tag.replace(SEARCH.SPECIAL_TAGS.NO, '');
        subQuery.where(`tag.TagType = :${tagKey}`, { [tagKey]: tagType });
      } else if (tag.includes(SEARCH.SPECIAL_TAGS.HAVE)) {
        const tagType = tag.replace(SEARCH.SPECIAL_TAGS.HAVE, '');
        subQuery.where(`tag.TagType = :${tagKey}`, { [tagKey]: tagType });
      } else if (tag.includes(SEARCH.SPECIAL_TAGS.MANY)) {
        const tagType = tag.replace(SEARCH.SPECIAL_TAGS.MANY, '');
        subQuery
          .where(`tag.TagType = :${tagKey}`, { [tagKey]: tagType })
          .groupBy('folder.FolderLocation')
          .having('COUNT(folder.FolderLocation) > 1');
      }
      return preQuery + subQuery.getQuery();
    });
  };

  // Get records that match all conditions.
  // REFERENCE: https://stackoverflow.com/a/4768499/12183494
  const createDynamicQueriesForTags = (
    tagsArray: string[],
    tagKey: string,
    isWildcard: boolean
  ) => {
    const isSpecialTag = (tag: string) =>
      Object.values(SEARCH.SPECIAL_TAGS).some(specialTag =>
        tag.includes(specialTag)
      );
    tagsArray.forEach((tagValue: string, tagPosition: number) => {
      if (isSpecialTag(tagValue)) {
        querySpecialTags(tagValue, tagPosition);
        return;
      }

      const isTagAbsolute =
        tagValue[0] === SEARCH.ABSOLUTE_TAGS_CHARACTER &&
        _.last(tagValue) === SEARCH.ABSOLUTE_TAGS_CHARACTER;
      const isTagIncluded = tagValue[0] !== SEARCH.EXCLUDE_TAGS_CHARACTER;
      let tagName = tagValue;
      if (!isTagIncluded) tagName = tagValue.substring(1);
      else if (isTagAbsolute)
        tagName = tagValue.substring(1, tagValue.length - 1);
      const isTagAboveMinimumLetters = tagName.length >= SEARCH.MINIMUM_LETTERS;

      const parameterKey = (index: number) =>
        `${tagKey}_${tagPosition}_${index}`;
      // Folder name lookup can be relative when absolute
      // since it's hard to remember exact the name
      const folderQueryString = (index: number) =>
        `folder.FolderName LIKE :${parameterKey(index)}`;
      // But tag must be 100% match if absolute
      const tagQueryString = (index: number) =>
        !isTagAbsolute
          ? `tag.TagName LIKE :${parameterKey(index)}`
          : `tag.TagName = :${parameterKey(-1)}`;
      query.andWhere(q => {
        const subQuery = q
          .subQuery()
          .select('folder.FolderLocation')
          .from(Folder, 'folder');
        if (isWildcard) {
          subQuery.leftJoin('folder.Tags', 'tag');
          if (isTagAboveMinimumLetters) {
            subQuery.where(folderQueryString(0));
            subQuery.orWhere(tagQueryString(0));
          } else {
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
        } else {
          subQuery.innerJoin('folder.Tags', 'tag');
          subQuery.where(`tag.TagType = :${tagKey}`, {
            [tagKey]: tagKey
          });
          if (isTagAboveMinimumLetters) subQuery.andWhere(tagQueryString(0));
          else
            subQuery.orWhere(
              new Brackets(sq => {
                sq.orWhere(tagQueryString(1));
                sq.orWhere(tagQueryString(2));
                sq.orWhere(tagQueryString(3));
              })
            );
        }
        subQuery.setParameters({
          [parameterKey(-1)]: tagName,
          [parameterKey(0)]: `%${tagName}%`,
          [parameterKey(1)]: `%${tagName} %`,
          [parameterKey(2)]: `% ${tagName}%`,
          [parameterKey(3)]: `% ${tagName} %`
        });
        return (
          `folder.FolderLocation ${isTagIncluded ? 'IN' : 'NOT IN'} ` +
          subQuery.getQuery()
        );
      });
    });
  };

  _.forEach(tags, (value, key) => {
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
        status: StatusCode.InvalidData
      };
    }
    if (isRandom) query.limit(_.last(PAGINATION.ITEMS_PER_PAGE));
    else query.offset(skipQuantity).limit(itemsPerPage);

    const result = await query.getRawMany();
    return {
      folders: {
        foldersList: result,
        totalFolders
      },
      message: MESSAGE.SUCCESS,
      status: StatusCode.Success
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
      status: StatusCode.DbError
    };
  }
};

Folder.prototype.add = async (
  folders: FolderInterface[]
): Promise<FolderQueryResult> => {
  const isAddingMultipleFoldesr = folders.length > 1;
  const insertFolders: Folder[] = [];
  const manager = getManager();

  // Foreach does not support async await
  // How many times does it need for me to remember :(
  for (const folder of folders) {
    const { location, name, thumbnail } = folder;
    const folderExists = await new Folder().isExisting(location);
    if (folderExists) {
      if (isAddingMultipleFoldesr) continue;
      return {
        message: MESSAGE.SPECIFIC_FOLDER_ALREADY_EXISTS(location),
        status: StatusCode.DbError
      };
    } else
      insertFolders.push(
        manager.create(Folder, {
          FolderLocation: location,
          FolderName: name,
          FolderThumbnail: thumbnail,
          CreatedAt: new Date().getTime()
        })
      );
  }

  try {
    await manager.insert(Folder, insertFolders);
    return {
      message: MESSAGE.SUCCESS,
      status: StatusCode.Success
    };
  } catch (error) {
    console.error('ADD FOLDERS ERROR: ', error);
    logErrors(error.message, error.stack);
    return {
      message: error.message,
      status: StatusCode.DbError
    };
  }
};

/**
 * Using folderName instead of folderLocation for checking
 * due to folders might be moved.
 * There is an edge case that folderName will be duplicate
 * but since it's kinda complicated we need to handle it manually.
 */
Folder.prototype.import = async (
  json: TransferData[],
  isOverwrite = false
): Promise<QueryResult> => {
  if (!Array.isArray(json)) {
    console.error('IMPORT FOLDERS ERROR: ', 'Backup file has incorrect format');
    return {
      message: 'Backup file has incorrect format',
      status: StatusCode.InvalidData
    };
  }

  const manager = getManager();
  const folderRepository = getRepository(Folder);
  const tagRepository = getRepository(Tag);
  const allCategories = await getRepository(Category).find();
  const allLanguages = await getRepository(Language).find();
  const allTagTypes = await getRepository(TagType).find();
  const upsertFolders: Folder[] = [];
  const failedToImportFolders: TransferData[] = [];
  const newTags: Tag[] = [];

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
    const {
      FolderLocation,
      FolderName,
      Category,
      Language,
      CreatedAt,
      UpdatedAt,
      Tags
    } = folder;
    const folderAlreadyInDB = await getFolderInDB(FolderName);
    const categoryAlreadyInDB = allCategories.find(
      category => category.Category === Category
    );
    const languageAlreadyInDB = allLanguages.find(
      language => language.Language === Language
    );

    const updateOrCreateFolders = async (folder: Folder) => {
      const folderTags: Tag[] = [];
      const transferTags: Record<string, string[]> = { ...Tags };
      const getFolderTags = async () => {
        for (const tagType of Object.keys(transferTags)) {
          const tagTypeInDatabase = allTagTypes.find(
            t => t.TagType === tagType
          );
          // This tag type does not exist in database
          if (!tagTypeInDatabase) continue;
          for (const tagName of transferTags[tagType]) {
            const tagAlreadyInDB = await getTagInDB(tagType, tagName);
            if (tagAlreadyInDB) folderTags.push(tagAlreadyInDB);
            else {
              const newTag = manager.create(Tag, {
                TagId: getTagId(tagType, tagName),
                TagName: tagName,
                TagType: tagTypeInDatabase
              });
              const isNewTagDuplicate =
                newTags.find(upsertTag => upsertTag.TagId === newTag.TagId) !==
                undefined;
              if (!isNewTagDuplicate) newTags.push(newTag);
              folderTags.push(newTag);
            }
          }
        }
      };
      await getFolderTags();

      if (!Category) {
        if (isOverwrite) folder.Category = null;
      } else if (categoryAlreadyInDB) folder.Category = categoryAlreadyInDB;
      if (!Language) {
        if (isOverwrite) folder.Language = null;
      } else if (languageAlreadyInDB) folder.Language = languageAlreadyInDB;
      folder.Tags = folderTags;
      upsertFolders.push(folder);
    };

    if (folderAlreadyInDB) {
      let folderHasTags;
      if (!isOverwrite) folderHasTags = await checkFolderHasTags(FolderName);
      if (isOverwrite || !folderHasTags)
        await updateOrCreateFolders(folderAlreadyInDB);
      if (folderHasTags) failedToImportFolders.push(folder);
    } else {
      if (!fileExists(FolderLocation)) failedToImportFolders.push(folder);
      else {
        const newFolder = manager.create(Folder, {
          FolderLocation,
          FolderName: getFolderName(FolderLocation),
          FolderThumbnail: getFolderThumbnail(FolderLocation),
          CreatedAt,
          UpdatedAt
        });
        await updateOrCreateFolders(newFolder);
      }
    }
  }

  try {
    await manager.transaction(async transactionManager => {
      if (!_.isEmpty(newTags)) await transactionManager.insert(Tag, newTags);
      // Sqlite maximum depth is 1000
      await transactionManager.save(upsertFolders, { chunk: 500 });
      if (!_.isEmpty(failedToImportFolders))
        writeToFile(
          BACKUP.DIRECTORY,
          BACKUP.PATH_FAILED_IMPORT(moment()),
          JSON.stringify(failedToImportFolders, null, 2)
        );
    });
    return {
      message: MESSAGE.SUCCESS,
      status: StatusCode.Success
    };
  } catch (error) {
    console.error('IMPORT FOLDERS ERROR: ', error);
    logErrors(error.message, error.stack);
    return {
      message: error.message,
      status: StatusCode.DbError
    };
  }
};

Folder.prototype.export = async (): Promise<QueryResult> => {
  try {
    const allFolders = await getRepository(Folder)
      .createQueryBuilder('folder')
      .leftJoinAndSelect('folder.Category', 'category')
      .leftJoinAndSelect('folder.Language', 'language')
      .leftJoinAndSelect('folder.Tags', 'tag')
      .leftJoinAndSelect('tag.TagType', 'tagType')
      .select([
        'folder.FolderLocation',
        'folder.FolderName',
        'category.Category',
        'language.Language',
        'folder.CreatedAt',
        'folder.UpdatedAt',
        'tag.TagName',
        'tagType.TagType'
      ])
      .getMany();
    const json = allFolders.map(folder => {
      const {
        FolderLocation,
        FolderName,
        Category,
        Language,
        CreatedAt,
        UpdatedAt,
        Tags
      } = folder;
      return {
        FolderLocation,
        FolderName,
        Category: Category?.Category || null,
        Language: Language?.Language || null,
        CreatedAt,
        UpdatedAt,
        Tags: Tags.reduce(
          (accumulator: Record<BreakDownTagType, string[]>, currentValue) => {
            const tagKey = currentValue.TagType.TagType;
            switch (tagKey) {
              case 'author':
              case 'parody':
              case 'character':
              case 'genre':
                accumulator[tagKey].push(currentValue.TagName);
                break;
            }
            return accumulator;
          },
          { author: [], parody: [], character: [], genre: [] }
        )
      };
    });
    writeToFile(
      BACKUP.DIRECTORY,
      BACKUP.PATH_EXPORT(moment()),
      JSON.stringify(json, null, 2)
    );

    return {
      message: MESSAGE.SUCCESS,
      status: StatusCode.Success
    };
  } catch (error) {
    console.error('EXPORT FOLDERS ERROR: ', error);
    logErrors(error.message, error.stack);
    return {
      message: error.message,
      status: StatusCode.DbError
    };
  }
};

Folder.prototype.clear = async (): Promise<QueryResult> => {
  const allFolders = await getRepository(Folder)
    .createQueryBuilder('folder')
    .select(['folder.FolderLocation', 'folder.FolderThumbnail'])
    .getMany();
  const nonExistentFolders: Folder[] = [];
  const updatedThumbnailFolders: Folder[] = [];
  allFolders.forEach(folder => {
    const { FolderLocation, FolderThumbnail } = folder;
    if (!fileExists(FolderLocation)) nonExistentFolders.push(folder);
    else if (!FolderThumbnail || !fileExists(FolderThumbnail)) {
      const newThumbnail = getFolderThumbnail(FolderLocation);
      if (newThumbnail) folder.FolderThumbnail = newThumbnail;
      else folder.FolderThumbnail = '';
      // If folder does not have thumbnail from the get go
      // and no new thumbnail has been found (basically nothing happened),
      // don't update UpdatedAt.
      if (!(!FolderThumbnail && !newThumbnail))
        folder.UpdatedAt = new Date().getTime();
      updatedThumbnailFolders.push(folder);
    }
  });

  try {
    const deletedFolders = nonExistentFolders.map(
      folder => folder.FolderLocation
    );
    const manager = getManager();
    await manager.transaction(async transactionManager => {
      await transactionManager.remove(nonExistentFolders);
      await transactionManager.save(updatedThumbnailFolders);
    });
    if (!_.isEmpty(deletedFolders))
      writeToFile(
        BACKUP.DIRECTORY,
        BACKUP.PATH_DELETE(moment()),
        JSON.stringify(deletedFolders, null, 2)
      );
    return {
      message: MESSAGE.SUCCESS,
      status: StatusCode.Success
    };
  } catch (error) {
    console.error('CLEAR FOLDERS ERROR: ', error);
    logErrors(error.message, error.stack);
    return {
      message: error.message,
      status: StatusCode.DbError
    };
  }
};

Folder.prototype.rename = async (
  params: RenameFolderParams
): Promise<RenameQueryResult> => {
  const { oldLocation, newLocation } = params;
  const folderExists = await new Folder().isExisting(newLocation);
  if (folderExists)
    return {
      message: MESSAGE.SPECIFIC_FOLDER_ALREADY_EXISTS(newLocation),
      status: StatusCode.DbError
    };
  const manager = getManager();
  const oldFolder = await getRepository(Folder)
    .createQueryBuilder('folder')
    .leftJoinAndSelect('folder.Category', 'category')
    .leftJoinAndSelect('folder.Language', 'language')
    .leftJoinAndSelect('folder.Tags', 'tags')
    .where('folder.FolderLocation = :oldLocation', { oldLocation })
    .getOne();
  const newName = getFolderName(newLocation);
  const newThumbnail = oldFolder?.FolderThumbnail
    ? oldFolder.FolderThumbnail.replace(oldLocation, newLocation)
    : '';
  const newFolder = manager.create(Folder, {
    ...oldFolder,
    FolderLocation: newLocation,
    FolderName: newName,
    FolderThumbnail: newThumbnail,
    UpdatedAt: new Date().getTime()
  });

  try {
    await manager.transaction(async transactionManager => {
      await transactionManager.save(newFolder);
      await transactionManager.remove(oldFolder);
      renameFolder(oldLocation, newLocation);
    });
    return {
      newLocation,
      newName,
      newThumbnail,
      message: MESSAGE.SUCCESS,
      status: StatusCode.Success
    };
  } catch (error) {
    console.error('RENAME FOLDERS ERROR: ', error);
    logErrors(error.message, error.stack);
    return {
      message: error.message,
      status: StatusCode.DbError
    };
  }
};

Folder.prototype.remove = async (
  removedFolders: string[]
): Promise<QueryResult> => {
  try {
    await getRepository(Folder).delete(removedFolders);
    return {
      message: MESSAGE.SUCCESS,
      status: StatusCode.Success
    };
  } catch (error) {
    console.error('REMOVE FOLDERS ERROR: ', error);
    logErrors(error.message, error.stack);
    return {
      message: error.message,
      status: StatusCode.DbError
    };
  }
};
