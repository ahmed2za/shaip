import { Router } from 'express';
import { ReviewController, createReviewLimiter } from '../controllers/ReviewController';
import { authenticate } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { isCompanyOwner } from '../middleware/isCompanyOwner';

const router = Router();
const reviewController = new ReviewController();

// Public routes
router.get('/reviews', reviewController.getReviews);
router.get('/reviews/analytics', reviewController.getAnalytics);

// Authenticated routes
router.post(
  '/reviews',
  authenticate,
  createReviewLimiter,
  reviewController.createReview
);
router.post('/reviews/:reviewId/report', authenticate, reviewController.reportReview);

// Company owner routes
router.post(
  '/reviews/:reviewId/reply',
  authenticate,
  isCompanyOwner,
  reviewController.addReply
);
router.get(
  '/reviews/export',
  authenticate,
  isCompanyOwner,
  reviewController.exportReviews
);

// Admin routes
router.patch(
  '/reviews/:reviewId/status',
  authenticate,
  isAdmin,
  reviewController.updateReviewStatus
);

export default router;
