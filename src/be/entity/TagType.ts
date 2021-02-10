import { Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Tag } from './entity';

@Entity()
export default class TagType {
  @PrimaryColumn()
  TagType!: string;

  @OneToMany(() => Tag, tag => tag.TagType)
  Tags!: Tag[];
}
