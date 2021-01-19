import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  Column,
  getRepository
} from 'typeorm';
import { TagType } from './entity';
import { MESSAGE, STATUS_CODE } from '../../common/variables/commonVariables';
import { logErrors } from '../logging';

interface TagQueryResult {
  tags: {
    artist?: Array<string>;
    group?: Array<string>;
    parody?: Array<string>;
    character?: Array<string>;
    genre?: Array<string>;
  };
  message: string;
  status: number;
}

interface LooseObject {
  [key: string]: Array<string>;
}

@Entity({ name: 'Tags' })
export default class Tag {
  @PrimaryColumn()
  TagId!: string;

  @Column()
  TagName!: string;

  @ManyToOne(() => TagType, tagType => tagType.Tags)
  TagType!: TagType;

  get = async (): Promise<TagQueryResult> => {
    try {
      // const result = await getRepository(Tag)
      //   .createQueryBuilder('tag')
      //   .select('tag.TagType', tagType)
      //   .addSelect('tag.TagName', tagName)
      //   .getRawMany();
      const result = [
        {
          tagType: 'artist',
          tagName: 'a'
        },
        {
          tagType: 'group',
          tagName: 'b'
        },
        {
          tagType: 'parody',
          tagName: 'c'
        },
        {
          tagType: 'character',
          tagName: 'd'
        },
        {
          tagType: 'genre',
          tagName: 'e'
        },
        {
          tagType: 'artist',
          tagName: 'b'
        },
        {
          tagType: 'artist',
          tagName: 'c'
        },
        {
          tagType: 'parody',
          tagName: 'd'
        },
        {
          tagType: 'character',
          tagName: 'e'
        },
        {
          tagType: 'genre',
          tagName: 'a'
        },
        {
          tagType: 'genre',
          tagName: 'g'
        }
      ];
      return {
        tags: result.reduce(
          (accumulator, currentValue) => {
            const newValue: LooseObject = { ...accumulator };
            newValue[currentValue.tagType].push(currentValue.tagName);
            return { ...accumulator, ...newValue };
          },
          { artist: [], group: [], parody: [], character: [], genre: [] }
        ),
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.error('GET TAGS ERROR:', error);
      logErrors(error.message, error.stack);
      return {
        tags: {},
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };
}
