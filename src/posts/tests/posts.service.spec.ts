import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { Vote } from '../vote.entity';
import { Comment } from '../comment.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository: Repository<Post>;
  let votesRepository: Repository<Vote>;
  let commentsRepository: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Vote),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Comment),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    votesRepository = module.get<Repository<Vote>>(getRepositoryToken(Vote));
    commentsRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        image: 'image.png',
        content: 'Content',
        category: 'Health',
      };
      const post = { ...createPostDto, id: 1, user: { id: 1 } };

      jest.spyOn(postsRepository, 'save').mockResolvedValue(post as Post);

      expect(await service.create(createPostDto, 1)).toEqual(post);
    });
  });

  describe('update', () => {
    it('should update an existing post', async () => {
      const updatePostDto: UpdatePostDto = { content: 'Updated Content' };
      const post = {
        id: 1,
        image: 'image.png',
        content: 'Content',
        category: 'Health',
        user: { id: 1 },
      };

      jest.spyOn(postsRepository, 'findOne').mockResolvedValue(post as Post);
      jest
        .spyOn(postsRepository, 'save')
        .mockResolvedValue({ ...post, ...updatePostDto } as Post);

      expect(await service.update(1, updatePostDto, 1)).toEqual({
        ...post,
        ...updatePostDto,
      });
    });
  });

  describe('delete', () => {
    it('should delete an existing post', async () => {
      jest.spyOn(postsRepository, 'delete').mockResolvedValue({ affected: 1 });

      await service.delete(1, 1);
    });

    it('should throw an exception if no post is deleted', async () => {
      jest.spyOn(postsRepository, 'delete').mockResolvedValue({ affected: 0 });

      await expect(service.delete(1, 1)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('findAll', () => {
    it('should return a list of posts', async () => {
      const posts = [{ id: 1, content: 'Content' }];
      jest.spyOn(postsRepository, 'createQueryBuilder').mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(posts),
      } as any);

      expect(await service.findAll('time')).toEqual(posts);
    });
  });

  describe('vote', () => {
    it('should create a vote', async () => {
      const createVoteDto: CreateVoteDto = { value: 1 };
      const vote = {
        ...createVoteDto,
        id: 1,
        post: { id: 1 },
        user: { id: 1 },
      };

      jest.spyOn(votesRepository, 'save').mockResolvedValue(vote as Vote);

      expect(await service.vote(1, createVoteDto, 1)).toEqual(vote);
    });
  });

  describe('addComment', () => {
    it('should create a comment', async () => {
      const createCommentDto: CreateCommentDto = { content: 'Nice post!' };
      const comment = {
        ...createCommentDto,
        id: 1,
        post: { id: 1 },
        user: { id: 1 },
      };

      jest
        .spyOn(commentsRepository, 'save')
        .mockResolvedValue(comment as Comment);

      expect(await service.addComment(1, createCommentDto, 1)).toEqual(comment);
    });
  });

  describe('getComments', () => {
    it('should return comments for a post', async () => {
      const comments = [{ id: 1, content: 'Nice post!', user: { id: 1 } }];
      jest.spyOn(commentsRepository, 'find').mockResolvedValue(comments);

      expect(await service.getComments(1)).toEqual(comments);
    });
  });
});
