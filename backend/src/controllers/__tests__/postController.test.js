import { commentOnPost, createPost, deletePost, getPostById, getPosts, isAuthorizedToModifyPost, updatePost } from '../postController.js';
import Post from '../../models/post.js';

import Comment from '../../models/comment.js';
jest.mock('../../models/comment.js');
jest.mock('../../models/post.js');
jest.mock('../../middleware/roleMiddleware.js');
jest.mock('../../utils/notification.js', () => ({
  notify: jest.fn(),
}));
describe('Post Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {}, user: { _id: 'userId123', role: 'User', email: 'test@example.com' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('createPost should create a post and return it', async () => {
    const mockPost = { title: 'Test Title', content: 'Test Content', author: 'userId123' };

    Post.create.mockResolvedValue(mockPost);

    req.body = { title: 'Test Title', content: 'Test Content' };

    await createPost(req, res, next);

    expect(Post.create).toHaveBeenCalledWith({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockPost);
  });

  test('getPostById should return the post if found', async () => {
    const mockPost = { title: 'Test Title', content: 'Test Content', author: 'userId123' };

    Post.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockPost),
    });

    req.params.id = 'postId123';

    await getPostById(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(Post.findById().populate).toHaveBeenCalledWith('author', 'email');
    expect(res.json).toHaveBeenCalledWith(mockPost);
  });

  test('getPostById should return 404 if post is not found', async () => {
    Post.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    req.params.id = 'postId123';

    await getPostById(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(Post.findById().populate).toHaveBeenCalledWith('author', 'email');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
  });


  test('should delete the post and associated comments if authorized', async () => {
    const mockPost = { _id: 'postId123', author: 'userId123' };
    Post.findById.mockResolvedValue(mockPost);

    Comment.deleteMany.mockResolvedValue({ deletedCount: 1 });
    Post.findByIdAndDelete.mockResolvedValue(mockPost);

    req.params.id = 'postId123';
    req.user = { _id: 'userId123' };

    await deletePost(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);

    expect(Comment.deleteMany).toHaveBeenCalledWith({ post: req.params.id });
    expect(Post.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post removed' });
  });
  test('deletePost should return 404 if post is not found', async () => {
    Post.findById.mockResolvedValue(null);

    req.params.id = 'postId123';

    await deletePost(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
  });

  test('deletePost should return 403 if user is not authorized to delete the post', async () => {
    const mockPost = { author: 'anotherUserId' };

    Post.findById.mockResolvedValue(mockPost);

    req.params.id = 'postId123';
    req.user.role = 'User';

    await deletePost(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to delete this post' });
  });

  test('deletePost should return 500 if there is a server error', async () => {
    Post.findById.mockRejectedValue(new Error('Database error'));

    req.params.id = 'postId123';

    await deletePost(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error', error: expect.any(Error) });
  });


  test('updatePost should return 404 if post is not found', async () => {
    Post.findById.mockResolvedValue(null);

    req.params.id = 'postId123';

    await updatePost(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
  });


  test('updatePost should return 500 if there is a server error', async () => {
    Post.findById.mockRejectedValue(new Error('Database error'));

    req.params.id = 'postId123';

    await updatePost(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error', error: expect.any(Error) });
  });
  test('updatePost should return 403 if user is not authorized to update the post', async () => {
    const mockPost = { title: 'Old Title', content: 'Old content', author: 'anotherUserId' };

    Post.findById.mockResolvedValue(mockPost);


    req.params.id = 'postId123';

    await updatePost(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized to update this post' });
  });
  test('updatePost should update the post and return it if authorized', async () => {
    const mockPost = {
      title: 'Old Title',
      content: 'Old content',
      author: 'userId123',
      save: jest.fn().mockResolvedValue({ title: 'Updated Title', content: 'Updated content' })
    };

    Post.findById.mockResolvedValue(mockPost);


    req.params.id = 'postId123';
    req.body = { title: 'Updated Title', content: 'Updated content' };

    await updatePost(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);

    expect(mockPost.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ title: 'Updated Title', content: 'Updated content' });
  });

  test('getPosts should return paginated posts and metadata', async () => {
    const mockPosts = [
      { title: 'Test Post 1', content: 'Content 1', author: 'userId123' },
      { title: 'Test Post 2', content: 'Content 2', author: 'userId123' },
    ];
    const totalPosts = 20;
    const page = 1;
    const limit = 10;
    const search = 'Test';

    Post.countDocuments.mockResolvedValue(totalPosts);
    Post.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockPosts),
    });

    req.query = { page, limit, search };

    await getPosts(req, res, next);

    expect(Post.countDocuments).toHaveBeenCalledWith({ title: { $regex: search, $options: 'i' } });
    expect(Post.find).toHaveBeenCalledWith({ title: { $regex: search, $options: 'i' } });
    expect(Post.find().populate).toHaveBeenCalledWith({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'email'
      }
    });
    expect(Post.find().skip).toHaveBeenCalledWith((page - 1) * limit);
    expect(Post.find().limit).toHaveBeenCalledWith(parseInt(limit));

    expect(res.json).toHaveBeenCalledWith({
      totalPosts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      posts: mockPosts,
    });
  });

  test('getPosts should handle case with no search query', async () => {
    const mockPosts = [{ title: 'Test Post', content: 'Content', author: 'userId123' }];
    const totalPosts = 1;
    const page = 1;
    const limit = 10;

    Post.countDocuments.mockResolvedValue(totalPosts);
    Post.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(mockPosts),
    });

    req.query = { page, limit };

    await getPosts(req, res, next);

    expect(Post.countDocuments).toHaveBeenCalledWith({});
    expect(Post.find).toHaveBeenCalledWith({});
    // expect(Post.find().populate).toHaveBeenCalledWith('author', 'email');
    expect(Post.find().populate).toHaveBeenCalledWith({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'email'
      }
    });
    expect(Post.find().skip).toHaveBeenCalledWith((page - 1) * limit);
    expect(Post.find().limit).toHaveBeenCalledWith(parseInt(limit));

    expect(res.json).toHaveBeenCalledWith({
      totalPosts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      posts: mockPosts,
    });
  });

  test('getPosts should return 500 if there is a server error', async () => {
    Post.countDocuments.mockRejectedValue(new Error('Database error'));

    await getPosts(req, res, next);

    expect(Post.countDocuments).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to retrieve posts', error: expect.any(Error) });
  });
  test('commentOnPost should notify the post author and return the comment', async () => {
    const mockPost = { _id: 'postId123', author: 'postAuthorId', comments: [], save: jest.fn() };
    const mockComment = { _id: 'commentId123', content: 'Test Comment', author: 'userId123', post: 'postId123' };

    // Mock the methods
    Post.findById.mockResolvedValue(mockPost);
    Comment.create.mockResolvedValue(mockComment);


    // Mock req, res, and next
    const req = {
      params: { id: 'postId123' },
      body: { content: 'Test Comment' },
      user: { _id: 'userId123', email: 'user@example.com' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const next = jest.fn();

    await commentOnPost(req, res, next);


    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(Comment.create).toHaveBeenCalledWith({
      content: req.body.content,
      author: req.user._id,
      post: req.params.id,
    });

    expect(mockPost.save).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockComment);
  });
  test('commentOnPost should return 404 if post is not found', async () => {
    Post.findById.mockResolvedValue(null);

    req.params.id = 'postId123';
    req.body.content = 'Test Comment';

    await commentOnPost(req, res, next);

    expect(Post.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
  });
});
