import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Rating,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Reply as ReplyIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  reply?: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/company/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError('Failed to fetch reviews');
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReview) {
      try {
        await fetch(`/api/company/reviews/${selectedReview._id}/reply`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reply: replyText }),
        });
        setSuccess('تم إضافة الرد بنجاح');
        setReplyDialogOpen(false);
        setSelectedReview(null);
        setReplyText('');
        fetchReviews();
      } catch (err) {
        setError('Failed to add reply');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
      try {
        await fetch(`/api/company/reviews/${id}`, {
          method: 'DELETE',
        });
        setSuccess('تم حذف التقييم بنجاح');
        fetchReviews();
      } catch (err) {
        setError('Failed to delete review');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'مقبول';
      case 'rejected':
        return 'مرفوض';
      default:
        return 'قيد المراجعة';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        إدارة التقييمات
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {reviews.map((review) => (
          <Grid item xs={12} md={6} key={review._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={review.user.avatar}
                    alt={review.user.name}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {review.user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Chip
                      label={getStatusLabel(review.status)}
                      color={getStatusColor(review.status) as any}
                      size="small"
                    />
                  </Box>
                </Box>

                <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {review.comment}
                </Typography>

                {review.reply && (
                  <Paper sx={{ p: 2, bgcolor: 'grey.100', mt: 1 }}>
                    <Typography variant="subtitle2" color="primary">
                      ردكم:
                    </Typography>
                    <Typography variant="body2">
                      {review.reply}
                    </Typography>
                  </Paper>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton
                    onClick={() => {
                      setSelectedReview(review);
                      setReplyText(review.reply || '');
                      setReplyDialogOpen(true);
                    }}
                  >
                    <ReplyIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(review._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleReply}>
          <DialogTitle>الرد على التقييم</DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2 }}>
              {selectedReview && (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">التقييم:</Typography>
                    <Rating value={selectedReview.rating} readOnly sx={{ mb: 1 }} />
                    <Typography variant="body2">{selectedReview.comment}</Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="الرد"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                  />
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" variant="contained">
              إرسال الرد
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
