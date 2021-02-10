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
  Tags as TagsInterface,
  TagRelations
} from '../../common/interfaces/commonInterfaces';
import { QueryResultInterface } from '../../common/interfaces/beInterfaces';
import { MESSAGE, SETTING } from '../../common/variables/commonVariables';
import { STATUS_CODE, TAG_ACTION } from '../../common/enums/commonEnums';
import { writeToFile } from '../../utilities/utilityFunctions';
import { logErrors } from '../logging';

interface TagQueryResult extends QueryResultInterface {
  tags?: Array<TagsInterface>;
  category?: string;
  language?: string;
}
interface GetTagFilterParams {
  folderLocation?: string;
}
interface ModifyTagsOfFolders extends TagsInterface {
  folderLocations: Array<string>;
  existingTags: Array<TagsInterface>;
  newTags: Array<TagsInterface>;
  category: string | undefined;
  language: string | undefined;
  action: TAG_ACTION;
}
interface TagRelationQueryResult extends QueryResultInterface {
  relations?: TagRelations;
}

const TAG_FREQUENT_THRESHOLD = 0.5;
const FOLDER_COUNT_THRESHOLD = Math.ceil(
  1 / Math.pow(TAG_FREQUENT_THRESHOLD, 2)
);
const getTagId = (tagType: string, tagName: string) => `${tagType}-${tagName}`;

@Entity()
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
    const getTagsForFolder = folderLocation !== undefined;
    const query = getRepository(Tag)
      .createQueryBuilder('tag')
      .select('tag.TagType', 'tagType')
      .addSelect('tag.TagName', 'tagName');
    if (getTagsForFolder)
      query
        .innerJoin('tag.Folders', 'folder')
        .where('folder.FolderLocation = :folderLocation', { folderLocation });
    try {
      const tags = await query.getRawMany();
      if (getTagsForFolder) {
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
    params: ModifyTagsOfFolders
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
    const newCategory = category
      ? await getRepository(Category)
          .createQueryBuilder()
          .whereInIds(category)
          .getOne()
      : undefined;
    const newLanguage = language
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
        if (newCategory) folder.Category = newCategory;
        if (newLanguage) folder.Language = newLanguage;
        switch (action) {
          case TAG_ACTION.ADD:
            folder.Tags = [...folder.Tags, ...foundTags, ...newlyCreatedTags];
            break;
          case TAG_ACTION.EDIT:
            folder.Tags = [...foundTags, ...newlyCreatedTags];
            break;
          case TAG_ACTION.REMOVE:
            _.pullAllBy(folder.Tags, foundTags, 'TagId');
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

  calculateRelation = async (): Promise<TagRelationQueryResult> => {
    const rawData = await getRepository(Folder)
      .createQueryBuilder('folder')
      .innerJoinAndSelect('folder.Tags', 'tag')
      .innerJoinAndSelect('tag.TagType', 'tagType')
      .select(['folder.FolderLocation', 'tagType.TagType', 'tag.TagName'])
      .getMany();
    type TagTypeType = 'author' | 'parody' | 'character' | 'genre';

    const findFrequentTags = async (source: Record<string, Array<string>>) => {
      const getSourceWithFrequentTags = async () => {
        const newSource = { ...source };
        for (const parentTag of Object.keys(newSource)) {
          const childrenTags = [...newSource[parentTag]];
          const numberOfFoldersWithParentTag = await getRepository(Folder)
            .createQueryBuilder('folder')
            .innerJoin('folder.Tags', 'tag')
            .innerJoin('tag.TagType', 'tagType')
            .where(`tagType.TagType = :author`, { author: 'author' })
            .andWhere(`tag.Tagname = :${parentTag}`, {
              [parentTag]: parentTag
            })
            .getCount();
          // Calculating tags frequency is meaningless if the sample is too small
          if (numberOfFoldersWithParentTag <= FOLDER_COUNT_THRESHOLD) {
            newSource[parentTag] = [];
            continue;
          }
          const childrenTagsPresence = childrenTags.reduce(
            (accumulator: Record<string, number>, tag) => {
              accumulator[tag] =
                typeof accumulator[tag] === 'number' ? accumulator[tag] + 1 : 1;
              return accumulator;
            },
            {}
          );
          newSource[parentTag] = _.reduce(
            childrenTagsPresence,
            (childrenTags: Array<string>, count, tag) => {
              if (
                count >=
                numberOfFoldersWithParentTag * TAG_FREQUENT_THRESHOLD
              )
                childrenTags.push(tag);
              return childrenTags;
            },
            []
          );
        }
        return newSource;
      };

      const sourceWithFrequentTags = await getSourceWithFrequentTags();
      return _.omitBy(sourceWithFrequentTags, _.isEmpty);
    };

    const relations = rawData.reduce(
      (relation: TagRelations, folder) => {
        const parodyCharacterRelation = relation.parody_character;
        const authorParodyRelation = relation.author_parody;
        const authorGenreRelation = relation.author_genre;
        const tags = folder.Tags.reduce(
          (accumulator: Record<TagTypeType, Array<string>>, tag) => {
            const { TagType } = tag.TagType;
            switch (TagType) {
              case 'author':
              case 'parody':
              case 'character':
              case 'genre':
                accumulator[TagType].push(tag.TagName);
                break;
            }
            return accumulator;
          },
          {
            author: [],
            parody: [],
            character: [],
            genre: []
          }
        );
        const hasExactlyOneAuthor = tags.author.length === 1;
        const hasExactlyOneParody = tags.parody.length === 1;
        const hasAtLeastOneCharacter = tags.character.length >= 1;

        if (hasExactlyOneParody && hasAtLeastOneCharacter) {
          const currentParody = tags.parody[0];
          if (typeof parodyCharacterRelation[currentParody] === 'object') {
            const relatedCharacters = [
              ...parodyCharacterRelation[currentParody],
              ...tags.character
            ];
            parodyCharacterRelation[currentParody] = [
              ...new Set(relatedCharacters)
            ];
          } else parodyCharacterRelation[currentParody] = [...tags.character];
        }
        if (hasExactlyOneAuthor) {
          const currentAuthor = tags.author[0];
          authorParodyRelation[currentAuthor] =
            typeof authorParodyRelation[currentAuthor] === 'object'
              ? [...authorParodyRelation[currentAuthor], ...tags.parody]
              : [...tags.parody];
          authorGenreRelation[currentAuthor] =
            typeof authorGenreRelation[currentAuthor] === 'object'
              ? [...authorGenreRelation[currentAuthor], ...tags.genre]
              : [...tags.genre];
        }

        return {
          parody_character: parodyCharacterRelation,
          author_parody: authorParodyRelation,
          author_genre: authorGenreRelation
        };
      },
      {
        parody_character: {},
        author_parody: {},
        author_genre: {}
      }
    );

    try {
      const { author_parody, author_genre } = relations;
      const authorParodyRelation = await findFrequentTags(author_parody);
      const authorGenreRelation = await findFrequentTags(author_genre);
      relations.author_parody = authorParodyRelation;
      relations.author_genre = authorGenreRelation;
      writeToFile(
        SETTING.DIRECTORY,
        SETTING.RELATION_PATH,
        JSON.stringify(relations, null, 2),
        true
      );
      return {
        relations,
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.error('CALCULATE TAGS RELATION ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };
}
