import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  getRepository,
  getManager,
  EntityManager,
  ManyToMany,
  Brackets
} from 'typeorm';
import _ from 'lodash';
import { TagType, Folder, Category, Language } from './entity';
import {
  Tag as TagInterface,
  TagRelations,
  BreakDownTagType
} from '../../common/interfaces/commonInterfaces';
import { QueryResult } from '../../common/interfaces/beInterfaces';
import { MESSAGE, SETTING } from '../../common/variables/commonVariables';
import { StatusCode, TagAction } from '../../common/enums/commonEnums';
import { writeToFile } from '../../utilities/utilityFunctions';
import { logErrors } from '../logging';

interface TagQueryResult extends QueryResult {
  tags?: TagInterface[];
  category?: string;
  language?: string;
}
interface GetTagFilterParams {
  folderLocation?: string;
  includedTagTypes?: BreakDownTagType[];
}
interface ModifyTagsOfFolders extends TagInterface {
  folderLocations: string[];
  existingTags: TagInterface[];
  newTags: TagInterface[];
  category?: string;
  language?: string;
  action: TagAction;
}
interface TagRelationQueryResult extends QueryResult {
  relations?: TagRelations;
}

// A 51% instead of 50% will ensure an author will only have a single main parody
// while an increasing of 1% won't affect much to other kinds of tag.
const TAG_FREQUENT_THRESHOLD = 0.51;
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
    folderLocation,
    includedTagTypes
  }: GetTagFilterParams): Promise<TagQueryResult> => {
    const getTagsForFolder = folderLocation !== undefined;
    const hasIncludedTagTypes = includedTagTypes !== undefined;
    const query = getRepository(Tag)
      .createQueryBuilder('tag')
      .select('tag.TagType', 'tagType')
      .addSelect('tag.TagName', 'tagName');
    if (getTagsForFolder)
      query
        .innerJoin('tag.Folders', 'folder')
        .where('folder.FolderLocation = :folderLocation', { folderLocation });
    if (hasIncludedTagTypes)
      query.andWhere(
        new Brackets(q => {
          includedTagTypes?.forEach(tagType => {
            q.orWhere(`tag.TagType = :${tagType}`, { [tagType]: tagType });
          });
        })
      );

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
          status: StatusCode.Success
        };
      }
      return {
        tags,
        message: MESSAGE.SUCCESS,
        status: StatusCode.Success
      };
    } catch (error) {
      console.error('GET TAGS ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: StatusCode.DbError
      };
    }
  };

  create = async (
    newTags: TagInterface[],
    transactionManager?: EntityManager
  ): Promise<Tag[]> => {
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
  ): Promise<QueryResult> => {
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
    if (action !== TagAction.Edit)
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

    const updateFoldersTag = async (newlyCreatedTags: Tag[]) => {
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
          case TagAction.Add:
            folder.Tags = [...folder.Tags, ...foundTags, ...newlyCreatedTags];
            break;
          case TagAction.Edit:
            folder.Tags = [...foundTags, ...newlyCreatedTags];
            break;
          case TagAction.Remove:
            _.pullAllBy(folder.Tags, foundTags, 'TagId');
            break;
        }
      }
    };

    try {
      await getManager().transaction(async transactionManager => {
        let newlyCreatedTags: Tag[] = [];
        if (!_.isEmpty(newTags)) {
          newlyCreatedTags = await this.create(newTags, transactionManager);
        }
        await updateFoldersTag(newlyCreatedTags);
        await transactionManager.save(insertFolders);
      });
      return {
        message: MESSAGE.SUCCESS,
        status: StatusCode.Success
      };
    } catch (error) {
      console.error('MODIFY FOLDERS TAGS ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: StatusCode.DbError
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

    const findFrequentTags = async (source: Record<string, string[]>) => {
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
            (childrenTags: string[], count, tag) => {
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
          (accumulator: Record<BreakDownTagType, string[]>, tag) => {
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
        JSON.stringify(relations, null, 2)
      );
      return {
        relations,
        message: MESSAGE.SUCCESS,
        status: StatusCode.Success
      };
    } catch (error) {
      console.error('CALCULATE TAGS RELATION ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: StatusCode.DbError
      };
    }
  };

  clear = async (): Promise<QueryResult> => {
    const unusedTags = await getRepository(Tag)
      .createQueryBuilder('tag')
      .leftJoin('tag.Folders', 'folder')
      .where('folder.FolderLocation IS NULL')
      .getMany();

    try {
      const manager = getManager();
      await manager.remove(unusedTags);
      return {
        message: MESSAGE.SUCCESS,
        status: StatusCode.Success
      };
    } catch (error) {
      console.error('CLEAR TAGS ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        message: error.message,
        status: StatusCode.DbError
      };
    }
  };
}
