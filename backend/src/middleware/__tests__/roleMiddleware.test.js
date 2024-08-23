// tests/authorizeRoles.test.js
import { authorizeRoles } from '../roleMiddleware.js'; // Adjust the path to your middleware

describe('authorizeRoles middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { role: '' } }; // Mock request object
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; // Mock response object
    next = jest.fn(); // Mock next function
  });

  test('should allow access if user role is in allowed roles', () => {
    req.user.role = 'Admin';
    const middleware = authorizeRoles('Admin', 'Moderator');

    middleware(req, res, next);

    expect(next).toHaveBeenCalled(); // Middleware should call next()
    expect(res.status).not.toHaveBeenCalled(); // No response status should be set
  });

  test('should deny access if user role is not in allowed roles', () => {
    req.user.role = 'User';
    const middleware = authorizeRoles('Admin', 'Moderator');

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled(); // Middleware should not call next()
    expect(res.status).toHaveBeenCalledWith(403); // Status should be 403 Forbidden
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: Insufficient role' });
  });
});
