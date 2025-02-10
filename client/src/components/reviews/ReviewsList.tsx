import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Rating,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Flag as FlagIcon,
  Reply as ReplyIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

interface Review {
  id: string;
  rating: number;
  text: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  companyId: string;
  companyName: string;
  language: string;
  purchaseVerified: boolean;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  replies: Reply[];
  helpful: number;
  reported: boolean;
}

interface Reply {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  companyId: string;
  text: string;
  createdAt: string;
}

interface ReviewsListProps {
  companyId: string;
  companyName: string;
}

export default function ReviewsList({ companyId, companyName }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [openReplyDialog, setOpenReplyDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');

  const stats = {
    average: reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0,
    total: reviews.length,
    verified: reviews.filter(review => review.purchaseVerified).length,
    distribution: Array.from({ length: 5 }, (_, i) => ({
      rating: 5 - i,
      count: reviews.filter(review => review.rating === 5 - i).length,
      percentage: (reviews.filter(review => review.rating === 5 - i).length / reviews.length) * 100 || 0
    }))
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRating(null);
    setReviewText('');
  };

  const handleSubmitReview = () => {
    if (rating && reviewText) {
      const newReview: Review = {
        id: String(Date.now()),
        rating,
        text: reviewText,
        userId: '1', // Should come from auth
        userName: 'أحمد محمد', // Should come from auth
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        companyId,
        companyName,
        language: 'ar',
        purchaseVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'pending',
        replies: [],
        helpful: 0,
        reported: false,
      };

      setReviews([newReview, ...reviews]);
      handleCloseDialog();
    }
  };

  const handleOpenReplyDialog = (review: Review) => {
    setSelectedReview(review);
    setOpenReplyDialog(true);
  };

  const handleCloseReplyDialog = () => {
    setOpenReplyDialog(false);
    setSelectedReview(null);
    setReplyText('');
  };

  const handleSubmitReply = () => {
    if (selectedReview && replyText) {
      const newReply: Reply = {
        id: String(Date.now()),
        reviewId: selectedReview.id,
        userId: '2', // Company ID
        userName: companyName,
        companyId,
        text: replyText,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setReviews(reviews.map(review =>
        review.id === selectedReview.id
          ? { ...review, replies: [...review.replies, newReply] }
          : review
      ));

      handleCloseReplyDialog();
    }
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const handleReport = (reviewId: string) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, reported: true }
        : review
    ));
  };

  return (
    <Box>
      {/* Reviews Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Stack alignItems="center" spacing={1}>
              <Typography variant="h3">{stats.average.toFixed(1)}</Typography>
              <Rating value={stats.average} precision={0.1} readOnly size="large" />
              <Typography color="text.secondary">
                من {stats.total} مراجعة
              </Typography>
              {stats.verified > 0 && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label={`${stats.verified} مراجعة مؤكدة الشراء`}
                  color="success"
                />
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={1}>
              {stats.distribution.map((dist) => (
                <Stack
                  key={dist.rating}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography sx={{ minWidth: 20 }}>{dist.rating}</Typography>
                  <Box sx={{ flexGrow: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Box
                      sx={{
                        width: `${dist.percentage}%`,
                        height: 8,
                        bgcolor: 'primary.main',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <Typography sx={{ minWidth: 40 }}>
                    {dist.percentage.toFixed(0)}%
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Add Review Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleOpenDialog}
          fullWidth
        >
          أضف مراجعتك
        </Button>
      </Box>

      {/* Reviews List */}
      <Stack spacing={2}>
        {reviews.map((review) => (
          <Paper key={review.id} sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={review.userAvatar} alt={review.userName} />
                  <Box>
                    <Typography variant="subtitle1">{review.userName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.createdAt}
                    </Typography>
                  </Box>
                </Stack>
                {review.purchaseVerified && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="مؤكد الشراء"
                    color="success"
                    size="small"
                  />
                )}
              </Stack>

              <Rating value={review.rating} readOnly />
              <Typography>{review.text}</Typography>

              {/* Replies */}
              {review.replies.length > 0 && (
                <Box sx={{ pl: 4 }}>
                  {review.replies.map((reply) => (
                    <Paper
                      key={reply.id}
                      sx={{ p: 2, bgcolor: 'grey.50', mb: 1 }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        {reply.userName}
                      </Typography>
                      <Typography variant="body2">{reply.text}</Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        {reply.createdAt}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              )}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    startIcon={<ThumbUpIcon />}
                    onClick={() => handleHelpful(review.id)}
                  >
                    مفيد ({review.helpful})
                  </Button>
                  <Button
                    size="small"
                    startIcon={<ReplyIcon />}
                    onClick={() => handleOpenReplyDialog(review)}
                  >
                    رد
                  </Button>
                </Stack>
                {!review.reported && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleReport(review.id)}
                  >
                    <FlagIcon />
                  </IconButton>
                )}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Add Review Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>أضف مراجعتك</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="مراجعتك"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <Alert severity="info">
              سيتم مراجعة تقييمك قبل النشر للتأكد من مطابقته لمعايير المجتمع
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>إلغاء</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={!rating || !reviewText}
          >
            نشر المراجعة
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={openReplyDialog}
        onClose={handleCloseReplyDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>الرد على المراجعة</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <>
              <Box sx={{ mb: 2, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  المراجعة الأصلية:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2">{selectedReview.text}</Typography>
                </Paper>
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="نص الرد"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReplyDialog}>إلغاء</Button>
          <Button
            onClick={handleSubmitReply}
            variant="contained"
            disabled={!replyText}
          >
            إرسال الرد
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
