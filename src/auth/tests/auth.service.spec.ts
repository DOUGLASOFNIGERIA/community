import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(),
            findOneById: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid', async () => {
      const user = { id: 1, username: 'test', password: 'password' };
      jest
        .spyOn(usersService, 'findOneByUsername')
        .mockResolvedValue(user as User);

      expect(await service.validateUser('test', 'password')).toEqual({
        id: 1,
        username: 'test',
      });
    });

    it('should return null if credentials are invalid', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

      expect(await service.validateUser('test', 'password')).toBeNull();
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const user = { id: 1, username: 'test' };
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');

      expect(await service.login(user)).toEqual({ access_token: 'jwt-token' });
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const user = {
        username: 'test',
        password: 'password',
        name: 'Test User',
        picture: 'picture.png',
      };
      jest.spyOn(usersService, 'create').mockResolvedValue(user as User);

      expect(await service.register(user as User)).toEqual(user);
    });
  });
});
