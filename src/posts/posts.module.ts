import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { Vote } from './vote.entity';
import { Comment } from './comment.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Vote, Comment]), UsersModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
