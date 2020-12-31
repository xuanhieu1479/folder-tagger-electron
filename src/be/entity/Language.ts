import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Folder from './Folder';

@Entity()
export default class Language {
  @PrimaryGeneratedColumn()
  LanguageId!: number;

  @Column()
  LanguageLabel!: string;

  @OneToMany(() => Folder, folder => folder.category)
  folders!: Folder[];
}
