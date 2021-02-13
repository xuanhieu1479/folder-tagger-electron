import { Entity, getRepository, OneToMany, PrimaryColumn } from 'typeorm';
import { MESSAGE } from '../../common/variables/commonVariables';
import { StatusCode } from '../../common/enums/commonEnums';
import { QueryResult } from '../../common/interfaces/beInterfaces';
import { Folder } from './entity';
import { logErrors } from '../logging';

interface CategoryQueryResult extends QueryResult {
  categories: Array<string>;
}

@Entity()
export default class Category {
  @PrimaryColumn()
  Category!: string;

  @OneToMany(() => Folder, folder => folder.Category)
  Folders!: Folder[];

  get = async (): Promise<CategoryQueryResult> => {
    try {
      const result = await getRepository(Category)
        .createQueryBuilder('category')
        .select('category.Category', 'category')
        .getRawMany();
      return {
        categories: result.map(item => item.category),
        message: MESSAGE.SUCCESS,
        status: StatusCode.Success
      };
    } catch (error) {
      console.error('GET CATEGORIES ERROR: ', error);
      logErrors(error.message, error.stack);
      return {
        categories: [],
        message: error.message,
        status: StatusCode.DbError
      };
    }
  };
}
