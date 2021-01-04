import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  getConnection
} from 'typeorm';
import Category from './Category';
import Language from './Language';

@Entity()
export default class Folder {
  @PrimaryColumn()
  FolderLocation!: string;

  @Column({ nullable: true })
  CategoryId!: number;

  @Column({ nullable: true })
  LanguageId!: number;

  @ManyToOne(() => Category, category => category.folders)
  category!: Category;

  @ManyToOne(() => Language, language => language.folders)
  language!: Language;

  addFolder = async (folderLocation: string): Promise<void> => {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Folder)
      .values([{ FolderLocation: folderLocation }])
      .execute();
  };
}
