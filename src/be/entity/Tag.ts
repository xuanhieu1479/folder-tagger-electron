import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  getRepository,
  getManager
} from 'typeorm';
import { TagType, Folder, Category, Language } from './entity';
import { MESSAGE, STATUS_CODE } from '../../common/variables/commonVariables';
import {
  Tags as TagsInterface,
  LooseObject
} from '../../common/interfaces/commonInterfaces';
import { QueryResultInterface } from '../../common/interfaces/beInterfaces';
import { logErrors } from '../logging';

interface TagQueryResult extends QueryResultInterface {
  tags?: {
    allTags: Array<TagsInterface>;
  };
}
interface AddTagsToFoldersInterface extends TagsInterface {
  folderLocations: Array<string>;
  tags: Array<TagsInterface>;
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

  create = async (newTags: Array<TagsInterface>): Promise<TagQueryResult> => {
    const allTagTypes = await getRepository(TagType)
      .createQueryBuilder()
      .getMany();
    const getTagType = (type: string) => {
      return allTagTypes.find(tagType => tagType.TagType === type);
    };
    const tagTypes: LooseObject = {
      artist: getTagType('artist'),
      group: getTagType('group'),
      parody: getTagType('parody'),
      character: getTagType('character'),
      genre: getTagType('genre')
    };

    const insertValues = newTags.map(newTag => {
      const { tagType, tagName } = newTag;
      return {
        TagId: getTagId(tagType, tagName),
        TagName: tagName,
        TagType: tagTypes[tagType]
      };
    });

    try {
      await getRepository(Tag)
        .createQueryBuilder()
        .insert()
        .values(insertValues)
        .execute();
      return {
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.error('CREATE TAGS ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };

  addToFolders = async (
    params: AddTagsToFoldersInterface
  ): Promise<QueryResultInterface> => {
    const { folderLocations, tags, category, language } = params;
    const tagIds = tags.map(tag => getTagId(tag.tagType, tag.tagName));

    const insertFolders = await getRepository(Folder)
      .createQueryBuilder()
      .whereInIds(folderLocations)
      .getMany();
    const insertTags = await getRepository(Tag)
      .createQueryBuilder()
      .whereInIds(tagIds)
      .getMany();
    let insertCategory = undefined;
    if (category)
      insertCategory = await getRepository(Category)
        .createQueryBuilder()
        .whereInIds(category)
        .getOne();
    let insertLanguage = undefined;
    if (language)
      insertLanguage = await getRepository(Language)
        .createQueryBuilder()
        .whereInIds(language)
        .getOne();

    try {
      const manager = getManager();
      for (const folder of insertFolders) {
        if (insertCategory) folder.Category = insertCategory;
        if (insertLanguage) folder.Language = insertLanguage;
        folder.Tags = [...folder.Tags, ...insertTags];
        manager.save(folder);
      }
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
