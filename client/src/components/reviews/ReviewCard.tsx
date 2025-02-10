import React from 'react';
import Image from 'next/image';
import StarRating from './StarRating';
import { FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import { Box, Paper, Typography, Rating, Avatar } from '@mui/material';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  pros: string;
  cons: string;
  advice: string;
  helpfulCount: number;
  liked: boolean;
  companyResponse?: string;
  responseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    image: string | null;
  };
  company: {
    name: string;
    logo: string | null;
  };
}

interface ReviewCardProps {
  review: Review;
  onLike?: (id: string) => void;
  onHelpful?: (id: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onLike, onHelpful }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'primary.main',
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          src={review.user.image || undefined}
          alt={review.user.name}
          sx={{ width: 40, height: 40, mr: 1.5 }}
        >
          {review.user.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {review.user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(review.createdAt), 'dd MMMM yyyy', { locale: ar })}
          </Typography>
        </Box>
      </Box>

      <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
      
      {review.title && (
        <Typography
          variant="subtitle1"
          sx={{
            mb: 1,
            fontWeight: 600,
          }}
        >
          {review.title}
        </Typography>
      )}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          whiteSpace: 'pre-wrap',
        }}
      >
        {review.content}
      </Typography>

      <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <span>مفيد: {review.helpfulCount}</span>
        </div>
        
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => onHelpful?.(review.id)}
            className="flex items-center space-x-1 rtl:space-x-reverse text-gray-500 hover:text-gray-700"
          >
            <span>مفيد</span>
          </button>
          
          <button
            onClick={() => onLike?.(review.id)}
            className="text-gray-500 hover:text-primary-600"
          >
            {review.liked ? (
              <FaThumbsUp className="w-5 h-5" />
            ) : (
              <FaRegThumbsUp className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </Paper>
  );
};

export default ReviewCard;
