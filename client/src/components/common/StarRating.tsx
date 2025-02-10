import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export default function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = sizeClasses[size];

  const getStarColor = (starIndex: number) => {
    if (rating >= starIndex) {
      return 'text-yellow-400';
    }
    return 'text-gray-300';
  };

  return (
    <div className="flex">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} ml-1`}
          disabled={!interactive}
        >
          {rating >= star ? (
            <StarSolid className={`${sizeClass} ${getStarColor(star)}`} />
          ) : (
            <StarOutline className={`${sizeClass} ${getStarColor(star)}`} />
          )}
        </button>
      ))}
    </div>
  );
}
