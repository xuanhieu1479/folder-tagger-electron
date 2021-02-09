import { Entity, getRepository, OneToMany, PrimaryColumn } from 'typeorm';
import { MESSAGE } from '../../common/variables/commonVariables';
import { STATUS_CODE } from '../../common/enums/commonEnums';
import { QueryResultInterface } from '../../common/interfaces/beInterfaces';
import { Folder } from './entity';
import { logErrors } from '../logging';

interface CategoryQueryResult extends QueryResultInterface {
  categories: Array<string>;
}

@Entity({ name: 'Categories' })
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
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.error('GET CATEGORIES ERROR: ', error);
      logErrors(error.message, error.stack);
      return {
        categories: [],
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };
}
