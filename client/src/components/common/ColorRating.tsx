import { Rating, styled } from '@mui/material';

// Define color stops for the rating gradient
const getRatingColor = (value: number) => {
  if (value >= 4.5) return '#00b67a'; // Excellent - Green
  if (value >= 3.5) return '#73cf11'; // Good - Light Green
  if (value >= 2.5) return '#ffce00'; // Average - Yellow
  if (value >= 1.5) return '#ff8622'; // Poor - Orange
  return '#ff3722'; // Bad - Red
};

interface StyledRatingProps {
  ratingValue: number;
}

const StyledRating = styled(Rating, {
  shouldForwardProp: (prop) => prop !== 'ratingValue',
})<StyledRatingProps>(({ ratingValue }) => ({
  '& .MuiRating-icon': {
    color: getRatingColor(ratingValue),
  },
  '& .MuiRating-iconFilled': {
    color: getRatingColor(ratingValue),
  },
  '& .MuiRating-iconHover': {
    color: getRatingColor(ratingValue),
  },
}));

interface ColorRatingProps {
  value: number;
  precision?: number;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  onChange?: (event: React.SyntheticEvent, value: number | null) => void;
}

export default function ColorRating({ 
  value, 
  precision = 0.1, 
  readOnly = true,
  size = 'medium',
  onChange
}: ColorRatingProps) {
  return (
    <StyledRating
      value={value}
      precision={precision}
      readOnly={readOnly}
      size={size}
      ratingValue={value}
      onChange={onChange}
    />
  );
}
