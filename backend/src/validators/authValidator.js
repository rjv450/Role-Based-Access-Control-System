import { check, validationResult } from 'express-validator';

export const loginValidator = [
    check('email')
        .isEmail()
        .withMessage('Invalid email address format')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required'),

    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


export const registerValidator = [
    check('email')
        .isEmail()
        .withMessage('Invalid email address format')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required'),

    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required'),

    check('role')
        .optional()
        .isIn(['Admin', 'Moderator', 'User'])
        .withMessage('Role must be one of the following: Admin, Moderator, User'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


export const refreshTokenValidator = [
    check('token')
        .notEmpty()
        .withMessage('Refresh token is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];