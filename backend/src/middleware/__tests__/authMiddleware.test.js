
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import { protect } from '../authMiddleware.js';

jest.mock('jsonwebtoken');
jest.mock('../../models/user.js');

describe('protect middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    });

    test('should call next() if token is valid and user is found', async () => {
        const mockToken = 'validToken';
        const mockDecoded = { id: 'userId123' };
        const mockUser = { _id: 'userId123', email: 'test@example.com' };

        req.headers.authorization = `Bearer ${mockToken}`;
        jwt.verify.mockReturnValue(mockDecoded);
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUser),
        });

        await protect(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
        expect(User.findById).toHaveBeenCalledWith(mockDecoded.id);
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });


});
