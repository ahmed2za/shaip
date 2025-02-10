import Review, { IReview } from '../models/Review';
import { FilterQuery } from 'mongoose';
import { createTransport } from 'nodemailer';
import { WebClient } from '@slack/web-api';
import axios from 'axios';
import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis();

// Initialize email transport
const emailTransport = createTransport({
  // Configure your email service
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASS,
  },
});

// Initialize Slack client
const slack = new WebClient(process.env.SLACK_TOKEN);

export class ReviewService {
  // Create a new review
  async createReview(reviewData: Partial<IReview>): Promise<IReview> {
    // Check for spam/fraud
    await this.checkForSpam(reviewData);
    
    // Create the review
    const review = new Review(reviewData);
    await review.save();

    // Send notifications
    await this.sendNotifications('new_review', review);

    // Cache invalidation
    await this.invalidateCache(review.companyId.toString());

    return review;
  }

  // Get reviews with filtering and pagination
  async getReviews(filters: FilterQuery<IReview>, page = 1, limit = 10) {
    const cacheKey = `reviews:${JSON.stringify(filters)}:${page}:${limit}`;
    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const skip = (page - 1) * limit;
    const reviews = await Review.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name avatar')
      .populate('companyId', 'name');

    const total = await Review.countDocuments(filters);

    const result = {
      reviews,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(result));

    return result;
  }

  // Update review status
  async updateReviewStatus(
    reviewId: string,
    status: 'approved' | 'rejected'
  ): Promise<IReview> {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );

    if (!review) {
      throw new Error('Review not found');
    }

    // Send notifications
    await this.sendNotifications(`review_${status}`, review);

    // Cache invalidation
    await this.invalidateCache(review.companyId.toString());

    return review;
  }

  // Add reply to review
  async addReply(reviewId: string, replyData: any): Promise<IReview> {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $push: { replies: replyData } },
      { new: true }
    );

    if (!review) {
      throw new Error('Review not found');
    }

    // Send notifications
    await this.sendNotifications('new_reply', review);

    // Cache invalidation
    await this.invalidateCache(review.companyId.toString());

    return review;
  }

  // Report review
  async reportReview(reviewId: string, reason: string): Promise<IReview> {
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { reported: true },
      { new: true }
    );

    if (!review) {
      throw new Error('Review not found');
    }

    // Send notifications
    await this.sendNotifications('review_reported', review, { reason });

    return review;
  }

  // Get review analytics
  async getAnalytics(companyId: string, timeRange: string) {
    const cacheKey = `analytics:${companyId}:${timeRange}`;
    const cachedResult = await redis.get(cacheKey);

    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    const dateFilter = this.getDateFilter(timeRange);
    const reviews = await Review.find({
      companyId,
      createdAt: dateFilter,
    });

    const analytics = {
      total: reviews.length,
      averageRating:
        reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length,
      distribution: this.calculateDistribution(reviews),
      sentiment: await this.analyzeSentiment(reviews),
      trends: await this.analyzeTrends(reviews),
    };

    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(analytics));

    return analytics;
  }

  // Export reviews
  async exportReviews(companyId: string, format: 'csv' | 'json' | 'excel') {
    const reviews = await Review.find({ companyId })
      .populate('userId', 'name email')
      .populate('companyId', 'name');

    switch (format) {
      case 'csv':
        return this.exportToCSV(reviews);
      case 'json':
        return this.exportToJSON(reviews);
      case 'excel':
        return this.exportToExcel(reviews);
      default:
        throw new Error('Unsupported format');
    }
  }

  // Private helper methods
  private async checkForSpam(reviewData: Partial<IReview>) {
    // Check for multiple reviews from same IP
    const recentReviews = await Review.find({
      ipAddress: reviewData.ipAddress,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (recentReviews.length > 5) {
      throw new Error('Too many reviews from this IP');
    }

    // Add more spam detection logic here
  }

  private async sendNotifications(
    event: string,
    review: IReview,
    extra?: any
  ) {
    // Email notification
    if (process.env.EMAIL_NOTIFICATIONS === 'true') {
      await emailTransport.sendMail({
        to: 'admin@example.com',
        subject: `New ${event}: ${review.companyId}`,
        text: `Review details: ${review.text}`,
      });
    }

    // Slack notification
    if (process.env.SLACK_NOTIFICATIONS === 'true') {
      await slack.chat.postMessage({
        channel: '#reviews',
        text: `New ${event}: ${review.companyId}\nReview: ${review.text}`,
      });
    }

    // Webhook notifications
    if (process.env.WEBHOOK_URL) {
      await axios.post(process.env.WEBHOOK_URL, {
        event,
        review,
        extra,
      });
    }
  }

  private async invalidateCache(companyId: string) {
    const keys = await redis.keys(`reviews:*${companyId}*`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
    await redis.del(`analytics:${companyId}:*`);
  }

  private getDateFilter(timeRange: string) {
    const now = new Date();
    switch (timeRange) {
      case 'day':
        return { $gte: new Date(now.setDate(now.getDate() - 1)) };
      case 'week':
        return { $gte: new Date(now.setDate(now.getDate() - 7)) };
      case 'month':
        return { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
      case 'year':
        return { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
      default:
        return {};
    }
  }

  private calculateDistribution(reviews: IReview[]) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  }

  private async analyzeSentiment(reviews: IReview[]) {
    // Implement sentiment analysis here
    // You can use external services like Google Cloud Natural Language API
    return {
      positive: reviews.filter((r) => r.rating >= 4).length,
      neutral: reviews.filter((r) => r.rating === 3).length,
      negative: reviews.filter((r) => r.rating <= 2).length,
    };
  }

  private async analyzeTrends(reviews: IReview[]) {
    // Group reviews by date and calculate average ratings
    const trends = new Map();
    reviews.forEach((review) => {
      const date = review.createdAt.toISOString().split('T')[0];
      if (!trends.has(date)) {
        trends.set(date, { total: 0, sum: 0 });
      }
      const data = trends.get(date);
      data.total++;
      data.sum += review.rating;
    });

    return Array.from(trends.entries()).map(([date, data]) => ({
      date,
      average: data.sum / data.total,
      count: data.total,
    }));
  }

  private exportToCSV(reviews: IReview[]) {
    // Implement CSV export
    return '';
  }

  private exportToJSON(reviews: IReview[]) {
    return JSON.stringify(reviews, null, 2);
  }

  private exportToExcel(reviews: IReview[]) {
    // Implement Excel export
    return Buffer.from('');
  }
}
