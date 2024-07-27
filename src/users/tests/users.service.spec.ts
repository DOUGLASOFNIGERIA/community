import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByUsername', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, username: 'test' };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user as User);

      expect(await service.findOneByUsername('test')).toEqual(user);
    });

    it('should return undefined if not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined);

      expect(await service.findOneByUsername('test')).toBeUndefined();
    });
  });

  describe('findOneById', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, username: 'test' };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user as User);

      expect(await service.findOneById(1)).toEqual(user);
    });

    it('should return undefined if not found', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined);

      expect(await service.findOneById(1)).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const user = {
        id: 1,
        username: 'test',
        password: 'password',
        name: 'Test User',
        picture: 'picture.png',
      };
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user as User);

      expect(await service.create(user as User)).toEqual(user);
    });
  });
});
