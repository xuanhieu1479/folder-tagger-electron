import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Folder from './Folder';

@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  CategoryId!: number;

  @Column()
  CategoryType!: string;

  @OneToMany(() => Folder, folder => folder.category)
  folders!: Folder[];
}
