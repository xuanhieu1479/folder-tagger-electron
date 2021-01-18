import { Entity, getRepository, OneToMany, PrimaryColumn } from 'typeorm';
import { MESSAGE, STATUS_CODE } from '../../common/variables/commonVariables';
import { Folder } from './entity';
import { logErrors } from '../logging';

interface CategoryQueryResult {
  categories: Array<string>;
  message: string;
  status: number;
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
      console.log('GET CATEGORIES ERROR: ', error);
      logErrors(error.message, error.stack);
      return {
        categories: [],
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };
}
