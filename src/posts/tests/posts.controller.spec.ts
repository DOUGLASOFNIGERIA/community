import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreateVoteDto } from '../dto/create-vote.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
            vote: jest.fn(),
            addComment: jest.fn(),
            getComments: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        image: 'image.png',
        content: 'Content',
        category: 'Health',
      };
      const post = { ...createPostDto, id: 1 };

      jest.spyOn(service, 'create').mockResolvedValue(post);

      expect(await controller.create(createPostDto, { userId: 1 })).toEqual(
        post,
      );
    });
  });

  describe('update', () => {
    it('should update an existing post', async () => {
      const updatePostDto: UpdatePostDto = { content: 'Updated Content' };
      const post = { id: 1, ...updatePostDto };

      jest.spyOn(service, 'update').mockResolvedValue(post);

      expect(
        await controller.update('1', updatePostDto, { userId: 1 }),
      ).toEqual(post);
    });
  });

  describe('remove', () => {
    it('should delete an existing post', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await controller.remove('1', { userId: 1 });
    });
  });

  describe('findAll', () => {
    it('should return a list of posts', async () => {
      const posts = [{ id: 1, content: 'Content' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(posts);

      expect(await controller.findAll({ sortBy: 'time' })).toEqual(posts);
    });
  });

  describe('vote', () => {
    it('should create a vote', async () => {
      const createVoteDto: CreateVoteDto = { value: 1 };
      const vote = { ...createVoteDto, id: 1 };

      jest.spyOn(service, 'vote').mockResolvedValue(vote);

      expect(await controller.vote('1', createVoteDto, { userId: 1 })).toEqual(
        vote,
      );
    });
  });

  describe('addComment', () => {
    it('should add a comment to a post', async () => {
      const createCommentDto: CreateCommentDto = { content: 'Nice post!' };
      const comment = { ...createCommentDto, id: 1 };

      jest.spyOn(service, 'addComment').mockResolvedValue(comment);

      expect(
        await controller.addComment('1', createCommentDto, { userId: 1 }),
      ).toEqual(comment);
    });
  });

  describe('getComments', () => {
    it('should return comments for a post', async () => {
      const comments = [{ id: 1, content: 'Nice post!', user: { id: 1 } }];
      jest.spyOn(service, 'getComments').mockResolvedValue(comments);

      expect(await controller.getComments('1')).toEqual(comments);
    });
  });
});
