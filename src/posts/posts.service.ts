import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { Vote } from './vote.entity';
import { Comment } from './comment.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateVoteDto } from './dto/create-vote.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      user: { id: userId },
    });
    return this.postsRepository.save(post);
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!post) throw new UnauthorizedException();

    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async delete(id: number, userId: number): Promise<void> {
    const result = await this.postsRepository.delete({
      id,
      user: { id: userId },
    });
    if (result.affected === 0) throw new UnauthorizedException();
  }

  async findAll(
    sortBy: 'time' | 'upvotes',
    filterBy?: string,
  ): Promise<Post[]> {
    const query = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .leftJoinAndSelect('post.votes', 'vote')
      .leftJoinAndSelect('post.comments', 'comment')
      .orderBy(
        sortBy === 'upvotes' ? 'post.voteCount' : 'post.createdAt',
        'DESC',
      );

    if (filterBy) query.andWhere('post.category = :filterBy', { filterBy });

    return query.getMany();
  }

  async vote(
    postId: number,
    createVoteDto: CreateVoteDto,
    userId: number,
  ): Promise<Vote> {
    const vote = this.votesRepository.create({
      ...createVoteDto,
      post: { id: postId },
      user: { id: userId },
    });
    return this.votesRepository.save(vote);
  }

  async addComment(
    postId: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<Comment> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      post: { id: postId },
      user: { id: userId },
    });
    return this.commentsRepository.save(comment);
  }

  async getComments(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }
}
