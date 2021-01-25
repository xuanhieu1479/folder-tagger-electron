import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  getRepository,
  getManager,
  EntityManager,
  ManyToMany
} from 'typeorm';
import _ from 'lodash';
import { TagType, Folder, Category, Language } from './entity';
import {
  MESSAGE,
  STATUS_CODE,
  TAG_ACTION
} from '../../common/variables/commonVariables';
import { Tags as TagsInterface } from '../../common/interfaces/commonInterfaces';
import { QueryResultInterface } from '../../common/interfaces/beInterfaces';
import { logErrors } from '../logging';

interface TagQueryResult extends QueryResultInterface {
  tags?: Array<TagsInterface>;
  category?: string;
  language?: string;
}
interface GetTagFilterParams {
  folderLocation?: string;
}
interface ModifyTagsOfFoldersInterface extends TagsInterface {
  folderLocations: Array<string>;
  existingTags: Array<TagsInterface>;
  newTags: Array<TagsInterface>;
  category: string | undefined;
  language: string | undefined;
  action: string;
}

const getTagId = (tagType: string, tagName: string) => `${tagType}-${tagName}`;

@Entity({ name: 'Tags' })
export default class Tag {
  /**
   * TagId = TagType-TagName
   */
  @PrimaryColumn()
  TagId!: string;

  @Column()
  TagName!: string;

  @ManyToOne(() => TagType, tagType => tagType.Tags)
  TagType!: TagType;

  @ManyToMany(() => Folder, folder => folder.Tags)
  Folders!: Folder[];

  get = async ({
    folderLocation
  }: GetTagFilterParams): Promise<TagQueryResult> => {
    const query = getRepository(Tag)
      .createQueryBuilder('tag')
      .select('tag.TagType', 'tagType')
      .addSelect('tag.TagName', 'tagName');
    if (folderLocation)
      query
        .innerJoin('tag.Folders', 'folder')
        .where('folder.FolderLocation = :folderLocation', { folderLocation });
    try {
      const tags = await query.getRawMany();
      if (folderLocation) {
        const selectedFolder = await getRepository(
          Folder
        ).findOne(folderLocation, { relations: ['Category', 'Language'] });
        const category = selectedFolder?.Category?.Category;
        const language = selectedFolder?.Language?.Language;
        return {
          tags,
          category,
          language,
          message: MESSAGE.SUCCESS,
          status: STATUS_CODE.SUCCESS
        };
      }
      return {
        tags,
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.error('GET TAGS ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };

  create = async (
    newTags: Array<TagsInterface>,
    transactionManager?: EntityManager
  ): Promise<Array<Tag>> => {
    const typesOfNewTags = newTags.map(newTag => newTag.tagType);
    const tagTypes = await getRepository(TagType)
      .createQueryBuilder()
      .whereInIds(typesOfNewTags)
      .getMany();
    const getTagType = (type: string) => {
      return tagTypes.find(tagType => tagType.TagType === type);
    };

    const manager = transactionManager || getManager();
    const insertValues = newTags.map(newTag => {
      const { tagType, tagName } = newTag;
      return manager.create(Tag, {
        TagId: getTagId(tagType, tagName),
        TagName: tagName,
        TagType: getTagType(tagType)
      });
    });

    try {
      await manager.insert(Tag, insertValues);
      return insertValues;
    } catch (error) {
      console.error('CREATE TAGS ERROR:', error);
      logErrors(error.message, error.stack);
      return [];
    }
  };

  modifyTagsOfFolders = async (
    params: ModifyTagsOfFoldersInterface
  ): Promise<QueryResultInterface> => {
    const {
      folderLocations,
      existingTags,
      newTags,
      category,
      language,
      action
    } = params;

    const insertFoldersQuery = getRepository(Folder)
      .createQueryBuilder('folder')
      .whereInIds(folderLocations);
    // When editing tags of folders,
    // there is no need for the tags they
    // are currently holding.
    // Since they all will be overwritten anyway.
    if (action !== TAG_ACTION.EDIT)
      insertFoldersQuery.leftJoinAndSelect('folder.Tags', 'Tag');

    const insertFolders = await insertFoldersQuery.getMany();
    const insertCategory = category
      ? await getRepository(Category)
          .createQueryBuilder()
          .whereInIds(category)
          .getOne()
      : undefined;
    const insertLanguage = language
      ? await getRepository(Language)
          .createQueryBuilder()
          .whereInIds(language)
          .getOne()
      : undefined;

    const updateFoldersTag = async (newlyCreatedTags: Array<Tag>) => {
      const tagIds = existingTags.map(tag =>
        getTagId(tag.tagType, tag.tagName)
      );
      const foundTags = await getRepository(Tag)
        .createQueryBuilder()
        .whereInIds(tagIds)
        .getMany();
      for (const folder of insertFolders) {
        if (insertCategory) folder.Category = insertCategory;
        if (insertLanguage) folder.Language = insertLanguage;
        switch (action) {
          case TAG_ACTION.ADD:
            folder.Tags = [...folder.Tags, ...foundTags, ...newlyCreatedTags];
            break;
          case TAG_ACTION.EDIT:
            folder.Tags = [...foundTags, ...newlyCreatedTags];
            break;
          case TAG_ACTION.REMOVE:
            folder.Tags = [...folder.Tags, ...foundTags];
            break;
        }
      }
    };

    try {
      await getManager().transaction(async transactionManager => {
        let newlyCreatedTags: Array<Tag> = [];
        if (!_.isEmpty(newTags)) {
          newlyCreatedTags = await this.create(newTags, transactionManager);
        }
        await updateFoldersTag(newlyCreatedTags);
        await transactionManager.save(insertFolders);
      });
      return {
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.error('MODIFY FOLDERS TAGS ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };
}
