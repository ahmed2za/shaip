import React, { useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  user: {
    name: string;
    image?: string;
  };
  createdAt: string;
}

interface ReviewWidgetProps {
  companyId: string;
  type: 'RATING_BADGE' | 'REVIEW_CAROUSEL' | 'LATEST_REVIEWS' | 'RATING_SNAPSHOT';
  settings?: {
    theme?: 'light' | 'dark';
    maxReviews?: number;
    showImages?: boolean;
  };
}

export default function ReviewWidget({ companyId, type, settings = {} }: ReviewWidgetProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  const theme = settings.theme || 'light';
  const maxReviews = settings.maxReviews || 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, statsRes] = await Promise.all([
          fetch(`/api/companies/${companyId}/reviews?limit=${maxReviews}`),
          fetch(`/api/companies/${companyId}/stats`)
        ]);
        
        const reviewsData = await reviewsRes.json();
        const statsData = await statsRes.json();
        
        setReviews(reviewsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching widget data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, maxReviews]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-40 rounded-lg" />;
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderRatingBadge = () => (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
      <div className="flex items-center space-x-2">
        <div className="flex">{renderStars(Math.round(stats.average))}</div>
        <span className="font-bold text-lg">{stats.average.toFixed(1)}</span>
      </div>
      <p className="text-sm mt-2">{stats.total} reviews</p>
    </div>
  );

  const renderReviewCarousel = () => (
    <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              {review.user.image && (
                <Image
                  src={review.user.image}
                  alt={review.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold">{review.user.name}</p>
                <div className="flex">{renderStars(review.rating)}</div>
              </div>
            </div>
            <p className="font-medium">{review.title}</p>
            <p className="text-sm">{review.content}</p>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRatingSnapshot = () => {
    const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: reviews.filter((r) => r.rating === rating).length,
      percentage: (reviews.filter((r) => r.rating === rating).length / stats.total) * 100
    }));

    return (
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-lg`}>
        <div className="space-y-2">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-2">
              <span className="w-4">{rating}</span>
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm">{count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  switch (type) {
    case 'RATING_BADGE':
      return renderRatingBadge();
    case 'REVIEW_CAROUSEL':
      return renderReviewCarousel();
    case 'RATING_SNAPSHOT':
      return renderRatingSnapshot();
    case 'LATEST_REVIEWS':
      return renderReviewCarousel(); // Uses same layout as carousel
    default:
      return null;
  }
}
