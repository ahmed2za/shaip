import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const StyledStarContainer = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  position: 'relative',
  cursor: 'pointer',
  textAlign: 'left',
  '& .star-base': {
    display: 'flex',
  },
  '& .star-filled': {
    display: 'flex',
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
    '& svg': {
      transform: 'scale(1.1)', // Make filled stars slightly larger
    }
  },
}));

const StyledStar = styled(StarIcon)(({ theme }) => ({
  width: '28px',
  height: '28px',
  padding: '2px',
  transition: 'color 200ms ease-in-out',
}));

// Define color stops for different ratings
const getStarColor = (value: number) => {
  if (value >= 5) return '#00b67a'; // Bright Green
  if (value >= 4) return '#73cf11'; // Yellow-Green
  if (value >= 3) return '#ffce00'; // Yellow
  if (value >= 2) return '#ff8622'; // Orange
  return '#ff3722'; // Red
};

interface CustomStarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showValue?: boolean;
}

export default function CustomStarRating({
  value,
  onChange,
  readOnly = false,
  size = 'medium',
  showValue = false,
}: CustomStarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const currentValue = hoverValue !== null ? hoverValue : value;
  const starColor = getStarColor(currentValue);

  const sizes = {
    small: 20,
    medium: 28,
    large: 36,
  };

  const starSize = sizes[size];

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (readOnly) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const starWidth = rect.width / 5;
    const position = event.clientX - rect.left;
    const starPosition = position % starWidth;
    const isHalfStar = starPosition < starWidth / 2;
    const value = starIndex + (isHalfStar ? 0.5 : 1);
    setHoverValue(value);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
    setIsHovering(false);
  };

  const handleClick = (newValue: number) => {
    if (readOnly || !onChange) return;
    onChange(newValue);
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <StyledStarContainer
        onMouseLeave={handleMouseLeave}
        sx={{
          '& svg': {
            width: starSize,
            height: starSize,
          }
        }}
      >
        {/* Base stars (empty) */}
        <div className="star-base">
          {[1, 2, 3, 4, 5].map((star) => (
            <StyledStar
              key={star}
              sx={{
                color: '#e7e7e7',
              }}
            />
          ))}
        </div>

        {/* Filled stars */}
        <div
          className="star-filled"
          style={{ width: `${(currentValue / 5) * 100}%` }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <StyledStar
              key={star}
              sx={{
                color: starColor,
              }}
            />
          ))}
        </div>

        {/* Interactive layer */}
        {!readOnly && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Box
                key={star}
                sx={{
                  width: '20%',
                  height: '100%',
                  cursor: 'pointer',
                }}
                onMouseMove={(e) => handleMouseMove(e, star - 1)}
                onClick={() => handleClick(star)}
              />
            ))}
          </Box>
        )}
      </StyledStarContainer>
      
      {showValue && (
        <Typography
          variant="body2"
          sx={{
            color: starColor,
            fontWeight: 'bold',
          }}
        >
          {currentValue.toFixed(1)}
        </Typography>
      )}
    </Box>
  );
}
