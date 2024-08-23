import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
  commentOnPost,
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from '../controllers/postController.js';
import { commentOnPostValidator, getPostsValidator, postValidator, updatePostValidator } from '../validators/postValidator.js';

const router = express.Router();
let roles = ['Admin', 'Moderator', 'User'];

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post with the provided title and content.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Post
 *               content:
 *                 type: string
 *                 example: This is the content of my first post.
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: string
 *       400:
 *         description: Validation errors
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
 *                         description: The error message
 *                         example: "Title is required"
 *                       param:
 *                         type: string
 *                         description: The parameter that caused the error
 *                         example: "title"
 *                       location:
 *                         type: string
 *                         description: The location of the parameter
 *                         example: "body"
 *       401:
 *         description: Not authorized, invalid token
 *       403:
 *         description: Access denied, insufficient role
 */
router.route('/')
  .post(protect, authorizeRoles(...roles), postValidator, createPost);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieves a post by its ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: string
 *       401:
 *         description: Not authorized, invalid token
 *       403:
 *         description: Access denied, insufficient role
 *       404:
 *         description: Post not found
 *   put:
 *     summary: Update a post by ID
 *     description: Updates a post with the specified ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Post Title
 *               content:
 *                 type: string
 *                 example: Updated content for the post.
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 author:
 *                   type: string
 *       400:
 *         description: Validation errors
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
 *                         description: The error message
 *                         example: "Title must be at least 5 characters long"
 *                       param:
 *                         type: string
 *                         description: The parameter that caused the error
 *                         example: "title"
 *                       location:
 *                         type: string
 *                         description: The location of the parameter
 *                         example: "body"
 *       401:
 *         description: Not authorized, invalid token
 *       403:
 *         description: Access denied, insufficient role
 *       404:
 *         description: Post not found
 */
router.route('/:id')
  .get(protect, authorizeRoles(...roles), getPostById)
  .delete(protect, authorizeRoles(...roles), deletePost)
  .put(protect, authorizeRoles(...roles), updatePostValidator, updatePost);

  /**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retrieve a list of posts with pagination and search
 *     description: Get a list of posts with optional pagination and search by title.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of posts per page.
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         required: false
 *         description: The search term to filter posts by title.
 *         schema:
 *           type: string
 *           example: 'My First Post'
 *     responses:
 *       200:
 *         description: A list of posts with pagination and search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPosts:
 *                   type: integer
 *                   description: The total number of posts that match the search criteria.
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages based on the limit.
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *     401:
 *       description: Not authorized, invalid token
 *     500:
 *       description: Failed to retrieve posts
 */
router.get('/',protect, authorizeRoles(...roles),getPostsValidator, getPosts);

/**
 * @swagger
 * /posts/{id}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     description: Allows users to add a comment to a specific post. The content of the comment is required and must be at least 1 character long.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to add the comment to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment.
 *                 example: "This is a comment."
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment added successfully."
 *       400:
 *         description: Invalid input
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
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       401:
 *         description: Not authorized, invalid token
 *       403:
 *         description: Access denied, insufficient role
 */
router.route('/:id/comments')
  .post(protect, authorizeRoles(...roles),commentOnPostValidator, commentOnPost);
export default router;
