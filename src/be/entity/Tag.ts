import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';
import { TagType } from './entity';

@Entity({ name: 'Tags' })
export default class Tag {
  @PrimaryColumn()
  TagId!: string;

  @Column()
  TagName!: string;

  @ManyToOne(() => TagType, tagType => tagType.Tags)
  TagType!: TagType;
}
