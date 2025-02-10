import { Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService';
import { validateReview, validateReply } from '../validators/reviewValidator';
import { AuthRequest } from '../types/express';
import rateLimit from 'express-rate-limit';

const reviewService = new ReviewService();

// Rate limiting for review creation
export const createReviewLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // limit each IP to 5 reviews per window
  message: 'Too many reviews created from this IP, please try again after 24 hours',
});

export class ReviewController {
  // Create a new review
  async createReview(req: AuthRequest, res: Response) {
    try {
      const { error } = validateReview(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const reviewData = {
        ...req.body,
        userId: req.user.id,
        ipAddress: req.ip,
      };

      const review = await reviewService.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get reviews with filtering and pagination
  async getReviews(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        companyId,
        status,
        rating,
        verified,
      } = req.query;

      const filters: any = {};
      if (companyId) filters.companyId = companyId;
      if (status) filters.status = status;
      if (rating) filters.rating = rating;
      if (verified) filters.purchaseVerified = verified === 'true';

      const reviews = await reviewService.getReviews(filters, +page, +limit);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update review status (admin only)
  async updateReviewStatus(req: AuthRequest, res: Response) {
    try {
      const { reviewId } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const review = await reviewService.updateReviewStatus(reviewId, status);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Add reply to review
  async addReply(req: AuthRequest, res: Response) {
    try {
      const { error } = validateReply(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { reviewId } = req.params;
      const replyData = {
        ...req.body,
        userId: req.user.id,
        companyId: req.user.companyId,
      };

      const review = await reviewService.addReply(reviewId, replyData);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Report a review
  async reportReview(req: AuthRequest, res: Response) {
    try {
      const { reviewId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return res.status(400).json({ error: 'Reason is required' });
      }

      const review = await reviewService.reportReview(reviewId, reason);
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get review analytics
  async getAnalytics(req: Request, res: Response) {
    try {
      const { companyId, timeRange = 'month' } = req.query;

      if (!companyId) {
        return res.status(400).json({ error: 'Company ID is required' });
      }

      const analytics = await reviewService.getAnalytics(
        companyId as string,
        timeRange as string
      );
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Export reviews
  async exportReviews(req: Request, res: Response) {
    try {
      const { companyId, format = 'json' } = req.query;

      if (!companyId) {
        return res.status(400).json({ error: 'Company ID is required' });
      }

      if (!['csv', 'json', 'excel'].includes(format as string)) {
        return res.status(400).json({ error: 'Invalid format' });
      }

      const data = await reviewService.exportReviews(
        companyId as string,
        format as 'csv' | 'json' | 'excel'
      );

      // Set appropriate headers based on format
      switch (format) {
        case 'csv':
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename=reviews-${companyId}.csv`
          );
          break;
        case 'json':
          res.setHeader('Content-Type', 'application/json');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename=reviews-${companyId}.json`
          );
          break;
        case 'excel':
          res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
          res.setHeader(
            'Content-Disposition',
            `attachment; filename=reviews-${companyId}.xlsx`
          );
          break;
      }

      res.send(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
