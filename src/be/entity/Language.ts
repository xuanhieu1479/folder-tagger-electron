import { Entity, PrimaryColumn, OneToMany, getRepository } from 'typeorm';
import { QueryResult } from '../../common/interfaces/beInterfaces';
import { MESSAGE } from '../../common/variables/commonVariables';
import { StatusCode } from '../../common/enums/commonEnums';
import { Folder } from './entity';
import { logErrors } from '../logging';

interface LanguageQueryResult extends QueryResult {
  languages: Array<string>;
}

@Entity()
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
        status: StatusCode.Success
      };
    } catch (error) {
      console.error('GET LANGUAGES ERROR: ', error);
      logErrors(error.message, error.stack);
      return {
        languages: [],
        message: error.message,
        status: StatusCode.DbError
      };
    }
  };
}
