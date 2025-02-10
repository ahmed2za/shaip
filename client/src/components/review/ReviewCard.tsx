import React from 'react';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon } from '@heroicons/react/24/outline';

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    content: string;
    rating: number;
    helpfulVotes: number;
    createdAt: string;
    pros?: string;
    cons?: string;
    user: {
      name: string;
      avatar?: string;
    };
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-5 w-5 ${
          index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between">
        {/* User Info */}
        <div className="flex items-center">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
            {review.user.avatar ? (
              <Image
                src={review.user.avatar}
                alt={review.user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-400">
                  {review.user.name[0]}
                </span>
              </div>
            )}
          </div>
          <div className="mr-4">
            <div className="font-semibold text-gray-900">{review.user.name}</div>
            <div className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </div>
          </div>
        </div>

        {/* Helpful Button */}
        <button className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-700">
          <HandThumbUpIcon className="h-5 w-5" />
          <span>مفيد ({review.helpfulVotes})</span>
        </button>
      </div>

      {/* Rating */}
      <div className="mt-4">
        <div className="flex items-center gap-x-2">
          <div className="flex">{renderStars(review.rating)}</div>
          <span className="text-sm font-medium text-gray-900">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Review Content */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
        <p className="mt-2 text-gray-600 whitespace-pre-line">{review.content}</p>
      </div>

      {/* Pros & Cons */}
      {(review.pros || review.cons) && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {review.pros && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                الإيجابيات
              </h4>
              <p className="text-sm text-gray-600">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                السلبيات
              </h4>
              <p className="text-sm text-gray-600">{review.cons}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
