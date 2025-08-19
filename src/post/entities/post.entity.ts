import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  content: string;

  @Column('text')
  excerpt: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //Many Post to One User -> authorId ->Fk para user
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;
}
