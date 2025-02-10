import { useState, useEffect } from 'react';
import { Box, Rating, SvgIconOwnProps } from '@mui/material';
import { Star } from '@mui/icons-material';
import { motion, AnimatePresence, SVGMotionProps } from 'framer-motion';
import { styled } from '@mui/material/styles';

interface AnimatedRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  precision?: number;
}

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    '&[data-value="1"]': {
      color: theme.palette.error.main,
    },
    '&[data-value="2"]': {
      color: theme.palette.warning.main,
    },
    '&[data-value="3"]': {
      color: theme.palette.warning.light,
    },
    '&[data-value="4"]': {
      color: theme.palette.success.light,
    },
    '&[data-value="5"]': {
      color: theme.palette.success.main,
    },
  },
  '& .MuiRating-iconHover': {
    '&[data-value="1"]': {
      color: `${theme.palette.error.main}!important`,
    },
    '&[data-value="2"]': {
      color: `${theme.palette.warning.main}!important`,
    },
    '&[data-value="3"]': {
      color: `${theme.palette.warning.light}!important`,
    },
    '&[data-value="4"]': {
      color: `${theme.palette.success.light}!important`,
    },
    '&[data-value="5"]': {
      color: `${theme.palette.success.main}!important`,
    },
  },
}));

const StarIcon = motion(Star as React.ComponentType<SvgIconOwnProps>);

export default function AnimatedRating({
  value,
  onChange,
  readOnly = false,
  size = 'medium',
  precision = 1,
}: AnimatedRatingProps) {
  const [hover, setHover] = useState(-1);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number | null) => {
    const rating = newValue || 0;
    setLocalValue(rating);
    onChange?.(rating);
  };

  const getColor = (index: number) => {
    const ratingValue = hover !== -1 ? hover : localValue;
    if (index + 1 <= ratingValue) {
      switch (Math.ceil(ratingValue)) {
        case 1:
          return '#f44336'; // error.main
        case 2:
          return '#ff9800'; // warning.main
        case 3:
          return '#ffc107'; // warning.light
        case 4:
          return '#4caf50'; // success.light
        case 5:
          return '#2e7d32'; // success.main
        default:
          return '#757575'; // grey
      }
    }
    return '#757575'; // grey for empty stars
  };

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <StyledRating
        value={localValue}
        precision={precision}
        onChange={handleChange}
        onChangeActive={(event, newHover) => {
          if (!readOnly) {
            setHover(newHover);
          }
        }}
        readOnly={readOnly}
        size={size}
        icon={
          <AnimatePresence mode="wait">
            <StarIcon
              fontSize="inherit"
              initial={{ scale: 1 }}
              animate={{
                scale: hover !== -1 ? 1.2 : 1,
                rotate: hover !== -1 ? [0, 10, -10, 0] : 0,
              }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
              }}
            />
          </AnimatePresence>
        }
        emptyIcon={<Star fontSize="inherit" />}
        sx={{
          '& .MuiRating-icon': {
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: !readOnly ? 'scale(1.2)' : 'none',
            },
          },
        }}
      />
      {!readOnly && (
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          sx={{
            ml: 1,
            color: getColor(Math.floor(localValue) - 1),
            fontWeight: 'bold',
          }}
        >
          {localValue}
        </Box>
      )}
    </Box>
  );
}
