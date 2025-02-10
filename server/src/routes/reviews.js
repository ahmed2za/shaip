const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// @route   POST api/reviews
// @desc    Create a review
// @access  Private
router.post('/', auth, reviewController.createReview);

// @route   GET api/reviews
// @desc    Get reviews (with optional company filter)
// @access  Public
router.get('/', reviewController.getReviews);

// @route   PUT api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', auth, reviewController.updateReview);

// @route   DELETE api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', auth, reviewController.deleteReview);

// @route   POST api/reviews/:id/vote
// @desc    Vote review as helpful
// @access  Private
router.post('/:id/vote', auth, reviewController.voteHelpful);

// @route   POST api/reviews/:id/report
// @desc    Report review
// @access  Private
router.post('/:id/report', auth, reviewController.reportReview);

module.exports = router;
