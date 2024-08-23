const { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } = require('../../utils/jwt.js');
const jwt = require('jsonwebtoken');


jest.mock('jsonwebtoken');

describe('JWT Utility Functions', () => {
  const id = '123';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should generate a token', () => {
    const token = 'testtoken';
    jwt.sign.mockReturnValue(token); 

    const result = generateToken(id);
    expect(jwt.sign).toHaveBeenCalledWith({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    expect(result).toBe(token);
  });

  it('should generate a refresh token', () => {
    const refreshToken = 'testrefreshtoken';
    jwt.sign.mockReturnValue(refreshToken); 

    const result = generateRefreshToken(id);
    expect(jwt.sign).toHaveBeenCalledWith({ id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    expect(result).toBe(refreshToken);
  });

  it('should verify a token', () => {
    const token = 'testtoken';
    const decoded = { id };
    jwt.verify.mockReturnValue(decoded); 

    const result = verifyToken(token);
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(result).toBe(decoded);
  });

  it('should verify a refresh token', () => {
    const token = 'testrefreshtoken';
    const decoded = { id };
    jwt.verify.mockReturnValue(decoded);

    const result = verifyRefreshToken(token);
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.REFRESH_SECRET);
    expect(result).toBe(decoded);
  });
});
