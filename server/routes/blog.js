const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { check, validationResult } = require('express-validator');

// @route   GET /api/blog
// @desc    Get all published blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find({ status: 'published' })
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments({ status: 'published' });

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/blog/:id
// @desc    Get blog post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.user', 'name');

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blog
// @desc    Create a blog post
// @access  Private (Admin only)
router.post('/',
  [
    auth,
    admin,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newPost = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status || 'draft',
        author: req.user.id,
        tags: req.body.tags,
        featuredImage: req.body.featuredImage
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/blog/:id
// @desc    Update a blog post
// @access  Private (Admin only)
router.put('/:id',
  [
    auth,
    admin,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let post = await BlogPost.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      post.title = req.body.title;
      post.content = req.body.content;
      post.status = req.body.status || post.status;
      post.tags = req.body.tags || post.tags;
      post.featuredImage = req.body.featuredImage || post.featuredImage;

      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/blog/:id
// @desc    Delete a blog post
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blog/:id/like
// @desc    Like a blog post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    post.likes += 1;
    await post.save();

    res.json({ likes: post.likes });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/blog/:id/comment
// @desc    Add comment to a blog post
// @access  Private
router.post('/:id/comment',
  [
    auth,
    [
      check('content', 'Content is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await BlogPost.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const newComment = {
        user: req.user.id,
        content: req.body.content
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found' });
      }
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
