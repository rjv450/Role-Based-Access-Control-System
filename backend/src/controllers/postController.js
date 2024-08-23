import Comment from '../models/comment.js';
import Post from '../models/post.js';
import { notify } from '../utils/notification.js'
export const createPost = async (req, res) => {
  const { title, content } = req.body;

  const post = await Post.create({
    title,
    content,
    author: req.user._id,
  });

  res.status(201).json(post);
};

export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'email');

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (isAuthorizedToModifyPost(post, req.user)) {
      await Comment.deleteMany({ post: req.params.id });
      await Post.findByIdAndDelete(req.params.id);
      res.json({ message: 'Post removed' });
    } else {
      res.status(403).json({ message: 'You are not authorized to delete this post' });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: 'Server error', error });
  }
};
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!isAuthorizedToModifyPost(post, req.user)) {
      return res.status(403).json({ message: 'You are not authorized to update this post' });
    }
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
export const isAuthorizedToModifyPost = (post, user) => {

  return post.author.toString() === user._id.toString() ||
    user.role === 'Admin' ||
    user.role === 'Moderator';
};


export const getPosts = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  const titleFilter = search ? { title: { $regex: search, $options: 'i' } } : {};

  try {
    const totalPosts = await Post.countDocuments(titleFilter);

    const posts = await Post.find(titleFilter)
      .populate({
        path: 'author',
        select: 'email'
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'email'
        }
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      totalPosts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve posts', error });
  }
};
export const commentOnPost = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId,
    });
    post.comments.push(comment._id);
    await post.save();
    const notificationMessage = {
      author: req.user.email,
      content: content,
      timestamp: comment.createdAt
    };
    if (post.author !== req.user._id) {
      notify(post.author, notificationMessage);
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error });
  }
};