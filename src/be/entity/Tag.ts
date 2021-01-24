import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  getRepository,
  getManager,
  EntityManager
} from 'typeorm';
import _ from 'lodash';
import { TagType, Folder, Category, Language } from './entity';
import { MESSAGE, STATUS_CODE } from '../../common/variables/commonVariables';
import { Tags as TagsInterface } from '../../common/interfaces/commonInterfaces';
import { QueryResultInterface } from '../../common/interfaces/beInterfaces';
import { logErrors } from '../logging';

interface TagQueryResult extends QueryResultInterface {
  tags?: {
    allTags: Array<TagsInterface>;
  };
}
interface AddTagsToFoldersInterface extends TagsInterface {
  folderLocations: Array<string>;
  existingTags: Array<TagsInterface>;
  newTags: Array<TagsInterface>;
  category: string | undefined;
  language: string | undefined;
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

  get = async (): Promise<TagQueryResult> => {
    try {
      const result = await getRepository(Tag)
        .createQueryBuilder('tag')
        .select('tag.TagType', 'tagType')
        .addSelect('tag.TagName', 'tagName')
        .getRawMany();
      return {
        tags: {
          allTags: result
        },
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

  addToFolders = async (
    params: AddTagsToFoldersInterface
  ): Promise<QueryResultInterface> => {
    const {
      folderLocations,
      existingTags,
      newTags,
      category,
      language
    } = params;

    const insertFolders = await getRepository(Folder)
      .createQueryBuilder('folder')
      .whereInIds(folderLocations)
      .leftJoinAndSelect('folder.Tags', 'Tag')
      .getMany();
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
        const holdingTags = folder.Tags || [];
        folder.Tags = [...holdingTags, ...foundTags, ...newlyCreatedTags];
      }
    };

    try {
      const manager = getManager();
      await manager.transaction(async transactionManager => {
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
      console.error('ADD TAGS TO FOLDERS ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };
}
