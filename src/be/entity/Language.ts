import { Entity, PrimaryColumn, OneToMany, getRepository } from 'typeorm';
import { MESSAGE, STATUS_CODE } from '../../common/variables/commonVariables';
import { Folder } from './entity';
import { logErrors } from '../logging';

interface LanguageQueryResult {
  languages: Array<string>;
  message: string;
  status: number;
}

@Entity({ name: 'Languages' })
export default class Language {
  @PrimaryColumn()
  Language!: string;

  @OneToMany(() => Folder, folder => folder.Language)
  Folders!: Folder[];

  get = async (): Promise<LanguageQueryResult> => {
    try {
      const result = await getRepository(Language)
        .createQueryBuilder('language')
        .select('language.Language', 'language')
        .getRawMany();
      return {
        languages: result.map(item => item.language),
        message: MESSAGE.SUCCESS,
        status: STATUS_CODE.SUCCESS
      };
    } catch (error) {
      console.error('GET LANGUAGES ERROR: ', error);
      logErrors(error.message, error.stack);
      return {
        languages: [],
        message: error.message,
        status: STATUS_CODE.DB_ERROR
      };
    }
  };
}
