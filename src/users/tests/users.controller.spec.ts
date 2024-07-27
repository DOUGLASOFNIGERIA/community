import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../users/users.controller';
import { UsersService } from '../../users/users.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateUserDto } from '../.././posts/dto/create-user.dto';
import { UpdateUserDto } from '../.././posts/dto/update-user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = {
        id: 1,
        username: 'testuser',
        name: 'Test User',
        picture: 'picture.png',
      };
      jest.spyOn(service, 'findOneById').mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password',
        name: 'Test User',
        picture: 'picture.png',
      };
      const result = { id: 1, ...createUserDto };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createUserDto)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const result = { id: 1, username: 'testuser', ...updateUserDto };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(
        await controller.update(1, updateUserDto, { user: { id: 1 } }),
      ).toEqual(result);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

      await expect(
        controller.update(1, updateUserDto, { user: { id: 2 } }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(1, { user: { id: 1 } });

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException if user is not the owner', async () => {
      await expect(controller.remove(1, { user: { id: 2 } })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
