import { check,query ,body, validationResult } from 'express-validator';

export const postValidator = [
    check('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 5 })
        .withMessage('Title must be at least 5 characters long'),

    check('content')
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


export const updatePostValidator = [
    check('title')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Title must be at least 5 characters long'),

    check('content')
        .optional()
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


export const getPostsValidator = [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),
  
    query('limit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Limit must be a positive integer')
      .toInt(),
  
    query('search')
      .optional()
      .isString()
      .withMessage('Search term must be a string')
      .trim()
      .escape(),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
  ];

  export const commentOnPostValidator = [
    body('content')
      .isLength({ min: 1 })
      .withMessage('Content is required and must be at least 1 character long')
      .trim()
      .escape(),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
  ];