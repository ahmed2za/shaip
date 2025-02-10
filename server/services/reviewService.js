const Review = require('../models/Review');
const Company = require('../models/Company');

class ReviewService {
  static async updateCompanyStats(companyId) {
    try {
      const approvedReviews = await Review.find({
        companyId,
        status: 'approved'
      });

      const totalReviews = approvedReviews.length;
      const averageRating = totalReviews > 0
        ? approvedReviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
        : 0;

      await Company.findByIdAndUpdate(companyId, {
        totalReviews,
        averageRating,
        updatedAt: Date.now()
      });

      return { totalReviews, averageRating };
    } catch (error) {
      throw new Error('Failed to update company stats');
    }
  }

  static async handleReviewReport(reviewId, userId, reason) {
    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        throw new Error('Review not found');
      }

      // Check if user already reported
      const existingReport = review.reports.find(
        report => report.userId.toString() === userId.toString()
      );

      if (existingReport) {
        throw new Error('You have already reported this review');
      }

      // Add new report
      review.reports.push({ userId, reason });
      review.reportCount = review.reports.length;

      // If report count exceeds threshold, mark for review
      if (review.reportCount >= 3 && review.status === 'approved') {
        review.status = 'pending';
      }

      await review.save();
      return review;
    } catch (error) {
      throw error;
    }
  }

  static async getReviewAnalytics(companyId, startDate, endDate) {
    try {
      const matchStage = {
        companyId,
        status: 'approved',
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      };

      const analytics = await Review.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            averageRating: { $avg: '$rating' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      const ratingDistribution = await Review.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]);

      return {
        dailyStats: analytics,
        ratingDistribution
      };
    } catch (error) {
      throw new Error('Failed to get review analytics');
    }
  }
}

module.exports = ReviewService;
