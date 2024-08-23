import express from 'express';
import { register, login, refreshToken } from '../controllers/authController.js';
import { loginValidator, refreshTokenValidator, registerValidator } from '../validators/authValidator.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user and return authentication tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 description: The user's password. Must be at least 6 characters long.
 *                 example: password
 *               role:
 *                 type: string
 *                 description: Optional. The user's role. Must be 'Admin', 'Moderator', or 'User'.
 *                 example: User
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token.
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token.
 *       400:
 *         description: User already exists or validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User already exists
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         description: The error message.
 *                         example: "Invalid email address format"
 *                       param:
 *                         type: string
 *                         description: The parameter that caused the error.
 *                         example: "email"
 *                       location:
 *                         type: string
 *                         description: The location of the parameter.
 *                         example: "body"
 */
router.post('/register', registerValidator, register);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticate a user and return authentication tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 description: The user's password. Must be at least 6 characters long.
 *                 example: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token.
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token.
 *       400:
 *         description: Validation errors or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         description: The error message.
 *                         example: "Invalid email address format"
 *                       param:
 *                         type: string
 *                         description: The parameter that caused the error.
 *                         example: "email"
 *                       location:
 *                         type: string
 *                         description: The location of the parameter.
 *                         example: "body"
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid email or password
 */
router.post('/login', loginValidator, login);


/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh authentication tokens
 *     description: Use a refresh token to obtain a new authentication token and refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The refresh token.
 *                 example: invalidrefreshtoken
 *             required:
 *               - token
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT access token.
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token.
 *       400:
 *         description: Validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         description: The error message.
 *                         example: "Refresh token is required"
 *                       param:
 *                         type: string
 *                         description: The parameter that caused the error.
 *                         example: "token"
 *                       location:
 *                         type: string
 *                         description: The location of the parameter.
 *                         example: "body"
 *       401:
 *         description: Invalid refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid refresh token
 */
router.post('/refresh-token', refreshTokenValidator, refreshToken);

export default router;
