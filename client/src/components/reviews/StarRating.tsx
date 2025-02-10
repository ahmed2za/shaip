import React from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 'md',
  interactive = false,
  onChange,
}) => {
  const [hover, setHover] = React.useState<number | null>(null);

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  const getColor = (index: number) => {
    const starRating = hover !== null ? hover : rating;
    
    if (index < starRating) {
      // Trustpilot green color for filled stars
      return '#00b67a';
    }
    // Light gray for empty stars
    return '#e6e6e6';
  };

  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((index) => (
        <div
          key={index}
          className={`${interactive ? 'cursor-pointer' : ''} transition-colors duration-200`}
          onClick={() => interactive && onChange?.(index)}
          onMouseEnter={() => interactive && setHover(index)}
          onMouseLeave={() => interactive && setHover(null)}
        >
          <FaStar
            className={`${getSizeClass()} transition-all duration-200`}
            style={{
              color: getColor(index),
              filter: index < (hover !== null ? hover : rating) ? 'drop-shadow(0 0 2px rgba(0, 182, 122, 0.3))' : 'none',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StarRating;
