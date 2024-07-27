import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { LocalAuthGuard } from '../local.strategy';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { login: jest.fn(), register: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return JWT token', async () => {
      const user = { username: 'test', id: 1 };
      jest
        .spyOn(service, 'login')
        .mockResolvedValue({ access_token: 'jwt-token' });

      expect(await controller.login({ user })).toEqual({
        access_token: 'jwt-token',
      });
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
      jest.spyOn(service, 'register').mockResolvedValue(user);

      expect(await controller.register(user)).toEqual(user);
    });
  });
});
