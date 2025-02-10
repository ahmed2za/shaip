import { Box, Rating, Typography } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

interface TrustStarsProps {
  rating: number;
  totalReviews?: number;
  size?: 'small' | 'medium' | 'large';
  showTotal?: boolean;
}

export function TrustStars({
  rating,
  totalReviews,
  size = 'medium',
  showTotal = true,
}: TrustStarsProps) {
  const getStarSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: '1rem' };
      case 'large':
        return { fontSize: '2rem' };
      default:
        return { fontSize: '1.5rem' };
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Rating
        value={rating}
        precision={0.5}
        readOnly
        icon={<StarIcon sx={{ ...getStarSize(), color: '#faaf00' }} />}
        emptyIcon={<StarIcon sx={{ ...getStarSize(), color: '#e0e0e0' }} />}
      />
      <Typography
        variant={size === 'small' ? 'body2' : 'body1'}
        color="text.secondary"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        {rating.toFixed(1)}
        {showTotal && totalReviews !== undefined && (
          <Typography
            component="span"
            variant={size === 'small' ? 'caption' : 'body2'}
            color="text.secondary"
            sx={{ ml: 1 }}
          >
            ({totalReviews} تقييم)
          </Typography>
        )}
      </Typography>
    </Box>
  );
}
