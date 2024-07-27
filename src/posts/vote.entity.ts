import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @ManyToOne(() => Post, (post) => post.votes)
  post: Post;

  @ManyToOne(() => User, (user) => user.votes)
  user: User;
}
