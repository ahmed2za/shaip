import React from 'react';
import StarRating from '../reviews/StarRating';

interface RatingStarsProps {
  rating: number;
  totalReviews: number;
  showTotal?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  totalReviews,
  showTotal = true,
  size = 'md'
}) => {
  const getRatingText = () => {
    if (rating >= 4.5) return 'ممتاز';
    if (rating >= 4) return 'جيد جداً';
    if (rating >= 3) return 'جيد';
    if (rating >= 2) return 'مقبول';
    return 'سيء';
  };

  const getRatingColor = () => {
    if (rating >= 4.5) return 'text-[#00b67a]'; // Trustpilot green
    if (rating >= 4) return 'text-[#73cf11]';
    if (rating >= 3) return 'text-[#ffb80f]';
    if (rating >= 2) return 'text-[#ff8622]';
    return 'text-[#ff3722]';
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <StarRating rating={rating} size={size} />
        <span className={`font-semibold ${getRatingColor()}`}>
          {getRatingText()}
        </span>
      </div>
      {showTotal && (
        <div className="text-sm text-gray-500 mt-1">
          بناءً على {totalReviews} تقييم
        </div>
      )}
    </div>
  );
};

export default RatingStars;
