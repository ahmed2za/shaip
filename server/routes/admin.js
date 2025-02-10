const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Company = require('../models/Company');
const Review = require('../models/Review');
const Ad = require('../models/Ad');
const { check, validationResult } = require('express-validator');

// Dashboard Stats
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      companies: await Company.countDocuments(),
      reviews: await Review.countDocuments(),
      pendingReviews: await Review.countDocuments({ status: 'pending' }),
      activeAds: await Ad.countDocuments({ status: 'active' })
    };
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// User Management
router.get('/users', [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role;
    const status = req.query.status;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/users/:id/status', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.status = req.body.status;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/users/:id/verify', [auth, admin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.isVerified = req.body.isVerified;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Company Management
router.get('/companies', [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status;
    const category = req.query.category;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;
    if (category) query.category = category;

    const companies = await Company.find(query)
      .populate('userId', 'name email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Company.countDocuments(query);

    res.json({
      companies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/companies/:id/verify', [auth, admin], async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    company.isVerified = req.body.isVerified;
    await company.save();

    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Review Management
router.get('/reviews', [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search || '';

    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const reviews = await Review.find(query)
      .populate('userId', 'name email')
      .populate('companyId', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/reviews/:id/status', [auth, admin], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    review.status = req.body.status;
    if (req.body.adminComment) {
      review.adminComment = req.body.adminComment;
    }
    await review.save();

    // Update company stats if review status changes
    if (review.status === 'approved' || review.status === 'rejected') {
      const company = await Company.findById(review.companyId);
      if (company) {
        const approvedReviews = await Review.find({
          companyId: company._id,
          status: 'approved'
        });
        
        company.rating = approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / approvedReviews.length;
        company.totalReviews = approvedReviews.length;
        await company.save();
      }
    }

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Ad Management
router.get('/ads', [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const type = req.query.type;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const ads = await Ad.find(query)
      .populate('companyId', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Ad.countDocuments(query);

    res.json({
      ads,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/ads/:id/status', [auth, admin], async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ msg: 'Ad not found' });
    }

    ad.status = req.body.status;
    if (req.body.adminComment) {
      ad.adminComment = req.body.adminComment;
    }
    await ad.save();

    res.json(ad);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Analytics
router.get('/analytics', [auth, admin], async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate || new Date().setDate(new Date().getDate() - 30));
    const endDate = new Date(req.query.endDate || new Date());

    // User growth
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Review statistics
    const reviewStats = await Review.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Company growth
    const companyGrowth = await Company.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      userGrowth,
      reviewStats,
      companyGrowth
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
