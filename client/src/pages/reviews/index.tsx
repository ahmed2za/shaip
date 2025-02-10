import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Grid,
  Button,
  Menu,
  MenuItem,
  Divider,
  useTheme,
} from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import Head from 'next/head';
import Link from 'next/link';
import { mockReviews, Review } from '@/data/mockReviews';
import CustomStarRating from '@/components/common/CustomStarRating';
import { ModernButton } from '@/components/common/ModernFormElements';
import { formatDate, formatDateTime } from '@/utils/dateFormat';

export default function Reviews() {
  const theme = useTheme();
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleLikeClick = (reviewId: string) => {
    const newLikedReviews = new Set(likedReviews);
    if (likedReviews.has(reviewId)) {
      newLikedReviews.delete(reviewId);
    } else {
      newLikedReviews.add(reviewId);
    }
    setLikedReviews(newLikedReviews);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleRatingFilter = (rating: number | null) => {
    setSelectedRating(rating);
    handleFilterClose();
  };

  const handleSort = (type: 'date' | 'rating' | 'helpful') => {
    const sortedReviews = [...reviews].sort((a, b) => {
      if (type === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (type === 'rating') {
        return b.rating - a.rating;
      } else {
        return b.helpful - a.helpful;
      }
    });
    setReviews(sortedReviews);
    handleSortClose();
  };

  const filteredReviews = selectedRating
    ? reviews.filter((review) => review.rating === selectedRating)
    : reviews;

  return (
    <>
      <Head>
        <title>التقييمات | مصداقية</title>
      </Head>

      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              تقييمات العملاء
            </Typography>
            <Typography variant="body1" color="text.secondary">
              اطلع على تجارب العملاء مع الشركات المختلفة
            </Typography>
          </Box>

          {/* Filters and Sort */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 4 }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2}>
              <ModernButton
                startIcon={<FilterListIcon />}
                onClick={handleFilterClick}
                variant="outlined"
              >
                تصفية
              </ModernButton>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
              >
                <MenuItem onClick={() => handleRatingFilter(null)}>
                  جميع التقييمات
                </MenuItem>
                <Divider />
                {[5, 4, 3, 2, 1].map((rating) => (
                  <MenuItem
                    key={rating}
                    onClick={() => handleRatingFilter(rating)}
                    selected={selectedRating === rating}
                  >
                    <CustomStarRating value={rating} readOnly size="small" />
                    <Box component="span" sx={{ mr: 1 }}>
                      ({rating} نجوم)
                    </Box>
                  </MenuItem>
                ))}
              </Menu>

              <ModernButton
                startIcon={<SortIcon />}
                onClick={handleSortClick}
                variant="outlined"
              >
                ترتيب
              </ModernButton>
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortClose}
              >
                <MenuItem onClick={() => handleSort('date')}>الأحدث</MenuItem>
                <MenuItem onClick={() => handleSort('rating')}>
                  الأعلى تقييماً
                </MenuItem>
                <MenuItem onClick={() => handleSort('helpful')}>
                  الأكثر إفادة
                </MenuItem>
              </Menu>
            </Stack>

            {selectedRating && (
              <Chip
                label={`${selectedRating} نجوم`}
                onDelete={() => handleRatingFilter(null)}
                color="primary"
              />
            )}
          </Stack>

          {/* Reviews Grid */}
          <Grid container spacing={3}>
            {filteredReviews.map((review) => (
              <Grid item xs={12} key={review.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  {/* Review Header */}
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Link href={`/company/${review.companyId}`} passHref>
                      <Avatar
                        src={review.companyLogo}
                        alt={review.companyName}
                        sx={{
                          width: 48,
                          height: 48,
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    </Link>
                    <Box>
                      <Link href={`/company/${review.companyId}`} passHref>
                        <Typography
                          variant="h6"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { color: 'primary.main' },
                          }}
                        >
                          {review.companyName}
                        </Typography>
                      </Link>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CustomStarRating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          · {formatDate(review.createdAt)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  {/* Review Content */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {review.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {review.content}
                    </Typography>
                  </Box>

                  {/* Review Footer */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={review.user.image}
                        alt={review.user.name}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box>
                        <Typography variant="subtitle2">{review.user.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.user.reviewCount} تقييم
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <IconButton
                        onClick={() => handleLikeClick(review.id)}
                        color={likedReviews.has(review.id) ? 'primary' : 'default'}
                        size="small"
                      >
                        {likedReviews.has(review.id) ? (
                          <ThumbUpIcon fontSize="small" />
                        ) : (
                          <ThumbUpOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        {review.helpful + (likedReviews.has(review.id) ? 1 : 0)}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Company Response */}
                  {review.companyResponse && (
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                      >
                        رد {review.companyResponse.responder}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {review.companyResponse.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        {formatDateTime(review.companyResponse.respondedAt)}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
