const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const company = require('../middleware/company');
const Company = require('../models/Company');
const Review = require('../models/Review');
const Ad = require('../models/Ad');
const { check, validationResult } = require('express-validator');

// Get company profile
router.get('/profile', [auth, company], async (req, res) => {
  try {
    const companyProfile = await Company.findOne({ userId: req.user.id })
      .populate('userId', 'name email');

    if (!companyProfile) {
      return res.status(404).json({ msg: 'Company profile not found' });
    }

    res.json(companyProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update company profile
router.put('/profile',
  [
    auth,
    company,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let company = await Company.findOne({ userId: req.user.id });
      if (!company) {
        return res.status(404).json({ msg: 'Company not found' });
      }

      const {
        name,
        description,
        category,
        logo,
        website,
        phone,
        address,
        socialMedia,
        workingHours
      } = req.body;

      company.name = name;
      company.description = description;
      company.category = category;
      if (logo) company.logo = logo;
      if (website) company.website = website;
      if (phone) company.phone = phone;
      if (address) company.address = address;
      if (socialMedia) company.socialMedia = socialMedia;
      if (workingHours) company.workingHours = workingHours;

      await company.save();
      res.json(company);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Get company reviews
router.get('/reviews', [auth, company], async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    const query = { companyId: company._id };
    if (status) query.status = status;

    const reviews = await Review.find(query)
      .populate('userId', 'name')
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

// Respond to a review
router.post('/reviews/:id/respond',
  [
    auth,
    company,
    [
      check('response', 'Response is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const company = await Company.findOne({ userId: req.user.id });
      if (!company) {
        return res.status(404).json({ msg: 'Company not found' });
      }

      const review = await Review.findOne({
        _id: req.params.id,
        companyId: company._id
      });

      if (!review) {
        return res.status(404).json({ msg: 'Review not found' });
      }

      review.companyResponse = {
        content: req.body.response,
        createdAt: Date.now()
      };

      await review.save();
      res.json(review);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Get company statistics
router.get('/stats', [auth, company], async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    const startDate = new Date(req.query.startDate || new Date().setDate(new Date().getDate() - 30));
    const endDate = new Date(req.query.endDate || new Date());

    // Review statistics
    const reviewStats = await Review.aggregate([
      {
        $match: {
          companyId: company._id,
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

    // Rating distribution
    const ratingDistribution = await Review.aggregate([
      {
        $match: {
          companyId: company._id,
          status: 'approved'
        }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Response rate
    const totalReviews = await Review.countDocuments({
      companyId: company._id,
      status: 'approved'
    });

    const respondedReviews = await Review.countDocuments({
      companyId: company._id,
      status: 'approved',
      'companyResponse.content': { $exists: true }
    });

    const responseRate = totalReviews > 0 ? (respondedReviews / totalReviews) * 100 : 0;

    res.json({
      reviewStats,
      ratingDistribution,
      responseRate,
      totalReviews,
      averageRating: company.rating
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get company ads
router.get('/ads', [auth, company], async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    const ads = await Ad.find({ companyId: company._id })
      .sort({ createdAt: -1 });

    res.json(ads);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create new ad
router.post('/ads',
  [
    auth,
    company,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('content', 'Content is required').not().isEmpty(),
      check('type', 'Type is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const company = await Company.findOne({ userId: req.user.id });
      if (!company) {
        return res.status(404).json({ msg: 'Company not found' });
      }

      const newAd = new Ad({
        companyId: company._id,
        title: req.body.title,
        content: req.body.content,
        type: req.body.type,
        image: req.body.image,
        url: req.body.url,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      });

      const ad = await newAd.save();
      res.json(ad);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
