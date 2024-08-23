import { register, login, refreshToken } from '../authController.js';
import User from '../../models/user.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';

jest.mock('../../models/user.js');
jest.mock('../../utils/jwt.js', () => ({
  verifyRefreshToken: jest.fn(),
  generateToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

describe('Auth Controllers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('register', () => {
    it('should create a user and return tokens', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue(req.body);
      generateToken.mockReturnValue('testtoken');
      generateRefreshToken.mockReturnValue('testrefreshtoken');

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: undefined,
        email: 'test@example.com',
        token: 'testtoken',
        refreshToken: 'testrefreshtoken',
      });
    });
    it('should return an error if user creation fails', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };


      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(null); 

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(User.create).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user data' });
    });
    it('should return an error if user already exists', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne = jest.fn().mockResolvedValue(req.body);

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });

  describe('login', () => {
    it('should return user and tokens if login is successful', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = { json: jest.fn() };

      User.findOne = jest.fn().mockResolvedValue({
        _id: '123',
        email: 'test@example.com',
        matchPassword: jest.fn().mockResolvedValue(true),
      });
      generateToken.mockReturnValue('testtoken');
      generateRefreshToken.mockReturnValue('testrefreshtoken');

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.json).toHaveBeenCalledWith({
        _id: '123',
        email: 'test@example.com',
        token: 'testtoken',
        refreshToken: 'testrefreshtoken',
      });
    });

    it('should return an error if login fails', async () => {
      const req = { body: { email: 'test@example.com', password: 'password' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      User.findOne = jest.fn().mockResolvedValue(null);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });
  });





});
