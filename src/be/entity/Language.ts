import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Folder } from './entity';

@Entity({ name: 'Languages' })
export default class Language {
  @PrimaryColumn()
  Language!: string;

  @OneToMany(() => Folder, folder => folder.Language)
  Folders!: Folder[];
}
