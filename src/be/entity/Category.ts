import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Folder } from './entity';

@Entity({ name: 'Categories' })
export default class Category {
  @PrimaryColumn()
  Category!: string;

  @OneToMany(() => Folder, folder => folder.Category)
  Folders!: Folder[];
}
